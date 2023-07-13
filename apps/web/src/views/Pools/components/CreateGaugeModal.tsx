import { useMemo, useState, ChangeEvent } from 'react'
import { differenceInSeconds } from 'date-fns'
import { InjectedModalProps, Button, Flex, useToast, Pool, LinkExternal } from '@pancakeswap/uikit'
import { Currency } from '@pancakeswap/sdk'
import { MaxUint256 } from '@ethersproject/constants'
import BigNumber from 'bignumber.js'
import useTheme from 'hooks/useTheme'
import { fetchPairsAsync } from 'state/pools'
import { requiresApproval } from 'utils/requiresApproval'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { useERC20, useFeeToContract, usePoolGaugeContract } from 'hooks/useContract'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useTranslation, TranslateFunction, ContextApi } from '@pancakeswap/localization'
import ConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ConfirmStage'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import { useCurrPool } from 'state/pools/hooks'
import { useAppDispatch } from 'state'
import AdminWithdrawStage from './AdminWithdrawStage'
import DepositStage from './DepositStage'
import AddRewardsStage from './AddRewardsStage'
import UnstakeStage from './UnstakeStage'
// import ActivityHistory from './ActivityHistory/ActivityHistory'
import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { LockStage,  ARPState } from './types'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.DISTRIBUTE]: t('Distribute'),
  [LockStage.DEPOSIT_ALL]: t('Deposit All'),
  [LockStage.WITHDRAW]: t('Withdraw'),
  [LockStage.DEPOSIT]: t('Deposit'),
  [LockStage.WITHDRAW_ALL]: t('Withdraw All'),
  [LockStage.UNSTAKE]: t('Unstake'),
  [LockStage.ADD_REWARDS]: t('Add Rewards'),
  [LockStage.CONFIRM_ADD_REWARDS]: t('Back'),
  [LockStage.CONFIRM_WITHDRAW]: t('Back'),
  [LockStage.CONFIRM_WITHDRAW_ALL]: t('Back'),
  [LockStage.CONFIRM_DEPOSIT]: t('Back'),
  [LockStage.CONFIRM_DEPOSIT_ALL]: t('Back'),
  [LockStage.CONFIRM_UNSTAKE]: t('Back'),
  [LockStage.CONFIRM_DISTRIBUTE]: t('Back'),
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
  // if (stage === LockStage.CONFIRM_UPDATE_ARP) {
  //   return t('ARP successfully updated')
  // }
  // if (stage === LockStage.CONFIRM_PAY) {
  //   return t('Payment successfully made')
  // }
  // if (stage === LockStage.CONFIRM_DELETE) {
  //   return t('Account successfully deleted')
  // }
  // if (stage === LockStage.CONFIRM_DELETE_ARP) {
  //   return t('ARP successfully deleted')
  // }
  // if (stage === LockStage.UPLOAD) {
  //   return t('Upload successful')
  // }
  // if (stage === LockStage.AUTOCHARGE) {
  //   return t('Autocharge updated successfully')
  // }
}

