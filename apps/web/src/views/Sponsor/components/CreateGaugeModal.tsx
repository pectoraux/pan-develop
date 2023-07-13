import axios from 'axios'
import { useRouter } from 'next/router'
import { firestore } from 'utils/firebase'
import { useState, ChangeEvent } from 'react'
import { differenceInSeconds } from 'date-fns'
import { convertTimeToSeconds } from 'utils/timeHelper'
import { InjectedModalProps, Button, Flex, useToast, LinkExternal } from '@pancakeswap/uikit'
import { Currency } from '@pancakeswap/sdk'
import { MaxUint256 } from '@ethersproject/constants'

import BigNumber from 'bignumber.js'
import useTheme from 'hooks/useTheme'
import { requiresApproval } from 'utils/requiresApproval'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { useERC20, useSponsorContract, useSponsorHelper } from 'hooks/useContract'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useTranslation, TranslateFunction, ContextApi } from '@pancakeswap/localization'
import ConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ConfirmStage'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import UpdateParametersStage from './UpdateParametersStage'
import UpdateAutoChargeStage from './UpdateAutoChargeStage'
import UpdateBountyStage from './UpdateBountyStage'
import UpdateDescriptionStage from './UpdateDescriptionStage'
import UpdateTokenStage from './UpdateTokenStage'
import VoteStage from './VoteStage'
import AutoChargeStage from './AutoChargeStage'
import UpdateProtocolStage from './UpdateProtocolStage'
import CosignStage from './CosignStage'
import UpdateOwnerStage from './UpdateOwnerStage'
import AdminWithdrawStage from './AdminWithdrawStage'
import DeleteStage from './DeleteStage'
import DeleteRampStage from './DeleteRampStage'
import UpdateCosignStage from './UpdateCosignStage'
// import ActivityHistory from './ActivityHistory/ActivityHistory'
import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { LockStage,  ARPState } from './types'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.UPDATE_COSIGN]: t('Update Cosign'),
  [LockStage.UPDATE_PROTOCOL]: t('Create/Update Account'),
  [LockStage.WITHDRAW]: t('Withdraw'),
  [LockStage.UPDATE_PARAMETERS]: t('Update Parameters'),
  [LockStage.UPDATE_OWNER]: t('Update Owner'),
  [LockStage.UPDATE_TOKEN_ID]: t('Update Attached veNFT Token'),
  [LockStage.UPDATE_BOUNTY_ID]: t('Update Attached Bounty'),
  [LockStage.COSIGNS]: t('COSIGNS'),
  [LockStage.VOTE]: t('Vote'),
  [LockStage.UPDATE_AUTOCHARGE]: t('Update Autocharge'),
  [LockStage.ADMIN_AUTOCHARGE]: t('Pay'),
  [LockStage.UPDATE_DESCRIPTION]: t('Update Description'),
  [LockStage.COSIGNS]: t('Cosigns'),
  [LockStage.DELETE]: t('Delete'),
  [LockStage.DELETE_PROTOCOL]: t('Delete Protocol'),
  [LockStage.CONFIRM_UPDATE_PROTOCOL]: t('Back'),
  [LockStage.CONFIRM_WITHDRAW]: t('Back'),
  [LockStage.CONFIRM_COSIGNS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_COSIGN]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PARAMETERS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_DESCRIPTION]: t('Back'),
  [LockStage.CONFIRM_UPDATE_AUTOCHARGE]: t('Back'),
  [LockStage.CONFIRM_ADMIN_AUTOCHARGE]: t('Back'),
  [LockStage.CONFIRM_DELETE]: t('Back'),
  [LockStage.CONFIRM_DELETE_PROTOCOL]: t('Back'),
  [LockStage.CONFIRM_UPDATE_BOUNTY_ID]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TOKEN_ID]: t('Back'),
  [LockStage.CONFIRM_VOTE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_OWNER]: t('Back'),
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

