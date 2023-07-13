import EncryptRsa from 'encrypt-rsa'
import { useEffect, useRef, useState, useCallback } from 'react'
import { 
  Card, 
  Flex, 
  Grid, 
  Box, 
  Text, 
  Modal, 
  Button, 
  CardBody, 
  CardHeader, 
  AutoRenewIcon, 
  ErrorIcon, 
  useToast, 
  Heading,
  Input,
  ButtonMenu, 
  ButtonMenuItem,
} from '@pancakeswap/uikit'
import Select from 'components/Select/Select'
import ReactMarkdown from 'components/ReactMarkdown'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useWeb3React, useSignMessage } from '@pancakeswap/wagmi'
import { useSSIContract } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Divider } from 'views/ARPs/components/styles'
import { Entry, EntryState } from 'state/types'
import { firestore } from 'utils/firebase'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { DatePicker, DatePickerPortal, TimePicker } from 'views/Voting/components/DatePicker'
import { Label, SecondaryLabel } from '../CreateProposal/styles'
import { combineDateAndTime } from '../CreateProposal/helpers'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CryptoJS = require('crypto-js')

interface SetPriceStageProps {
  entry: Entry
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateContentModal: React.FC<any> = ({
  entry,
  unencrypted,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const [activeButtonIndex1, setActiveButtonIndex1] = useState(0)
  const [activeButtonIndex, setActiveButtonIndex] = useState<any>(0)
  const [recipient, setRecipient ] = useState('')
  const [testimony, setTestimony ] = useState<any>('')
  const [comparator, setComparator ] = useState<any>('eq')
  const [recipientProfileId, setRecipientProfileId ] = useState<any>('')
  const [deadlineDate, setDeadlineDate ] = useState<any>(null)
  const [deadlineTime, setDeadlineTime ] = useState<any>(null)
  const [userSig, setUserSig ] = useState<any>(null)
  const [answer, setAnswer] = useState<any>(unencrypted)
  const ssiContract = useSSIContract()
  const { signMessageAsync } = useSignMessage()

  const encryptWithAES = (text, passPhrase) => {
    return CryptoJS.AES.encrypt(text, passPhrase).toString();
  }

  const decryptWithAES1 = (ciphertext) => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.NEXT_PUBLIC_PRIVATE_KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText;
    } catch(err) {
      console.log("decryptWithAES======>", err)
      return '';
    }
  }

  const decryptWithAES2 = async (ciphertext) => {
    try {
      return signMessageAsync({ message: account })
      .then((key) => {
        setUserSig(key)
        const bytes = CryptoJS.AES.decrypt(ciphertext, key);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText;
      })
    } catch(err) {
      console.log("decryptWithAES======>", err)
      return '';
    }
  }

