import EncryptRsa from 'encrypt-rsa'
import BigNumber from 'bignumber.js'
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
import { useMarketEventsContract, usePaywallMarketOrdersContract } from 'hooks/useContract'

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
  partner,
  onDismiss,
}) => {
  const [state, setState] = useState<any>(() => ({
    productId: '', 
    bountyId: '',
    referrerFee: '',
    partnerCollectionId: ''
  }))
  console.log("1PartnerModal=================>", collection)
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { signer: marketEventsContract } = useMarketEventsContract()
  const { signer: paywallMarketOrdersContract } = usePaywallMarketOrdersContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [isDone, setIsDone] = useState(false)
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const item = useMemo(() => collection?.nfts?.find((it) => it.tokenId?.toLowerCase() === state.productId?.toLowerCase()),[
    collection,
    state
  ])

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

  const handleAddItem = useCallback(async () => {
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
      } catch(err) { console.log("handleItem err============>", err) }
      const contract = partner ? paywallMarketOrdersContract : marketEventsContract
      const method = partner ? "addReferral" : "updatePaywall"
      const args = partner ? [
        paywall?.currentSeller,
        account,
        paywall?.tokenId,
        state.productId,
        `${img0},${img1}`,
        [state.referrerFee,state.bountyId,3]
      ] : [
        state.productId,
        paywall?.id,
        true,
        true,
        `${img0},${img1}`,
      ]
      console.log("handleAddItem====================>", method, args)
      return callWithGasPrice(contract, method, args)
      .catch((err) => {
        console.log("handleAddItem====================>", err)
        return null
      })
    })
    if (receipt?.status) {
        toastSuccess(
          t('Item Successfully Added'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Subscribers of this paywall will now have access to this item.')}
          </ToastDescriptionWithTx>,
        )
        setIsDone(true);
      }
  }, [
    t,
    item,
    state,
    account,
    paywall,
    partner,
    toastSuccess,
    callWithGasPrice,
    marketEventsContract,
    fetchWithCatchTxError,
    paywallMarketOrdersContract
  ])

  return (
    <Modal
    title={t('Add Item to Wall')} 
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
          {t('Referrer Fee')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='referrerFee'
          value={state.referrerFee}
          placeholder={t('input referrer fee')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Bounty ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='bountyId'
          value={state.bountyId}
          placeholder={t('input bounty id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      </>:null}
      <Box>
        <Text small color="textSubtle">
          {t('The will add the specified item to your paywall. Please read the documentation for more details.')}
        </Text>
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
      {account ?
        <Button
          mb="8px"
          disabled={isDone}
          onClick={handleAddItem}
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
