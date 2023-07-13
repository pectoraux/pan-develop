import { useRouter } from 'next/router'
import getTimePeriods from 'utils/getTimePeriods'
import { useState, ChangeEvent } from 'react'
import { usePool } from 'state/stakemarket/hooks'
import { convertTimeToSeconds } from 'utils/timeHelper'
import { InjectedModalProps, Button, Flex, useToast, LinkExternal, Pool, Text } from '@pancakeswap/uikit'
import { Currency } from '@pancakeswap/sdk'
import { MaxUint256 } from '@ethersproject/constants'
import useTheme from 'hooks/useTheme'
import { differenceInSeconds } from 'date-fns'
import { useTranslation, TranslateFunction, ContextApi } from '@pancakeswap/localization'
import { getBalanceNumber, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { 
  useERC20, 
  useStakeMarketContract, 
  useStakeMarketNoteContract,
} from 'hooks/useContract'
import { useAppDispatch } from 'state'
import { fetchStakesAsync } from 'state/stakemarket'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { ToastDescriptionWithTx } from 'components/Toast'
import ConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ConfirmStage'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import { requiresApproval } from 'utils/requiresApproval'
import UpdateParametersStage from './UpdateParametersStage'
import UpdateStakeStage from './UpdateStakeStage'
import ClaimNoteStage from './ClaimNoteStage'
import ApplyStage from './ApplyStage'
import AcceptStage from './AcceptStage'
import UpdateBeforeLitigationStage from './UpdateBeforeLitigationStage'
import UpdateTaxContractStage from './UpdateTaxContractStage'
import UpdateOwnerStage from './UpdateOwnerStage'
import DepositStage from './DepositStage'
import WithdrawStage from './WithdrawStage'
import MintNoteStage from './MintNoteStage'
import MintIOUStage from './MintIOUStage'
import LitigationStage from './LitigationStage'
import SwitchStakeStage from './SwitchStakeStage'
import CancelStakeStage from './CancelStakeStage'
import WaitingPeriodStage from './WaitingPeriodStage'
import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { LockStage,  ARPState } from './types'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.ACCEPT]: t('Accept Application'),
  [LockStage.START_WAITING_PERIOD]: t('Start Waiting Period'),
  [LockStage.UPDATE]: t('Update Requirements'),
  [LockStage.APPLY]: t('Apply for this stake'),
  [LockStage.DEPOSIT]: t('Deposit into Account'),
  [LockStage.WITHDRAW]: t('Withdraw from Account'),
  [LockStage.MINT_NOTE]: t('Mint Transfer Note'),
  [LockStage.SPLIT_SHARES]: t('Split Shares'),
  [LockStage.CLAIM_NOTE]: t('Claim Revenue from Note'),
  [LockStage.CLAIM_NOTE]: t('Claim Note'),
  [LockStage.UPLOAD]: t('Upload Documents'),
  [LockStage.START_LITIGATIONS]: t('Litigations'),
  [LockStage.COSIGNS]: t('COSIGNS'),
  [LockStage.UPDATE_COSIGN]: t('UPDATE COSIGN'),
  [LockStage.ADD_PAID_DAYS]: t('Add Paid Periods'),
  [LockStage.MINT_FT]: t('Mint Fungible Tokens'),
  [LockStage.UPDATE_PROTOCOL]: t('Update Parameters'),
  [LockStage.DELETE]: t('Delete Account'),
  [LockStage.DELETE_ARP]: t('Delete ARP'),
  [LockStage.UPDATE_STAKE]: t('Update Stake'),
  [LockStage.ADMIN_WITHDRAW]: t('Withdraw'),
  [LockStage.ACCEPT]: t('Accept Application'),
  [LockStage.UPDATE_OWNER]: t('Update Owner'),
  [LockStage.UPDATE_TAX_CONTRACT]: t('Update Tax Contract'),
  [LockStage.UPDATE_BEFORE_LITIGATIONS]: t('Update Before Litigations'),
  [LockStage.CANCEL_STAKE]: t('Cancel Stake'),
  [LockStage.SWITCH_STAKE]: t('Switch Stake'),
  [LockStage.MINT_IOU]: t('Mint IOU'),
  [LockStage.CONFIRM_MINT_IOU]: t('Back'),
  [LockStage.CONFIRM_SWITCH_STAKE]: t('Back'),
  [LockStage.CONFIRM_CANCEL_STAKE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_BEFORE_LITIGATIONS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TAX_CONTRACT]: t('Back'),
  [LockStage.CONFIRM_UPDATE_OWNER]: t('Back'),
  [LockStage.CONFIRM_ACCEPT]: t('Back'),
  [LockStage.AUTOCHARGE]: t('Back'),
  [LockStage.CONFIRM_UPDATE]: t('Back'),
  [LockStage.CONFIRM_START_WAITING_PERIOD]: t('Back'),
  [LockStage.CONFIRM_ADD_PAID_DAYS]: t('Back'),
  [LockStage.CONFIRM_START_LITIGATIONS]: t('Back'),
  [LockStage.CONFIRM_APPLY]: t('Back'),
  [LockStage.CONFIRM_UPDATE_COSIGN]: t('Back'),
  [LockStage.CONFIRM_MINT_FT]: t('Back'),
  [LockStage.CONFIRM_DEPOSIT]: t('Back'),
  [LockStage.CONFIRM_WITHDRAW]: t('Back'),
  [LockStage.CONFIRM_MINT_NOTE]: t('Back'),
  [LockStage.CONFIRM_SPLIT_SHARES]: t('Back'),
  [LockStage.CONFIRM_CLAIM_NOTE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_STAKE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PROTOCOL]: t('Back'),
  [LockStage.CONFIRM_PAY]: t('Back'),
  [LockStage.CONFIRM_ADMIN_WITHDRAW]: t('Back'),
  [LockStage.CONFIRM_DELETE]: t('Back'),
  [LockStage.CONFIRM_DELETE_ARP]: t('Back'),
  [LockStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

interface BuyModalProps extends InjectedModalProps {
  variant: "admin" | "user" | "delete"| "adminUser"
  location: "arps" | "arp"
  pool?: any
  sousId: number
  currency: any
}

// eslint-disable-next-line consistent-return
const getToastText = (stage: LockStage, t: ContextApi['t']) => {
  if (stage === LockStage.CONFIRM_UPDATE) {
    return t('Stale parameters successfully updated')
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
  if (stage === LockStage.CONFIRM_UPDATE_STAKE) {
    return t('Stake requirements successfully updated')
  }
  if (stage === LockStage.CONFIRM_PAY) {
    return t('Payment successfully made')
  }
  if (stage === LockStage.CONFIRM_DELETE) {
    return t('Account successfully deleted')
  }
  if (stage === LockStage.CONFIRM_DELETE_ARP) {
    return t('ARP successfully deleted')
  }
  if (stage === LockStage.UPLOAD) {
    return t('Upload successful')
  }
  if (stage === LockStage.AUTOCHARGE) {
    return t('Autocharge updated successfully')
  }
}

// NFT WBNB in testnet contract is different
const BuyModal: React.FC<any> = ({ variant="user", pool, sousId, currency, application, onDismiss }) => {
  const [stage, setStage] = useState(variant === "accept" ? LockStage.ACCEPT: LockStage.SETTINGS)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const { t } = useTranslation()
  const { theme } = useTheme()
  const router = useRouter()
  const collectionId = router.query.collectionAddress as string
  const { account } = useWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const dispatch = useAppDispatch()
  const adminPool = usePool(sousId) as any
  const { toastSuccess } = useToast()
  // const _adminARP = useGetAdminARP()
  const adminARP = pool 
  const { signer: stakeMarketContract} = useStakeMarketContract()
  const { signer: stakeMarketNoteContract} = useStakeMarketNoteContract()
  const stakingTokenContract = useERC20(pool?.tokenAddress || '')
  // const remainingDuration = Math.max(
  //   differenceInSeconds(new Date(1668860000000), new Date(), {
  //   roundingMethod: 'ceil',
  // }),0)
  // 1668816000000
  // 1668951793007
  const remainingDuration = Math.max(
    differenceInSeconds(new Date(convertTimeToSeconds(pool.waitingDuration)), new Date(), {
    roundingMethod: 'ceil',
  }),0)
  const { days, hours, minutes } = getTimePeriods(Number(remainingDuration ?? '0'))
  const [nftFilters, setNftFilters] = useState({
    country: pool?.countries,
    city: pool?.cities,
    product: pool?.products,
  })
  console.log("adminPool======================>", adminPool)
  // if (!currency) {
  //   const serializedTokens = serializeTokens()
  //   currency = Object.values(serializedTokens).find((token) => token.address === adminARP.tokenAddress)
  // }
  // const [onPresentPreviousTx] = useModal(<ActivityHistory />,)
  console.log("gauge=================>", pool, nftFilters)
  const [state, setState] = useState<any>(() => ({
    owner: pool?.owner,
    bountyId: pool?.bountyId ?? '',
    profileId: pool?.profileId ?? '',
    tokenId: pool?.tokenId ?? '',
    amountPayable: getBalanceNumber(pool.amountReceivable ?? 0, currency?.decimals) ?? '0',
    waitingPeriod: pool?.waitingPeriod,
    amountReceivable: getBalanceNumber(pool.amountPayable ?? 0, currency?.decimals) ?? '0',
    deadline: '86400',
    terms: pool?.terms,
    removePartner: 0,
    taxAddress: '',
    tag: '',
    numPeriods: '',
    paidPayable: '',
    paidReceivable: '',
    periodPayable: pool?.periodPayable,
    periodReceivable: pool?.periodReceivable,
    startPayable: '',
    startReceivable: '',
    description: '',
    name: '',
    symbol: '',
    source: '',
    startProtocolId: '',
    endProtocolId: '',
    requestAddress: '',
    requestAmount: '',
    recipient: '',
    splitShares: '',
    adminNote: false,
    period: pool?.period,
    stakeRequired: Number(pool?.stakeRequired ?? 0),
    profileRequired: Number(pool?.profileRequired ?? 0),
    gasPercent: Number(pool?.gasPercent ?? 0),
    bountyRequired: Number(pool?.bountyRequired ?? 0),
    agreement: pool?.ownerAgreement === 3 ? 1 : 0,
    cosignEnabled: pool?.cosignEnabled,
    minCosigners: pool?.minCosigners || '',
    requests: adminARP.userData?.requests?.length || [],
    amounts: adminARP.userData?.amounts?.length || [],
    closeStake: false,
    stakeId: pool?.sousId ?? '',
    waitingDuration: pool.waitingDuration,
    defenderStakeId: '',
  }))
  console.log("ppool==============>", stage, LockStage.WITHDRAW, stage === LockStage.CONFIRM_WITHDRAW, pool)
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
      case LockStage.APPLY:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_APPLY:
        setStage(LockStage.APPLY)
        break
      case LockStage.UPDATE_TAX_CONTRACT:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_TAX_CONTRACT:
        setStage(LockStage.UPDATE_TAX_CONTRACT)
        break
      case LockStage.UPDATE_BEFORE_LITIGATIONS:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_BEFORE_LITIGATIONS:
        setStage(LockStage.UPDATE_BEFORE_LITIGATIONS)
        break
      case LockStage.START_WAITING_PERIOD:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_START_WAITING_PERIOD:
        setStage(LockStage.START_WAITING_PERIOD)
        break
      case LockStage.ACCEPT:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_ACCEPT:
        setStage(LockStage.ACCEPT)
        break
      case LockStage.START_LITIGATIONS:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_START_LITIGATIONS:
        setStage(LockStage.START_LITIGATIONS)
        break
      case LockStage.CONFIRM_ADD_PAID_DAYS:
        setStage(LockStage.ADD_PAID_DAYS)
        break
      case LockStage.CONFIRM_MINT_FT:
          setStage(LockStage.ADMIN_SETTINGS)
          break
      case LockStage.UPDATE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.UPDATE_STAKE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_STAKE:
        setStage(LockStage.UPDATE_STAKE)
        break
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_OWNER:
        setStage(LockStage.UPDATE_OWNER)
        break
      case LockStage.CANCEL_STAKE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_CANCEL_STAKE:
        setStage(LockStage.CANCEL_STAKE)
        break
      case LockStage.SWITCH_STAKE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_SWITCH_STAKE:
        setStage(LockStage.SWITCH_STAKE)
        break
      case LockStage.MINT_IOU:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_MINT_IOU:
        setStage(LockStage.MINT_IOU)
        break
      case LockStage.DEPOSIT:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.COSIGNS:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.WITHDRAW:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.MINT_NOTE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.SPLIT_SHARES:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_CLAIM_NOTE:
        setStage(LockStage.CLAIM_NOTE)
        break
      case LockStage.CLAIM_NOTE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.UPLOAD:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE:
        setStage(LockStage.UPDATE)
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
      case LockStage.DELETE_ARP:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_DEPOSIT:
        setStage(LockStage.DEPOSIT)
        break
      case LockStage.CONFIRM_COSIGNS:
        setStage(LockStage.COSIGNS)
        break
      case LockStage.CONFIRM_DELETE:
        setStage(LockStage.DELETE)
        break
      case LockStage.CONFIRM_DELETE_ARP:
        setStage(LockStage.DELETE_ARP)
        break
      case LockStage.CONFIRM_WITHDRAW:
        setStage(LockStage.WITHDRAW)
        break
      case LockStage.CONFIRM_MINT_NOTE:
        setStage(LockStage.MINT_NOTE)
        break
      case LockStage.CONFIRM_SPLIT_SHARES:
        setStage(LockStage.SPLIT_SHARES)
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
      case LockStage.UPDATE_BEFORE_LITIGATIONS:
        setStage(LockStage.CONFIRM_UPDATE_BEFORE_LITIGATIONS)
        break
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.CONFIRM_UPDATE_OWNER)
        break
      case LockStage.UPDATE_TAX_CONTRACT:
        setStage(LockStage.CONFIRM_UPDATE_TAX_CONTRACT)
        break
      case LockStage.APPLY:
        setStage(LockStage.CONFIRM_APPLY)
        break 
      case LockStage.START_WAITING_PERIOD:
        setStage(LockStage.CONFIRM_START_WAITING_PERIOD)
        break 
      case LockStage.ACCEPT:
        setStage(LockStage.CONFIRM_ACCEPT)
        break
      case LockStage.START_LITIGATIONS:
        setStage(LockStage.CONFIRM_START_LITIGATIONS)
        break
      case LockStage.UPDATE_PROTOCOL:
        setStage(LockStage.CONFIRM_UPDATE_PROTOCOL)
        break
      case LockStage.DEPOSIT:
        setStage(LockStage.CONFIRM_DEPOSIT)
        break
      case LockStage.CANCEL_STAKE:
        setStage(LockStage.CONFIRM_CANCEL_STAKE)
        break
      case LockStage.SWITCH_STAKE:
        setStage(LockStage.CONFIRM_SWITCH_STAKE)
        break
      case LockStage.MINT_IOU:
        setStage(LockStage.CONFIRM_MINT_IOU)
        break
      case LockStage.COSIGNS:
          setStage(LockStage.CONFIRM_COSIGNS)
        break
      case LockStage.CLAIM_NOTE:
        setStage(LockStage.CONFIRM_CLAIM_NOTE)
        break
      case LockStage.WITHDRAW:
        setStage(LockStage.CONFIRM_WITHDRAW)
        break
      case LockStage.MINT_NOTE:
        setStage(LockStage.CONFIRM_MINT_NOTE)
        break
      case LockStage.SPLIT_SHARES:
        setStage(LockStage.CONFIRM_SPLIT_SHARES)
        break
      case LockStage.UPDATE_STAKE:
        setStage(LockStage.CONFIRM_UPDATE_STAKE)
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
      case LockStage.DELETE_ARP:
        setStage(LockStage.CONFIRM_DELETE_ARP)
        break
      default:
        break
    }
  }
  
  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        return requiresApproval(stakingTokenContract, account, stakeMarketContract.address)
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      return callWithGasPrice(stakingTokenContract, 'approve', [stakeMarketContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now transfer tokens into this Stake!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    // eslint-disable-next-line consistent-return
    onConfirm: () => {
      if (stage === LockStage.CONFIRM_APPLY) {
        const amountPayable = getDecimalAmount(new BigNumber(state.amountPayable), currency.decimals)
        const amountReceivable = getDecimalAmount(new BigNumber(state.amountReceivable), currency.decimals)
        const startPayable = Math.max(differenceInSeconds(new Date(state.startPayable || 0), new Date(), {
          roundingMethod: 'ceil',
        }),0)
        const startReceivable = Math.max(differenceInSeconds(new Date(state.startReceivable || 0), new Date(), {
          roundingMethod: 'ceil',
        }),0)
        const args = [
          account,
          [
            amountPayable.toString(),
            amountReceivable.toString(), 
            state.periodPayable, 
            state.periodReceivable, 
            state.waitingPeriod, 
            startPayable, 
            startReceivable
          ],
          state.deadline,
          state.identityTokenId,
          pool?.sousId.toString(),
          collectionId ?? 0
        ]
        console.log("CONFIRM_APPLY===============>",args)
        return callWithGasPrice(stakeMarketContract, 'createAndApply', args)
        .catch((err) => console.log("CONFIRM_APPLY===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_STAKE) {
        const args = [
          pool?.sousId.toString(),
          Number(state.agreement) === 0 ? 2 : 3
        ]
        console.log("CONFIRM_UPDATE_STAKE==========================>", args)
        return callWithGasPrice(stakeMarketContract, 'updateStake', args)
        .catch((err) => console.log("CONFIRM_UPDATE_STAKE===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_TAX_CONTRACT) {
        const args = [pool?.sousId.toString(), state.taxAddress]
        console.log("CONFIRM_UPDATE_TAX_CONTRACT==========================>", args)
        return callWithGasPrice(stakeMarketContract, 'updateTaxContract', args)
        .catch((err) => console.log("CONFIRM_UPDATE_TAX_CONTRACT===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_OWNER) {
        const args = [pool?.sousId.toString(), state.owner]
        console.log("CONFIRM_UPDATE_OWNER==========================>", args)
        return callWithGasPrice(stakeMarketContract, 'updateOwner', args)
        .catch((err) => console.log("CONFIRM_UPDATE_OWNER===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_BEFORE_LITIGATIONS) {
        const amountPayable = getDecimalAmount(new BigNumber(state.amountPayable), currency.decimals)
        const amountReceivable = getDecimalAmount(new BigNumber(state.amountReceivable), currency.decimals)
        const args = [
          pool?.sousId.toString(), 
          amountPayable?.toString(),
          amountReceivable?.toString(),
          state.source
        ]
        console.log("CONFIRM_UPDATE_BEFORE_LITIGATIONS==========================>", args)
        return callWithGasPrice(stakeMarketContract, 'updateStaked', args)
        .catch((err) => console.log("CONFIRM_UPDATE_BEFORE_LITIGATIONS===============>", err))
      }
      if (stage === LockStage.CONFIRM_SWITCH_STAKE) {
        const args = [state.stakeId]
        console.log("CONFIRM_SWITCH_STAKE===============>",args)
        return callWithGasPrice(stakeMarketContract, 'switchStake', args)
        .catch((err) => console.log("CONFIRM_SWITCH_STAKE===============>", err))
      }
      if (stage === LockStage.CONFIRM_MINT_IOU) {
        const args = [state.stakeId, state.defenderStakeId, state.tag]
        console.log("CONFIRM_MINT_IOU===============>",args)
        return callWithGasPrice(stakeMarketNoteContract, 'createIOU', args)
        .catch((err) => console.log("CONFIRM_MINT_IOU===============>", err))
      }
      if (stage === LockStage.CONFIRM_MINT_NOTE) {
        const args = [1,0]
        console.log("CONFIRM_MINT_NOTE===============>",args)
        return callWithGasPrice(stakeMarketNoteContract, 'transferDueToNote', args)
        .catch((err) => console.log("CONFIRM_MINT_NOTE===============>", err))
      }
      if (stage === LockStage.CONFIRM_CLAIM_NOTE) {
        const args = [state.tokenId]
        console.log("CONFIRM_CLAIM_NOTE===============>",args)
        return callWithGasPrice(stakeMarketNoteContract, 'claimRevenueFromNote', args)
        .catch((err) => console.log("CONFIRM_CLAIM_NOTE===============>", err))
      }
      if (stage === LockStage.CONFIRM_CANCEL_STAKE) {
        const args = [state.stakeId]
        console.log("CONFIRM_CANCEL_STAKE===============>",args)
        return callWithGasPrice(stakeMarketContract, 'cancelStake', args)
        .catch((err) => console.log("CONFIRM_CANCEL_STAKE===============>", err))
      }
      if (stage === LockStage.CONFIRM_DEPOSIT) {
        const amount = getDecimalAmount(state.amountReceivable, currency?.decimals)
        const args = [pool.sousId, amount.toString()]
        console.log("CONFIRM_DEPOSIT===============>",stakingTokenContract, stakeMarketContract, args)
        return callWithGasPrice(stakeMarketContract, 'addToStake', args)
        .catch((err) => console.log("CONFIRM_DEPOSIT===============>", err))
      }
      if (stage === LockStage.CONFIRM_WITHDRAW) {
        const amount = getDecimalAmount(state.amountPayable, currency?.decimals)
        const args = [
          pool.sousId, 
          state.removePartner ? 0 : amount.toString(),
          !!state.removePartner
        ]
        console.log("CONFIRM_WITHDRAW===============>", args)
        return callWithGasPrice(stakeMarketContract, 'unlockStake', args)
        .catch((err) => console.log("CONFIRM_WITHDRAW===============>", err))
      }
      if (stage === LockStage.CONFIRM_START_WAITING_PERIOD) {
        const args = [state.stakeId, state.defenderStakeId, "", ""]
        console.log("CONFIRM_START_WAITING_PERIOD=============>", args)
        return callWithGasPrice(stakeMarketContract, 'createGauge', args)
        .catch((err) => console.log("CONFIRM_START_WAITING_PERIOD===============>", err))
      }
      if (stage === LockStage.CONFIRM_ACCEPT) {
        console.log("CONFIRM_ACCEPT1===============>", application)
        const startPayable = Math.max(differenceInSeconds(new Date(state.startPayable || 0), new Date(), {
          roundingMethod: 'ceil',
        }),0)
        const args = [
          application.sousId.toString(),
          pool.sousId.toString(),
          startPayable,
          !!state.closeStake,
        ]
        console.log("CONFIRM_ACCEPT===============>",args)
        return callWithGasPrice(stakeMarketContract, 'lockStake', args)
        .catch((err) => console.log("CONFIRM_ACCEPT===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE) {
        const stakeRequired = getDecimalAmount(state.stakeRequired, currency?.decimals)
        const args = [
          pool.sousId.toString(),
          state.profileId,
          state.bountyId,
          !!state.profileRequired,
          !!state.bountyRequired,
          stakeRequired.toString(),
          Number(state.gasPercent)*100,
          state.terms,
          nftFilters?.country?.reduce((accum, attr) => ([...accum, attr]),[],),
          nftFilters?.city?.reduce((accum, attr) => ([...accum, attr]),[],),
          nftFilters?.product?.reduce((accum, attr) => ([...accum, attr]),[],),
        ]
        console.log("CONFIRM_UPDATE===============>", args)
        return callWithGasPrice(stakeMarketContract, 'updateRequirements', args)
        .catch((err) => console.log("CONFIRM_UPDATE===============>", err))
      }
      return null
    },
    onSuccess: async ({ receipt }) => {
      toastSuccess(getToastText(stage, t), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      dispatch(fetchStakesAsync(collectionId))
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
          {!parseInt(pool?.partnerStakeId) ?
          <Button variant="success" mb="8px" onClick={()=> setStage(LockStage.APPLY) }>
            {t('APPLY')}
          </Button>:null}
          <Button mb="8px" variant="success" onClick={()=> setStage(LockStage.DEPOSIT) }>
            {t('DEPOSIT')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={()=> setStage(LockStage.UPDATE) }>
            {t('UPDATE REQUIREMENTS')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={()=> setStage(LockStage.UPDATE_STAKE) }>
            {t('UPDATE AGREEMENT')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={()=> setStage(LockStage.UPDATE_OWNER) }>
            {t('UPDATE OWNER')}
          </Button>
          <Button mb="8px" variant="light" onClick={()=> setStage(LockStage.UPDATE_TAX_CONTRACT) }>
            {t('UPDATE TAX CONTRACT')}
          </Button>
          <Button mb="8px" variant="light" onClick={()=> setStage(LockStage.UPDATE_BEFORE_LITIGATIONS) }>
            {t('UPDATE BEFORE LITIGATIONS')}
          </Button>
          <Button variant="light" mb="8px" onClick={()=> setStage(LockStage.WITHDRAW)}>
            {t('WITHDRAW FROM STAKE')}
          </Button>
          <Button mb="8px" variant="danger" onClick={()=> setStage(LockStage.SWITCH_STAKE) }>
            {t('SWITCH STAKE')}
          </Button>
          <Button mb="8px" variant="danger" onClick={()=> setStage(LockStage.CANCEL_STAKE) }>
            {t('CANCEL STAKE')}
          </Button>
          <Button variant="subtle" mb="8px" onClick={()=> setStage(LockStage.MINT_NOTE)}>
            {t('TRANSFER NOTE')}
          </Button>
          <Button variant="subtle" mb="8px" onClick={()=> setStage(LockStage.MINT_IOU)}>
            {t('TRANSFER IOU')}
          </Button>
          <Button variant="secondary" mb="8px" onClick={()=> setStage(LockStage.CLAIM_NOTE)}>
            {t('CLAIM TRANSFER NOTE')}
          </Button>
          <Flex mb="8px" justifyContent='center' alignItems='center'>
            {Number(adminPool.waitingDuration) === 0 ?
            <Button variant="danger" mb="8px" width='100%' onClick={()=> setStage(LockStage.START_WAITING_PERIOD)}>
              {t('START WAITING PERIOD')}
            </Button>:
            remainingDuration > 0 ?
            <Text color="failure" bold as="span">
              {t('Waiting period ongoing, ends in %days% days, %hours% hours, %minutes% minutes',{ days, hours, minutes })}
            </Text>:
            <LinkExternal color='failure' href='/stakemarket/voting/create' bold>
              {t('START LITIGATIONS')}
            </LinkExternal>}
          </Flex>
          <Flex mb="8px" justifyContent='center' alignItems='center'>
            <LinkExternal href='/stakemarket/voting/updateOrAppeal' bold>
                {t('UPDATE STATUS OR APPEAL')}
            </LinkExternal>
          </Flex>
        </Flex>
      }
      {stage === LockStage.UPDATE && 
      <UpdateParametersStage 
        state={state} 
        nftFilters={nftFilters} 
        setNftFilters={setNftFilters}
        handleChange={handleChange}
        handleRawValueChange={handleRawValueChange}
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.UPDATE_STAKE && 
      <UpdateStakeStage
        state={state} 
        handleRawValueChange={handleRawValueChange}
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.DEPOSIT && 
      <DepositStage 
        state={state}
        currency={currency} 
        handleRawValueChange={handleRawValueChange}
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.WITHDRAW && 
      <WithdrawStage 
        state={state} 
        currency={currency} 
        totalLiquidity={adminPool?.totalLiquidity}
        handleRawValueChange={handleRawValueChange}
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.MINT_NOTE && 
        <MintNoteStage
          state={state}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage} 
          handleRawValueChange={handleRawValueChange}
        />}
      {stage === LockStage.MINT_IOU && 
        <MintIOUStage
          state={state}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage} 
        />}
      {stage === LockStage.ACCEPT && 
      <AcceptStage
        state={state} 
        handleChange={handleChange} 
        continueToNextStage={continueToNextStage} 
        handleRawValueChange={handleRawValueChange}
      />}
      {stage === LockStage.APPLY && 
      <ApplyStage 
        state={state} 
        handleChange={handleChange} 
        handleRawValueChange={handleRawValueChange} 
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.CLAIM_NOTE && 
      <ClaimNoteStage 
        state={state}
        handleChange={handleChange} 
        continueToNextStage={continueToNextStage} 
        handleRawValueChange={handleRawValueChange}
        />}
      {stage === LockStage.START_LITIGATIONS && 
      <LitigationStage 
        state={state}
        handleChange={handleChange} 
        continueToNextStage={continueToNextStage} 
        />}
      {stage === LockStage.START_WAITING_PERIOD && 
      <WaitingPeriodStage
        state={state}
        handleChange={handleChange} 
        continueToNextStage={continueToNextStage} 
        />}
      {stage === LockStage.UPDATE_OWNER && 
      <UpdateOwnerStage
        state={state}
        handleChange={handleChange} 
        continueToNextStage={continueToNextStage} 
        />}
      {stage === LockStage.UPDATE_TAX_CONTRACT && 
      <UpdateTaxContractStage
        state={state}
        handleChange={handleChange} 
        continueToNextStage={continueToNextStage} 
        />}
        {stage === LockStage.UPDATE_BEFORE_LITIGATIONS && 
        <UpdateBeforeLitigationStage
          state={state}
          handleChange={handleChange} 
          continueToNextStage={continueToNextStage} 
          />}
          {stage === LockStage.SWITCH_STAKE && 
        <SwitchStakeStage
          state={state}
          handleChange={handleChange} 
          continueToNextStage={continueToNextStage} 
          />}
        {stage === LockStage.CANCEL_STAKE && 
        <CancelStakeStage
          state={state}
          handleChange={handleChange} 
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
