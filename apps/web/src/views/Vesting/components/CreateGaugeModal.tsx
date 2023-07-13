import { useAppDispatch } from 'state'
import { useRouter } from 'next/router'
import { useMemo, useState, ChangeEvent } from 'react'
import { InjectedModalProps, Button, Flex, Modal, NotificationDot, useToast, Pool } from '@pancakeswap/uikit'
import { Currency } from '@pancakeswap/sdk'
import { MaxUint256 } from '@ethersproject/constants'
import { useCurrPool } from 'state/valuepools/hooks'
import useTheme from 'hooks/useTheme'
import { useTranslation, TranslateFunction, ContextApi } from '@pancakeswap/localization'
import { getBalanceNumber, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { 
  useERC20, 
  useVaContract, 
  useValuepoolHelperContract,
  useValuepoolContract,
} from 'hooks/useContract'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { ToastDescriptionWithTx } from 'components/Toast'
import ConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ConfirmStage'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { fetchValuepoolSgAsync } from 'state/valuepools'
import AddAmountModal from './LockedPool/Modals/AddAmountModal'
import RemoveAmountModal from './LockedPool/Modals/RemoveAmountModal'
import PresentBribeModal from './LockedPool/Modals/PresentBribeModal'
import CreditorStage from './CreditorStage'
import MergeStage from './MergeStage'
import UpdateVPStage from './UpdateVPStage'
import CosignStage from './CosignStage'
import AdminWithdrawStage from './AdminWithdrawStage'
import DeleteVPStage from './DeleteVPStage'
import UpdateAdminStage from './UpdateAdminStage'
import UpdateCosignStage from './UpdateCosignStage'
import AddSponsorStage from './AddSponsorStage'
import RemoveSponsorStage from './RemoveSponsorStage'
import NotifyPaymentStage from './NotifyPaymentStage'
import { stagesWithBackButton, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { LockStage } from './types'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.UPDATE]: t('Update Parameters'),
  [LockStage.DEPOSIT]: t('Deposit into Account'),
  [LockStage.WITHDRAW]: t('Withdraw from Account'),
  [LockStage.MERGE]: t('Merge IDs'),
  [LockStage.VOTE_UP]: t('Vote Up'),
  [LockStage.VOTE_DOWN]: t('Vote Down'),
  [LockStage.CLAIM_NOTE]: t('Claim Note'),
  [LockStage.UPLOAD]: t('Upload Documents'),
  [LockStage.CREATE_LOCK]: t('Create Account'),
  [LockStage.RESET]: t('Reset'),
  [LockStage.ADMINS]: t('Update Admins'),
  [LockStage.COSIGNS]: t('COSIGNS'),
  [LockStage.HISTORY]: t('Transactions History'),
  [LockStage.SPONSORS]: t('SPONSORS'),
  [LockStage.UPDATE_COSIGN]: t('UPDATE COSIGN'),
  [LockStage.CREDITOR]: t('Become a Creditor'),
  [LockStage.DELETE]: t('Delete Account'),
  [LockStage.DELETE_VP]: t('Delete Valuepool'),
  [LockStage.UPDATE_VP]: t('Update Valuepool'),
  [LockStage.ADMIN_WITHDRAW]: t('Withdraw from treasury'),
  [LockStage.ADD_SPONSORS]: t('Add Sponsors'),
  [LockStage.REMOVE_SPONSORS]: t('Remove Sponsors'),
  [LockStage.NOTIFY_PAYMENT]: t('Notify Payment'),
  [LockStage.CONFIRM_RESET]: t('Back'),
  [LockStage.CONFIRM_UPDATE]: t('Back'),
  [LockStage.CONFIRM_ADD_SPONSORS]: t('Back'),
  [LockStage.CONFIRM_NOTIFY_PAYMENT]: t('Back'),
  [LockStage.CONFIRM_REMOVE_SPONSORS]: t('Back'),
  [LockStage.CONFIRM_CREDITOR]: t('Back'),
  [LockStage.CONFIRM_COSIGNS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_COSIGN]: t('Back'),
  [LockStage.CONFIRM_MERGE]: t('Back'),
  [LockStage.CONFIRM_DEPOSIT]: t('Back'),
  [LockStage.CONFIRM_WITHDRAW]: t('Back'),
  [LockStage.CONFIRM_VOTE_UP]: t('Back'),
  [LockStage.CONFIRM_VOTE_DOWN]: t('Back'),
  [LockStage.CONFIRM_ADMINS]: t('Back'),
  [LockStage.CONFIRM_CLAIM_NOTE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_VP]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PROTOCOL]: t('Back'),
  [LockStage.CONFIRM_CREATE_LOCK]: t('Back'),
  [LockStage.CONFIRM_ADMIN_WITHDRAW]: t('Back'),
  [LockStage.CONFIRM_DELETE]: t('Back'),
  [LockStage.CONFIRM_DELETE_VP]: t('Back'),
  [LockStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

interface BuyModalProps extends InjectedModalProps {
  variant: "admin" | "user" | "delete"| "adminUser" | "sponsors" | "add_sponsors"
  location: "valuepools" | "valuepool"
  pool?: any
  currency: any
}

const getToastText = (stage: LockStage, t: ContextApi['t']) => {
  if (stage === LockStage.CONFIRM_UPDATE) {
    return t('Account parameters successfully updated')
  }
  if (stage === LockStage.CONFIRM_DEPOSIT) {
    return t('Deposit successfully processed')
  }
  if (stage === LockStage.CONFIRM_WITHDRAW || stage === LockStage.CONFIRM_ADMIN_WITHDRAW) {
    return t('Withdrawal successfully processed')
  }
  if (stage === LockStage.CONFIRM_MINT_NOTE) {
    return t('Transfer note successfully minted')
  }
  if (stage === LockStage.CONFIRM_SPLIT_SHARES) {
    return t('Shares successfully split')
  }
  if (stage === LockStage.CONFIRM_CLAIM_NOTE) {
    return t('Transfer note successfully claimed')
  }
  if (stage === LockStage.CONFIRM_UPDATE_VP) {
    return t('Valuepool successfully updated')
  }
  if (stage === LockStage.CONFIRM_PAY) {
    return t('Payment successfully made')
  }
  if (stage === LockStage.CONFIRM_DELETE) {
    return t('Account successfully deleted')
  }
  if (stage === LockStage.CONFIRM_DELETE_VP) {
    return t('Valuepool successfully deleted')
  }
  if (stage === LockStage.UPLOAD) {
    return t('Upload successful')
  }
  if (stage === LockStage.AUTOCHARGE) {
    return t('Autocharge updated successfully')
  }
  return ""
}

// NFT WBNB in testnet contract is different
const BuyModal: React.FC<any> = ({ variant="user", location="valuepool", pool, currency, onDismiss }) => {
  const [stage, setStage] = useState(variant==="admin" || variant==="adminUser"
  ? LockStage.ADMIN_SETTINGS 
  : variant === "delete" 
  ? LockStage.DELETE_VP
  : variant === "user" 
  ? LockStage.SETTINGS
  : variant === 'add_sponsors'
  ? LockStage.ADD_SPONSORS
  : LockStage.SPONSORS
  )
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const _adminARP = pool
  const adminARP = location === "valuepool" ? pool : _adminARP
  const valuepoolHelperContract = useValuepoolHelperContract()
  const stakingTokenContract = useERC20(pool?.stakingToken?.address || '')
  const valuepoolContract = useValuepoolContract(pool?.valuepoolAddress ?? '')
  const vaContract = useVaContract(pool?._va ?? '')
  const currState = useCurrPool()
  const { userData } = pool
  const tokenBalance = useMemo(() => pool?.userData?.nfts?.find((n) => n.id === currState[pool?.valuepoolAddress]), [pool, currState])
  const balance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const stakingTokenBalance = balance ? getDecimalAmount(new BigNumber(balance.toExact()), currency?.decimals) : BIG_ZERO
  const stakingTokenBalance2 = tokenBalance?.maxWithdrawable ? getDecimalAmount(tokenBalance.maxWithdrawable, currency?.decimals) : BIG_ZERO
  const totalLiquidity = parseFloat(pool.totalLiquidity) ? getBalanceNumber(pool?.totalLiquidity, currency?.decimals) : BIG_ZERO
  const treasuryBalance = (parseFloat(pool?.treasuryShare ?? '0') / 100) * parseFloat(totalLiquidity?.toString())
  const dispatch = useAppDispatch()
  const fromValuepool = useRouter().query.valuepool

  const [activeButtonIndex, setActiveButtonIndex] = useState<any>(0)
  const [share, setShare] = useState(0)

  const [state, setState] = useState<any>(() => ({
    owner: pool?.owner,
    bountyId: pool?.bountyId,
    profileId: pool?.profileId,
    tokenId: pool?.tokenId,
    tokenId2: '',
    amountPayable: '',
    amountReceivable: '',
    paidPayable: '',
    paidReceivable: '',
    periodPayable: '',
    periodReceivable: '',
    startPayable: '',
    startReceivable: '',
    description: '',
    numPeriods: '',
    name: '',
    symbol: '',
    startProtocolId: '',
    endProtocolId: '',
    requestAddress: '',
    requestAmount: '',
    recipient: '',
    splitShares: '',
    adminNote: false,
    period: pool?.period,
    bufferTime: pool?.bufferTime,
    limitFactor: pool?.limitFactor,
    gaugeBalanceFactor: pool?.gaugeBalanceFactor,
    profileRequired: pool?.profileRequired,
    bountyRequired: pool?.bountyRequired,
    paidDays:'',
    cosignEnabled: pool?.cosignEnabled,
    minCosigners: pool?.minCosigners || '',
    requests: adminARP.userData?.requests?.length || [],
    amounts: adminARP.userData?.amounts?.length || [],
    cbcAddress: '',
    BNPL: pool?.BNPL,
    onlyTrustWorthyAuditors: pool?.onlyTrustWorthyAuditors,
    queueDuration: pool?.queueDuration,
    linkFeeInBase: pool?.linkFeeInBase,
    treasuryShare: pool?.treasuryShare,
    maxDueReceivable: pool?.maxDueReceivable,
    addAdmin: true,
    admins: false,
    adminAddress: '',
    cardId: '',
    cardAddress: '',
    maxWithdrawable: pool?.maxWithdrawable,
    minimumSponsorPercentile: pool?.minimumSponsorPercentile
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
      case LockStage.MERGE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_PAY:
        setStage(LockStage.PAY)
        break
      case LockStage.ADMINS:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_ADMINS:
        setStage(LockStage.ADMINS)
        break
      case LockStage.CONFIRM_NOTIFY_PAYMENT:
        setStage(LockStage.NOTIFY_PAYMENT)
        break
      case LockStage.NOTIFY_PAYMENT:
        setStage(variant === "admin" ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.ADD_SPONSORS:
        if (pool?.userData?.isAdmin) setStage(LockStage.SPONSORS)
        break
      case LockStage.REMOVE_SPONSORS:
        setStage(variant === "admin" ? LockStage.ADMIN_SETTINGS : LockStage.SPONSORS)
        break
      case LockStage.CONFIRM_ADD_SPONSORS:
        setStage(LockStage.ADD_SPONSORS)
        break
      case LockStage.CONFIRM_REMOVE_SPONSORS:
        setStage(LockStage.REMOVE_SPONSORS)
        break
      case LockStage.HISTORY:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.VOTE_UP:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.VOTE_DOWN:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.UPDATE_COSIGN:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_COSIGN:
        setStage(LockStage.UPDATE_COSIGN)
        break
      case LockStage.CONFIRM_RESET:
        setStage(LockStage.RESET)
        break
      case LockStage.CONFIRM_MERGE:
          setStage(LockStage.MERGE)
          break
      case LockStage.UPDATE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_VOTE_UP:
        setStage(LockStage.VOTE_UP)
        break
      case LockStage.CONFIRM_VOTE_DOWN:
        setStage(LockStage.VOTE_DOWN)
        break
      case LockStage.DEPOSIT:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CREATE_LOCK:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.COSIGNS:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.WITHDRAW:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.RESET:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CREDITOR:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_CREDITOR:
        setStage(LockStage.CREDITOR)
        break
      case LockStage.CLAIM_NOTE:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.UPLOAD:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE:
        setStage(LockStage.UPDATE)
        break
      case LockStage.UPDATE_VP:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.PAY:
          setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.ADMIN_WITHDRAW:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_ADMIN_WITHDRAW:
        setStage(LockStage.ADMIN_WITHDRAW)
        break
      case LockStage.DELETE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.DELETE_VP:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_VP:
        setStage(LockStage.UPDATE_VP)
        break
      case LockStage.CONFIRM_DEPOSIT:
        setStage(LockStage.DEPOSIT)
        break
      case LockStage.CONFIRM_CREATE_LOCK:
        setStage(LockStage.CREATE_LOCK)
        break
      case LockStage.CONFIRM_COSIGNS:
        setStage(LockStage.COSIGNS)
        break
      case LockStage.CONFIRM_DELETE:
        setStage(LockStage.DELETE)
        break
      case LockStage.CONFIRM_DELETE_VP:
        setStage(LockStage.DELETE_VP)
        break
      case LockStage.CONFIRM_WITHDRAW:
        setStage(LockStage.WITHDRAW)
        break
      default:
        break
    }
  }

  const continueToNextStage = () => {
    switch (stage) {
      case LockStage.UPDATE:
        setStage(LockStage.CONFIRM_UPDATE)
        break
      case LockStage.UPDATE_COSIGN:
        setStage(LockStage.CONFIRM_UPDATE_COSIGN)
        break 
      case LockStage.ADMINS:
        setStage(LockStage.CONFIRM_ADMINS)
        break
      case LockStage.NOTIFY_PAYMENT:
        setStage(LockStage.CONFIRM_NOTIFY_PAYMENT)
        break
      case LockStage.ADD_SPONSORS:
        setStage(LockStage.CONFIRM_ADD_SPONSORS)
        break
      case LockStage.REMOVE_SPONSORS:
        setStage(LockStage.CONFIRM_REMOVE_SPONSORS)
        break
      case LockStage.MERGE:
        setStage(LockStage.CONFIRM_MERGE)
        break
      case LockStage.VOTE_UP:
        setStage(LockStage.CONFIRM_VOTE_UP)
        break
      case LockStage.VOTE_DOWN:
        setStage(LockStage.CONFIRM_VOTE_DOWN)
        break
      case LockStage.DEPOSIT:
        setStage(LockStage.CONFIRM_DEPOSIT)
        break
      case LockStage.CREATE_LOCK:
        setStage(LockStage.CONFIRM_CREATE_LOCK)
        break
      case LockStage.COSIGNS:
          setStage(LockStage.CONFIRM_COSIGNS)
        break
      case LockStage.RESET:
        setStage(LockStage.CONFIRM_RESET)
        break
      case LockStage.WITHDRAW:
        setStage(LockStage.CONFIRM_WITHDRAW)
        break
      case LockStage.CREDITOR:
        setStage(LockStage.CONFIRM_CREDITOR)
        break
      case LockStage.SPLIT_SHARES:
        setStage(LockStage.CONFIRM_SPLIT_SHARES)
        break
      case LockStage.UPDATE_VP:
        setStage(LockStage.CONFIRM_UPDATE_VP)
        break
      case LockStage.PAY:
        setStage(LockStage.CONFIRM_PAY)
        break
      case LockStage.ADMIN_WITHDRAW:
        setStage(LockStage.CONFIRM_ADMIN_WITHDRAW)
        break
      case LockStage.DELETE:
        setStage(LockStage.CONFIRM_DELETE)
        break
      case LockStage.DELETE_VP:
        setStage(LockStage.CONFIRM_DELETE_VP)
        break
      default:
        break
    }
  }
  
  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        return !parseFloat(pool ? pool.userData?.allowance : adminARP?.allowance) && 
        !parseFloat(pool ? pool.userData?.vaAllowance : adminARP?.vaAllowance) 
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      return callWithGasPrice(stakingTokenContract, 'approve', [valuepoolContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now transfer tokens into this contract!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    // eslint-disable-next-line consistent-return
    onConfirm: () => {
      if (stage === LockStage.CONFIRM_DELETE_VP) {
        return callWithGasPrice(valuepoolHelperContract, 'deleteVava', [adminARP.arpAddress])
        .catch((err) => console.log("CONFIRM_DELETE_VP===============>", err))
      }
      if (stage === LockStage.CONFIRM_DELETE) {
        return callWithGasPrice(valuepoolContract, 'deleteProtocol', [pool.owner])
        .catch((err) => console.log("CONFIRM_DELETE===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_PROTOCOL) {
        if (activeButtonIndex === 0) {
          return callWithGasPrice(valuepoolContract, 'updateBounty', [state.bountyId])
          .catch((err) => console.log("CONFIRM_UPDATE_PROTOCOL===============>", err))
        } 
        if (activeButtonIndex === 1) {
        return callWithGasPrice(valuepoolContract, 'updateProfile', [state.profileId])
        .catch((err) => console.log("CONFIRM_UPDATE_PROTOCOL===============>", err))
      } 
        if (activeButtonIndex === 2) {
          return callWithGasPrice(valuepoolContract, 'updateTokenId', [state.tokenId])
        .catch((err) => console.log("CONFIRM_UPDATE_PROTOCOL===============>", err))
      }
      }
      if (stage === LockStage.ADMIN_WITHDRAW) {
        return callWithGasPrice(valuepoolContract, 'withdraw', [pool.stakingToken.address, state.amountPayable])
        .catch((err) => console.log("ADMIN_WITHDRAW===============>", err))
      }
      if (stage === LockStage.PAY) {
        // protocolId - 1 => protocol index 
        return callWithGasPrice(valuepoolContract, 'batchPayInvoices', [parseInt(state.startProtocolId)-1, parseInt(state.endProtocolId)-1])
        .catch((err) => console.log("PAY===============>", err))
      }
      if (stage === LockStage.CONFIRM_WITHDRAW) {
        return callWithGasPrice(valuepoolContract, 'payInvoicePayable', [pool.owner, share.toString()])
        .catch((err) => console.log("CONFIRM_WITHDRAW===============>", err))
      }
      if (stage === LockStage.CONFIRM_MERGE) {
        return callWithGasPrice(vaContract, 'merge', [state.tokenId, state.tokenId2])
        .catch((err) => console.log("CONFIRM_MINT_FT===============>", err))
      }
      if (stage === LockStage.CONFIRM_MINT_NOTE) {
        return callWithGasPrice(valuepoolHelperContract, 'transferDueToNoteReceivable', [
          adminARP.arpAddress,
          account,
          pool.owner,
          state.numPeriods,
        ]).catch((err) => console.log("CONFIRM_MINT_NOTE===============>", err))
      }
      if (stage === LockStage.CONFIRM_CLAIM_NOTE) {
        return callWithGasPrice(valuepoolHelperContract, 'claimPendingRevenueFromNote', [
          adminARP.arpAddress,
          !!state.adminNote,
          state.tokenId,
        ]).catch((err) => console.log("CONFIRM_CLAIM_NOTE===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_ACCOUNT) {
        return callWithGasPrice(valuepoolContract, 'updatePaidPayable', [pool.owner, state.numPeriods])
        .catch((err) => console.log("CONFIRM_UPDATE_ACCOUNT===============>", err))
      }
      if (stage === LockStage.CONFIRM_SPLIT_SHARES) {
        return callWithGasPrice(valuepoolHelperContract, 'sendInvoice', [
          adminARP.arpAddress,
          pool.owner,
          [state.recipient],
          [state.splitShares]
        ]).catch((err) => console.log("CONFIRM_SPLIT_SHARES===============>", err))
        
      }
      if (stage === LockStage.CONFIRM_COSIGNS) {
        if (!activeButtonIndex) {
          return callWithGasPrice(valuepoolContract, 'cosign', [state.requestAddress])
          .catch((err) => console.log("CONFIRM_COSIGNS===============>", err))
        }
          return callWithGasPrice(valuepoolContract, 'requestCosign', [state.requestAmount])
          .catch((err) => console.log("CONFIRM_COSIGNS===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_VP) {
        return callWithGasPrice(valuepoolContract, 'updateParameters', [
          !!state.profileRequired,
          !!state.bountyRequired,
          parseInt(state.bufferTime).toString(),
          parseInt(state.period).toString(),
          parseInt(state.limitFactor).toString(),
          parseInt(state.gaugeBalanceFactor).toString()
        ]).catch((err) => console.log("CONFIRM_UPDATE_VP===============>", err))
      }
      if (stage === LockStage.CONFIRM_ADD_SPONSORS) {
        console.log("CONFIRM_ADD_SPONSORS===============>", [
          state.cardAddress,
          state.cardId
        ])
        return callWithGasPrice(valuepoolContract, 'addSponsor', [
          state.cardAddress,
          state.cardId
        ]).catch((err) => console.log("CONFIRM_ADD_SPONSORS===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_COSIGN) {
        return callWithGasPrice(valuepoolContract, 'updateCosign', [
          !!state.cosignEnabled,
          state.minCosigners
        ]).catch((err) => console.log("CONFIRM_UPDATE_VP===============>", err))
      }
      if (stage === LockStage.CONFIRM_NOTIFY_PAYMENT) {
        console.log("CONFIRM_NOTIFY_PAYMENT===============>",state.cardAddress)
        return callWithGasPrice(valuepoolContract, 'notifyPayment', [
          state.cardAddress
        ]).catch((err) => console.log("CONFIRM_NOTIFY_PAYMENT===============>", err))
      }
      return null
    },
    onSuccess: async ({ receipt }) => {
      toastSuccess(getToastText(stage, t), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      // onSuccessSale()
      dispatch(fetchValuepoolSgAsync({
        fromVesting: false,
        fromValuepool
      }))
      setConfirmedTxHash(receipt.transactionHash)
      setStage(LockStage.TX_CONFIRMED)
    },
  })

  const showBackButton = stagesWithBackButton.includes(stage) && !isConfirming && !isApproving

  return (
    <Modal
      title={modalTitles(t)[stage]}
      // stage={stage}
      onDismiss={onDismiss}
      onBack={showBackButton ? goBack : null}
      headerBackground={theme.colors.gradientCardHeader}
    > 
      {stage === LockStage.SPONSORS &&
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          <Button mb="8px" onClick={()=> setStage(LockStage.ADD_SPONSORS) }>
            {t('ADD SPONSORS')}
          </Button>
          <Button variant="danger" mb="8px" onClick={()=> setStage(LockStage.REMOVE_SPONSORS) }>
            {t('REMOVE SPONSORS')}
          </Button>
        </Flex>
      }
      {(stage === LockStage.SETTINGS || (stage === LockStage.ADMIN_SETTINGS && location === 'valuepool')) && 
        <Flex flexDirection="column" width="100%" px="16px">
          <Button variant="success" mb="8px" onClick={()=> setStage(LockStage.NOTIFY_PAYMENT)}>
            {t('NOTIFY PAYMENT')}
          </Button>
        </Flex>
      }
      {stage === LockStage.SETTINGS && 
        <Flex flexDirection="column" width="100%" px="16px">
          {pool.BNPL ? 
            <Button variant="success" mb="8px" onClick={()=> setStage(LockStage.COSIGNS)}>
              {t('REIMBURSE BNPL')}
              {/* <Flex mb="40px" position="relative" left="100px"><NotificationDot show={state.requests.length} /></Flex> */}
            </Button>:null}
            <Button variant="success" mb="8px" onClick={()=> setStage(LockStage.CREATE_LOCK) }>
              {t('CREATE ACCOUNT')}
            </Button>
          {userData?.nfts?.length ?
          <Button variant="success" mb="8px" onClick={()=> setStage(LockStage.DEPOSIT) }>
            {t('DEPOSIT')}
          </Button>:null}
          {userData?.nfts?.length >= 2 ?
          <Button variant="success" mb="8px" onClick={()=> setStage(LockStage.MERGE) }>
            {t('MERGE IDs')}
          </Button>:null}
          <Button variant="secondary" mb="8px" onClick={()=> setStage(LockStage.CREDITOR) }>
            {t('BECOME A CREDITOR')}
          </Button>
          {userData?.nfts?.length ?
          <Button variant="danger" mb="8px" onClick={()=> setStage(LockStage.WITHDRAW)}>
            {t('WITHDRAW')}
          </Button>:null}
          {pool.cosignEnabled ? 
            <>
            <Button variant="danger" mb="8px" onClick={()=> setStage(LockStage.ADMIN_WITHDRAW)}>
              {t('ADMIN WITHDRAW')}
              {/* <Flex mb="40px" position="relative" left="100px"><NotificationDot show={state.requests.length} /></Flex> */}
            </Button>
            <Button variant="light" mb="8px" onClick={()=> setStage(LockStage.COSIGNS)}>
              {t('COSIGNS')}
            </Button></>:null}
            <Button variant="secondary" mb="8px" onClick={() => setStage(LockStage.HISTORY) }>
              {t('ALL TRANSACTION HISTORY')}
            </Button>
        </Flex>
      }
      {stage === LockStage.ADMIN_SETTINGS && 
        <Flex flexDirection="column" width="100%" px="16px">
          {variant === "admin" ?
          <>
          <Button variant="success" mb="8px" onClick={()=> setStage(LockStage.CREATE_LOCK) }>
            {t('CREATE ACCOUNT')}
          </Button>
          <Button variant="success" mb="8px" onClick={()=> setStage(LockStage.UPDATE_VP) }>
            {t('UPDATE PARAMETERS')}
          </Button>
          <Button variant="primary" mb="8px" onClick={()=> setStage(LockStage.ADMIN_WITHDRAW) }>
            {t('WITHDRAW')}
          </Button>
          <Button variant="tertiary" mb="8px" onClick={()=> setStage(LockStage.UPDATE_COSIGN) }>
            {t('UPDATE COSIGN')}
          </Button>
          <Button variant="tertiary" mb="8px" onClick={()=> setStage(LockStage.ADMINS) }>
            {t('UPDATE ADMINS')}
          </Button>
          <Button variant="danger" mb="8px" onClick={()=> setStage(LockStage.DELETE_VP) }>
            {t('DELETE VALUEPOOL')}
          </Button>
          </>:null}
          {location === "valuepool" && variant === "admin" ?
          <Button variant="danger" mb="8px" onClick={()=> setStage(LockStage.REMOVE_SPONSORS) }>
            {t('REMOVE SPONSORS')}
          </Button>:null}
          <Button variant="secondary" mb="8px" onClick={() => setStage(LockStage.HISTORY) }>
            {t('ALL TRANSACTION HISTORY')}
          </Button>
        </Flex>
      }
       {stage === LockStage.ADD_SPONSORS && 
      <AddSponsorStage 
        state={state} 
        handleChange={handleChange}
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.REMOVE_SPONSORS && 
      <RemoveSponsorStage 
        state={state} 
        handleChange={handleChange}
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.NOTIFY_PAYMENT && 
      <NotifyPaymentStage 
        state={state} 
        handleChange={handleChange}
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.CREATE_LOCK && (
      <PresentBribeModal 
        pool={pool} 
        stakingToken={currency}
        stakingTokenBalance={stakingTokenBalance}
      />
      )}
      {stage === LockStage.DEPOSIT && (
      <AddAmountModal 
        pool={pool}
        stakingToken={currency} 
        currentBalance={stakingTokenBalance}
        currentLockedAmount={new BigNumber(tokenBalance?.lockAmount ?? '')}
        lockEndTime={tokenBalance?.lockEnds ?? ''}
        stakingTokenBalance={stakingTokenBalance}
      />
      )}
      {stage === LockStage.WITHDRAW && 
        <RemoveAmountModal 
          pool={pool}
          stakingToken={currency} 
          currentBalance={stakingTokenBalance2}
          currentLockedAmount={new BigNumber(tokenBalance?.lockAmount ?? '')}
          lockEndTime={tokenBalance?.lockEnds ?? ''}
          stakingTokenBalance={stakingTokenBalance2}
        />
      }
      {stage === LockStage.MERGE && 
        <MergeStage
          state={state}
          pool={pool}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage} 
        />}
      {stage === LockStage.ADMINS && 
      <UpdateAdminStage 
        state={state}
        currency={currency} 
        continueToNextStage={continueToNextStage} 
        handleRawValueChange={handleRawValueChange}
      />}
      {/* {stage === LockStage.HISTORY && <ActivityHistoryStage />} */}
      {stage === LockStage.CREDITOR && 
        <CreditorStage 
          state={state}
          currency={currency} 
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage} 
        />
      }
      {stage === LockStage.UPDATE_VP && 
      <UpdateVPStage 
        state={state} 
        handleChange={handleChange}
        continueToNextStage={continueToNextStage} 
        handleRawValueChange={handleRawValueChange}
      />}
      {stage === LockStage.COSIGNS && 
      <CosignStage 
        state={state} 
        symbol={pool.stakingToken?.symbol}
        currency={currency} 
        handleChange={handleChange}
        activeButtonIndex={activeButtonIndex} 
        setActiveButtonIndex={setActiveButtonIndex}
        handleRawValueChange={handleRawValueChange}
        continueToNextStage={continueToNextStage} />}
      {stage === LockStage.ADMIN_WITHDRAW && 
      <AdminWithdrawStage 
        state={state}
        currency={currency} 
        pendingRevenue={treasuryBalance}
        continueToNextStage={continueToNextStage} 
        handleRawValueChange={handleRawValueChange}
        />
      }
      {stage === LockStage.UPDATE_COSIGN && 
        <UpdateCosignStage
          state={state}
          handleChange={handleChange} 
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.DELETE_VP && <DeleteVPStage continueToNextStage={continueToNextStage} />}
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
      {stage === LockStage.TX_CONFIRMED && <TransactionConfirmed txHash={confirmedTxHash} calendarEnabled taskEnabled onDismiss={onDismiss} />}
    </Modal>
  )
}

export default BuyModal