const BuyModal: React.FC<any> = ({ variant="user", pool, currAccount, currency, onDismiss }) => {
  const [stage, setStage] = useState(variant === "user" ? LockStage.SETTINGS : LockStage.ADMIN_SETTINGS)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const adminARP = pool
  const router = useRouter()
  const stakingTokenContract = useERC20(currency?.address || router.query?.userCurrency || '')
  const sponsorContract = useSponsorContract(pool?.sponsorAddress || router.query.sponsor || '')
  const sponsorHelperContract = useSponsorHelper()
  const [nftFilters, setNewFilters] = useState({} as any)
  // const currAccount = pool.accounts?.find((acct) => acct === account)
  console.log("mcurrencyy3===============>", currency, pool, currAccount, sponsorContract)
  // const [onPresentPreviousTx] = useModal(<ActivityHistory />,)

  // console.log("router===================>", router)
  // const { state: status, userAccount, session_id, userCurrency, amount } = router.query
  const [state, setState] = useState<any>(() => ({
    owner: pool?.owner,
    avatar: pool?.sponsor?.avatar,
    bountyId: pool?.bountyId,
    profileId: pool?.profileId,
    tokenId: pool?.tokenId,
    maxNotesPerProtocol: pool?.maxNotesPerProtocol,
    amountPayable: '',
    amountReceivable: currAccount?.amountReceivable,
    periodReceivable: currAccount?.periodReceivable,
    startReceivable: currAccount?.startReceivable,
    description: currAccount?.description,
    rating: currAccount?.description,
    media: pool?.media,
    autoCharge: 0,
    like: 0,
    bountyRequired: pool?.bountyRequired,
    ve: pool?._ve,
    cosignEnabled: pool?.cosignEnabled,
    minCosigners: pool?.minCosigners || '',
    token: currency?.address,
    name: pool?.name,
    applicationLink: pool?.sponsor?.applicationLink,
    auditorDescription: pool?.sponsor?.sponsorDescription,
    contactChannels: [],
    contacts: [],
    workspaces: [],
    countries: [],
    cities: [],
    products: [],
    accounts: [],
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
      case LockStage.UPDATE_AUTOCHARGE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_AUTOCHARGE:
        setStage(LockStage.UPDATE_AUTOCHARGE)
        break
      case LockStage.ADMIN_AUTOCHARGE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_ADMIN_AUTOCHARGE:
        setStage(LockStage.ADMIN_AUTOCHARGE)
        break
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_OWNER:
        setStage(LockStage.UPDATE_OWNER)
        break
      case LockStage.UPDATE_PARAMETERS:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PARAMETERS:
        setStage(LockStage.UPDATE_PARAMETERS)
        break
      case LockStage.UPDATE_PROTOCOL:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PROTOCOL:
        setStage(LockStage.UPDATE_PROTOCOL)
        break
      case LockStage.UPDATE_TOKEN_ID:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.UPDATE_BOUNTY_ID:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_BOUNTY_ID:
        setStage(LockStage.UPDATE_BOUNTY_ID)
        break
      case LockStage.CONFIRM_UPDATE_TOKEN_ID:
        setStage(LockStage.UPDATE_TOKEN_ID)
        break
      case LockStage.CONFIRM_VOTE:
        setStage(LockStage.VOTE)
        break
      case LockStage.VOTE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_DELETE_PROTOCOL:
        setStage(LockStage.DELETE_PROTOCOL)
        break
      case LockStage.DELETE_PROTOCOL:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_DELETE:
        setStage(LockStage.DELETE)
        break
      case LockStage.DELETE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_WITHDRAW:
        setStage(LockStage.WITHDRAW)
        break
      case LockStage.CONFIRM_UPDATE_COSIGN:
        setStage(LockStage.UPDATE_COSIGN)
        break
      case LockStage.UPDATE_COSIGN:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.WITHDRAW:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_DESCRIPTION:
        setStage(LockStage.UPDATE_DESCRIPTION)
        break
      case LockStage.UPDATE_DESCRIPTION:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.COSIGNS:
        setStage(LockStage.SETTINGS)
        break
      default:
        break
    }
  }

  const continueToNextStage = () => {
    switch (stage) {
      case LockStage.UPDATE_AUTOCHARGE:
        setStage(LockStage.CONFIRM_UPDATE_AUTOCHARGE)
        break
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.CONFIRM_UPDATE_OWNER)
        break 
      case LockStage.UPDATE_TOKEN_ID:
        setStage(LockStage.CONFIRM_UPDATE_TOKEN_ID)
        break
      case LockStage.UPDATE_BOUNTY_ID:
        setStage(LockStage.CONFIRM_UPDATE_BOUNTY_ID)
        break
      case LockStage.VOTE:
        setStage(LockStage.CONFIRM_VOTE)
        break
      case LockStage.DELETE_PROTOCOL:
        setStage(LockStage.CONFIRM_DELETE_PROTOCOL)
        break
      case LockStage.COSIGNS:
          setStage(LockStage.CONFIRM_COSIGNS)
        break
      case LockStage.UPDATE_COSIGN:
        setStage(LockStage.CONFIRM_UPDATE_COSIGN)
        break
      case LockStage.DELETE:
        setStage(LockStage.CONFIRM_DELETE)
        break
      case LockStage.WITHDRAW:
        setStage(LockStage.CONFIRM_WITHDRAW)
        break
      case LockStage.UPDATE_PROTOCOL:
        setStage(LockStage.CONFIRM_UPDATE_PROTOCOL)
        break
      case LockStage.ADMIN_AUTOCHARGE:
        setStage(LockStage.CONFIRM_ADMIN_AUTOCHARGE)
        break
      case LockStage.UPDATE_PARAMETERS:
        setStage(LockStage.CONFIRM_UPDATE_PARAMETERS)
        break
      case LockStage.UPDATE_DESCRIPTION:
        setStage(LockStage.CONFIRM_UPDATE_DESCRIPTION)
        break
      default:
        break
    }
  }
  
  
  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        return requiresApproval(stakingTokenContract, account, sponsorContract.address)
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      return callWithGasPrice(stakingTokenContract, 'approve', [sponsorContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now transfer tokens into this contract!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    // eslint-disable-next-line consistent-return
    onConfirm: () => {
      if (stage === LockStage.CONFIRM_UPDATE_PROTOCOL) {
        const amountReceivable = getDecimalAmount(new BigNumber(state.amountReceivable), currency.decimals)
        const startReceivable = differenceInSeconds(new Date(state.startReceivable), new Date(), {
          roundingMethod: 'ceil',
        })
        return callWithGasPrice(sponsorContract, 'updateProtocol', [
          account,
          amountReceivable.toString(), 
          state.periodReceivable,
          startReceivable.toString(),
          state.rating.toString(),
          state.media.toString(),
          state.description,
        ])
        .catch((err) => console.log("CONFIRM_UPDATE_PROTOCOL===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_PARAMETERS) {
        return callWithGasPrice(sponsorContract, 'updateParameters', [
          state.maxNotesPerProtocol,
          !!state.bountyRequired,
          state.ve,
          state.name
        ]).catch((err) => console.log("CONFIRM_UPDATE_PARAMETERS===============>", err))
      }
      if (stage === LockStage.CONFIRM_ADMIN_AUTOCHARGE) {
        return callWithGasPrice(sponsorContract, 'autoCharge', [state.accounts, 0, 1])
        .catch((err) => console.log("CONFIRM_ADMIN_AUTOCHARGE===============>", err, sponsorContract))
      }
      if (stage === LockStage.CONFIRM_UPDATE_DESCRIPTION) {
        return callWithGasPrice(sponsorHelperContract, 'emitUpdateSponsorDescription', [
          pool.sponsorAddress, 
          state.sponsorDescription, 
          state.avatar, 
          state.applicationLink, 
          state.contactChannels?.split(','), 
          state.contacts?.split(','), 
          nftFilters?.workspace?.reduce((accum, attr) => ([...accum, attr]),[],), 
          nftFilters?.country?.reduce((accum, attr) => ([...accum, attr]),[],), 
          nftFilters?.city?.reduce((accum, attr) => ([...accum, attr]),[],), 
          nftFilters?.product?.reduce((accum, attr) => ([...accum, attr]),[],), 
        ])
        .catch((err) => console.log("CONFIRM_UPDATE_DESCRIPTION===============>", err))
      }
      if (stage === LockStage.CONFIRM_WITHDRAW) {
        const amount = getDecimalAmount(new BigNumber(state.amountPayable), currency.decimals)
        return callWithGasPrice(sponsorContract, 'withdraw', [
          currency.address, 
          amount.toString()
        ])
        .catch((err) => console.log("CONFIRM_WITHDRAW===============>", err))
      }
      if (stage === LockStage.CONFIRM_DELETE_PROTOCOL) {
        return callWithGasPrice(sponsorContract, 'deleteProtocol', [currAccount])
        .catch((err) => console.log("CONFIRM_DELETE_PROTOCOL===============>", err))
      }
      if (stage === LockStage.CONFIRM_DELETE) {
        return callWithGasPrice(sponsorHelperContract, 'deleteSponsor', [pool?.sponsorAddress])
        .catch((err) => console.log("CONFIRM_DELETE_PROTOCOL===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_BOUNTY_ID) {
        return callWithGasPrice(sponsorContract, 'updateBounty', [state.bountyId])
          .catch((err) => console.log("CONFIRM_UPDATE_BOUNTY===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_OWNER) {
        return callWithGasPrice(sponsorContract, 'updateOwner', [account, state.tokenId])
        .catch((err) => console.log("CONFIRM_UPDATE_OWNER===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_TOKEN_ID) {
        return callWithGasPrice(sponsorContract, 'updateTokenId', [state.tokenId])
        .catch((err) => console.log("CONFIRM_UPDATE_TOKEN_ID===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_AUTOCHARGE) {
        return callWithGasPrice(sponsorContract, 'updateAutoCharge', [!!state.autoCharge])
        .catch((err) => console.log("CONFIRM_UPDATE_AUTOCHARGE===============>", err))
      }
      if (stage === LockStage.CONFIRM_VOTE) {
        return callWithGasPrice(sponsorHelperContract, 'vote', [
          pool.sponsorAddress,
          state.profileId,
          !!state.like
        ])
        .catch((err) => console.log("CONFIRM_VOTE===============>", err))
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
          <Flex justifyContent='center' alignSelf='center' mb='10px'>
            <LinkExternal color='success' href={pool.sponsor?.applicationLink} bold>
              {t('APPLY FOR AN AUDIT')}
            </LinkExternal>
          </Flex>
          <Button mb="8px" variant='success' onClick={()=> setStage(LockStage.VOTE) }>
            {t('VOTE')}
          </Button>
          <Button mb="8px" variant='secondary' onClick={()=> setStage(LockStage.UPDATE_OWNER) }>
            {t('UPDATE OWNER')}
          </Button>
          <Button mb="8px" variant='secondary' onClick={()=> setStage(LockStage.UPDATE_TOKEN_ID) }>
            {t('UPDATE TOKEN ID')}
          </Button>
          <Button mb="8px" variant='secondary' onClick={()=> setStage(LockStage.UPDATE_BOUNTY_ID) }>
            {t('UPDATE BOUNTY ID')}
          </Button>
        </Flex>
      }
      {stage === LockStage.ADMIN_SETTINGS && 
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          <Button variant="success" mb="8px" onClick={()=> setStage(LockStage.UPDATE_PROTOCOL) }>
            {t('CREATE/UPDATE ACCOUNT')}
          </Button>
          <Button mb="8px" onClick={()=> setStage(LockStage.UPDATE_PARAMETERS) }>
            {t('UPDATE PARAMETERS')}
          </Button>
          <Button mb="8px" onClick={()=> setStage(LockStage.ADMIN_AUTOCHARGE) }>
            {t('PAY')}
          </Button>
          <Button mb="8px" variant='secondary' onClick={()=> setStage(LockStage.UPDATE_DESCRIPTION) }>
            {t('UPDATE DESCRIPTION')}
          </Button>
          <Button variant="secondary" mb="8px" onClick={()=> setStage(LockStage.WITHDRAW) }>
            {t('WITHDRAW')}
          </Button>
          <Button variant="tertiary" mb="8px" onClick={()=> setStage(LockStage.UPDATE_COSIGN) }>
            {t('UPDATE COSIGN')}
          </Button>
          <Button variant="danger" mb="8px" onClick={()=> setStage(LockStage.DELETE_PROTOCOL) }>
            {t('DELETE PROTOCOL')}
          </Button>
        </Flex>
      }
      {stage === LockStage.UPDATE_PARAMETERS && 
      <UpdateParametersStage 
        state={state} 
        handleChange={handleChange}
        handleRawValueChange={handleRawValueChange}
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.UPDATE_AUTOCHARGE && 
      <UpdateAutoChargeStage
        state={state} 
        handleRawValueChange={handleRawValueChange}
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.UPDATE_DESCRIPTION && 
        <UpdateDescriptionStage
          state={state}
          nftFilters={nftFilters} 
          setNewFilters={setNewFilters}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
        />}
      {stage === LockStage.VOTE && 
      <VoteStage
        state={state} 
        handleChange={handleChange}
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
      {stage === LockStage.WITHDRAW && 
      <AdminWithdrawStage 
        state={state} 
        account={pool.sponsorAddress}
        currency={currency}
        continueToNextStage={continueToNextStage} 
        handleRawValueChange={handleRawValueChange}
      />}
      {stage === LockStage.UPDATE_TOKEN_ID && 
      <UpdateTokenStage
        state={state}
        handleChange={handleChange} 
        continueToNextStage={continueToNextStage} 
      />}
        {stage === LockStage.UPDATE_BOUNTY_ID && 
        <UpdateBountyStage 
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
        {stage === LockStage.ADMIN_AUTOCHARGE && 
          <AutoChargeStage
            state={state}
            handleChange={handleChange} 
            continueToNextStage={continueToNextStage} 
        />}
      {stage === LockStage.DELETE && <DeleteStage continueToNextStage={continueToNextStage} />}
      {stage === LockStage.DELETE_PROTOCOL && <DeleteRampStage continueToNextStage={continueToNextStage} />}
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
