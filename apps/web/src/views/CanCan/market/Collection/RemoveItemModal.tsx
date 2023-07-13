import NodeRSA from 'encrypt-rsa'
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
import { useMarketEventsContract } from 'hooks/useContract'

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
}

const PartnerModal: React.FC<any> = ({
  collection,
  paywall,
  onConfirm,
  onDismiss,
}) => {
  const [state, setState] = useState<any>(() => ({
    productId: '', 
    partnerCollectionId: ''
  }))
  console.log("1PartnerModal=================>", collection)
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { signer: marketEventsContract } = useMarketEventsContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [isDone, setIsDone] = useState(false)
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const item = useMemo(() => collection?.items?.find((it) => it.tokenId?.toLowerCase() === state.productId?.toLowerCase()),[
    collection,
    state
  ])
  console.log("7collection===============>", item)
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

  const handleRemoveItem = useCallback(async () => {
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const nodeRSA = new NodeRSA(
        process.env.NEXT_PUBLIC_PUBLIC_KEY,
        process.env.NEXT_PUBLIC_PRIVATE_KEY,
      )
      const chunks = item?.images && item?.images?.split(",")
      const thumb = chunks?.length > 0 && item?.images?.split(",")[0]
      const mp4 = chunks?.length > 1 && item?.images?.split(",").slice(1).join(",")
      let [img0, img1] = [thumb, mp4]
      console.log("mp4==============>", thumb, mp4)
      try {
        img0 = thumb ? nodeRSA.decryptStringWithRsaPrivateKey({ 
          text: thumb, 
          privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY
        }):"";
        console.log("mp3==============>", thumb, img0)
        img1 = mp4 ? nodeRSA.decryptStringWithRsaPrivateKey({ 
          text: mp4, 
          privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY
        }):"";
        console.log("mp2==============>", mp4, img1)
      } catch(err) { console.log("err============>", err) }
      // const img2 = item.images[2] ? nodeRSA.decryptStringWithRsaPrivateKey({ 
      //   text: item.images[2], 
      //   privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY
      // }):"";
      // const img3 = item.images[3] ? nodeRSA.decryptStringWithRsaPrivateKey({ 
      //   text: item.images[3], 
      //   privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY
      // }):"";
      // const img4 = item.images[4] ? nodeRSA.decryptStringWithRsaPrivateKey({ 
      //   text: item.images[4], 
      //   privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY
      // }):"";
      const args = [
        state.productId,
        paywall?.id,
        false,
        false,
        `${img0},${img1}`
      ]
      console.log("handleRemoveItem====================>", args)
      return callWithGasPrice(marketEventsContract, "updatePaywall", args)
      .catch((err) => {
        console.log("handleRemoveItem====================>", err)
      })
    })
    if (receipt?.status) {
        toastSuccess(
          t('Item Successfully Removed'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Subscribers of this paywall will no longer have access to this item.')}
          </ToastDescriptionWithTx>,
        )
        setIsDone(true);
      }
  }, [
    t,
    item,
    state,
    paywall,
    toastSuccess,
    callWithGasPrice,
    marketEventsContract,
    fetchWithCatchTxError,
  ])

  return (
    <Modal
    title={t('Remove Item from Wall')} 
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
      <Box>
        <Text small color="textSubtle">
          {t('The will remove the specified item from your paywall. Please read the documentation for more details.')}
        </Text>
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
      {account ?
        <Button
          mb="8px"
          variant="danger"
          disabled={isDone}
          onClick={handleRemoveItem}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : undefined}
          >
          {t('Remove')}
        </Button> : <ConnectWalletButton />
      }
      </Flex>
    </Modal>
  )
}

export default PartnerModal
