import { useEffect, useRef, useState, useCallback, ChangeEvent } from 'react'
import { Flex, Grid, Box, Text, Input, Modal, Button, AutoRenewIcon, ErrorIcon, useToast, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { differenceInSeconds } from 'date-fns'
import { Currency } from "@pancakeswap/sdk"
import { useAppDispatch } from 'state'
import { DatePicker, DatePickerPortal } from 'views/Voting/components/DatePicker'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { fetchLotteriesAsync } from 'state/lotteries'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useLotteryHelperContract } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { AddressZero } from '@ethersproject/constants'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { Divider, GreyedOutContainer } from './styles'

interface SetPriceStageProps {
  currency?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateLotteryModal: React.FC<any> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const lotteryHelperContract = useLotteryHelperContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const [state, setState] = useState<any>(() => ({
    valuepool: '',
    startTime: '',
    endTime: '',
    endAmount: '',
    useNFTicket: 0,
    riskpool: 0,
    treasuryFee: '',
    referrerFee: '',
    priceTicket: '',
    discountDivisor: '',
    rewardsBreakdown: '',
    lockDuration: '',
  }))
  const updateValue = (key: any, value: string | number | boolean | Date) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    updateValue(inputName, value)
  }
  const handleRawValueChange = (key: string) => (value: Date | number | boolean | string) => {
    updateValue(key, value)
  }

  const handleCreateGauge = useCallback(async () => {
      setPendingFb(true);
      // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
        const startTime = Math.max(differenceInSeconds(new Date(state.startTime || 0), new Date(), {
          roundingMethod: 'ceil',
        }),0)
        const endTime = Math.max(differenceInSeconds(new Date(state.endTime || 0), new Date(), {
          roundingMethod: 'ceil',
        }),0)
        const endAmount = getDecimalAmount(state.endAmount ?? 0)
        const priceTicket = getDecimalAmount(state.priceTicket ?? 0)
        const args = [
          account,
          state.valuepool || AddressZero,
          startTime,
          endTime,
          endAmount.toString(),
          state.lockDuration,
          !!state.useNFTicket,
          [state.treasuryFee,state.referrerFee,priceTicket.toString(),state.discountDivisor],
          state.rewardsBreakdown?.split(',')?.map((val) => parseFloat(val.trim())*100)
        ]
      console.log("receipt================>", lotteryHelperContract, args)
      return callWithGasPrice(lotteryHelperContract, 'startLottery', args)
      .catch((err) => {
        console.log("err================>",err)
        setPendingFb(false);
        toastError(
          t('Issue creating lottery'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {err}
          </ToastDescriptionWithTx>,
        )
      })
    })
    if (receipt?.status) {
      setPendingFb(false);
      toastSuccess(
        t('Lottery successfully created'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start processing transactions through your Lottery contract.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchLotteriesAsync({ fromLottery: true }))
    }
      onDismiss()
  }, [fetchWithCatchTxError, onDismiss, state.startTime, state.endTime, state.endAmount, state.priceTicket, state.valuepool, state.lockDuration, state.useNFTicket, state.treasuryFee, state.referrerFee, state.discountDivisor, state.rewardsBreakdown, account, lotteryHelperContract, callWithGasPrice, toastError, t, toastSuccess, dispatch])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <Modal 
    title={t('Create Lottery')}
    onDismiss={onDismiss}
    >
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Start Date')}
        </Text>
        <DatePicker
          onChange={handleRawValueChange('startTime')}
          selected={state.startTime}
          placeholderText="YYYY/MM/DD"
        />
        <DatePickerPortal/>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('End Date')}
        </Text>
        <DatePicker
          onChange={handleRawValueChange('endTime')}
          selected={state.endTime}
          placeholderText="YYYY/MM/DD"
        />
        <DatePickerPortal/>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Valuepool Address')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="valuepool"
          value={state.valuepool}
          placeholder={t('input valuepool address')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('End Amount')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="endAmount"
          value={state.endAmount}
          placeholder={t('input end amount')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Treasury Fee')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="treasuryFee"
          value={state.treasuryFee}
          placeholder={t('input treasury fee')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Referrer Fee')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="referrerFee"
          value={state.referrerFee}
          placeholder={t('input referrer fee')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Price Ticket')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="priceTicket"
          value={state.priceTicket}
          placeholder={t('input price ticket')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Lock Duration')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="lockDuration"
          value={state.lockDuration}
          placeholder={t('input lock duration')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Discount Divisor')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="discountDivisor"
          value={state.discountDivisor}
          placeholder={t('input discount divisor')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Rewards Breakdown')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="rewardsBreakdown"
          value={state.rewardsBreakdown}
          placeholder='250,375,625,1250,2500,5000'
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
            {t('Use NFTicket ?')}
          </Text>
          <ButtonMenu scale="xs" variant='subtle' activeIndex={state.useNFTicket ? 1 : 0} onItemClick={handleRawValueChange('useNFTicket')}>
            <ButtonMenuItem >{t("No")}</ButtonMenuItem>
            <ButtonMenuItem >{t("Yes")}</ButtonMenuItem>
          </ButtonMenu> 
        </StyledItemRow>
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t('The will create a new lottery session with you as its Admin. Please read the documentation to learn more about Lotteries.')}
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
          {t('Create Lottery')}
        </Button>: <ConnectWalletButton />}
      </Flex>
    </Modal>
  )
}

export default CreateLotteryModal