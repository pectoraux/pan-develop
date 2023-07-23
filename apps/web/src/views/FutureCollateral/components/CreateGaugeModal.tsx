import axios from 'axios'
import NodeRSA from 'encrypt-rsa'
import EncryptRsa from 'encrypt-rsa'
import { useRouter } from 'next/router'
import { useState, ChangeEvent } from 'react'
import { InjectedModalProps, Button, Flex, useToast, Pool, LinkExternal } from '@pancakeswap/uikit'
import { Currency } from '@pancakeswap/sdk'
import { AddressZero, MaxUint256 } from '@ethersproject/constants'
import BigNumber from 'bignumber.js'
import useTheme from 'hooks/useTheme'
import { requiresApproval } from 'utils/requiresApproval'
import { getDecimalAmount, getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useERC20, useFutureCollateralContract, useTrustBountiesContract } from 'hooks/useContract'
import { convertTimeToSeconds } from 'utils/timeHelper'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useTranslation, TranslateFunction, ContextApi } from '@pancakeswap/localization'
import ConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ConfirmStage'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import DeleteStage from './DeleteStage'
import DeleteRampStage from './DeleteRampStage'
import UpdateParametersStage from './UpdateParametersStage'
import MintStage from './MintStage'
import BurnStage from './BurnStage'
import NotifyRewardStage from './NotifyRewardStage'
import SellCollateralStage from './SellCollateralStage'
import EraseDebtStage from './EraseDebtStage'
import UpdateAdminStage from './UpdateAdminStage'
import AdminWithdrawStage from './AdminWithdrawStage'
import UpdateEstimationTableStage from './UpdateEstimationTableStage'
import AddToChannelStage from './AddToChannelStage'
import UpdateBlacklistStage from './UpdateBlacklistStage'
// import ActivityHistory from './ActivityHistory/ActivityHistory'
import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { LockStage,  ARPState } from './types'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.UPDATE_ESTIMATION_TABLE]: t('Update Estimation Table'),
  [LockStage.ADD_TO_CHANNEL]: t('Add To Channel'),
  [LockStage.UPDATE_BLACKLIST]: t('Update Blacklist'),
  [LockStage.UPDATE_PARAMETERS]: t('Update Parameters'),
  [LockStage.SELL_COLLATERAL]: t('Sell Collateral'),
  [LockStage.WITHDRAW_TREASURY]: t('Withdraw'),
  [LockStage.NOTIFY_REWARD]: t('Notify Reward'),
  [LockStage.ERASE_DEBT]: t('Erase Debt'),
  [LockStage.UPDATE_ADMIN]: t('Update Admin'),
  [LockStage.BURN]: t('Burn'),
  [LockStage.MINT]: t('Mint'),
  [LockStage.CONFIRM_MINT]: t('Mint'),
  [LockStage.CONFIRM_NOTIFY_REWARD]: t('Back'),
  [LockStage.CONFIRM_ERASE_DEBT]: t('Back'),
  [LockStage.CONFIRM_UPDATE_ADMIN]: t('Back'),
  [LockStage.CONFIRM_BURN]: t('Back'),
  [LockStage.CONFIRM_ADD_TO_CHANNEL]: t('Back'),
  [LockStage.CONFIRM_UPDATE_BLACKLIST]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PARAMETERS]: t('Back'),
  [LockStage.CONFIRM_WITHDRAW_TREASURY]: t('Back'),
  [LockStage.CONFIRM_UPDATE_ESTIMATION_TABLE]: t('Back'),
  [LockStage.CONFIRM_SELL_COLLATERAL]: t('Back'),
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

