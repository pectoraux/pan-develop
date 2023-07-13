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
import { usePaywallContract } from 'hooks/useContract'
import { useGetPaywallARP } from 'state/cancan/hooks'

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
    nfticketId: '',
    pickedOption: '', 
    partnerCollectionId: ''
  }))
  console.log("1PartnerModal=================>", collection)
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [isDone, setIsDone] = useState(false)
  const paywallARPAddress = useGetPaywallARP(collection?.id ?? '')
  const paywallContract = usePaywallContract(paywallARPAddress ?? '')
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const item = useMemo(() => collection?.items?.find((it) => it.tokenId?.toLowerCase() === state.productId?.toLowerCase()),[
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

  const handleSubscribe = useCallback(async () => {
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      console.log("handleSubscribe====================>", [
        state.nfticketId,
        state.pickedOption ? Number(state.pickedOption) + 1 : 0,
        [account]
      ])
      return callWithGasPrice(paywallContract, "updateProtocol", [
        state.nfticketId,
        state.pickedOption ? Number(state.pickedOption) + 1 : 0,
        [account]
      ])
      .catch((err) => {
        console.log("handleSubscribe====================>", err)
      })
    })
    if (receipt?.status) {
        toastSuccess(
          t('Subscription Successfully Started'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('You now have access to all items behind this paywall.')}
          </ToastDescriptionWithTx>,
        )
        setIsDone(true);
      }
  }, [
    t,
    state,
    paywall,
    toastSuccess,
    callWithGasPrice,
    paywallContract,
    fetchWithCatchTxError,
  ])

  return (
    <Modal
    title={t('Start Subscription to Wall')} 
    onDismiss={onDismiss}
    >
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('NFTicket ID')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='nfticketId'
        value={state.nfticketId}
        placeholder={t('input your nfticket id')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Pick Option ID (Optional)')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='pickedOption'
        value={state.pickedOption}
        placeholder={t('input picked option id')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
      <Box>
        <Text small color="textSubtle">
          {t('The will start your subscription to the paywall. Please read the documentation for more details.')}
        </Text>
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
      {account ?
        <Button
          mb="8px"
          variant='success'
          disabled={isDone}
          onClick={handleSubscribe}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : undefined}
          >
          {t('Start Subscription')}
        </Button> : <ConnectWalletButton />
      }
      </Flex>
    </Modal>
  )
}

export default PartnerModal