  const revealData = async () => {
      if (entry.state === EntryState.PENDING) {
        setAnswer(decryptWithAES1(entry.answer))
      } else if (entry.state === EntryState.COMPLETE) {
        await decryptWithAES2(entry.answer)
        .then((res) => setAnswer(res))
      } 
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const generateIdentityProof = () => {
    if (comparator === 'eq' && testimony?.toLowerCase() === answer?.toLowerCase()) {
      return `testify_eq_${answer?.toLowerCase()}`
    } 
    if (comparator === 'gt' && parseFloat(answer) > parseFloat(testimony)) {
      return `testify_gt_${testimony}`
    } 
    if (comparator === 'gte' && parseFloat(answer) >= parseFloat(testimony)) {
      return `testify_gte_${testimony}`
    } 
    if (comparator === 'lte' && parseFloat(answer) <= parseFloat(testimony)) {
      return `testify_lte_${testimony}`
    } 
    if (comparator === 'lt' && parseFloat(answer) < parseFloat(testimony)) {
      return `testify_lt_${testimony}`
    } 
    if (comparator === 'neq' && answer?.toLowerCase() !== testimony?.toLowerCase()) {
      return `testify_neq_${testimony}`
    }
    return ''
  }

  console.log("comparator==============>", comparator, answer, generateIdentityProof())

  const handleIdentityProof = useCallback(async () => {
    setPendingFb(true);
    const identityProof = generateIdentityProof()
    if (identityProof) {
      // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
        console.log("generateIdentityProof===================>",[
          entry.owner,
          entry.ownerProfileId.id,
          entry.auditorProfileId.id,
          entry.endTime,
          entry.question,
          identityProof
        ])
        return callWithGasPrice(ssiContract, 'generateIdentityProof', [
          entry.owner,
          entry.ownerProfileId.id,
          entry.auditorProfileId.id,
          entry.endTime,
          entry.question,
          identityProof
        ])
      }).catch((err) => console.log("rerr===================>", err))
      if (receipt?.status) {
        toastSuccess(
          t('Identity Proof successfully created'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('You can now show your Identity proof to prove your identity.')}
          </ToastDescriptionWithTx>,
        )
      }
    } else {
      toastError(
        t('Your Identity Proof Is Wrong'),
        <ToastDescriptionWithTx txHash={null}>
          {t('Please check you have the correct comparator')}
        </ToastDescriptionWithTx>,
      )
    }
    onDismiss()
  }, [
    t,
    entry,
    onDismiss,
    ssiContract,
    toastError,
    toastSuccess,
    callWithGasPrice,
    generateIdentityProof,
    fetchWithCatchTxError,
  ])
  
  const handleShare = useCallback(async () => {
    const deadline = combineDateAndTime(deadlineDate, deadlineTime)
    setPendingFb(true);
      // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
        const encryptRsa = new EncryptRsa()
        const encryptedAnswer = answer ? encryptRsa.encryptStringWithRsaPublicKey({ 
          text: answer,   
          publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
        }):"";
        console.log("createData===============>", [
          recipientProfileId,
          entry.auditorProfileId?.id,
          entry.owner,
          entry.auditorProfileId?.owner,
          entry.startTime,
          deadline?.toString(),
          entry.searchable,
          entry.question,
          entry.searchable ? answer : encryptedAnswer,
          "shared"
        ])
        console.log("shareproof========================>", [
          entry.owner,
          entry.ownerProfileId?.id,
          recipientProfileId,
          entry.auditorProfileId?.id,
          deadline,
          entry.question
        ])
        return callWithGasPrice(ssiContract, 'createData', [
          recipientProfileId,
          entry.auditorProfileId?.id,
          entry.owner,
          entry.auditorProfileId?.owner,
          entry.startTime,
          deadline?.toString(),
          entry.searchable,
          entry.question,
          entry.searchable ? answer : encryptedAnswer,
          "shared"
        // eslint-disable-next-line consistent-return
        ]).then(() => {
          if (activeButtonIndex) {
            return callWithGasPrice(ssiContract, 'generateShareProof', [
              entry.owner,
              entry.ownerProfileId?.id,
              recipientProfileId,
              entry.auditorProfileId?.id,
              deadline,
              entry.question
            ]).catch((err) => console.log("rerr===================>", err))
          }
        })
      })
      if (receipt?.status) {
        toastSuccess(
          t('Data successfully shared'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('You can now show your NFTProof as proof of the data you shared.')}
          </ToastDescriptionWithTx>,
        )
      }
      onDismiss()
  }, [
    t,
    entry,
    answer,
    onDismiss,
    ssiContract,
    toastSuccess,
    deadlineDate,
    deadlineTime,
    callWithGasPrice,
    recipientProfileId,
    activeButtonIndex,
    fetchWithCatchTxError,
  ])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <Modal 
    title={t('Data Operations')}
    onDismiss={onDismiss}
    > 
      <Box mb="24px">
        <Card>
          <CardHeader>
            <Heading as="h3" scale="md">
              {entry.question}
            </Heading>
          </CardHeader>
          <CardBody p="0" px="24px">
            <ReactMarkdown>{answer}</ReactMarkdown>
          </CardBody>
        </Card>
      </Box>
      <Flex alignSelf="center" justifyContent='center' mb='18px'>
      <StyledItemRow>
        <ButtonMenu scale="xs" variant='subtle' activeIndex={activeButtonIndex1} onItemClick={setActiveButtonIndex1}>
          <ButtonMenuItem>{t('Generate Identity Proof')}</ButtonMenuItem>
          <ButtonMenuItem >{t('Share Data')}</ButtonMenuItem>
        </ButtonMenu>
      </StyledItemRow>
      </Flex>
      {!activeButtonIndex1 ?
      <>
      <Box mb="24px">
        <SecondaryLabel>{entry.question}</SecondaryLabel>
        <Select
          options={[
            {
              label: t('='),
              value: t('eq'),
            },
            {
              label: t('>'),
              value: t('gt'),
            },
            {
              label: t('>='),
              value: t('gte'),
            },
            {
              label: t('<'),
              value: t('lt'),
            },
            {
              label: t('<='),
              value: t('lte'),
            },
            {
              label: t('!='),
              value: t('neq'),
            },
          ]}
          onOptionChange={(val)=>{setComparator(val.value)}}
        />
      </Box>
      <Box mb="24px">
        <Label htmlFor="testimony">{t('Input testimony')}</Label>
        <Input id="testimony" name="testimony" value={testimony} scale="lg" onChange={(e) => setTestimony(e.target.value)} required />
      </Box>
      </>:
      <>
      <Box mb="24px">
      <SecondaryLabel>{t('End Share Date')}</SecondaryLabel>
      <DatePicker
        name="deadlineDate"
        onChange={setDeadlineDate}
        selected={deadlineDate}
        placeholderText="YYYY/MM/DD"
      />
    </Box>
    <Box mb="24px">
      <SecondaryLabel>{t('End Share Time')}</SecondaryLabel>
      <TimePicker
        name="deadlineTime"
        onChange={setDeadlineTime}
        selected={deadlineTime}
        placeholderText="00:00"
      />
    </Box>
      <Box mb="24px">
        <Label htmlFor="recipient">{t('Recipient Profile ID')}</Label>
        <Input id="recipientProfileId" name="recipientProfileId" value={recipientProfileId} scale="lg" onChange={(e) => setRecipientProfileId(e.target.value)} required />
      </Box>
      <Box mb="24px">
        <StyledItemRow>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
            {t('Generate NFTProof')}
          </Text>
          <ButtonMenu scale="xs" variant='subtle' activeIndex={activeButtonIndex} onItemClick={setActiveButtonIndex}>
            <ButtonMenuItem >{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </Box>
      </>}
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        {account ? 
        <Button
          mb="8px"
          onClick={activeButtonIndex1 ? handleShare : handleIdentityProof }
          endIcon={pendingTx || pendingFb ? <AutoRenewIcon spin color="currentColor" /> : null}
          isLoading={pendingTx || pendingFb}
          disabled={activeButtonIndex1 ? false : !generateIdentityProof()}
        >
          {t('%action% Data', { action: activeButtonIndex1 ? 'Share' : 'Generate Proof'})}
        </Button>: <ConnectWalletButton />}
      </Flex>
      <DatePickerPortal />
    </Modal>
  )
}

export default CreateContentModal