const BuyModal: React.FC<any> = ({ variant="user", location='fromStake', pool, currency, onDismiss }) => {
  const [stage, setStage] = useState(variant === "user" ? LockStage.SETTINGS : LockStage.ADMIN_SETTINGS)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const stakingTokenContract = useERC20(currency?.address || '')
  const feeToContract = useFeeToContract()
  const poolGaugeContract = usePoolGaugeContract()
  const currState = useCurrPool()
  const dispatch = useAppDispatch()
  const currAccount = useMemo(() => pool?.userData?.accounts?.find((bal) => bal.id ===  currState[pool?.id]), [currState])
  console.log("mcurrencyy===============>", currency, pool)
  // const [onPresentPreviousTx] = useModal(<ActivityHistory />,)

  const [state, setState] = useState<any>(() => ({
    tokenId: currAccount?.tokenId,
    ve: currAccount?._ve,
    token: currency?.address,
    amountReceivable: '',
    amountPayable: '',
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
      case LockStage.CONFIRM_DISTRIBUTE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_DEPOSIT_ALL:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_DEPOSIT:
        setStage(LockStage.DEPOSIT)
        break
      case LockStage.DEPOSIT:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_ADD_REWARDS:
        setStage(LockStage.ADD_REWARDS)
        break
      case LockStage.ADD_REWARDS:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UNSTAKE:
        setStage(LockStage.UNSTAKE)
        break
      case LockStage.UNSTAKE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_WITHDRAW:
        setStage(LockStage.WITHDRAW)
        break
      case LockStage.WITHDRAW:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_WITHDRAW_ALL:
        setStage(LockStage.SETTINGS)
        break
      default:
        break
    }
  }

  const continueToNextStage = () => {
    switch (stage) {
      case LockStage.DISTRIBUTE:
        setStage(LockStage.CONFIRM_DISTRIBUTE)
        break
      case LockStage.DEPOSIT:
        setStage(LockStage.CONFIRM_DEPOSIT)
        break
      case LockStage.WITHDRAW:
        setStage(LockStage.CONFIRM_WITHDRAW)
        break
      case LockStage.UNSTAKE:
        setStage(LockStage.CONFIRM_UNSTAKE)
        break
      case LockStage.ADD_REWARDS:
        setStage(LockStage.CONFIRM_ADD_REWARDS)
        break
      default:
        break
    }
  }

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        return requiresApproval(stakingTokenContract, account, poolGaugeContract.address)
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      return callWithGasPrice(stakingTokenContract, 'approve', [poolGaugeContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now transfer tokens into this contract!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    // eslint-disable-next-line consistent-return
    onConfirm: () => {
      if (stage === LockStage.CONFIRM_DISTRIBUTE) {
        return callWithGasPrice(feeToContract, 'distribute', [currency?.address])
        .catch((err) => console.log("CONFIRM_DISTRIBUTE===============>", err))
      }
      if (stage === LockStage.CONFIRM_DEPOSIT_ALL) {
        console.log("CONFIRM_DEPOSIT_ALL===============>",[
          currency?.address,
          currAccount?.ve,
          currAccount?.tokenId
        ])
        return callWithGasPrice(poolGaugeContract, 'depositAll', [
          currency?.address,
          currAccount?.ve,
          currAccount?.tokenId
        ]).catch((err) => console.log("CONFIRM_DEPOSIT_ALL===============>", err))
      }
      if (stage === LockStage.CONFIRM_DEPOSIT) {
        const amount = getDecimalAmount(new BigNumber(state.amountReceivable), pool.decimals)
        console.log("CONFIRM_DEPOSIT===============>",[
          currency?.address,
          currAccount?.ve,
          currAccount?.tokenId,
          amount?.toString()
        ])
        return callWithGasPrice(poolGaugeContract, 'deposit', [
          currency?.address,
          currAccount?.ve,
          currAccount?.tokenId,
          amount?.toString()
        ])
        .catch((err) => console.log("CONFIRM_DEPOSIT===============>", err))
      }
      if (stage === LockStage.CONFIRM_ADD_REWARDS) {
        const amount = getDecimalAmount(new BigNumber(state.amountReceivable), pool.decimals)
        console.log("CONFIRM_ADD_REWARDS===============>",[
          currency?.address,
          amount?.toString()
        ])
        return callWithGasPrice(poolGaugeContract, 'notifyRewardAmount', [
          currency?.address,
          amount?.toString()
        ])
        .catch((err) => console.log("CONFIRM_ADD_REWARDS===============>", err))
      }
      if (stage === LockStage.CONFIRM_WITHDRAW_ALL) {
        console.log("CONFIRM_WITHDRAW_ALL===============>",[
          currency?.address,
          currAccount?.ve,
          currAccount?.tokenId
        ])
        return callWithGasPrice(poolGaugeContract, 'withdrawAll', [
          currency?.address,
          currAccount?.ve,
          currAccount?.tokenId
        ])
        .catch((err) => console.log("CONFIRM_WITHDRAW_ALL===============>", err))
      }
      if (stage === LockStage.CONFIRM_WITHDRAW) {
        const amount = getDecimalAmount(new BigNumber(state.amountPayable), pool.decimals)
        console.log("CONFIRM_WITHDRAW===============>", [
          currency?.address,
          currAccount?.ve,
          currAccount?.tokenId,
          amount?.toString()
        ])
        return callWithGasPrice(poolGaugeContract, 'withdraw', [
          currency?.address,
          currAccount?.ve,
          currAccount?.tokenId,
          amount?.toString()
        ])
        .catch((err) => console.log("CONFIRM_WITHDRAW===============>", err))
      }
      if (stage === LockStage.CONFIRM_UNSTAKE) {
        const amount = getDecimalAmount(new BigNumber(state.amountPayable), pool.decimals)
        console.log("CONFIRM_UNSTAKE===============>",[
          currency?.address,
          currAccount?.ve,
          currAccount?.tokenId,
          amount?.toString()
        ])
        return callWithGasPrice(poolGaugeContract, 'withdrawToken', [
          currency?.address,
          currAccount?.ve,
          currAccount?.tokenId,
          amount?.toString()
        ])
        .catch((err) => console.log("CONFIRM_UNSTAKE===============>", err))
      }
      return null
    },
    onSuccess: async ({ receipt }) => {
      dispatch(fetchPairsAsync())
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
          <Button mb="8px" variant='success' onClick={()=> setStage(LockStage.CONFIRM_DISTRIBUTE) }>
            {t('DISTRIBUTE REWARDS')}
          </Button>
          <Button mb="8px" variant='success' onClick={()=> setStage(LockStage.ADD_REWARDS) }>
            {t('ADD REWARDS')}
          </Button>
          <Button mb="8px" variant='success' onClick={()=> setStage(LockStage.CONFIRM_DEPOSIT_ALL) }>
            {t('DEPOSIT ALL')}
          </Button>
          <Button mb="8px" onClick={()=> setStage(LockStage.DEPOSIT) }>
            {t('DEPOSIT')}
          </Button>
          <Button mb="8px" onClick={()=> setStage(LockStage.WITHDRAW) }>
            {t('WITHDRAW REWARDS')}
          </Button>
          <Button mb="8px" variant='secondary' onClick={()=> setStage(LockStage.CONFIRM_WITHDRAW_ALL) }>
            {t('WITHDRAW ALL REWARDS')}
          </Button>
          <Button mb="8px" variant='secondary' onClick={()=> setStage(LockStage.UNSTAKE) }>
            {t('UNSTAKE')}
          </Button>
        </Flex>
      }
      {stage === LockStage.DEPOSIT && 
        <DepositStage
          state={state}
          currency={currency}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />}
        {stage === LockStage.ADD_REWARDS && 
        <AddRewardsStage
          state={state}
          currency={currency}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />}
      {stage === LockStage.WITHDRAW && 
      <AdminWithdrawStage 
        state={state} 
        balance={currAccount?.earned}
        currency={currency}
        continueToNextStage={continueToNextStage} 
        handleRawValueChange={handleRawValueChange}
      />}
      {stage === LockStage.UNSTAKE && 
      <UnstakeStage
        state={state}
        balance={currAccount?.amount}
        currency={currency}
        continueToNextStage={continueToNextStage} 
        handleRawValueChange={handleRawValueChange}
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
