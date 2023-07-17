import { useAppDispatch } from 'state'
import { useRouter } from 'next/router'
import { useMemo, useState, ChangeEvent } from 'react'
import { InjectedModalProps, Button, Flex, Modal, NotificationDot, useToast, Pool } from '@pancakeswap/uikit'
import { Currency } from '@pancakeswap/sdk'
import { AddressZero, MaxUint256 } from '@ethersproject/constants'
import { useCurrPool } from 'state/valuepools/hooks'
import useTheme from 'hooks/useTheme'
import { useTranslation, TranslateFunction, ContextApi } from '@pancakeswap/localization'
import { getBalanceNumber, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { 
  useERC20, 
  useVaContract, 
  useValuepoolHelperContract,
  useValuepoolHelper2Contract,
  useValuepoolVoterContract,
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
import UpdateExcludedContentStage from './UpdateExcludedContentStage'
import UpdateCollectionIdStage from './UpdateCollectionIdStage'
import UpdateSwitchStage from './UpdateSwitchStage'
import UpdateBlacklistedStage from './UpdateBlacklistedStage'
import UpdateVPStage from './UpdateVPStage'
import PickRankStage from './PickRankStage'
import CheckRankStage from './CheckRankStage'
import UpdateDescriptionStage from './UpdateDescriptionStage'
import UpdateMediaStage from './UpdateMediaStage'
import UpdateTaxContractStage from './UpdateTaxContractStage'
import UpdateMarketPlaceStage from './UpdateMarketPlaceStage'
import UpdateTrustworthyMerchantStage from './UpdateTrustworthyMerchantStage'
import UpdateTrustworthyAuditorStage from './UpdateTrustworthyAuditorStage'
import AdminWithdrawStage from './AdminWithdrawStage'
import DeleteVPStage from './DeleteVPStage'
import UpdateAdminStage from './UpdateAdminStage'
import UpdateOwnerStage from './UpdateOwnerStage'
import AddSponsorStage from './AddSponsorStage'
import RemoveSponsorStage from './RemoveSponsorStage'
import NotifyPaymentStage from './NotifyPaymentStage'
import NotifyLoanStage from './NotifyLoanStage'
import ReimburseLoanStage from './ReimburseLoanStage'
import ReimburseBNPLStage from './ReimburseBNPLStage'
import UpdateMerchantIDProofStage from './UpdateMerchantIDProofStage'
import AddCreditStage from './AddCreditStage'
import UpdateUserIDProofStage from './UpdateUserIDProofStage'
import UpdateMinimumLockStage from './UpdateMinimumLockStage'
import UpdateVotingParametersStage from './UpdateVotingParametersStage'
import UpdateVotingBlacklistStage from './UpdateVotingBlacklistStage'
import { stagesWithBackButton, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { LockStage } from './types'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.UPDATE]: t('Update Parameters'),
  [LockStage.DEPOSIT]: t('Deposit into Account'),
  [LockStage.WITHDRAW]: t('Withdraw from Account'),
  [LockStage.REIMBURSE_BNPL]: t('Reimburse BNPL'),  
  [LockStage.REIMBURSE]: t('Reimburse Loan'),  
  [LockStage.MERGE]: t('Merge IDs'),
  [LockStage.ADD_CREDIT]: t('Add Credits'),
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
  [LockStage.UPDATE_OWNER]: t('Update Owner'),
  [LockStage.CREDITOR]: t('Become a Creditor'),
  [LockStage.DELETE]: t('Delete Account'),
  [LockStage.DELETE_VP]: t('Delete Valuepool'),
  [LockStage.UPDATE_VP]: t('Update Valuepool'),
  [LockStage.ADMIN_WITHDRAW]: t('Withdraw from treasury'),
  [LockStage.ADD_SPONSORS]: t('Add Sponsors'),
  [LockStage.REMOVE_SPONSORS]: t('Remove Sponsors'),
  [LockStage.NOTIFY_PAYMENT]: t('Notify Payment'),
  [LockStage.NOTIFY_LOAN]: t('Notify Loan'),
  [LockStage.UPDATE_MERCHANT_IDENTITY_PROOFS]: t('Update Merchants ID Proof'),
  [LockStage.UPDATE_USER_IDENTITY_PROOFS]: t('Update Users ID Proof'),
  [LockStage.PICK_RANK]: t('Pick Rank'),
  [LockStage.UPDATE_DESCRIPTION]: t('Update Description'),
  [LockStage.UPDATE_TAX_CONTRACT]: t('Update Tax Contract'),
  [LockStage.UPDATE_MARKETPLACE]: t('Update MarketPlace'),
  [LockStage.UPDATE_TRUSTWORTHY_AUDITORS]: t('Update Trustworthy Auditors'),
  [LockStage.UPDATE_TRUSTWORTHY_MERCHANTS]: t('Update Trustworthy Merchants'),
  [LockStage.CHECK_RANK]: t('Check Rank'),
  [LockStage.UPDATE_EXCLUDED_CONTENT]: t('Update Excluded Content'),
  [LockStage.UPDATE_BLACKLISTED_MERCHANTS]: t('Update Blacklisted Merchants'),
  [LockStage.UPDATE_MEDIA]: t('Update Media'),
  [LockStage.UPDATE_VOTING_PARAMETERS]: t('Update Voting Parameters'),
  [LockStage.UPDATE_VOTING_BLACKLIST]: t('Update Voting Blacklist'),
  [LockStage.UPDATE_MINIMUM_LOCK]: t('Update Minimum Lock'),
  [LockStage.UPDATE_COLLECTION_ID]: t('Update Collection Id'),
  [LockStage.CONFIRM_UPDATE_COLLECTION_ID]: t('Back'),
  [LockStage.CONFIRM_UPDATE_MARKETPLACE]: t('Back'),
  [LockStage.CONFIRM_SWITCH_POOL]: t('Back'),
  [LockStage.CONFIRM_UPDATE_MINIMUM_LOCK]: t('Back'),
  [LockStage.CONFIRM_UPDATE_VOTING_BLACKLIST]: t('Back'),
  [LockStage.CONFIRM_UPDATE_VOTING_PARAMETERS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_MEDIA]: t('Back'),
  [LockStage.CONFIRM_UPDATE_BLACKLISTED_MERCHANTS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT]: t('Back'),
  [LockStage.CONFIRM_CHECK_RANK]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TRUSTWORTHY_MERCHANTS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TRUSTWORTHY_AUDITORS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TAX_CONTRACT]: t('Back'),
  [LockStage.CONFIRM_UPDATE_DESCRIPTION]: t('Back'),
  [LockStage.CONFIRM_PICK_RANK]: t('Back'),
  [LockStage.CONFIRM_EXECUTE_NEXT_PURCHASE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_USER_IDENTITY_PROOFS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_MERCHANT_IDENTITY_PROOFS]: t('Back'),
  [LockStage.CONFIRM_ADD_CREDIT]: t('Back'),
  [LockStage.CONFIRM_RESET]: t('Back'),
  [LockStage.CONFIRM_UPDATE]: t('Back'),
  [LockStage.CONFIRM_REIMBURSE_BNPL]: t('Back'),
  [LockStage.CONFIRM_REIMBURSE]: t('Back'),
  [LockStage.CONFIRM_ADD_SPONSORS]: t('Back'),
  [LockStage.CONFIRM_NOTIFY_LOAN]: t('Back'),
  [LockStage.CONFIRM_NOTIFY_PAYMENT]: t('Back'),
  [LockStage.CONFIRM_REMOVE_SPONSORS]: t('Back'),
  [LockStage.CONFIRM_CREDITOR]: t('Back'),
  [LockStage.CONFIRM_COSIGNS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_OWNER]: t('Back'),
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
  const valuepoolHelper2Contract = useValuepoolHelper2Contract()
  const valuepoolVoterContract = useValuepoolVoterContract()
  const stakingTokenContract = useERC20(pool?.stakingToken?.address || '')
  const valuepoolContract = useValuepoolContract(pool?.id ?? '')
  const vaContract = useVaContract(pool?._va ?? '')
  const currState = useCurrPool()
  const { userData } = pool
  const router = useRouter()
  const referrer = router.query?.referrer as string
  const tokenBalance = useMemo(() => pool?.userData?.nfts?.find((n) => n.id === currState[pool?.valuepoolAddress]), [pool, currState])
  const balance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const stakingTokenBalance = balance ? getDecimalAmount(new BigNumber(balance.toExact()), currency?.decimals) : BIG_ZERO
  const stakingTokenBalance2 = tokenBalance?.maxWithdrawable ? getDecimalAmount(tokenBalance.maxWithdrawable, currency?.decimals) : BIG_ZERO
  const totalLiquidity = parseFloat(pool.totalLiquidity) ? getBalanceNumber(pool?.totalLiquidity, currency?.decimals) : BIG_ZERO
  console.log("totalLiquidity=============>", totalLiquidity, pool)
  const treasuryBalance = (parseFloat(pool?.treasuryShare ?? '0') / 100) * parseFloat(totalLiquidity.toString())
  const dispatch = useAppDispatch()
  const fromValuepool = useRouter().query.valuepool

  const [activeButtonIndex, setActiveButtonIndex] = useState<any>(0)
  const [share, setShare] = useState(0)

  const [state, setState] = useState<any>(() => ({
    owner: pool?.owner,
    bountyId: pool?.bountyId,
    profileId: pool?.profileId,
    tokenId: pool?.tokenId,
    vava: pool?.valuepoolAddress ?? '',
    tokenId2: '',
    amountPayable: '',
    amountReceivable: '',
    identityTokenId: '',
    paidPayable: '',
    paidReceivable: '',
    periodPayable: '',
    periodReceivable: '',
    startPayable: '',
    startReceivable: '',
    description: '',
    minLockValue: '',
    numPeriods: '',
    name: '',
    symbol: '',
    price: '',
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
    item: '',
    options: '',
    userTokenId: '',
    collectionAddress: '',
    merchantIdentityTokenId: '',
    cosignEnabled: pool?.cosignEnabled,
    minCosigners: pool?.minCosigners || '',
    requests: adminARP.userData?.requests?.length || [],
    amounts: adminARP.userData?.amounts?.length || [],
    cbcAddress: '',
    BNPL: pool?.BNPL ?? 0,
    onlyTrustWorthyAuditors: pool?.onlyTrustWorthyAuditors,
    queueDuration: pool?.queueDuration,
    linkFeeInBase: pool?.linkFeeInBase,
    maxDueReceivable: pool?.maxDueReceivable,
    addAdmin: true,
    admins: false,
    taxAddress: '',
    minDifference: '',
    adminAddress: '',
    minReceivable: '',
    maxTreasuryShare: '',
    uniqueAccounts: 0,
    votingPower: 0,
    cardId: '',
    geoTag: '',
    cardAddress: '',
    badgeColor: 0,
    maxUse: '',
    valueName: '',
    contentType: '',
    add: 0,
    value: '',
    onlyDataKeepers: 0,
    minimumLockValue: '',
    onlyTrustWorthyMerchants: 0,
    treasuryShare: pool?.treasuryShare,
    maxWithdrawable: pool?.maxWithdrawable,
    minimumSponsorPercentile: pool?.minimumSponsorPercentile
  }))
  console.log("ppool==============>", pool, adminARP, valuepoolContract)
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
      case LockStage.UPDATE_MERCHANT_IDENTITY_PROOFS:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_MERCHANT_IDENTITY_PROOFS:
        setStage(LockStage.UPDATE_MERCHANT_IDENTITY_PROOFS)
        break
      case LockStage.UPDATE_USER_IDENTITY_PROOFS:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_USER_IDENTITY_PROOFS:
        setStage(LockStage.UPDATE_USER_IDENTITY_PROOFS)
        break
      case LockStage.PICK_RANK:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_PICK_RANK:
        setStage(LockStage.PICK_RANK)
        break
      case LockStage.CHECK_RANK:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_CHECK_RANK:
        setStage(LockStage.CHECK_RANK)
        break
      case LockStage.UPDATE_TRUSTWORTHY_MERCHANTS:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_TRUSTWORTHY_MERCHANTS:
        setStage(LockStage.UPDATE_TRUSTWORTHY_MERCHANTS)
        break
      case LockStage.UPDATE_BLACKLISTED_MERCHANTS:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_BLACKLISTED_MERCHANTS:
        setStage(LockStage.UPDATE_BLACKLISTED_MERCHANTS)
        break
      case LockStage.UPDATE_VOTING_BLACKLIST:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_VOTING_BLACKLIST:
        setStage(LockStage.UPDATE_VOTING_BLACKLIST)
        break
      case LockStage.UPDATE_MINIMUM_LOCK:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_MINIMUM_LOCK:
        setStage(LockStage.UPDATE_MINIMUM_LOCK)
        break
      case LockStage.UPDATE_COLLECTION_ID:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_COLLECTION_ID:
        setStage(LockStage.UPDATE_COLLECTION_ID)
        break
      case LockStage.UPDATE_VOTING_PARAMETERS:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_VOTING_PARAMETERS:
        setStage(LockStage.UPDATE_VOTING_PARAMETERS)
        break
      case LockStage.UPDATE_MEDIA:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_MEDIA:
        setStage(LockStage.UPDATE_MEDIA)
        break
      case LockStage.UPDATE_EXCLUDED_CONTENT:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT:
        setStage(LockStage.UPDATE_EXCLUDED_CONTENT)
        break
      case LockStage.UPDATE_TRUSTWORTHY_AUDITORS:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_TRUSTWORTHY_AUDITORS:
        setStage(LockStage.UPDATE_TRUSTWORTHY_AUDITORS)
        break
      case LockStage.UPDATE_TAX_CONTRACT:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_TAX_CONTRACT:
        setStage(LockStage.UPDATE_TAX_CONTRACT)
        break
      case LockStage.UPDATE_DESCRIPTION:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_DESCRIPTION:
        setStage(LockStage.UPDATE_DESCRIPTION)
        break
      case LockStage.UPDATE_MARKETPLACE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_MARKETPLACE:
        setStage(LockStage.UPDATE_MARKETPLACE)
        break
      case LockStage.CONFIRM_EXECUTE_NEXT_PURCHASE:
        setStage(variant === "admin" ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_NOTIFY_PAYMENT:
        setStage(LockStage.NOTIFY_PAYMENT)
        break
      case LockStage.NOTIFY_PAYMENT:
        setStage(variant === "admin" ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_NOTIFY_LOAN:
        setStage(LockStage.NOTIFY_LOAN)
        break
      case LockStage.NOTIFY_LOAN:
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
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_OWNER:
        setStage(LockStage.UPDATE_OWNER)
        break
      case LockStage.REIMBURSE_BNPL:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_REIMBURSE_BNPL:
        setStage(LockStage.REIMBURSE_BNPL)
        break
      case LockStage.ADD_CREDIT:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_ADD_CREDIT:
        setStage(LockStage.ADD_CREDIT)
        break
      case LockStage.REIMBURSE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_REIMBURSE:
        setStage(LockStage.REIMBURSE)
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
      case LockStage.CONFIRM_SWITCH_POOL:
        setStage(LockStage.ADMIN_SETTINGS)
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
      case LockStage.ADD_CREDIT:
        setStage(LockStage.CONFIRM_ADD_CREDIT)
        break
      case LockStage.REIMBURSE_BNPL:
        setStage(LockStage.CONFIRM_REIMBURSE_BNPL)
        break
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.CONFIRM_UPDATE_OWNER)
        break 
      case LockStage.REIMBURSE:
        setStage(LockStage.CONFIRM_REIMBURSE)
        break 
      case LockStage.ADMINS:
        setStage(LockStage.CONFIRM_ADMINS)
        break
      case LockStage.NOTIFY_PAYMENT:
        setStage(LockStage.CONFIRM_NOTIFY_PAYMENT)
        break
      case LockStage.UPDATE_MERCHANT_IDENTITY_PROOFS:
        setStage(LockStage.CONFIRM_UPDATE_MERCHANT_IDENTITY_PROOFS)
        break
      case LockStage.UPDATE_USER_IDENTITY_PROOFS:
        setStage(LockStage.CONFIRM_UPDATE_USER_IDENTITY_PROOFS)
        break
      case LockStage.PICK_RANK:
        setStage(LockStage.CONFIRM_PICK_RANK)
        break
      case LockStage.CHECK_RANK:
        setStage(LockStage.CONFIRM_CHECK_RANK)
        break
      case LockStage.UPDATE_TRUSTWORTHY_MERCHANTS:
        setStage(LockStage.CONFIRM_UPDATE_TRUSTWORTHY_MERCHANTS)
        break
      case LockStage.UPDATE_BLACKLISTED_MERCHANTS:
        setStage(LockStage.CONFIRM_UPDATE_BLACKLISTED_MERCHANTS)
        break
      case LockStage.UPDATE_VOTING_PARAMETERS:
        setStage(LockStage.CONFIRM_UPDATE_VOTING_PARAMETERS)
        break
      case LockStage.UPDATE_MINIMUM_LOCK:
        setStage(LockStage.CONFIRM_UPDATE_MINIMUM_LOCK)
        break
      case LockStage.UPDATE_COLLECTION_ID:
        setStage(LockStage.CONFIRM_UPDATE_COLLECTION_ID)
        break
      case LockStage.UPDATE_VOTING_BLACKLIST:
        setStage(LockStage.CONFIRM_UPDATE_VOTING_BLACKLIST)
        break
      case LockStage.UPDATE_EXCLUDED_CONTENT:
        setStage(LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT)
        break
      case LockStage.UPDATE_MEDIA:
        setStage(LockStage.CONFIRM_UPDATE_MEDIA)
        break
      case LockStage.UPDATE_TRUSTWORTHY_AUDITORS:
        setStage(LockStage.CONFIRM_UPDATE_TRUSTWORTHY_AUDITORS)
        break
      case LockStage.UPDATE_TAX_CONTRACT:
        setStage(LockStage.CONFIRM_UPDATE_TAX_CONTRACT)
        break
      case LockStage.UPDATE_DESCRIPTION:
        setStage(LockStage.CONFIRM_UPDATE_DESCRIPTION)
        break
      case LockStage.UPDATE_MARKETPLACE:
        setStage(LockStage.CONFIRM_UPDATE_MARKETPLACE)
        break
      case LockStage.NOTIFY_LOAN:
        setStage(LockStage.CONFIRM_NOTIFY_LOAN)
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
        console.log("CONFIRM_DELETE_VP===============>", [pool?.valuepoolAddress])
        return callWithGasPrice(valuepoolHelperContract, 'deleteVava', [pool?.valuepoolAddress])
        .catch((err) => console.log("CONFIRM_DELETE_VP===============>", err))
      }
      if (stage === LockStage.CONFIRM_NOTIFY_LOAN) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [currency?.address,state.cardAddress,amountReceivable.toString()]
        console.log("CONFIRM_NOTIFY_LOAN===============>", args)
        return callWithGasPrice(valuepoolContract, 'notifyLoan', args)
        .catch((err) => console.log("CONFIRM_NOTIFY_LOAN===============>", err))
      }
      if (stage === LockStage.CONFIRM_ADMIN_WITHDRAW) {
        const amountPayable = getDecimalAmount(state.amountPayable ?? 0, currency?.decimals)
        const args = [pool?.valuepoolAddress, currency?.address, amountPayable?.toString()]
        console.log("CONFIRM_ADMIN_WITHDRAW===============>", args)
        return callWithGasPrice(valuepoolHelperContract, 'withdrawTreasury', args)
        .catch((err) => console.log("CONFIRM_ADMIN_WITHDRAW===============>", err))
      }
      if (stage === LockStage.CONFIRM_REMOVE_SPONSORS) {
        console.log("CONFIRM_REMOVE_SPONSORS===============>", [state.cardAddress])
        return callWithGasPrice(valuepoolContract, 'removeSponsorAt', [state.cardAddress])
        .catch((err) => console.log("CONFIRM_REMOVE_SPONSORS===============>", err))
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
        const args = [
          !!state.BNPL,
          state.maxUse,
          state.queueDuration,
          parseInt(state.minReceivable)*100,
          state.maxDueReceivable,
          parseInt(state.treasuryShare)*100,
          parseInt(state.maxTreasuryShare)*100,
          parseInt(state.maxWithdrawable)*100,
          parseInt(state.lenderFactor)*100,
          parseInt(state.minimumSponsorPercentile)*100,
        ]
        return callWithGasPrice(valuepoolContract, 'updateParameters', args)
        .catch((err) => console.log("CONFIRM_UPDATE_VP===============>", err))
      }
      if (stage === LockStage.CONFIRM_ADD_SPONSORS) {
        const args = [state.cardAddress, state.cardId, state.geoTag]
        console.log("CONFIRM_ADD_SPONSORS===============>", args)
        return callWithGasPrice(valuepoolContract, 'addSponsor', args)
        .catch((err) => console.log("CONFIRM_ADD_SPONSORS===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_OWNER) {
        const args = [state.owner]
        console.log("CONFIRM_UPDATE_OWNER===============>",args)
        return callWithGasPrice(valuepoolContract, 'updateDev', args)
        .catch((err) => console.log("CONFIRM_UPDATE_OWNER===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_COLLECTION_ID) {
        const args = [state.userTokenId]
        console.log("CONFIRM_UPDATE_COLLECTION_ID===============>",args)
        return callWithGasPrice(vaContract, 'setIdentityParams', args)
        .catch((err) => console.log("CONFIRM_UPDATE_COLLECTION_ID===============>", err))
      }
      if (stage === LockStage.CONFIRM_SWITCH_POOL) {
        console.log("CONFIRM_SWITCH_POOL===============>")
        return callWithGasPrice(vaContract, 'switchPool', [])
        .catch((err) => console.log("CONFIRM_SWITCH_POOL===============>", err))
      }
      if (stage === LockStage.CONFIRM_REIMBURSE_BNPL) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [state.tokenId, amountReceivable.toString()]
        console.log("CONFIRM_REIMBURSE_BNPL===============>",args)
        return callWithGasPrice(valuepoolContract, 'reimburseBNPL', args)
        .catch((err) => console.log("CONFIRM_REIMBURSE_BNPL===============>", err))
      }
      if (stage === LockStage.CONFIRM_ADD_CREDIT) {
        const args = [state.tokenId]
        console.log("CONFIRM_ADD_CREDIT===============>",args)
        return callWithGasPrice(valuepoolContract, 'addCredit', args)
        .catch((err) => console.log("CONFIRM_ADD_CREDIT===============>", err))
      }
      if (stage === LockStage.CONFIRM_REIMBURSE) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [currency.address, state.cardAddress, amountReceivable.toString()]
        console.log("CONFIRM_REIMBURSE===============>",args)
        return callWithGasPrice(valuepoolContract, 'notifyReimbursement', args)
        .catch((err) => console.log("CONFIRM_REIMBURSE===============>", err))
      }
      if (stage === LockStage.CONFIRM_NOTIFY_PAYMENT) {
        console.log("CONFIRM_NOTIFY_PAYMENT===============>",state.cardAddress)
        return callWithGasPrice(valuepoolContract, 'notifyPayment', [
          state.cardAddress
        ]).catch((err) => console.log("CONFIRM_NOTIFY_PAYMENT===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_MERCHANT_IDENTITY_PROOFS) {
        const args = [state.badgeColor, state.valueName, state.value, !!state.onlyDataKeepers, !!state.onlyTrustWorthyMerchants]
        console.log("CONFIRM_UPDATE_MERCHANT_IDENTITY_PROOFS===============>",args)
        return callWithGasPrice(valuepoolContract, 'updateMerchantIDProofParams', args)
        .catch((err) => console.log("CONFIRM_UPDATE_MERCHANT_IDENTITY_PROOFS===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_USER_IDENTITY_PROOFS) {
        const args = [state.badgeColor, state.valueName, state.value, !!state.uniqueAccounts, !!state.onlyDataKeepers, !!state.onlyTrustWorthyMerchants]
        console.log("CONFIRM_UPDATE_USER_IDENTITY_PROOFS===============>",args)
        return callWithGasPrice(valuepoolContract, 'updateUserIDProofParams', args)
        .catch((err) => console.log("CONFIRM_UPDATE_USER_IDENTITY_PROOFS===============>", err))
      }
      if (stage === LockStage.CONFIRM_PICK_RANK) {
        const args = [state.tokenId, state.identityTokenId]
        console.log("CONFIRM_PICK_RANK===============>",args)
        return callWithGasPrice(valuepoolContract, 'pickRank', args)
        .catch((err) => console.log("CONFIRM_PICK_RANK===============>", err))
      }
      if (stage === LockStage.CONFIRM_CHECK_RANK) {
        const amountReceivable = getDecimalAmount(state.amountReceivable, currency?.decimals)
        const args = [
          state.vava, 
          state.collectionAddress, 
          referrer || AddressZero , 
          state.item, 
          state.options?.split(','), 
          [
            state.userTokenId,
            state.identityTokenId,
            state.merchantIdentityTokenId,
            state.tokenId,
            amountReceivable.toString(),
          ]
        ]
        console.log("CONFIRM_CHECK_RANK===============>",args)
        return callWithGasPrice(valuepoolHelperContract, 'checkRank', args)
        .catch((err) => console.log("CONFIRM_CHECK_RANK===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_TRUSTWORTHY_MERCHANTS) {
        const args = [state.vava, state.taxAddress, !!state.add]
        console.log("CONFIRM_UPDATE_TRUSTWORTHY_MERCHANTS===============>",args)
        return callWithGasPrice(valuepoolHelper2Contract, 'updateVavaTrustWorthyMerchants', args)
        .catch((err) => console.log("CONFIRM_UPDATE_TRUSTWORTHY_MERCHANTS===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_TRUSTWORTHY_AUDITORS) {
        const args = [state.vava, state.taxAddress, !!state.add]
        console.log("CONFIRM_UPDATE_TRUSTWORTHY_AUDITORS===============>",args)
        return callWithGasPrice(valuepoolHelper2Contract, 'updateMerchantTrustWorthyAuditors', args)
        .catch((err) => console.log("CONFIRM_UPDATE_TRUSTWORTHY_AUDITORS===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_BLACKLISTED_MERCHANTS) {
        const args = [state.vava, state.taxAddress, !!state.add]
        console.log("CONFIRM_UPDATE_BLACKLISTED_MERCHANTS===============>",args)
        return callWithGasPrice(valuepoolHelper2Contract, 'updateBlacklistMerchant', args)
        .catch((err) => console.log("CONFIRM_UPDATE_BLACKLISTED_MERCHANTS===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_VOTING_BLACKLIST) {
        const args = [state.vava, state.taxAddress, !!state.add]
        console.log("CONFIRM_UPDATE_VOTING_BLACKLIST===============>",args)
        return callWithGasPrice(valuepoolVoterContract, 'updateBlacklist', args)
        .catch((err) => console.log("CONFIRM_UPDATE_VOTING_BLACKLIST===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_MINIMUM_LOCK) {
        const minLockValue = getDecimalAmount(state.minLockValue, currency?.decimals)
        const args = [state.vava, minLockValue.toString()]
        console.log("CONFIRM_UPDATE_MINIMUM_LOCK===============>",args)
        return callWithGasPrice(valuepoolVoterContract, 'updateMinimumLock', args)
        .catch((err) => console.log("CONFIRM_UPDATE_MINIMUM_LOCK===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_VOTING_PARAMETERS) {
        const args = [
          state.vava, 
          state.period, 
          state.minPeriod, 
          parseInt(state.minDifference)*100, 
          state.userTokenId, 
          state.minBountyRequired, 
          state.minimumLockValue,
          state.votingPower
        ]
        console.log("CONFIRM_UPDATE_VOTING_PARAMETERS===============>",args)
        return callWithGasPrice(valuepoolVoterContract, 'addVa', args)
        .catch((err) => console.log("CONFIRM_UPDATE_VOTING_PARAMETERS===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT) {
        const args = [state.vava, state.contentType, !!state.add]
        console.log("CONFIRM_UPDATE_EXCLUDED_CONTENT===============>",args)
        return callWithGasPrice(valuepoolHelper2Contract, 'updateExcludedContent', args)
        .catch((err) => console.log("CONFIRM_UPDATE_EXCLUDED_CONTENT===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_MEDIA) {
        const args = [state.taxAddress, state.vava, state.item]
        console.log("CONFIRM_UPDATE_MEDIA===============>",args)
        return callWithGasPrice(valuepoolHelper2Contract, 'updateMedia', args)
        .catch((err) => console.log("CONFIRM_UPDATE_MEDIA===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_TAX_CONTRACT) {
        const args = [state.taxAddress]
        console.log("CONFIRM_UPDATE_TAX_CONTRACT===============>",args)
        return callWithGasPrice(valuepoolHelperContract, 'updateTaxContract', args)
        .catch((err) => console.log("CONFIRM_UPDATE_TAX_CONTRACT===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_DESCRIPTION) {
        const args = [state.vava, state.description]
        console.log("CONFIRM_UPDATE_DESCRIPTION===============>",args)
        return callWithGasPrice(valuepoolHelperContract, 'updateValuepool', args)
        .catch((err) => console.log("CONFIRM_UPDATE_DESCRIPTION===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_MARKETPLACE) {
        const args = [state.vava, state.taxAddress]
        console.log("CONFIRM_UPDATE_MARKETPLACE===============>",args)
        return callWithGasPrice(valuepoolHelperContract, 'updateMarketPlace', args)
        .catch((err) => console.log("CONFIRM_UPDATE_MARKETPLACE===============>", err))
      }
      if (stage === LockStage.CONFIRM_EXECUTE_NEXT_PURCHASE) {
        console.log("CONFIRM_EXECUTE_NEXT_PURCHASE1===============>")
        return callWithGasPrice(valuepoolContract, 'executeNextPurchase', [])
        .catch((err) => console.log("CONFIRM_EXECUTE_NEXT_PURCHASE===============>", err))
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
          <Button variant="success" mb="8px" onClick={()=> setStage(LockStage.NOTIFY_LOAN)}>
            {t('NOTIFY LOAN')}
          </Button>
        </Flex>
      }
      {stage === LockStage.SETTINGS && 
        <Flex flexDirection="column" width="100%" px="16px">
          {pool.BNPL ? 
            <Button variant="success" mb="8px" onClick={()=> setStage(LockStage.REIMBURSE_BNPL)}>
              {t('REIMBURSE BNPL')}
              {/* <Flex mb="40px" position="relative" left="100px"><NotificationDot show={state.requests.length} /></Flex> */}
            </Button>:null}
            <Button variant="success" mb="8px" onClick={()=> setStage(LockStage.REIMBURSE)}>
              {t('REIMBURSE LOAN')}
              {/* <Flex mb="40px" position="relative" left="100px"><NotificationDot show={state.requests.length} /></Flex> */}
            </Button>
            <Button mb="8px" onClick={()=> setStage(LockStage.CREATE_LOCK) }>
              {t('CREATE ACCOUNT')}
            </Button>
            <Button mb="8px" onClick={()=> setStage(LockStage.ADD_CREDIT) }>
              {t('ADD CREDIT')}
            </Button>
            <Button variant="light" mb="8px" onClick={()=> setStage(LockStage.PICK_RANK) }>
              {t('PICK RANK')}
            </Button>
            <Button variant="light" mb="8px" onClick={()=> setStage(LockStage.CHECK_RANK) }>
              {t('CHECK RANK')}
            </Button>
            <Button variant="light" mb="8px" onClick={()=> setStage(LockStage.UPDATE_TAX_CONTRACT) }>
              {t('UPDATE TAX CONTRACT')}
            </Button>
            <Button mb="8px" variant="subtle" onClick={()=> setStage(LockStage.CONFIRM_EXECUTE_NEXT_PURCHASE) }>
              {t('EXECUTE NEXT PURCHASE')}
            </Button>
          {userData?.nfts?.length ?
          <Button variant="success" mb="8px" onClick={()=> setStage(LockStage.DEPOSIT) }>
            {t('DEPOSIT')}
          </Button>:null}
          {userData?.nfts?.length >= 2 ?
          <Button variant="success" mb="8px" onClick={()=> setStage(LockStage.MERGE) }>
            {t('MERGE IDs')}
          </Button>:null}
          {/* <Button variant="secondary" mb="8px" onClick={()=> setStage(LockStage.CREDITOR) }>
            {t('BECOME A CREDITOR')}
          </Button> */}
          {userData?.nfts?.length ?
          <Button variant="danger" mb="8px" onClick={()=> setStage(LockStage.WITHDRAW)}>
            {t('WITHDRAW')}
          </Button>:null}
            <Button variant="secondary" mb="8px" onClick={() => setStage(LockStage.HISTORY) }>
              {t('ALL TRANSACTION HISTORY')}
            </Button>
        </Flex>
      }
      {stage === LockStage.ADMIN_SETTINGS && 
        <Flex flexDirection="column" width="100%" px="16px">
          {variant === "admin" ?
          <>
          <Button mb="8px" onClick={()=> setStage(LockStage.CREATE_LOCK) }>
            {t('CREATE ACCOUNT')}
          </Button>
          <Button mb="8px" variant="subtle" onClick={()=> setStage(LockStage.CONFIRM_EXECUTE_NEXT_PURCHASE) }>
            {t('EXECUTE NEXT PURCHASE')}
          </Button>
          <Button mb="8px" onClick={()=> setStage(LockStage.UPDATE_VP) }>
            {t('UPDATE PARAMETERS')}
          </Button>
          <Button variant="secondary" mb="8px" onClick={()=> setStage(LockStage.UPDATE_MERCHANT_IDENTITY_PROOFS) }>
            {t('UPDATE MERCHANT IDENTITY PROOFS')}
          </Button>
          <Button variant="secondary" mb="8px" onClick={()=> setStage(LockStage.UPDATE_USER_IDENTITY_PROOFS) }>
            {t('UPDATE USER IDENTITY PROOFS')}
          </Button>
          <Button variant="text" mb="8px" onClick={()=> setStage(LockStage.UPDATE_TRUSTWORTHY_MERCHANTS) }>
            {t('UPDATE TRUSTWORTHY MERCHANTS')}
          </Button>
          <Button variant="text" mb="8px" onClick={()=> setStage(LockStage.UPDATE_TRUSTWORTHY_AUDITORS) }>
            {t('UPDATE TRUSTWORTHY AUDITORS')}
          </Button>
          <Button variant="light" mb="8px" onClick={()=> setStage(LockStage.UPDATE_BLACKLISTED_MERCHANTS) }>
            {t('UPDATE BLACKLISTED MERCHANTS')}
          </Button>
          <Button variant="light" mb="8px" onClick={()=> setStage(LockStage.UPDATE_EXCLUDED_CONTENT) }>
            {t('UPDATE EXCLUDED CONTENT')}
          </Button>
          <Button variant="light" mb="8px" onClick={()=> setStage(LockStage.UPDATE_MEDIA) }>
            {t('UPDATE MEDIA')}
          </Button>
          {/* <Button variant="light" mb="8px" onClick={()=> setStage(LockStage.UPDATE_MINIMUM_LOCK) }>
            {t('UPDATE MINIMUM LOCK')}
          </Button> */}
          <Button variant="secondary" mb="8px" onClick={()=> setStage(LockStage.UPDATE_VOTING_PARAMETERS) }>
            {t('UPDATE VOTING PARAMETERS')}
          </Button>
          <Button variant="secondary" mb="8px" onClick={()=> setStage(LockStage.UPDATE_VOTING_BLACKLIST) }>
            {t('UPDATE VOTING BLACKLIST')}
          </Button>
          <Button variant="tertiary" mb="8px" onClick={()=> setStage(LockStage.CONFIRM_SWITCH_POOL) }>
            {t('SWITCH POOL')}
          </Button>
          {/* <Button variant="tertiary" mb="8px" onClick={()=> setStage(LockStage.UPDATE_COLLECTION_ID) }>
            {t('UPDATE COLLECTION ID IN VE')}
          </Button> */}
          <Button mb="8px" onClick={()=> setStage(LockStage.UPDATE_OWNER) }>
            {t('UPDATE OWNER')}
          </Button>
          <Button variant="success" mb="8px" onClick={()=> setStage(LockStage.UPDATE_DESCRIPTION) }>
            {t('UPDATE DESCRIPTION')}
          </Button>
          <Button variant="success" mb="8px" onClick={()=> setStage(LockStage.UPDATE_MARKETPLACE) }>
            {t('UPDATE MARKETPLACE')}
          </Button>
          <Button variant="danger" mb="8px" onClick={()=> setStage(LockStage.ADMIN_WITHDRAW) }>
            {t('WITHDRAW')}
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
      {stage === LockStage.UPDATE_COLLECTION_ID &&
        <UpdateCollectionIdStage
          state={state} 
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage} 
        />  
      }
      {stage === LockStage.UPDATE_VOTING_BLACKLIST &&
        <UpdateVotingBlacklistStage
          state={state} 
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage} 
        />  
      }
      {stage === LockStage.UPDATE_VOTING_PARAMETERS &&
        <UpdateVotingParametersStage
          state={state} 
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage} 
        />  
      }
      {stage === LockStage.UPDATE_MINIMUM_LOCK &&
        <UpdateMinimumLockStage
          state={state} 
          handleChange={handleChange}
          continueToNextStage={continueToNextStage} 
        />  
      }
      {stage === LockStage.PICK_RANK &&
        <PickRankStage
          state={state} 
          handleChange={handleChange}
          continueToNextStage={continueToNextStage} 
        />  
      }
      {stage === LockStage.CHECK_RANK &&
        <CheckRankStage
          state={state} 
          handleChange={handleChange}
          continueToNextStage={continueToNextStage} 
        />  
      }
      {stage === LockStage.UPDATE_TAX_CONTRACT &&
        <UpdateTaxContractStage
          state={state} 
          handleChange={handleChange}
          continueToNextStage={continueToNextStage} 
        />  
      }
      {stage === LockStage.UPDATE_DESCRIPTION &&
        <UpdateDescriptionStage
          state={state} 
          handleChange={handleChange}
          continueToNextStage={continueToNextStage} 
        />  
      }
      {stage === LockStage.UPDATE_MEDIA &&
        <UpdateMediaStage
          state={state} 
          handleChange={handleChange}
          continueToNextStage={continueToNextStage} 
        />  
      }
      {stage === LockStage.UPDATE_MARKETPLACE &&
        <UpdateMarketPlaceStage
          state={state} 
          handleChange={handleChange}
          continueToNextStage={continueToNextStage} 
        />  
      }
      {stage === LockStage.UPDATE_MERCHANT_IDENTITY_PROOFS &&
        <UpdateMerchantIDProofStage
          state={state} 
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage} 
        />  
      }
      {stage === LockStage.UPDATE_USER_IDENTITY_PROOFS &&
        <UpdateUserIDProofStage
          state={state} 
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage} 
        />  
      }
      {stage === LockStage.REIMBURSE &&
        <ReimburseLoanStage
          state={state} 
          handleChange={handleChange}
          continueToNextStage={continueToNextStage} 
        />
      }
      {stage === LockStage.ADD_CREDIT &&
        <AddCreditStage
          state={state} 
          handleChange={handleChange}
          continueToNextStage={continueToNextStage} 
        />
      }
      {stage === LockStage.REIMBURSE_BNPL &&
        <ReimburseBNPLStage
          state={state} 
          handleChange={handleChange}
          continueToNextStage={continueToNextStage} 
        />
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
      {stage === LockStage.NOTIFY_LOAN && 
      <NotifyLoanStage 
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
      {stage === LockStage.ADMIN_WITHDRAW && 
      <AdminWithdrawStage 
        state={state}
        currency={currency} 
        pendingRevenue={treasuryBalance}
        continueToNextStage={continueToNextStage} 
        handleRawValueChange={handleRawValueChange}
        />
      }
      {stage === LockStage.UPDATE_OWNER && 
        <UpdateOwnerStage 
          state={state} 
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage} 
        />}
      {stage === LockStage.UPDATE_TRUSTWORTHY_MERCHANTS && 
        <UpdateTrustworthyMerchantStage
          state={state} 
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage} 
        />}
        {stage === LockStage.UPDATE_TRUSTWORTHY_AUDITORS && 
        <UpdateTrustworthyAuditorStage
          state={state} 
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage} 
        />}
        {stage === LockStage.UPDATE_EXCLUDED_CONTENT && 
        <UpdateExcludedContentStage
          state={state} 
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage} 
        />}
        {stage === LockStage.UPDATE_BLACKLISTED_MERCHANTS && 
        <UpdateBlacklistedStage
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
