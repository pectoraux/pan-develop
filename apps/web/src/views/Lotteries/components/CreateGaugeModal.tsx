import { useRouter } from 'next/router'
import { useState, ChangeEvent } from 'react'
import { differenceInSeconds } from 'date-fns'
import { InjectedModalProps, Button, Flex, useToast, Pool, LinkExternal } from '@pancakeswap/uikit'
import { Currency } from '@pancakeswap/sdk'
import { AddressZero, MaxUint256 } from '@ethersproject/constants'
import BigNumber from 'bignumber.js'
import useTheme from 'hooks/useTheme'
import { requiresApproval } from 'utils/requiresApproval'
import { getDecimalAmount, getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useERC20, useLotteryContract, useLotteryHelperContract, useLotteryRandomNumberGenerator } from 'hooks/useContract'
import { combineDateAndTime } from 'views/SSI/CreateProposal/helpers'
import { convertTimeToSeconds } from 'utils/timeHelper'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useTranslation, TranslateFunction, ContextApi } from '@pancakeswap/localization'
import ConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ConfirmStage'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import ClaimTicketStage from './ClaimTicketStage'
import UpdateAutoChargeStage from './UpdateAutoChargeStage'
import UpdateBountyStage from './UpdateBountyStage'
import UpdateDescriptionStage from './UpdateDescriptionStage'
import StartLotteryStage from './StartLotteryStage'
import VoteStage from './VoteStage'
import RandomNumberFeesStage from './RandomNumberFeesStage'
import UpdateBurnForCreditStage from './UpdateBurnForCreditStage'
import ClaimLotteryStage from './ClaimLotteryStage'
import InjectFundsStage from './InjectFundsStage'
import SponsorTagStage from './SponsorTagStage'
import WithdrawStage from './WithdrawStage'
import BurnForCreditStage from './BurnForCreditStage'
import DrawFinalNumberStage from './DrawFinalNumberStage'
import AdminWithdrawStage from './AdminWithdrawStage'
import DeleteStage from './DeleteStage'
import CloseLotteryStage from './CloseLotteryStage'
import BuyTicketStage from './BuyTicketStage'
// import ActivityHistory from './ActivityHistory/ActivityHistory'
import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { LockStage } from './types'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.CONTRIBUTE_RANDOM_NUMBER_FEES]: t('Random Number Fees'),
  [LockStage.START_LOTTERY]: t('Start Lottery'),
  [LockStage.UPDATE_BURN_TOKEN_FOR_CREDIT]: t('Update Burn Token For Credit'),
  [LockStage.CLAIM_LOTTERY_REVENUE]: t('Claim Lottery Revenue'),
  [LockStage.INJECT_FUNDS]: t('Inject Funds'),
  [LockStage.BURN_TOKEN_FOR_CREDIT]: t('Burn Token For Credit'),
  [LockStage.WITHDRAW]: t('Withdraw'),
  [LockStage.DRAW_FINAL_NUMBER]: t('Draw Final Number'),
  [LockStage.BUY_TICKETS]: t('Buy Tickets'),
  [LockStage.CLOSE_LOTTERY]: t('Close Lottery'),
  [LockStage.CLAIM_TICKETS]: t('Claim Tickets'),
  [LockStage.ADMIN_WITHDRAW]: t('Withdraw'),
  [LockStage.CONFIRM_ADMIN_WITHDRAW]: t('Back'),
  [LockStage.CONFIRM_CONTRIBUTE_RANDOM_NUMBER_FEES]: t('Back'),
  [LockStage.CONFIRM_START_LOTTERY]: t('Back'),
  [LockStage.CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT]: t('Back'),
  [LockStage.CONFIRM_CLAIM_LOTTERY_REVENUE]: t('Back'),
  [LockStage.CONFIRM_CLAIM_TICKETS]: t('Back'),
  [LockStage.CONFIRM_INJECT_FUNDS]: t('Back'),
  [LockStage.CONFIRM_BURN_TOKEN_FOR_CREDIT]: t('Back'),
  [LockStage.CONFIRM_WITHDRAW]: t('Back'),
  [LockStage.CONFIRM_DRAW_FINAL_NUMBER]: t('Back'),
  [LockStage.CONFIRM_BUY_TICKETS]: t('Back'),
  [LockStage.CONFIRM_CLOSE_LOTTERY]: t('Back'),
  [LockStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

interface BuyModalProps extends InjectedModalProps {
  variant: "admin" | "user" | "delete" | "buy"
  pool?: any
  currency: any
}

const getToastText = (stage: LockStage, t: ContextApi['t']) => {
  // if (stage === LockStage.CONFIRM_UPDATE) {
  //   return t('Account parameters successfully updated')
  // }
  // if (stage === LockStage.CONFIRM_DEPOSIT) {
  //   return t('Deposit successfully processed')
  // }
  // if (stage === LockStage.CONFIRM_WITHDRAW || stage === LockStage.CONFIRM_ADMIN_WITHDRAW) {
  //   return t('Withdrawal successfully processed')
  // }
  // if (stage === LockStage.CONFIRM_MINT_NOTE) {
  //   return t('Transfer note successfully minted')
  // }
  // if (stage === LockStage.CONFIRM_SPLIT_SHARES) {
  //   return t('Shares successfully split')
  // }
  // if (stage === LockStage.CONFIRM_CLAIM_NOTE) {
  //   return t('Transfer note successfully claimed')
  // }
  // if (stage === LockStage.CONFIRM_UPDATE_Lottery) {
  //   return t('Lottery successfully updated')
  // }
  // if (stage === LockStage.CONFIRM_PAY) {
  //   return t('Payment successfully made')
  // }
  // if (stage === LockStage.CONFIRM_DELETE) {
  //   return t('Account successfully deleted')
  // }
  // if (stage === LockStage.CONFIRM_DELETE_Lottery) {
  //   return t('Lottery successfully deleted')
  // }
  // if (stage === LockStage.UPLOAD) {
  //   return t('Upload successful')
  // }
  // if (stage === LockStage.AUTOCHARGE) {
  //   return t('Autocharge updated successfully')
  // }
}

const BuyModal: React.FC<any> = ({ variant="user", location='fromStake', pool, currAccount, currency, onDismiss }) => {
  const [stage, setStage] = useState(variant === "user" ? LockStage.SETTINGS : LockStage.ADMIN_SETTINGS)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const router = useRouter()
  const referrerAddress = router.query.referrer as string
  const stakingTokenContract = useERC20(currency?.address || currAccount?.token?.address || '')
  const lotteryContract = useLotteryContract()
  const lotteryHelperContract = useLotteryHelperContract()
  const randomNumberGeneratorContract = useLotteryRandomNumberGenerator()
  console.log("mcurrencyy===============>", currAccount, currency, pool, lotteryContract)
  // const [onPresentPreviousTx] = useModal(<ActivityHistory />,)

  // console.log("router===================>", router)
  // const { state: status, userAccount, session_id, userCurrency, amount } = router.query
  const [state, setState] = useState<any>(() => ({
    lockDuration: '',
    endAmount: '',
    endReceivable: '',
    startReceivable: '',
    valuepool: '',
    periodReceivable: '',
    token: currency?.address,
    treasuryFee: '',
    referrerFee: '',
    discountDivisor: '',
    startTime: '',
    endTime: '',
    rewardsBreakdown: '',
    useNFTicket: 0,
    collectionId: '',
    checker: '',
    toAddress: '',
    destination: '',
    clear: 0,
    add: 0,
    reinject: 0,
    fromSponsors: 0,
    fungible: 0,
    referrer: 0,
    position: '',
    discount: '',
    item: '',
    nfticketId: '',
    tokenId: '',
    identityTokenId: '',
    ticketNumbers: '',
    brackets: '',
    lotteryId: currAccount?.id ?? '',
    owner: currAccount?.owner || account
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
  const handleRawValueChange = (key: string) => (value: string | Date) => {
    updateValue(key, value)
  }

  const goBack = () => {
    switch (stage) {
      case LockStage.CONFIRM_WITHDRAW:
        setStage(LockStage.WITHDRAW)
        break
      case LockStage.WITHDRAW:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_INJECT_FUNDS:
        setStage(LockStage.INJECT_FUNDS)
        break
      case LockStage.INJECT_FUNDS:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_DRAW_FINAL_NUMBER:
        setStage(LockStage.DRAW_FINAL_NUMBER)
        break
      case LockStage.DRAW_FINAL_NUMBER:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_BUY_TICKETS:
        setStage(LockStage.BUY_TICKETS)
        break
      case LockStage.BUY_TICKETS:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_CLAIM_TICKETS:
        setStage(LockStage.CLAIM_TICKETS)
        break
      case LockStage.CLAIM_TICKETS:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_BURN_TOKEN_FOR_CREDIT:
        setStage(LockStage.BURN_TOKEN_FOR_CREDIT)
        break
      case LockStage.BURN_TOKEN_FOR_CREDIT:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_ADMIN_WITHDRAW:
        setStage(LockStage.ADMIN_WITHDRAW)
        break
      case LockStage.ADMIN_WITHDRAW:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_CONTRIBUTE_RANDOM_NUMBER_FEES:
        setStage(LockStage.CONTRIBUTE_RANDOM_NUMBER_FEES)
        break
      case LockStage.CONTRIBUTE_RANDOM_NUMBER_FEES:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_CLOSE_LOTTERY:
        setStage(LockStage.CLOSE_LOTTERY)
        break
      case LockStage.CLOSE_LOTTERY:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_START_LOTTERY:
        setStage(LockStage.START_LOTTERY)
        break
      case LockStage.START_LOTTERY:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT:
        setStage(LockStage.UPDATE_BURN_TOKEN_FOR_CREDIT)
        break
      case LockStage.UPDATE_BURN_TOKEN_FOR_CREDIT:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_CLAIM_LOTTERY_REVENUE:
        setStage(LockStage.CLAIM_LOTTERY_REVENUE)
        break
      case LockStage.CLAIM_LOTTERY_REVENUE:
        setStage(LockStage.SETTINGS)
        break
      default:
        break
    }
  }

  const continueToNextStage = () => {
    switch (stage) {
      case LockStage.INJECT_FUNDS:
        setStage(LockStage.CONFIRM_INJECT_FUNDS)
        break
      case LockStage.BURN_TOKEN_FOR_CREDIT:
        setStage(LockStage.CONFIRM_BURN_TOKEN_FOR_CREDIT)
        break
      case LockStage.BUY_TICKETS:
        setStage(LockStage.CONFIRM_BUY_TICKETS)
        break
      case LockStage.CLAIM_TICKETS:
        setStage(LockStage.CONFIRM_CLAIM_TICKETS)
        break
      case LockStage.CLAIM_LOTTERY_REVENUE:
        setStage(LockStage.CONFIRM_CLAIM_LOTTERY_REVENUE)
        break
      case LockStage.CLOSE_LOTTERY:
        setStage(LockStage.CONFIRM_CLOSE_LOTTERY)
        break
      case LockStage.CONTRIBUTE_RANDOM_NUMBER_FEES:
        setStage(LockStage.CONFIRM_CONTRIBUTE_RANDOM_NUMBER_FEES)
        break
      case LockStage.UPDATE_BURN_TOKEN_FOR_CREDIT:
        setStage(LockStage.CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT)
        break
      case LockStage.START_LOTTERY:
        setStage(LockStage.CONFIRM_START_LOTTERY)
        break
      case LockStage.DRAW_FINAL_NUMBER:
        setStage(LockStage.CONFIRM_DRAW_FINAL_NUMBER)
        break
      case LockStage.WITHDRAW:
        setStage(LockStage.CONFIRM_WITHDRAW)
        break
      case LockStage.ADMIN_WITHDRAW:
        setStage(LockStage.CONFIRM_ADMIN_WITHDRAW)
        break
      default:
        break
    }
  }

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        return requiresApproval(stakingTokenContract, account, lotteryContract.address)
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      return callWithGasPrice(stakingTokenContract, 'approve', [lotteryContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now start receiving payments for audits!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    // eslint-disable-next-line consistent-return
    onConfirm: () => {
      if (stage === LockStage.CONFIRM_START_LOTTERY) {
        const endAmount = getDecimalAmount(state.endAmount ?? 0, currency?.decimals)
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const timeReceivable = combineDateAndTime(state.startReceivable, state.startTime)?.toString()
        const startReceivable = Math.max(differenceInSeconds(new Date(timeReceivable ? parseInt(timeReceivable) * 1000 : 0), new Date(), {
          roundingMethod: 'ceil',
        }),0)
        console.log("startReceivable===================>",startReceivable)
        const time2Receivable = combineDateAndTime(state.endReceivable, state.endTime)?.toString()
        const endReceivable = Math.max(differenceInSeconds(new Date(timeReceivable ? parseInt(timeReceivable) * 1000 : 0), new Date(), {
          roundingMethod: 'ceil',
        }),0)
        // const lockDuration = Math.max(differenceInSeconds(new Date(state.lockDuration ?? 0), new Date(), {
        //   roundingMethod: 'ceil',
        // }),0)
        const args = [
          account,
          state.valuepool,
          startReceivable.toString(),
          endReceivable.toString(),
          endAmount.toString(),
          state.lockDuration,
          !!state.useNFTicket,
          [
            state.treasuryFee, 
            state.referrerFee,
            amountReceivable.toString(),
            state.discountDivisor
          ],
          state.rewardsBreakdown?.split(',').map((rwb) => parseInt(rwb) * 100),
        ]
        console.log("CONFIRM_START_LOTTERY===============>", lotteryHelperContract, args)
        return callWithGasPrice(lotteryHelperContract, 'startLottery', args)
        .catch((err) => console.log("CONFIRM_START_LOTTERY===============>", err))
      }
      if (stage === LockStage.CONFIRM_CONTRIBUTE_RANDOM_NUMBER_FEES) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [amountReceivable?.toString()]
        console.log("CONFIRM_CONTRIBUTE_RANDOM_NUMBER_FEES===============>", args)
        return callWithGasPrice(randomNumberGeneratorContract, 'addFee', args)
        .catch((err) => console.log("CONFIRM_CONTRIBUTE_RANDOM_NUMBER_FEES===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT) {
        const args = [
          currency?.address,
          state.checker,
          state.destination,
          state.discount,
          state.collectionId,
          !!state.clear,
          state.item
        ]
        console.log("CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT===============>",args)
        return callWithGasPrice(lotteryHelperContract, 'updateBurnTokenForCredit', args)
        .catch((err) => console.log("CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT===============>", err))
      }
      if (stage === LockStage.CONFIRM_CLAIM_LOTTERY_REVENUE) {
        const args = state.fromSponsors ? [state.lotteryId] : [state.lotteryId, currency.address]
        const method = state.fromSponsors ? 'claimLotteryRevenueFomSponsors' : 'claimLotteryRevenue'
        console.log("CONFIRM_CLAIM_LOTTERY_REVENUE===============>",args)
        return callWithGasPrice(lotteryContract, method, args)
        .catch((err) => console.log("CONFIRM_CLAIM_LOTTERY_REVENUE===============>", err))
      }
      if (stage === LockStage.CONFIRM_INJECT_FUNDS) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [state.lotteryId, amountReceivable.toString(), currency?.address, !!state.reinject]
        console.log("CONFIRM_INJECT_FUNDS===============>",args)
        return callWithGasPrice(lotteryContract, 'injectFunds', args)
        .catch((err) => console.log("CONFIRM_INJECT_FUNDS===============>", err))
      }
      if (stage === LockStage.CONFIRM_WITHDRAW) {
        const args = !state.referrer ? [currency.address,state.lotteryId,state.identityTokenId] : [state.lotteryId,currency.address]
        const method = !state.referrer ? 'withdrawPendingReward' : 'withrawReferrerFee'
        console.log("CONFIRM_WITHDRAW===============>",args)
        return callWithGasPrice(lotteryContract, method, args)
        .catch((err) => console.log("CONFIRM_WITHDRAW===============>", err))
      }
      if (stage === LockStage.CONFIRM_BURN_TOKEN_FOR_CREDIT) {
        const amount = !state.fungible ? state.amountReceivable : getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)?.toString()
        const args = [state.owner,state.position,amount]
        console.log("CONFIRM_BURN_TOKEN_FOR_CREDIT===============>",args)
        return callWithGasPrice(lotteryHelperContract, 'burnForCredit', args)
        .catch((err) => console.log("CONFIRM_BURN_TOKEN_FOR_CREDIT===============>", err))
      }
      if (stage === LockStage.CONFIRM_DRAW_FINAL_NUMBER) {
        const args = [state.lotteryId]
        console.log("CONFIRM_DRAW_FINAL_NUMBER===============>",args)
        return callWithGasPrice(lotteryContract, 'drawFinalNumberAndMakeLotteryClaimable', args)
        .catch((err) => console.log("CONFIRM_DRAW_FINAL_NUMBER===============>", err))
      }
      if (stage === LockStage.CONFIRM_BUY_TICKETS) {
        const args = [
          state.owner, 
          account, 
          referrerAddress || AddressZero,
          "",
          state.nfticketId,
          state.identityTokenId,
          state.ticketNumbers?.split(','),
        ]
        console.log("CONFIRM_BUY_TICKETS===============>",args)
        return callWithGasPrice(lotteryContract, 'buyWithContract', args)
        .catch((err) => console.log("CONFIRM_BUY_TICKETS===============>", err))
      }
      if (stage === LockStage.CONFIRM_CLOSE_LOTTERY) {
        const args = [state.lotteryId, state.tokenId]
        console.log("CONFIRM_CLOSE_LOTTERY===============>", args)
        return callWithGasPrice(lotteryContract, 'closeLottery', args)
        .catch((err) => console.log("CONFIRM_CLOSE_LOTTERY===============>", err))
      }
      if (stage === LockStage.CONFIRM_ADMIN_WITHDRAW) {
        const amount = getDecimalAmount(state.amountPayable ?? 0, currency?.decimals)
        const args = [state.lotteryId, currency?.address]
        console.log("CONFIRM_ADMIN_WITHDRAW===============>",args)
        return callWithGasPrice(lotteryContract, 'withdrawTreasury', args)
        .catch((err) => console.log("CONFIRM_ADMIN_WITHDRAW===============>", err))
      }
      if (stage === LockStage.CONFIRM_CLAIM_TICKETS) {
        const args = [state.lotteryId, state.ticketNumbers.split(','), state.brackets.split(',')]
        console.log("CONFIRM_CLAIM_TICKETS===============>",args)
        return callWithGasPrice(lotteryContract, 'claimTickets', args)
        .catch((err) => console.log("CONFIRM_CLAIM_TICKETS===============>", err))
      }
      return null
    },
    onSuccess: async ({ receipt }) => {
      // toastSuccess(getToastText(stage, t), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      setConfirmedTxHash(receipt.transactionHash)
      setStage(LockStage.TX_CONFIRMED)
    },
  })

  const showBackButton = stagesWithBackButton.includes(stage) && !isConfirming && !isApproving
  
  return (
    <StyledModal
      title={modalTitles(t)[stage]}
      stage={stage}
      onDismiss={onDismiss}
      onBack={showBackButton ? goBack : null}
      headerBackground={theme.colors.gradientCardHeader}
    > 
      {stage === LockStage.SETTINGS && 
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          <Button mb="8px" variant='success' onClick={()=> setStage(LockStage.BUY_TICKETS) }>
            {t('BUY TICKETS')}
          </Button>
          <Button mb="8px" onClick={()=> setStage(LockStage.CLAIM_TICKETS) }>
            {t('CLAIM TICKETS')}
          </Button>
          <Button mb="8px" variant='secondary' onClick={()=> setStage(LockStage.DRAW_FINAL_NUMBER) }>
            {t('DRAW FINAL NUMBER')}
          </Button>
          <Button mb="8px" onClick={()=> setStage(LockStage.BURN_TOKEN_FOR_CREDIT) }>
            {t('BURN TOKEN FOR CREDIT')}
          </Button>
          <Button mb="8px" variant='secondary' onClick={()=> setStage(LockStage.WITHDRAW) }>
            {t('WITHDRAW')}
          </Button>
          <Button variant="success" mb="8px" onClick={()=> setStage(LockStage.INJECT_FUNDS) }>
            {t('INJECT FUNDS')}
          </Button>
          <Button variant="success" mb="8px" onClick={()=> setStage(LockStage.CLAIM_LOTTERY_REVENUE) }>
            {t('CLAIM LOTTERY REVENUE')}
          </Button>
          <Button mb="8px" onClick={()=> setStage(LockStage.CLOSE_LOTTERY) }>
            {t('CLOSE LOTTERY')}
          </Button>
          <Button mb="8px" variant='danger' onClick={()=> setStage(LockStage.CONTRIBUTE_RANDOM_NUMBER_FEES) }>
            {t('CONTRIBUTE RANDOM NUMBER FEES')}
          </Button>
        </Flex>
      }
      {stage === LockStage.ADMIN_SETTINGS && 
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          <Button variant="success" mb="8px" onClick={()=> setStage(LockStage.INJECT_FUNDS) }>
            {t('INJECT FUNDS')}
          </Button>
          <Button variant="success" mb="8px" onClick={()=> setStage(LockStage.CLAIM_LOTTERY_REVENUE) }>
            {t('CLAIM LOTTERY REVENUE')}
          </Button>
          <Button mb="8px" onClick={()=> setStage(LockStage.UPDATE_BURN_TOKEN_FOR_CREDIT) }>
            {t('UPDATE BURN TOKEN FOR CREDIT')}
          </Button>
          <Button mb="8px" variant='secondary' onClick={()=> setStage(LockStage.START_LOTTERY) }>
            {t('START LOTTERY')}
          </Button>
          <Button mb="8px" variant='secondary' onClick={()=> setStage(LockStage.DRAW_FINAL_NUMBER) }>
            {t('DRAW FINAL NUMBER')}
          </Button>
          <Button mb="8px" onClick={()=> setStage(LockStage.CLOSE_LOTTERY) }>
            {t('CLOSE LOTTERY')}
          </Button>
          <Button mb="8px" variant='danger' onClick={()=> setStage(LockStage.CONTRIBUTE_RANDOM_NUMBER_FEES) }>
            {t('CONTRIBUTE RANDOM NUMBER FEES')}
          </Button>
          <Button variant="secondary" mb="8px" onClick={()=> setStage(LockStage.ADMIN_WITHDRAW) }>
            {t('WITHDRAW')}
          </Button>
        </Flex>
      }
      {stage === LockStage.CONTRIBUTE_RANDOM_NUMBER_FEES && 
      <RandomNumberFeesStage 
        state={state} 
        currency={currency}
        handleChange={handleChange}
        handleRawValueChange={handleRawValueChange}
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.START_LOTTERY && 
      <StartLotteryStage
        state={state} 
        handleChange={handleChange}
        handleRawValueChange={handleRawValueChange}
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.UPDATE_BURN_TOKEN_FOR_CREDIT && 
        <UpdateBurnForCreditStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />}
      {stage === LockStage.CLAIM_LOTTERY_REVENUE && 
      <ClaimLotteryStage
        state={state} 
        handleChange={handleChange}
        handleRawValueChange={handleRawValueChange}
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.CLAIM_TICKETS && 
      <ClaimTicketStage
        state={state} 
        handleChange={handleChange}
        handleRawValueChange={handleRawValueChange}
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.INJECT_FUNDS && 
      <InjectFundsStage 
        state={state} 
        currency={currency}
        handleChange={handleChange} 
        handleRawValueChange={handleRawValueChange} 
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.WITHDRAW && 
      <WithdrawStage 
        state={state} 
        account={pool.id}
        currency={currency}
        continueToNextStage={continueToNextStage} 
        handleRawValueChange={handleRawValueChange}
      />}
      {stage === LockStage.ADMIN_WITHDRAW && 
      <AdminWithdrawStage 
        state={state} 
        account={pool.id}
        currency={currency}
        handleChange={handleChange} 
        continueToNextStage={continueToNextStage} 
        handleRawValueChange={handleRawValueChange}
      />}
        {stage === LockStage.BURN_TOKEN_FOR_CREDIT && 
        <BurnForCreditStage
          state={state}
          handleChange={handleChange} 
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage} 
        />}
        {stage === LockStage.DRAW_FINAL_NUMBER && 
          <DrawFinalNumberStage
            state={state}
            handleChange={handleChange} 
            continueToNextStage={continueToNextStage} 
        />}
        {stage === LockStage.BUY_TICKETS && 
          <BuyTicketStage
            state={state}
            account={account}
            currency={currency}
            handleChange={handleChange} 
            handleRawValueChange={handleRawValueChange}
            continueToNextStage={continueToNextStage} 
        />}
      {stage === LockStage.CLOSE_LOTTERY && 
        <CloseLotteryStage 
            state={state}
            handleChange={handleChange} 
            handleRawValueChange={handleRawValueChange}
            continueToNextStage={continueToNextStage} 
        />}
      {stagesWithApproveButton.includes(stage) && (
        <ApproveAndConfirmStage
          variant="buy"
          handleApprove={handleApprove}
          isApproved={isApproved}
          isApproving={isApproving}
          isConfirming={isConfirming}
          handleConfirm={handleConfirm}
        />
      )}
      {stagesWithConfirmButton.includes(stage) && <ConfirmStage isConfirming={isConfirming} handleConfirm={handleConfirm} />}
      {stage === LockStage.TX_CONFIRMED && <TransactionConfirmed txHash={confirmedTxHash} onDismiss={onDismiss} />}
    </StyledModal>
  )
}

export default BuyModal
