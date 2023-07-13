import { useRouter } from 'next/router'
import { useEffect, useRef, useState, useCallback, ChangeEvent } from 'react'
import { Flex, Grid, Box, Input, Text, Modal, Button, AutoRenewIcon, ErrorIcon, useToast } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import { useAppDispatch } from 'state'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { fetchValuepoolSgAsync } from 'state/valuepools'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useVaContract } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { AddressZero, MaxUint256 } from '@ethersproject/constants'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  currency?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const InitValuepoolModal: React.FC<any> = ({
  pool,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const fromValuepool = useRouter().query.valuepool
  const { reload } = useRouter()
  const vaContract = useVaContract(pool.ve)
  const [state, setState] = useState<any>(() => ({
    name: '',
    symbol: '',
    decimals: 18,
    maxSupply: 0
  }))

  const updateValue = (key: any, value: any) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    updateValue(inputName, value)
  }

  const handleInitGauge = useCallback(async () => {
    setPendingFb(true);
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
    const _maxSupply = state.maxSupply === 0 ? MaxUint256 : state.maxSupply
    return callWithGasPrice(vaContract, 'setParams', [
      state.name, 
      state.symbol,
      state.decimals,
      _maxSupply
    ])
    .catch((err) => {
      console.log("ress===============>", err, vaContract, [
        state.name, 
        state.symbol,
        state.decimals,
        _maxSupply
      ])
      toastError(
        t('Issue initializing Va'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {err}
        </ToastDescriptionWithTx>,
      )
    })
  })
  if (receipt?.status) {
    setPendingFb(false);
    toastSuccess(
      t('Va successfully initialized'),
      <ToastDescriptionWithTx txHash={receipt.transactionHash}>
        {t('You can now start processing account requests for your Valuepool.')}
      </ToastDescriptionWithTx>,
    )
    dispatch(fetchValuepoolSgAsync({
      fromVesting: false,
      fromValuepool
    }))
    // reload()
  }
    onDismiss()
}, [
  onDismiss,
  dispatch,
  fromValuepool,
  vaContract,
  state,
  // reload,
  t,
  toastError,
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
    title={t('Initialize Va')}
    onDismiss={onDismiss}
    > 
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Va Name')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='name'
          value={state.name}
          placeholder={t('input va name')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Va Symbol')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='symbol'
          value={state.symbol}
          placeholder={t('input va symbol')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Va Decimals')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='decimals'
          value={state.decimals}
          placeholder={t('input va decimals')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Max Supply')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='maxSupply'
          value={state.maxSupply}
          placeholder={t('input va maxSupply')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t('The will set the name, symbol and decimals of your Va')}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
      {account ? 
        <Button
          mb="8px"
          onClick={handleInitGauge}
          endIcon={pendingTx || pendingFb ? <AutoRenewIcon spin color="currentColor" /> : null}
          isLoading={pendingTx || pendingFb}
        >
          {t('Initialize')}
        </Button>: <ConnectWalletButton />}
      </Flex>
    </Modal>
  )
}

export default InitValuepoolModal