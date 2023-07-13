import { useRouter } from 'next/router'
import { useEffect, useRef, useState, useCallback, ChangeEvent } from 'react'
import { Flex, Grid, Box, Input, Text, Modal, Button, AutoRenewIcon, ErrorIcon, useToast, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
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
import { MaxUint256 } from '@ethersproject/constants'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
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
  const vaContract = useVaContract(pool.ve)
  const [state, setState] = useState<any>(() => ({
    name: '',
    symbol: '',
    decimals: 18,
    maxSupply: 0,
    minToSwitch: 0,
    estimatedSize: 0,
    minTicketPrice: 0,
    withdrawable: 0
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
  const handleRawValueChange = (key: string) => (value: any) => {
    updateValue(key, value)
  }

  const handleInitGauge = useCallback(async () => {
    setPendingFb(true);
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
    const _maxSupply = state.maxSupply === 0 ? MaxUint256?.toString() : state.maxSupply
    const _minToSwitch = getDecimalAmount(state.minToSwitch, state.decimals ?? 18)
    const _estimatedSize = getDecimalAmount(state.estimatedSize, state.decimals ?? 18)
    const _minTicketPrice = getDecimalAmount(state.minTicketPrice, state.decimals ?? 18)
    const args = [
      state.name, 
      state.symbol,
      state.decimals,
      _minToSwitch?.toString(),
      _maxSupply,
      _estimatedSize?.toString(),
      _minTicketPrice?.toString(),
      !!state.withdrawable
    ]
      console.log("ress===============>", vaContract, args)
      return callWithGasPrice(vaContract, 'setParams', args)
    .catch((err) => {
      console.log("ress===============>", err, vaContract, args)
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
    title={t('Initialize Ve')}
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
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Min to Switch')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='minToSwitch'
          value={state.minToSwitch}
          placeholder={t('input min amount to switch')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Estimated Size')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='estimatedSize'
          value={state.estimatedSize}
          placeholder={t('input estimated size')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Minimum Ticket Price')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='minTicketPrice'
          value={state.minTicketPrice}
          placeholder={t('input min ticket price')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="13px" paddingRight="50px" bold>
          {t('Make Withdrawable')}
        </Text>
        <ButtonMenu scale="sm" variant='subtle' activeIndex={state.withdrawable} onItemClick={handleRawValueChange('withdrawable')}>
        <ButtonMenuItem>{t('No')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
      </ButtonMenu>
      </StyledItemRow>
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