const BuyModal: React.FC<any> = ({ variant="user", location='fromStake', pool, state2, currAccount, currency, onDismiss }) => {
  const [stage, setStage] = useState(
    variant === "add" ?
    LockStage.CONFIRM_MINT
    : LockStage.SETTINGS)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const router = useRouter()
  const stakingTokenContract = useERC20(pool?.token?.address || currency?.address || '')
  const cardContract = useFutureCollateralContract()
  const { signer: trustBountiesContract } = useTrustBountiesContract()
  console.log("mcurrencyy===============>", trustBountiesContract, state2, currAccount, currency, pool, cardContract)
  // const [onPresentPreviousTx] = useModal(<ActivityHistory />,)
  const nodeRSA = new NodeRSA(
    process.env.NEXT_PUBLIC_PUBLIC_KEY,
    process.env.NEXT_PUBLIC_PRIVATE_KEY,
  )
  let password;
  if (pool?.password) {
    password = nodeRSA?.decryptStringWithRsaPrivateKey({ 
      text: pool?.password, 
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY
    });
  }
  // console.log("router===================>", router)
  // const { state: status, userAccount, session_id, userCurrency, amount } = router.query
  const [state, setState] = useState<any>(() => ({
    owner: account ?? '',
    avatar: pool?.avatar,
    bountyId: pool?.bountyId,
    profileId: pool?.profileId,
    tokenId: pool?.tokenId,
    extraMint: '',
    category: '',
    optionId: currAccount?.optionId ?? '0',
    cap: '',
    factor: '',
    period: '',
    maxNotesPerProtocol: pool?.maxNotesPerProtocol,
    amountPayable: '',
    pricePerMinute: '',
    contractAddress: '',
    card: pool?.cardAddress ?? '',
    legend: currAccount?.ratingLegend,
    amountReceivable: '',
    periodReceivable: currAccount?.periodReceivable,
    startReceivable: convertTimeToSeconds(currAccount?.startReceivable ?? 0),
    description: currAccount?.description ?? '',
    ratings: currAccount?.ratings?.toString() ?? '',
    esgRating: currAccount?.esgRating ?? '',
    media: pool?.media ?? '',
    identityTokenId: '0',
    message: '',
    tag: '',
    password: '',
    protocolId: currAccount?.protocolId ?? '0',
    toAddress: '',
    uriGenerator: '',
    autoCharge: 0,
    like: 0,
    bountyRequired: pool?.bountyRequired,
    ve: pool?._ve,
    cosignEnabled: pool?.cosignEnabled,
    minCosigners: pool?.minCosigners || '',
    token: currency?.address,
    add: 0,
    contentType: '',
    name: pool?.name,
    numPeriods: '',
    collection: '',
    referrer: '',
    productId: '',
    userTokenId: '',
    options: '',
    isPaywall: 0,
    applicationLink: pool?.applicationLink ?? '',
    cardDescription: pool?.cardDescription ?? '',
    datakeeper: 0,
    accounts: [],
    table: '',
    channel: state2?.channel ?? '',
    treasuryFee: '',
    bufferTime: '',
    minToBlacklist: '',
    minBountyPercent: '',
    updateColor: '',
    minColor: '',
    userBountyId: state2?.userBountyId ?? '',
    stakeId: state2?.stakeId ?? '',
    auditor: state2?.auditor ?? '',
    auditorBountyId: state2?.auditorBountyId ?? '',
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
      case LockStage.CONFIRM_UPDATE_ESTIMATION_TABLE:
        setStage(LockStage.UPDATE_ESTIMATION_TABLE)
        break
      case LockStage.UPDATE_ESTIMATION_TABLE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_ADD_TO_CHANNEL:
        setStage(LockStage.ADD_TO_CHANNEL)
        break
      case LockStage.ADD_TO_CHANNEL:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_BLACKLIST:
        setStage(LockStage.UPDATE_BLACKLIST)
        break
      case LockStage.UPDATE_BLACKLIST:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PARAMETERS:
        setStage(LockStage.UPDATE_PARAMETERS)
        break
      case LockStage.UPDATE_PARAMETERS:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_SELL_COLLATERAL:
        setStage(LockStage.SELL_COLLATERAL)
        break
      case LockStage.SELL_COLLATERAL:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_WITHDRAW_TREASURY:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_MINT:
        setStage(LockStage.MINT)
        break
      case LockStage.MINT:
        if (variant !== 'add') setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_NOTIFY_REWARD:
        setStage(LockStage.NOTIFY_REWARD)
        break
      case LockStage.NOTIFY_REWARD:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_ERASE_DEBT:
        setStage(LockStage.ERASE_DEBT)
        break
      case LockStage.ERASE_DEBT:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_ADMIN:
        setStage(LockStage.UPDATE_ADMIN)
        break
      case LockStage.UPDATE_ADMIN:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_BURN:
        setStage(LockStage.BURN)
        break
      case LockStage.BURN:
        setStage(LockStage.SETTINGS)
        break
      default:
        break
    }
  }

  const continueToNextStage = () => {
    switch (stage) {
      case LockStage.UPDATE_ESTIMATION_TABLE:
        setStage(LockStage.CONFIRM_UPDATE_ESTIMATION_TABLE)
        break
      case LockStage.ADD_TO_CHANNEL:
        setStage(LockStage.CONFIRM_ADD_TO_CHANNEL)
        break
      case LockStage.UPDATE_BLACKLIST:
        setStage(LockStage.CONFIRM_UPDATE_BLACKLIST)
        break
      case LockStage.UPDATE_PARAMETERS:
        setStage(LockStage.CONFIRM_UPDATE_PARAMETERS)
        break
      case LockStage.SELL_COLLATERAL:
        setStage(LockStage.CONFIRM_SELL_COLLATERAL)
        break
      case LockStage.WITHDRAW_TREASURY:
        setStage(LockStage.CONFIRM_WITHDRAW_TREASURY)
        break
      case LockStage.MINT:
        setStage(LockStage.CONFIRM_MINT)
        break
      case LockStage.NOTIFY_REWARD:
        setStage(LockStage.CONFIRM_NOTIFY_REWARD)
        break
      case LockStage.ERASE_DEBT:
        setStage(LockStage.CONFIRM_ERASE_DEBT)
        break
      case LockStage.UPDATE_ADMIN:
        setStage(LockStage.CONFIRM_UPDATE_ADMIN)
        break
      case LockStage.BURN:
        setStage(LockStage.CONFIRM_BURN)
        break
      default:
        break
    }
  }

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        return requiresApproval(stakingTokenContract, account, cardContract.address) && 
        requiresApproval(stakingTokenContract, account, trustBountiesContract.address)
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      return callWithGasPrice(stakingTokenContract, 'approve', [cardContract.address, MaxUint256])
      .then(() => callWithGasPrice(stakingTokenContract, 'approve', [trustBountiesContract.address, MaxUint256]))
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now start receiving payments for audits!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    // eslint-disable-next-line consistent-return
    onConfirm: () => {
      if (stage === LockStage.CONFIRM_UPDATE_ESTIMATION_TABLE) {
        const args = [state.channel, state.table?.split(',')]
        console.log("CONFIRM_UPDATE_ESTIMATION_TABLE===============>", args)
        return callWithGasPrice(cardContract, 'updateEstimationTable', args)
        .catch((err) => console.log("CONFIRM_UPDATE_ESTIMATION_TABLE===============>", err))
      }
      if (stage === LockStage.CONFIRM_ADD_TO_CHANNEL) {
        const args = [state.profileId,state.channel]
        console.log("CONFIRM_ADD_TO_CHANNEL===============>", args)
        return callWithGasPrice(cardContract, 'addToChannel', args)
        .catch((err) => console.log("CONFIRM_ADD_TO_CHANNEL===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_BLACKLIST) {
        const args = [state.profileId, !!state.add]
        console.log("CONFIRM_UPDATE_BLACKLIST===============>", args)
        return callWithGasPrice(cardContract, 'updateBlacklist', args)
        .catch((err) => console.log("CONFIRM_UPDATE_BLACKLIST===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_ADMIN) {
        const args = [state.owner, !!state.add]
        console.log("CONFIRM_UPDATE_ADMIN===============>", args)
        return callWithGasPrice(cardContract, 'updateDev', args)
        .catch((err) => console.log("CONFIRM_UPDATE_ADMIN===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_PARAMETERS) {
        const args = [state.treasuryFee,state.bufferTime,state.minToBlacklist,state.minBountyPercent,state.updateColor,state.minColor]
        console.log("CONFIRM_UPDATE_PARAMETERS===============>", args)
        return callWithGasPrice(cardContract, 'updateParams', args)
        .catch((err) => console.log("CONFIRM_UPDATE_PARAMETERS===============>", err))
      }
      if (stage === LockStage.CONFIRM_SELL_COLLATERAL) {
        const args = [state.owner]
        console.log("CONFIRM_SELL_COLLATERAL===============>", args)
        return callWithGasPrice(cardContract, 'sellCollateral', args)
        .catch((err) => console.log("CONFIRM_SELL_COLLATERAL===============>", err))
      }
      if (stage === LockStage.CONFIRM_WITHDRAW_TREASURY) {
        console.log("CONFIRM_WITHDRAW_TREASURY===============>")
        return callWithGasPrice(cardContract, 'withdrawTreasury', [])
        .catch((err) => console.log("CONFIRM_WITHDRAW_TREASURY===============>", err))
      }
      if (stage === LockStage.CONFIRM_MINT) {
        const args = [state.auditor, state.owner, state.stakeId, state.userBountyId, state.auditorBountyId, state.channel]
        console.log("CONFIRM_MINT===============>", args)
        return callWithGasPrice(cardContract, 'mint', args)
        .catch((err) => console.log("CONFIRM_MINT===============>", err))
      }
      if (stage === LockStage.CONFIRM_NOTIFY_REWARD) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [state.channel, amountReceivable?.toString()]
        console.log("CONFIRM_NOTIFY_REWARD===============>", args)
        return callWithGasPrice(cardContract, 'notifyReward', args)
        .catch((err) => console.log("CONFIRM_NOTIFY_REWARD===============>", err))
      }
      if (stage === LockStage.CONFIRM_ERASE_DEBT) {
        const args = [state.owner]
        console.log("CONFIRM_ERASE_DEBT===============>", args)
        return callWithGasPrice(cardContract, 'eraseDebt', args)
        .catch((err) => console.log("CONFIRM_ERASE_DEBT===============>", err))
      }
      if (stage === LockStage.CONFIRM_BURN) {
        const args = [state.owner]
        console.log("CONFIRM_BURN===============>", args)
        return callWithGasPrice(cardContract, 'burn', args)
        .catch((err) => console.log("CONFIRM_BURN===============>", err))
      }
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
          <Button mb="8px" variant='success' onClick={()=> setStage(LockStage.UPDATE_ESTIMATION_TABLE) }>
            {t('UPDATE ESTIMATION TABLE')}
          </Button>
          <Button mb="8px" variant='success' onClick={()=> setStage(LockStage.ADD_TO_CHANNEL) }>
            {t('ADD TO CHANNEL')}
          </Button>
          <Button mb="8px" onClick={()=> setStage(LockStage.UPDATE_BLACKLIST) }>
            {t('UPDATE BLACKLIST')}
          </Button>
          <Button mb="8px" onClick={()=> setStage(LockStage.UPDATE_PARAMETERS) }>
            {t('UPDATE PARAMETERS')}
          </Button>
          <Button mb="8px" onClick={()=> setStage(LockStage.SELL_COLLATERAL) }>
            {t('SELL COLLATERAL')}
          </Button>
          <Button mb="8px" variant='secondary' onClick={()=> setStage(LockStage.CONFIRM_WITHDRAW_TREASURY) }>
            {t('WITHDRAW TREASURY')}
          </Button>
          <Button mb="8px" variant='secondary' onClick={()=> setStage(LockStage.MINT) }>
            {t('MINT')}
          </Button>
          <Button mb="8px" variant='secondary' onClick={()=> setStage(LockStage.UPDATE_ADMIN) }>
            {t('UPDATE ADMIN')}
          </Button>
          <Button mb="8px" variant='danger' onClick={()=> setStage(LockStage.NOTIFY_REWARD) }>
            {t('NOTIFY REWARD')}
          </Button>
          <Button mb="8px" variant='danger' onClick={()=> setStage(LockStage.BURN) }>
            {t('BURN')}
          </Button>
          <Button mb="8px" variant='danger' onClick={()=> setStage(LockStage.ERASE_DEBT) }>
            {t('ERASE DEBT')}
          </Button>
        </Flex>
      }
        {stage === LockStage.UPDATE_ESTIMATION_TABLE && 
          <UpdateEstimationTableStage
            state={state}
            handleChange={handleChange}
            handleRawValueChange={handleRawValueChange}
            continueToNextStage={continueToNextStage} 
        />}
        {stage === LockStage.ADD_TO_CHANNEL && 
          <AddToChannelStage
            state={state}
            handleChange={handleChange}
            handleRawValueChange={handleRawValueChange}
            continueToNextStage={continueToNextStage} 
        />}
        {stage === LockStage.UPDATE_BLACKLIST && 
          <UpdateBlacklistStage
            state={state}
            handleChange={handleChange}
            handleRawValueChange={handleRawValueChange}
            continueToNextStage={continueToNextStage} 
        />}
        {stage === LockStage.UPDATE_PARAMETERS && 
          <UpdateParametersStage
            state={state}
            handleChange={handleChange}
            handleRawValueChange={handleRawValueChange}
            continueToNextStage={continueToNextStage} 
        />}
        {stage === LockStage.SELL_COLLATERAL && 
          <SellCollateralStage
            state={state}
            handleChange={handleChange}
            continueToNextStage={continueToNextStage} 
        />}
        {stage === LockStage.WITHDRAW_TREASURY && 
          <AdminWithdrawStage
            state={state}
            handleChange={handleChange}
            handleRawValueChange={handleRawValueChange}
            continueToNextStage={continueToNextStage} 
        />}
      {stage === LockStage.MINT && 
        <MintStage 
          state={state} 
          handleChange={handleChange} 
          continueToNextStage={continueToNextStage} 
        />}
        {stage === LockStage.NOTIFY_REWARD && 
        <NotifyRewardStage 
          state={state} 
          account={account}
          currency={currency}
          handleChange={handleChange} 
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage} 
        />}
        {stage === LockStage.BURN && 
        <BurnStage 
          state={state} 
          handleChange={handleChange} 
          continueToNextStage={continueToNextStage} 
        />}
        {stage === LockStage.ERASE_DEBT && 
        <EraseDebtStage 
          state={state} 
          handleChange={handleChange} 
          continueToNextStage={continueToNextStage} 
        />}
        {stage === LockStage.UPDATE_ADMIN && 
        <UpdateAdminStage 
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
