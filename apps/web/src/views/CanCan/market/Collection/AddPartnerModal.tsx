import EncryptRsa from 'encrypt-rsa'
import BigNumber from 'bignumber.js'
import { differenceInSeconds } from 'date-fns'
import { ChangeEvent, useState, useMemo, useCallback } from 'react'
import {
  Flex,
  Text,
  Button,
  Modal,
  Input,
  useToast,
  AutoRenewIcon,
  Box,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Divider, GreyedOutContainer } from 'views/Auditors/components/styles'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useMarketEventsContract, usePaywallContract } from 'hooks/useContract'
import { DatePicker, DatePickerPortal } from 'views/Voting/components/DatePicker'

interface DepositModalProps {
  max: BigNumber
  stakedBalance: BigNumber
  multiplier?: string
  lpPrice: BigNumber
  lpLabel?: string
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
  apr?: number
  displayApr?: string
  addLiquidityUrl?: string
  cakePrice?: BigNumber
}

interface FormState {
  tokenAddress: any, 
  poolAddress: any, 
  pricePerMinute: number, 
  creatorShare: number, 
  gameName: string,
  partner: boolean,
}

const PartnerModal: React.FC<any> = ({
  collection,
  paywall,
  paywallARP,
  partner,
  onDismiss,
}) => {
  const [state, setState] = useState<any>(() => ({
    productId: '', 
    partnerCollectionId: '',
    numOfSeconds: '',
  }))
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { signer: marketEventsContract } = useMarketEventsContract()
  const paywallContract = usePaywallContract(paywallARP?.paywallAddress ?? '')
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [isDone, setIsDone] = useState(false)
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const item = useMemo(() => collection?.items?.find((it) => it.tokenId?.toLowerCase() === state.productId?.toLowerCase()),[
    collection,
    state
  ])
  console.log("1PartnerModal=================>", item, paywallARP, paywallContract)

  const updateValue = (key: any, value: any ) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))

    // Keep track of what fields the user has attempted to edit
    setFieldsState((prevFieldsState) => ({
      ...prevFieldsState,
      [key]: true,
    }))
  }

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    updateValue(inputName, value)
  }

  const handleRawValueChange = (key: any) => (value: any ) => {
    updateValue(key, value)
  }

  const handleAddPartner = useCallback(async () => {
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const encryptRsa = new EncryptRsa()
      const chunks = item?.images && item?.images?.split(",")
      const thumb = chunks?.length > 0 && item?.images?.split(",")[0]
      const mp4 = chunks?.length > 1 && item?.images?.split(",").slice(1).join(",")
      let [img0, img1] = [thumb, mp4]
      try {
      img0 = thumb ? encryptRsa.encryptStringWithRsaPublicKey({ 
        text: thumb,   
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
      }):"";
      img1 = mp4 ? encryptRsa.encryptStringWithRsaPublicKey({ 
        text: mp4,   
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
      }):"";
      } catch(err) { console.log("handleAddPartner err============>", err) }
      const contract = partner ? paywallContract : marketEventsContract
      const method = partner ? "partner" : "updatePaywall"
      const numOfSeconds = Math.max(differenceInSeconds(new Date(state.numOfSeconds || 0), new Date(), {
        roundingMethod: 'ceil',
      }),0)
      const args = partner ? [
        state.partnerCollectionId,
        paywall?.tokenId,
        state.productId,
        numOfSeconds
      ]:[
        state.productId,
        paywall?.id,
        true,
        false,
        `${img0},${img1}`
      ]
      console.log("handleAddPartner====================>", contract, method, args)
      return callWithGasPrice(contract, method, args)
      .catch((err) => {
        console.log("handleAddPartner====================>", err)
      })
    })
    if (receipt?.status) {
        toastSuccess(
          t('Partner Successfully Added'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Subscribers of this paywall will now have access to items from this partner paywall.')}
          </ToastDescriptionWithTx>,
        )
        setIsDone(true);
      }
  }, [
    t,
    item,
    state,
    partner,
    paywall,
    toastSuccess,
    paywallContract,
    callWithGasPrice,
    marketEventsContract,
    fetchWithCatchTxError,
  ])

  return (
    <Modal
    title={t('Add Partner to Wall')} 
    onDismiss={onDismiss}
    >
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Product ID')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='productId'
        value={state.productId}
        placeholder={t('input your product id')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    {partner ?
    <>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Collection ID')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='partnerCollectionId'
        value={state.partnerCollectionId}
        placeholder={t('input your collection id')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('End Date')}
      </Text>
      <DatePicker
        onChange={handleRawValueChange('numOfSeconds')}
        selected={state.numOfSeconds}
        placeholderText="YYYY/MM/DD"
      />
      <DatePickerPortal/>
    </GreyedOutContainer>
    </>:null}
      <Box>
        <Text small color="textSubtle">
          {t('The will add the specified partner to your paywall. Please read the documentation for more details.')}
        </Text>
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
      {account ?
        <Button
          mb="8px"
          disabled={isDone}
          onClick={handleAddPartner}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : undefined}
          >
          {t('Add')}
        </Button> : <ConnectWalletButton />
      }
      </Flex>
    </Modal>
  )
}

export default PartnerModal
