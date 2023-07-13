import axios from 'axios'
import { useRouter } from 'next/router'
import { firestore } from 'utils/firebase'
import { useState, useEffect, useMemo, ChangeEvent } from 'react'
// import tokens, { serializeTokens } from 'config/constants/tokens'
import { InjectedModalProps, Button, Flex, useModal, NotificationDot, useToast } from '@pancakeswap/uikit'
import { Currency, ChainId } from '@pancakeswap/sdk'
import { MaxUint256 } from '@ethersproject/constants'

import useTheme from 'hooks/useTheme'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
// import { useGetAdminARP } from 'state/arp/hooks'
import { useERC20, useRampContract, useRampHelper } from 'hooks/useContract'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useTranslation, TranslateFunction, ContextApi } from '@pancakeswap/localization'
import ConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ConfirmStage'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import { useCurrencyBalance } from 'state/wallet/hooks'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { fetchSessionInfo } from 'state/ramps/fetchPools'
// import AddAmountModal from './LockedPool/Modals/AddAmountModal'
// // import RemoveAmountModal from './LockedPool/Modals/RemoveAmountModal'
// import PresentBribeModal from './LockedPool/Modals/PresentBribeModal'
import UpdateParametersStage from './UpdateParametersStage'
import ClaimRevenueStage from './ClaimRevenueStage'
import CreateClaimStage from './CreateClaimStage'
import UpdateBountyStage from './UpdateBountyStage'
import UnlockBountyStage from './UnlockBountyStage'
import UpdateTokenStage from './UpdateTokenStage'
import UpdateProfileStage from './UpdateProfileStage'
import UpdateBadgeStage from './UpdateBadgeStage'
import UpdateProtocolStage from './UpdateProtocolStage'
import CreateProtocolStage from './CreateProtocolStage'
import CosignStage from './CosignStage'
import BuyAccountStage from './BuyAccountStage'
import BuyRampStage from './BuyRampStage'
import UpdateOwnerStage from './UpdateOwnerStage'
import AdminWithdrawStage from './AdminWithdrawStage'
import DeleteStage from './DeleteStage'
import DeleteRampStage from './DeleteRampStage'
import MintStage from './MintStage'
import BurnStage from './BurnStage'
import PartnerStage from './PartnerStage'
import UpdateCosignStage from './UpdateCosignStage'
// import ActivityHistory from './ActivityHistory/ActivityHistory'
import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { LockStage,  ARPState } from './types'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.UPDATE_COSIGN]: t('Update Cosign'),
  [LockStage.UPDATE_PROTOCOL]: t('Update Account'),
  [LockStage.ADMIN_WITHDRAW]: t('Withdraw'),
  [LockStage.PRE_MINT]: t('tFIAT Mint'),
  [LockStage.UPDATE_PARAMETERS]: t('Update Parameters'),
  [LockStage.CLAIM]: t('Create Claim'),
  [LockStage.CLAIM_REVENUE]: t('Claim Revenue'),
  [LockStage.UPDATE_OWNER]: t('Update Owner'),
  [LockStage.UPDATE_BOUNTY]: t('Update Attached Bounty'),
  [LockStage.UNLOCK_BOUNTY]: t('Unlock Attached Bounty'),
  [LockStage.UPDATE_TOKEN_ID]: t('Update Attached veNFT Token'),
  [LockStage.UPDATE_BADGE_ID]: t('Update Attached Badge'),
  [LockStage.UPDATE_PROFILE_ID]: t('Update Attached Profile'),
  [LockStage.COSIGNS]: t('COSIGNS'),
  [LockStage.BUY_RAMP]: t('Buy Ramp'),
  [LockStage.BUY_ACCOUNT]: t('Buy Account'),
  [LockStage.PARTNER]: t('Partner'),
  [LockStage.BURN]: t('Burn'),
  [LockStage.MINT]: t('Mint'),
  [LockStage.DELETE]: t('Delete'),
  [LockStage.DELETE_RAMP]: t('Delete Ramp'),
  [LockStage.ADMIN_WITHDRAW]: t('Withdraw'),
  [LockStage.CREATE_PROTOCOL]: t('Create Account'),
  [LockStage.CONFIRM_UPDATE_PROTOCOL]: t('Back'),
  [LockStage.CONFIRM_ADMIN_WITHDRAW]: t('Back'),
  [LockStage.CONFIRM_COSIGNS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_COSIGN]: t('Back'),
  [LockStage.CONFIRM_CREATE_PROTOCOL]: t('Back'),
  [LockStage.CONFIRM_DELETE]: t('Back'),
  [LockStage.CONFIRM_DELETE_RAMP]: t('Back'),
  [LockStage.CONFIRM_UPDATE_BOUNTY]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PROFILE_ID]: t('Back'),
  [LockStage.CONFIRM_UPDATE_BADGE_ID]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TOKEN_ID]: t('Back'),
  [LockStage.CONFIRM_UNLOCK_BOUNTY]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TRUST]: t('Back'),
  [LockStage.CONFIRM_BUY_RAMP]: t('Back'),
  [LockStage.CONFIRM_BUY_ACCOUNT]: t('Back'),
  [LockStage.CONFIRM_PARTNER]: t('Back'),
  [LockStage.CONFIRM_UPDATE_OWNER]: t('Back'),
  [LockStage.CONFIRM_CLAIM]: t('Back'),
  [LockStage.CONFIRM_CLAIM_REVENUE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PARAMETERS]: t('Back'),
  [LockStage.CONFIRM_BURN]: t('Back'),
  [LockStage.CONFIRM_ADMIN_WITHDRAW]: t('Back'),
  [LockStage.CONFIRM_MINT]: t('Back'),
  [LockStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

interface BuyModalProps extends InjectedModalProps {
  variant: "admin" | "user" | "delete" | "buy"
  location: "arps" | "arp"  | "header"
  pool?: any
  sessionId: string
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

const BuyModal: React.FC<any> = ({ variant="user", sessionId, location="arp", pool, currency, onDismiss }) => {
  const [stage, setStage] = useState(
      sessionId 
    ? LockStage.PRE_MINT
    : variant === "user"
    ? LockStage.SETTINGS 
    : variant === "buy"
    ? LockStage.BUY_RAMP
    : variant === "delete"
    ? LockStage.DELETE_RAMP
    : LockStage.ADMIN_SETTINGS
  )
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const [checked, setChecked] = useState<boolean>()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const adminARP = pool
  const router = useRouter()
  const stakingTokenContract = useERC20(currency?.address || router.query?.userCurrency || '')
  const rampContract = useRampContract(pool?.rampAddress || router.query.ramp || '')
  const rampHelperContract = useRampHelper()
  // if (!currency) {
  //   const serializedTokens = serializeTokens()
  //   currency = Object.values(serializedTokens).find((token) => token.address === adminARP.tokenAddress)
  // }
  console.log("mcurrencyy===============>", currency, pool, rampContract)
  // const [onPresentPreviousTx] = useModal(<ActivityHistory />,)
  const [activeButtonIndex, setActiveButtonIndex] = useState<any>(0)

  // useEffect(() => {
  //     fetchSessionInfo(sessionId)
  //     .then((data) => {
  //       if (data) {
  //         if (data.account !== account || data.state === 'complete') {
  //           onDismiss()
  //           router.push(`/ramps/${router.query?.arp}`)
  //         } else {
  //           state.amountReceivable = data.amount
  //           state.token = data.currency
  //           setChecked(true)
  //         }
  //       }
  //     })
  // }, [sessionId])

  // console.log("router===================>", router)
  // const { state: status, userAccount, session_id, userCurrency, amount } = router.query
  const [state, setState] = useState<any>(() => ({
    owner: pool?.owner,
    bountyId: pool?.bountyId,
    profileId: pool?.profileId,
    tokenId: pool?.tokenId,
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
    requests: adminARP?.userData?.requests?.length || [],
    amounts: adminARP?.userData?.amounts?.length || [],
    token: currency?.address,
    close: false,
    salePrice: '',
    maxPartners: 0,
    partnerBountyId: 0,
    bountyIds: [],
    badgeId: 0,
    _ve: '',
    mintFee: 0,
    burnFee: 0,
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
      case LockStage.UPDATE_COSIGN:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_COSIGN:
        setStage(LockStage.UPDATE_COSIGN)
        break
      case LockStage.CONFIRM_UPDATE_PARAMETERS:
        setStage(LockStage.UPDATE_PARAMETERS)
        break
      case LockStage.UPDATE_PARAMETERS:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.UPDATE_PROTOCOL:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PROTOCOL:
        setStage(LockStage.UPDATE_PROTOCOL)
        break
      case LockStage.CONFIRM_CLAIM:
        setStage(LockStage.CLAIM)
        break
      case LockStage.CLAIM:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_CLAIM_REVENUE:
        setStage(LockStage.CLAIM_REVENUE)
        break
      case LockStage.CLAIM_REVENUE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_BADGE_ID:
        setStage(LockStage.UPDATE_BADGE_ID)
        break
      case LockStage.UPDATE_BADGE_ID:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_TOKEN_ID:
        setStage(LockStage.UPDATE_TOKEN_ID)
        break
      case LockStage.UPDATE_TOKEN_ID:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_ADMIN_WITHDRAW:
        setStage(LockStage.ADMIN_WITHDRAW)
        break
      case LockStage.CONFIRM_UPDATE_PROFILE_ID:
        setStage(LockStage.UPDATE_PROFILE_ID)
        break
      case LockStage.UPDATE_PROFILE_ID:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UNLOCK_BOUNTY:
        setStage(LockStage.UNLOCK_BOUNTY)
        break
      case LockStage.UNLOCK_BOUNTY:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.ADMIN_WITHDRAW:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.DELETE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_DELETE_RAMP:
        setStage(LockStage.DELETE_RAMP)
        break
      case LockStage.CONFIRM_BUY_ACCOUNT:
        setStage(LockStage.BUY_ACCOUNT)
        break
      case LockStage.BUY_ACCOUNT:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_PARTNER:
        setStage(LockStage.PARTNER)
        break
      case LockStage.PARTNER:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_COSIGNS:
        setStage(LockStage.COSIGNS)
        break
      case LockStage.COSIGNS:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_DELETE:
        setStage(LockStage.DELETE)
        break
      case LockStage.CONFIRM_BURN:
        setStage(LockStage.BURN)
        break
      case LockStage.BURN:
        setStage(variant === 'user' 
        ? LockStage.SETTINGS
        : LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_MINT:
        if(!sessionId) setStage(LockStage.MINT)
        break
      case LockStage.MINT:
        setStage(variant === 'user' 
        ? LockStage.SETTINGS
        : LockStage.ADMIN_SETTINGS)
        break
      case LockStage.BUY_RAMP:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_BUY_RAMP:
        setStage(LockStage.BUY_RAMP)
        break
      case LockStage.CONFIRM_CREATE_PROTOCOL:
        setStage(LockStage.CREATE_PROTOCOL)
        break
      case LockStage.CONFIRM_UPDATE_BOUNTY:
        setStage(LockStage.UPDATE_BOUNTY)
        break
      case LockStage.UPDATE_BOUNTY:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_OWNER:
        setStage(LockStage.UPDATE_OWNER)
        break
      case LockStage.CREATE_PROTOCOL:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      default:
        break
    }
  }

  const continueToNextStage = () => {
    switch (stage) {
      case LockStage.CREATE_PROTOCOL:
        setStage(LockStage.CONFIRM_CREATE_PROTOCOL)
        break
      case LockStage.MINT:
        setStage(LockStage.CONFIRM_MINT)
        break 
      case LockStage.BURN:
        setStage(LockStage.CONFIRM_BURN)
        break
      case LockStage.PARTNER:
        setStage(LockStage.CONFIRM_PARTNER)
        break
      case LockStage.BUY_ACCOUNT:
        setStage(LockStage.CONFIRM_BUY_ACCOUNT)
        break
      case LockStage.BUY_RAMP:
        setStage(LockStage.CONFIRM_BUY_RAMP)
        break
      case LockStage.COSIGNS:
          setStage(LockStage.CONFIRM_COSIGNS)
        break
      case LockStage.UPDATE_COSIGN:
        setStage(LockStage.CONFIRM_UPDATE_COSIGN)
        break
      case LockStage.UPDATE_BADGE_ID:
        setStage(LockStage.CONFIRM_UPDATE_BADGE_ID)
        break
      case LockStage.UPDATE_PROFILE_ID:
        setStage(LockStage.CONFIRM_UPDATE_PROFILE_ID)
        break
      case LockStage.UPDATE_TOKEN_ID:
        setStage(LockStage.CONFIRM_UPDATE_TOKEN_ID)
        break
      case LockStage.UNLOCK_BOUNTY:
        setStage(LockStage.CONFIRM_UNLOCK_BOUNTY)
        break
      case LockStage.UPDATE_BOUNTY:
        setStage(LockStage.CONFIRM_UPDATE_BOUNTY)
        break
      case LockStage.UPDATE_PROTOCOL:
        setStage(LockStage.CONFIRM_UPDATE_PROTOCOL)
        break
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.CONFIRM_UPDATE_OWNER)
        break
      case LockStage.CLAIM:
        setStage(LockStage.CONFIRM_CLAIM)
        break
      case LockStage.CLAIM_REVENUE:
        setStage(LockStage.CONFIRM_CLAIM_REVENUE)
        break
      case LockStage.ADMIN_WITHDRAW:
        setStage(LockStage.CONFIRM_ADMIN_WITHDRAW)
        break
      case LockStage.DELETE:
        setStage(LockStage.CONFIRM_DELETE)
        break
      case LockStage.DELETE_RAMP:
        setStage(LockStage.CONFIRM_DELETE_RAMP)
        break
      case LockStage.UPDATE_PARAMETERS:
        setStage(LockStage.CONFIRM_UPDATE_PARAMETERS)
        break
      default:
        break
    }
  }
  
 
  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        return !parseFloat(pool ? pool.userData?.allowance : adminARP?.allowance) 
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      return callWithGasPrice(stakingTokenContract, 'approve', [rampContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now transfer tokens into this contract!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    // eslint-disable-next-line consistent-return
    onConfirm: () => {
      if (stage === LockStage.CONFIRM_CREATE_PROTOCOL) {
        return callWithGasPrice(rampContract, 'createProtocol', [state.token, state.tokenId || 0])
        .catch((err) => console.log("CONFIRM_CREATE_PROTOCOL===============>", err))
      }
      if (stage === LockStage.CONFIRM_MINT) {
        const amount = getDecimalAmount(state.amountReceivable, 18)
        return callWithGasPrice(rampContract, 'mint', [state.token, account, amount.toString()])
        .catch((err) => console.log("CONFIRM_MINT===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_PROTOCOL) {
        const amount = getDecimalAmount(state.salePrice, 18)
        return callWithGasPrice(rampContract, 'updateProtocol', [state.token, state.close, amount.toString(), state.maxPartners])
          .catch((err) => console.log("CONFIRM_UPDATE_PROTOCOL===============>", err))
      }
      if (stage === LockStage.CONFIRM_BURN) {
        const amount = getDecimalAmount(state.amountReceivable, 18)
        return callWithGasPrice(rampContract, 'burn', [state.token, amount.toString()])
        .catch((err) => console.log("CONFIRM_BURN===============>", err))
      }
      if (stage === LockStage.CONFIRM_BUY_ACCOUNT) {
        return callWithGasPrice(rampContract, 'buyAccount', [state.token, state.tokenId, state.bountyId])
        .catch((err) => console.log("CONFIRM_BUY_ACCOUNT===============>", err))
      }
      if (stage === LockStage.CONFIRM_ADMIN_WITHDRAW) {
        const amount = getDecimalAmount(state.amountReceivable, 18)
        return callWithGasPrice(rampContract, 'withdraw', [state.token, amount.toString()])
        .catch((err) => console.log("CONFIRM_ADMIN_WITHDRAW===============>", err))
      }
      if (stage === LockStage.CONFIRM_BUY_RAMP) {
        return callWithGasPrice(rampContract, 'buyRamp', [state.token, state.bountyIds])
        .catch((err) => console.log("CONFIRM_BUY_RAMP===============>", err))
      }
      if (stage === LockStage.CONFIRM_CLAIM_REVENUE) {
        return callWithGasPrice(rampContract, 'claimPendingRevenue', [
          state.token,
          state.partnerBountyId,
        ]).catch((err) => console.log("CONFIRM_CLAIM_REVENUE===============>", err))
      }
      if (stage === LockStage.CONFIRM_PARTNER) {
        return callWithGasPrice(rampContract, 'addPartner', [
          state.token,
          state.bountyId,
        ]).catch((err) => console.log("CONFIRM_PARTNER===============>", err))
      }
      if (stage === LockStage.CONFIRM_COSIGNS) {
        return callWithGasPrice(rampContract, 'claimPendingRevenueFromNote', [
          adminARP.arpAddress,
          !!state.adminNote,
          state.tokenId,
        ]).catch((err) => console.log("CONFIRM_CLAIM_NOTE===============>", err))
      }
      if (stage === LockStage.CONFIRM_DELETE) {
        return callWithGasPrice(rampContract, 'deleteProtocol', [state.token])
        .catch((err) => console.log("CONFIRM_DELETE===============>", err))
      }
      if (stage === LockStage.CONFIRM_DELETE_RAMP) {
        return callWithGasPrice(rampHelperContract, 'deleteARP', [router.query.ramp])
        .catch((err) => console.log("CONFIRM_DELETE_RAMP===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_BOUNTY) {
        return callWithGasPrice(rampContract, 'updateBounty', [
          state.token,
          state.bountyId,
        ]).catch((err) => console.log("CONFIRM_UPDATE_BOUNTY===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_COSIGN) {
        if (!activeButtonIndex) {
          return callWithGasPrice(rampContract, 'cosign', [state.requestAddress])
          .catch((err) => console.log("CONFIRM_COSIGNS===============>", err))
        }
          return callWithGasPrice(rampContract, 'requestCosign', [state.requestAmount])
          .catch((err) => console.log("CONFIRM_COSIGNS===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_OWNER) {
        return callWithGasPrice(rampContract, 'updateOwner', [state.tokenId])
        .catch((err) => console.log("CONFIRM_UPDATE_ARP===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_PARAMETERS) {
        const amount = getDecimalAmount(state.amountReceivable, 18)
        return callWithGasPrice(rampContract, 'updateParameters', [
          state._ve,
          state.mintFee,
          state.burnFee,
          state.badgeId,
          amount.toString(),
        ]).catch((err) => console.log("CONFIRM_UPDATE_PARAMETERS===============>", err))
      }
      if (stage === LockStage.CONFIRM_CLAIM) {
        const amount = getDecimalAmount(state.amountReceivable, 18)
        return callWithGasPrice(rampContract, 'createClaim', [
          state.bountyId,
          amount.toString(),
        ]).catch((err) => console.log("CONFIRM_CLAIM===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_TOKEN_ID) {
        return callWithGasPrice(rampContract, 'updateTokenId', [
          state.token,
          state.tokenId
        ]).catch((err) => console.log("CONFIRM_UPDATE_TOKEN_ID===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_BADGE_ID) {
        return callWithGasPrice(rampContract, 'updateBadgeId', [
          state.token,
          state.badgeId
        ]).catch((err) => console.log("CONFIRM_UPDATE_BADGE_ID===============>", err))
      }
      if (stage === LockStage.CONFIRM_UNLOCK_BOUNTY) {
        return callWithGasPrice(rampContract, 'unlockBounty', [
          state.token,
          state.bountyId
        ]).catch((err) => console.log("CONFIRM_UNLOCK_BOUNTY===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_PROFILE_ID) {
        return callWithGasPrice(rampContract, 'updateProfile', [
          state.token,
          state.profileId
        ]).catch((err) => console.log("CONFIRM_UPDATE_PROFILE===============>", err))
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
      {stage === LockStage.PRE_MINT && 
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          {!account ? <ConnectWalletButton />
          : checked ?
          <Button mb="8px" variant='success' onClick={()=> setStage(LockStage.CONFIRM_MINT)}>
            {t('CONFIRM MINT')}
          </Button>: null}
        </Flex>
      }
      {stage === LockStage.SETTINGS && 
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          <Button mb="8px" variant='success' onClick={()=> {
            if(pool?.redirect) {
              router.push(pool.redirect)
            } else {
              setStage(LockStage.MINT) 
            }}}>
            {t('MINT')}
          </Button>
          <Button mb="8px" variant='danger' onClick={()=> {
            if(pool?.redirect) {
              router.push(pool.redirect)
            } else {
              setStage(LockStage.BURN) 
            }}}>
            {t('BURN')}
          </Button>
          <Button mb="8px" onClick={()=> setStage(LockStage.PARTNER) }>
            {t('PARTNER')}
          </Button>
          <Button mb="8px" onClick={()=> setStage(LockStage.BUY_ACCOUNT) }>
            {t('BUY ACCOUNT')}
          </Button>
          <Button mb="8px" variant='light' onClick={()=> setStage(LockStage.CLAIM) }>
            {t('CLAIM')}
          </Button>
          <Button mb="8px" variant='light' onClick={()=> setStage(LockStage.CLAIM_REVENUE) }>
            {t('CLAIM REVENUE')}
          </Button>
          {!pool.cosignEnabled ? 
            <Button variant="light" mb="8px" onClick={()=> setStage(LockStage.COSIGNS)}>
              {t('COSIGNS')}
              {/* <Flex mb="40px" position="relative" left="100px"><NotificationDot show={state?.requests?.length} /></Flex> */}
            </Button>:null}
        </Flex>
      }
      {stage === LockStage.ADMIN_SETTINGS && 
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          <Button variant="success" mb="8px" onClick={()=> setStage(LockStage.CREATE_PROTOCOL) }>
            {t('CREATE ACCOUNT')}
          </Button>
          <Button mb="8px" variant='success' onClick={()=> {
            if(pool?.redirect) {
              router.push(pool.redirect)
            } else {
              setStage(LockStage.MINT) 
            }}}>
            {t('MINT')}
          </Button>
          <Button mb="8px" variant='danger' onClick={()=> {
            if(pool?.redirect) {
              router.push(pool.redirect)
            } else {
              setStage(LockStage.BURN) 
            }}}>
            {t('BURN')}
          </Button>
          <Button mb="8px" onClick={()=> setStage(LockStage.UPDATE_PARAMETERS) }>
            {t('UPDATE PARAMETERS')}
          </Button>
          {location !== "header" ?
          <Button mb="8px" onClick={()=> setStage(LockStage.UPDATE_PROTOCOL) }>
            {t('UPDATE ACCOUNT')}
          </Button>:null}
          <Button mb="8px" variant='secondary' onClick={()=> setStage(LockStage.UNLOCK_BOUNTY) }>
            {t('UNLOCK BOUNTY')}
          </Button>
          <Button mb="8px" variant='secondary' onClick={()=> setStage(LockStage.UPDATE_TOKEN_ID) }>
            {t('UPDATE veNFT ID')}
          </Button>
          <Button mb="8px" variant='secondary' onClick={()=> setStage(LockStage.UPDATE_BADGE_ID) }>
            {t('UPDATE BADGE ID')}
          </Button>
          <Button mb="8px" variant='secondary' onClick={()=> setStage(LockStage.UPDATE_PROFILE_ID) }>
            {t('UPDATE PROFILE ID')}
          </Button>
          <Button mb="8px" variant='secondary' onClick={()=> setStage(LockStage.UPDATE_OWNER) }>
            {t('UPDATE OWNER')}
          </Button>
          <Button mb="8px" variant='secondary' onClick={()=> setStage(LockStage.UPDATE_BOUNTY) }>
            {t('UPDATE BOUNTY')}
          </Button>
          <Button variant="danger" mb="8px" onClick={()=> setStage(LockStage.DELETE) }>
            {t('DELETE PROTOCOL')}
          </Button>
          <Button variant="tertiary" mb="8px" onClick={()=> setStage(LockStage.ADMIN_WITHDRAW) }>
            {t('WITHDRAW')}
          </Button>
          <Button variant="tertiary" mb="8px" onClick={()=> setStage(LockStage.UPDATE_COSIGN) }>
            {t('UPDATE COSIGN')}
          </Button>
        </Flex>
      }
      {stage === LockStage.UPDATE_PARAMETERS && 
      <UpdateParametersStage 
        state={state} 
        setState={setState} 
        currency={currency} 
        handleChange={handleChange}
        handleRawValueChange={handleRawValueChange}
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.CLAIM && 
      <CreateClaimStage
        state={state} 
        handleChange={handleChange}
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.CLAIM_REVENUE && 
      <ClaimRevenueStage
        state={state} 
        handleChange={handleChange}
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.MINT && 
        <MintStage
          state={state}
          pool={pool}
          currency={currency}
          handleChange={handleChange}
          rampAddress={pool?.rampAddress}
          continueToNextStage={continueToNextStage} 
        />}
      {stage === LockStage.BURN && 
      <BurnStage
        state={state}
        handleChange={handleChange}
        rampAddress={pool?.rampAddress}
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.PARTNER && 
      <PartnerStage 
        state={state}
        handleChange={handleChange}
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.CREATE_PROTOCOL && 
      <CreateProtocolStage
        state={state} 
        handleChange={handleChange}
        continueToNextStage={continueToNextStage} 
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
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.UPDATE_PROTOCOL && 
      <UpdateProtocolStage 
        state={state} 
        handleChange={handleChange} 
        handleRawValueChange={handleRawValueChange} 
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.BUY_ACCOUNT && 
      <BuyAccountStage
        state={state}
        handleChange={handleChange} 
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.BUY_RAMP && 
      <BuyRampStage
        state={state}
        handleChange={handleChange} 
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.ADMIN_WITHDRAW && 
      <AdminWithdrawStage 
        currency={currency} 
        pendingRevenue={adminARP?.pendingRevenue}
        continueToNextStage={continueToNextStage} 
        handleRawValueChange={handleRawValueChange}
        />}
      {stage === LockStage.UPDATE_BADGE_ID && 
      <UpdateBadgeStage
        state={state}
        handleChange={handleChange} 
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.UPDATE_TOKEN_ID && 
      <UpdateTokenStage
        state={state}
        handleChange={handleChange} 
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.UPDATE_PROFILE_ID && 
      <UpdateProfileStage
        state={state}
        handleChange={handleChange} 
        continueToNextStage={continueToNextStage} 
      />}
        {stage === LockStage.UPDATE_BOUNTY && 
        <UpdateBountyStage 
          state={state}
          handleChange={handleChange} 
          continueToNextStage={continueToNextStage} 
        />}
        {stage === LockStage.UNLOCK_BOUNTY && 
        <UnlockBountyStage 
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
        {stage === LockStage.UPDATE_COSIGN && 
        <UpdateCosignStage
          state={state}
          handleChange={handleChange} 
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.DELETE && <DeleteStage continueToNextStage={continueToNextStage} />}
      {stage === LockStage.DELETE_RAMP && <DeleteRampStage continueToNextStage={continueToNextStage} />}
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
