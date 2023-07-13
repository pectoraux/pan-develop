import { useRouter } from 'next/router'
import { useEffect, useRef, useState, useCallback, ChangeEvent } from 'react'
import { Flex, Grid, Box, Input, Text, Modal, Button, AutoRenewIcon, ButtonMenu, ButtonMenuItem, ErrorIcon, useToast } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import { useAppDispatch } from 'state'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { fetchValuepoolSgAsync } from 'state/valuepools'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useValuepoolFactory } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { AddressZero } from '@ethersproject/constants'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  currency?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateRampModal: React.FC<any> = ({
  currency,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const titleName = 'Value Pool'
  const fromValuepool = useRouter().query.valuepool
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const currencyAddress = currency.address
  const valuepoolFactoryContract = useValuepoolFactory()
  const [nftFilters,] = useState({})
  const [state, setState] = useState<any>(() => ({
    marketplace: '',
    onePersonOneVote: 0,
    adminBountyRequired: false,
    autoDataSource: AddressZero,
    riskpool: 0,
    workspace: '',
    country: '',
    city: '',
    product: '',
  }))
  
  useEffect(() => {
    Object.entries(nftFilters).map((entry) => 
      setState((prevState) => ({
        ...prevState,
        [entry[0]]: entry[1],
      })))
  }, [nftFilters])

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
  const handleRawValueChange = (key: string) => (value: string | number) => {
    updateValue(key, !!value)
  }

  const handleCreateGauge = useCallback(async () => {
    setPendingFb(true);
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
    return callWithGasPrice(valuepoolFactoryContract, 'createValuePool', [
      currencyAddress, 
      account,
      state.marketplace || AddressZero,
      !!state.onePersonOneVote,
      !!state.riskpool
    ])
    .catch((err) => {
      setPendingFb(false);
      console.log("rerr1===============>", [
        currencyAddress, 
        account,
        state.marketplace || AddressZero,
        !!state.onePersonOneVote,
        !!state.riskpool
      ], err, valuepoolFactoryContract)
      toastError(
        t('Issue creating valuepool'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {err}
        </ToastDescriptionWithTx>,
      )
    })
  })
  if (receipt?.status) {
    setPendingFb(false);
    toastSuccess(
      t('Valuepool successfully created'),
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
  account,
  // reload,
  fromValuepool,
  valuepoolFactoryContract,
  state,
  currencyAddress,
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
    title={t('Create Value Pool')}
    onDismiss={onDismiss}
    > 
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('%titleName% marketplace', { titleName })}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='marketplace'
          value={state.marketplace}
          placeholder={t('input your marketplace')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
            {t('Is Riskpool ?')}
          </Text>
          <ButtonMenu scale="xs" variant='subtle' activeIndex={state.riskpool ? 1 : 0} onItemClick={handleRawValueChange('riskpool')}>
            <ButtonMenuItem >{t("No")}</ButtonMenuItem>
            <ButtonMenuItem >{t("Yes")}</ButtonMenuItem>
          </ButtonMenu> 
        </StyledItemRow>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
            {t('One person one vote?')}
          </Text>
          <ButtonMenu scale="xs" variant='subtle' activeIndex={state.onePersonOneVote ? 1 : 0} onItemClick={handleRawValueChange("onePersonOneVote")}>
            <ButtonMenuItem >{t("No")}</ButtonMenuItem>
            <ButtonMenuItem >{t("Yes")}</ButtonMenuItem>
          </ButtonMenu> 
        </StyledItemRow>
      </GreyedOutContainer>
      {/* <GreyedOutContainer style={{ paddingBottom: 0 }}>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('%titleName% Tags', { titleName })}
        </Text>
        <Filters nftFilters={nftFilters} setNewFilters={setNewFilters} country city product/>
      </GreyedOutContainer> */}
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t('The will create a new %titleName% with you as its Admin. Please read the documentation to learn more about %titleName%s.', { titleName })}
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
          // disabled={firebaseDone}
        >
          {t('Create %titleName% in %symbol%', { symbol: currency.symbol, titleName })}
        </Button>: <ConnectWalletButton />}
      </Flex>
    </Modal>
  )
}

export default CreateRampModal
