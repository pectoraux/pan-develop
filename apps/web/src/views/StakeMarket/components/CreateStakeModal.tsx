import { useRouter } from 'next/router'
import { differenceInSeconds } from 'date-fns'
import { useEffect, ChangeEvent, useRef, useState, useCallback } from 'react'
import { Flex, Grid, Box, Text, Modal, Button, AutoRenewIcon, Input, ErrorIcon, useToast, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { Currency } from "@pancakeswap/sdk"
import { useAppDispatch } from 'state'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { DatePicker, DatePickerPortal } from 'views/Voting/components/DatePicker'
import { FetchStatus } from 'config/constants/types'
import { fetchStakesAsync } from 'state/stakemarket'
import { useWeb3React } from '@pancakeswap/wagmi'
import Filters from 'views/CanCan/market/components/BuySellModals/SellModal/Filters'
import { getVeFromWorkspace } from 'utils/addressHelpers'
import { useERC20, useStakeMarketContract } from 'hooks/useContract'
import { DEFAULT_INPUT_CURRENCY } from 'config/constants/exchange'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { useGetRequiresApproval } from 'state/stakemarket/hooks'
import { AddressZero } from '@ethersproject/constants'
import BigNumber from 'bignumber.js'
import { useApprovePool } from '../hooks/useApprove'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  currency?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateStakeModal: React.FC<any> = ({
  currency,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const collectionId = useRouter().query.collectionAddress as string
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const titleName = "Stake Market"
  const dispatch = useAppDispatch()
  const { signer: stakeMarketContract } = useStakeMarketContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const [allowing, setAllowing] = useState(false)
  const currencyAddress = currency.address ?? DEFAULT_INPUT_CURRENCY
  const { toastSuccess, toastError } = useToast()
  const [nftFilters, setNftFilters] = useState<any>({})
  const stakingTokenContract = useERC20(currencyAddress || '')
  const { handleApprove: handlePoolApprove, pendingTx: pendingPoolTx } = useApprovePool(
    stakingTokenContract,
    0,
    stakeMarketContract.address,
    currency.symbol,
  )

  const { status, needsApproval } = useGetRequiresApproval(stakingTokenContract, account, stakeMarketContract.address)

  const [state, setState] = useState<any>({
    ve: '',
    source: account,
    token: '',
    tokenId: '',
    owner: '',
    amountPayable: '', 
    amountReceivable: '', 
    periodPayable: '', 
    periodReceivable: '', 
    waitingPeriod: '',
    startPayable: '',
    startReceivable: '',
    requireUpfrontPayment: 0,
    userTokenId: 0,
    identityTokenId: 0,
  })
  const handleCreateGauge = useCallback(async () => {
      setPendingFb(true);
      // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const ve = getVeFromWorkspace(nftFilters?.workspace?.value?.toLowerCase())
      const amountPayable = getDecimalAmount(new BigNumber(state.amountPayable ?? '0'), currency?.decimals)
      const amountReceivable = getDecimalAmount(new BigNumber(state.amountReceivable ?? '0'), currency?.decimals)
      const startPayable = Math.max(differenceInSeconds(new Date(state.startPayable || 0), new Date(), {
        roundingMethod: 'ceil',
      }),0)
      const startReceivable = Math.max(differenceInSeconds(new Date(state.startReceivable || 0), new Date(), {
        roundingMethod: 'ceil',
      }),0)
      const args = [
        [ve, currencyAddress, state.source, AddressZero, AddressZero,account], 
        state.tokenId ?? '0',
        collectionId ?? 0,
        [],
        state.userTokenId,
        state.identityTokenId,
        [amountPayable.toString(),amountReceivable.toString(),state.periodPayable,state.periodReceivable,state.waitingPeriod,startPayable,startReceivable],
        !!state.requireUpfrontPayment
      ]
      console.log("createStake=================>", args)
      return callWithGasPrice(stakeMarketContract, 'createStake', args)
      .catch((err) => {
        setPendingFb(false);
        console.log("err0=================>", err)
        toastError(
          t('Issue creating stake'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {err}
          </ToastDescriptionWithTx>,
        )
      })
    })
    if (receipt?.status) {
      setPendingFb(false);
      toastSuccess(
        t('Stake successfully created'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start processing applications for your Stake.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchStakesAsync(collectionId))
    }
      onDismiss()
  }, [
    onDismiss,
    dispatch,
    state,
    account,
    nftFilters,
    collectionId,
    currency,
    stakeMarketContract,
    currencyAddress,
    t,
    toastError,
    toastSuccess,
    callWithGasPrice,
    fetchWithCatchTxError,
  ])

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
  
  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])
  
  return (
    <Modal 
    title={t('%titleName%', { titleName: needsApproval ? 'Enable' : 'Create Stake' })}
    onDismiss={onDismiss}
    >
      {!needsApproval ? 
      <>
      <Flex alignSelf='center' mt={20}>
        <Filters
          nftFilters={nftFilters} 
          setNftFilters={setNftFilters}
          showCountry={false}
          showCity={false}
          showProduct={false}
        />
      </Flex>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Source Address')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='source'
          value={state.source}
          placeholder={t('input source address')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Media CID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='tokenId'
          value={state.tokenId}
          placeholder={t('input media cid')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('User Token Id')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='userTokenId'
          value={state.userTokenId}
          placeholder={t('input user token id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Identity Token Id')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='identityTokenId'
          value={state.identityTokenId}
          placeholder={t('input identity token id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Amount Payable')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='amountPayable'
          value={state.amountPayable}
          placeholder={t('input amount payable')}
        onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Amount Receivable')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='amountReceivable'
          value={state.amountReceivable}
          placeholder={t('input amount receivable')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Period Payable')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='periodPayable'
          value={state.periodPayable}
          placeholder={t('input period payable')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Period Receivable')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='periodReceivable'
          value={state.periodReceivable}
          placeholder={t('input period receivable')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Waiting Period')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='waitingPeriod'
          value={state.waitingPeriod}
          placeholder={t('input period receivable')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Start Payable')}
      </Text>
      <DatePicker
        selected={state.startPayable}
        placeholderText="YYYY/MM/DD"
        onChange={handleRawValueChange('startPayable')}
      />
      <DatePickerPortal/>
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Start Receivable')}
      </Text>
      <DatePicker
        selected={state.startReceivable}
        placeholderText="YYYY/MM/DD"
        onChange={handleRawValueChange('startReceivable')}
      />
      <DatePickerPortal/>
    </GreyedOutContainer>
    <GreyedOutContainer>
        <StyledItemRow>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
          {t('Require Upfront Payment')}
        </Text>
        <ButtonMenu scale="xs" variant='subtle' activeIndex={state.requireUpfrontPayment} onItemClick={handleRawValueChange('requireUpfrontPayment')}>
        <ButtonMenuItem >{t('No')}</ButtonMenuItem>
        <ButtonMenuItem >{t('Yes')}</ButtonMenuItem>
      </ButtonMenu>
      </StyledItemRow>
      </GreyedOutContainer>
    </>:null}
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {needsApproval 
            ? t('The will enable the stake market to withdraw from your wallet')
            : t('The will create a new stake in the market for you. Please read the documentation to learn more about the stake market.')}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        {!account ? <ConnectWalletButton />: needsApproval ?
        <Button
          mb="8px"
          onClick={handlePoolApprove}
          endIcon={allowing || status === FetchStatus.Fetching ? <AutoRenewIcon spin color="currentColor" /> : null}
          isLoading={allowing}
          disabled={allowing || status === FetchStatus.Fetching}
        >
          {t('%text% %symbol%', { text: status === FetchStatus.Fetching ? 'Enabling for' : 'Enable for', symbol: currency.symbol, titleName })}
        </Button>: 
        <Button
          mb="8px"
          onClick={handleCreateGauge}
          endIcon={pendingTx || pendingFb ? <AutoRenewIcon spin color="currentColor" /> : null}
          isLoading={pendingTx || pendingFb}
        >
        {t('%text% %symbol%', { text: 'Create a stake with', symbol: currency.symbol, titleName })}
      </Button>}
      </Flex>
    </Modal>
  )
}

export default CreateStakeModal
