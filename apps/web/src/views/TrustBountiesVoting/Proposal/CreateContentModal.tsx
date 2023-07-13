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
  ButtonMenu, 
  ButtonMenuItem 
} from '@pancakeswap/uikit'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'components/ReactMarkdown'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTrustBountiesVoterContract } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Divider } from 'views/ARPs/components/styles'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { Label } from '../CreateProposal/styles'

interface SetPriceStageProps {
  litigationId?: string | null
}

const EasyMde = dynamic(() => import('components/EasyMde'), {
  ssr: false,
})
// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateContentModal: React.FC<any> = ({
  litigation,
  onSuccess,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const { toastSuccess } = useToast()
  const [body, setBody] = useState('')
  const [activeButtonIndex, setActiveButtonIndex] = useState(null)
  const { signer: trustBountiesVoterContract } = useTrustBountiesVoterContract()
  
  const handleCreateGauge = useCallback(async () => {
      setPendingFb(true);
      // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
        console.log("trustBountiesVoterContract====================>",litigation, [
          litigation.id,
          activeButtonIndex ? litigation.defenderId : litigation.attackerId,
          body
        ])
        return callWithGasPrice(trustBountiesVoterContract, 
          activeButtonIndex ? 'updateDefenderContent' : 'updateAttackerContent', [
          litigation.id,
          activeButtonIndex ? litigation.defenderId : litigation.attackerId,
          body
        ])
      .catch((err) => {
        console.log("err====================>", err)
      })
    })
    if (receipt?.status) {
      onSuccess()
      setPendingFb(false);
      toastSuccess(
        t('Statement successfully updated'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start receiving votes accordingly.')}
        </ToastDescriptionWithTx>,
      )
    }
    onDismiss()
  }, [
    t,
    body,
    onSuccess,
    onDismiss,
    litigation,
    activeButtonIndex,
    trustBountiesVoterContract,
    toastSuccess,
    callWithGasPrice,
    fetchWithCatchTxError,
  ])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <Modal 
    title={t('Update Statement')}
    onDismiss={onDismiss}
    > 
      {body && (
        <Box mb="24px">
          <Card>
            <CardHeader>
              <Heading as="h3" scale="md">
                {t('Preview')}
              </Heading>
            </CardHeader>
            <CardBody p="0" px="24px">
              <ReactMarkdown>{body}</ReactMarkdown>
            </CardBody>
          </Card>
        </Box>
      )}
      <Box mb="24px">
        <StyledItemRow>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
            {t('Which one are you ?')}
          </Text>
          <ButtonMenu scale="xs" variant='subtle' activeIndex={activeButtonIndex} onItemClick={setActiveButtonIndex}>
            <ButtonMenuItem >{t('Attacker')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Defender')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </Box>
      <Box mb="24px">
        <Label htmlFor="body">{t('Content')}</Label>
        <Text color="textSubtle" mb="8px">
          {t('Tip: write in Markdown!')}
        </Text>
        <EasyMde
          id="body"
          name="body"
          onTextChange={setBody}
          value={body}
          required
        />
      </Box>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t('The will update your statement for this litigation')}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        {account ? 
        <Button
          mb="8px"
          onClick={handleCreateGauge}
          endIcon={pendingTx || pendingFb ? <AutoRenewIcon spin color="currentColor" /> : null}
          isLoading={pendingTx || pendingFb}
        >
          {t('Update')}
        </Button>: <ConnectWalletButton />}
      </Flex>
    </Modal>
  )
}

export default CreateContentModal
