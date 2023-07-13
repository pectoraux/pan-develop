import { useRouter } from 'next/router'
import { useState, ChangeEvent } from 'react'
import { differenceInSeconds } from 'date-fns'
import { InjectedModalProps, Button, Flex, useToast, Pool, LinkExternal } from '@pancakeswap/uikit'
import { Currency } from '@pancakeswap/sdk'
import { AddressZero, MaxUint256 } from '@ethersproject/constants'
import BigNumber from 'bignumber.js'
import useTheme from 'hooks/useTheme'
import { requiresApproval } from 'utils/requiresApproval'
import { getBalanceNumber, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { useERC20, useSponsorContract, useSponsorHelper } from 'hooks/useContract'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useTranslation, TranslateFunction, ContextApi } from '@pancakeswap/localization'
import ConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ConfirmStage'
import { convertTimeToSeconds } from 'utils/timeHelper'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import { combineDateAndTime } from 'views/Voting/CreateProposal/helpers'
import UpdateParametersStage from './UpdateParametersStage'
import ClaimNoteStage from './ClaimNoteStage'
import UpdateContentStage from './UpdateContentStage'
import UpdateBountyStage from './UpdateBountyStage'
import UpdateDescriptionStage from './UpdateDescriptionStage'
import UpdateTokenStage from './UpdateTokenStage'
import VoteStage from './VoteStage'
import PayStage from './PayStage'
import UpdateTransferToNoteReceivableStage from './UpdateTransferToNoteReceivableStage'
import UpdateProtocolStage from './UpdateProtocolStage'
import UpdateOwnerStage from './UpdateOwnerStage'
import DepositDueStage from './DepositDueStage'
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
  [LockStage.UPDATE_PROTOCOL]: t('Create Account'),
  [LockStage.WITHDRAW]: t('Withdraw'),
  [LockStage.UPDATE_PARAMETERS]: t('Update Parameters'),
  [LockStage.UPDATE_CONTENT]: t('Update Content'),
  [LockStage.UPDATE_OWNER]: t('Update Owner'),
  [LockStage.DEPOSIT_DUE]: t('Deposit Due'),
  [LockStage.UPDATE_TOKEN_ID]: t('Update Attached veNFT Token'),
  [LockStage.UPDATE_BOUNTY_ID]: t('Update Attached Bounty'),
  [LockStage.COSIGNS]: t('COSIGNS'),
  [LockStage.VOTE]: t('Vote'),
  [LockStage.PAY]: t('Pay'),
  [LockStage.UPDATE_DESCRIPTION]: t('Update Description'),
  [LockStage.COSIGNS]: t('Cosigns'),
  [LockStage.DELETE]: t('Delete'),
  [LockStage.CLAIM_NOTE]: t('Claim Note'),
  [LockStage.TRANSFER_TO_NOTE_RECEIVABLE]: t('Transfer Note Receivable'),
  [LockStage.DELETE_PROTOCOL]: t('Delete Protocol'),
  [LockStage.CONFIRM_UPDATE_PROTOCOL]: t('Back'),
  [LockStage.CONFIRM_CLAIM_NOTE]: t('Back'),
  [LockStage.CONFIRM_WITHDRAW]: t('Back'),
  [LockStage.CONFIRM_COSIGNS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PARAMETERS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_CONTENT]: t('Back'),
  [LockStage.CONFIRM_UPDATE_DESCRIPTION]: t('Back'),
  [LockStage.CONFIRM_PAY]: t('Back'),
  [LockStage.CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE]: t('Back'),
  [LockStage.CONFIRM_DELETE]: t('Back'),
  [LockStage.CONFIRM_DELETE_PROTOCOL]: t('Back'),
  [LockStage.CONFIRM_UPDATE_BOUNTY_ID]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TOKEN_ID]: t('Back'),
  [LockStage.CONFIRM_VOTE]: t('Back'),
  [LockStage.CONFIRM_DEPOSIT_DUE]: t('Back'),
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

const BuyModal: React.FC<any> = ({ variant="user", location='fromStake', pool, currency, currAccount, onDismiss }) => {
  const [stage, setStage] = useState(variant === "user" ? LockStage.SETTINGS : LockStage.ADMIN_SETTINGS)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const router = useRouter()
  const stakingTokenContract = useERC20(currency?.address || currAccount?.token?.address || '')
  const sponsorContract = useSponsorContract(pool?.sponsorAddress || router.query.sponsor || '')
  const sponsorHelperContract = useSponsorHelper()
  // const currAccount = pool.accounts?.find((acct) => acct === account)
  console.log("mcurrencyy2===============>", currency, stakingTokenContract, pool, currAccount)
  // const [onPresentPreviousTx] = useModal(<ActivityHistory />,)

  // console.log("router===================>", router)
  // const { state: status, userAccount, session_id, userCurrency, amount } = router.query
  const [state, setState] = useState<any>(() => ({
    avatar: pool?.avatar,
    bountyId: pool?.bountyId,
    profileId: pool?.profileId,
    tokenId: pool?.tokenId,
    maxNotesPerProtocol: pool?.maxNotesPerProtocol,
    amountPayable: getBalanceNumber(currAccount?.amountPayable ?? '0', currency?.decimals),
    periodPayable: currAccount?.periodPayable,
    startPayable: convertTimeToSeconds(currAccount?.startPayable ?? '0'),
    startTime: '',
    description: currAccount?.description ?? '',
    rating: currAccount?.rating ?? '0',
    protocolId: currAccount?.protocolId ?? '0',
    identityTokenId: '0',
    media: pool?.media ?? '',
    autoCharge: 0,
    like: 0,
    contentType: '',
    add: 0,
    bountyRequired: pool?.bountyRequired,
    ve: pool?._ve,
    cosignEnabled: pool?.cosignEnabled,
    minCosigners: pool?.minCosigners || '',
    token: currency?.address,
    name: pool?.name,
    toAddress: '',
    protocol: currAccount?.owner ?? '',
    applicationLink: pool?.applicationLink || '',
    sponsorDescription: pool?.sponsorDescription ?? '',
    contactChannels: pool?.contactChannels?.toString() || [],
    contacts: pool?.contacts?.toString() || [],
    workspaces: pool?.workspaces?.toString() || [],
    countries: pool?.countries?.toString() || [],
    cities: pool?.cities?.toString() || [],
    products: pool?.products?.toString() || [],
    account: currAccount?.owner || account,
    owner: currAccount?.owner || account,
    content: pool?.content
  }))
  const [nftFilters, setNewFilters] = useState({
    workspace: pool?.workspaces,
    country: pool.countries,
    city: pool.cities,
    product: pool.products,
  })

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
      case LockStage.CLAIM_NOTE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_CLAIM_NOTE:
        setStage(LockStage.CLAIM_NOTE)
        break
      case LockStage.TRANSFER_TO_NOTE_RECEIVABLE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE:
        setStage(LockStage.TRANSFER_TO_NOTE_RECEIVABLE)
        break
      case LockStage.PAY:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_PAY:
        setStage(LockStage.PAY)
        break
      case LockStage.UPDATE_OWNER:
        setStage(variant === "admin" ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_OWNER:
        setStage(LockStage.UPDATE_OWNER)
        break
      case LockStage.DEPOSIT_DUE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_DEPOSIT_DUE:
        setStage(LockStage.DEPOSIT_DUE)
        break
      case LockStage.UPDATE_PARAMETERS:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PARAMETERS:
        setStage(LockStage.UPDATE_PARAMETERS)
        break
      case LockStage.UPDATE_CONTENT:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_CONTENT:
        setStage(LockStage.UPDATE_CONTENT)
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
        setStage(variant === "admin" ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
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
      case LockStage.WITHDRAW:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_DESCRIPTION:
        setStage(LockStage.UPDATE_DESCRIPTION)
        break
      case LockStage.UPDATE_DESCRIPTION:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      default:
        break
    }
  }

  const continueToNextStage = () => {
    switch (stage) {
      case LockStage.CLAIM_NOTE:
        setStage(LockStage.CONFIRM_CLAIM_NOTE)
        break
      case LockStage.TRANSFER_TO_NOTE_RECEIVABLE:
        setStage(LockStage.CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE)
        break
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.CONFIRM_UPDATE_OWNER)
        break 
      case LockStage.DEPOSIT_DUE:
        setStage(LockStage.CONFIRM_DEPOSIT_DUE)
        break 
      case LockStage.PAY:
        setStage(LockStage.CONFIRM_PAY)
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
      case LockStage.DELETE:
        setStage(LockStage.CONFIRM_DELETE)
        break
      case LockStage.WITHDRAW:
        setStage(LockStage.CONFIRM_WITHDRAW)
        break
      case LockStage.UPDATE_PROTOCOL:
        setStage(LockStage.CONFIRM_UPDATE_PROTOCOL)
        break
      case LockStage.UPDATE_CONTENT:
        setStage(LockStage.CONFIRM_UPDATE_CONTENT)
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
        t('Contract approved - you can now start sponsoring accounts!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    // eslint-disable-next-line consistent-return
    onConfirm: () => {
      if (stage === LockStage.CONFIRM_CLAIM_NOTE) {
        const args = [pool?.id, state.tokenId]
        console.log("CONFIRM_CLAIM_NOTE===============>",args)
        return callWithGasPrice(sponsorHelperContract, 'claimRevenueFromNote', args)
        .catch((err) => console.log("CONFIRM_CLAIM_NOTE===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_PROTOCOL) {
        const amountPayable = getDecimalAmount(state.amountPayable ?? '0', currency?.decimals)
        const startPayable = combineDateAndTime(state.startDate, state.startTime)?.toString()
        const startDate = Math.max(differenceInSeconds(new Date(startPayable ?? 0), new Date(), {
          roundingMethod: 'ceil',
        }),0)
        const args = [
          state.owner,
          currency?.address,
          amountPayable.toString(), 
          state.periodPayable,
          startDate.toString(),
          state.identityTokenId,
          state.protocolId,
          state.media,
          state.description
        ]
        console.log("CONFIRM_UPDATE_PROTOCOL===============>", args)
        return callWithGasPrice(sponsorContract, 'updateProtocol', args)
        .catch((err) => console.log("CONFIRM_UPDATE_PROTOCOL===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_PARAMETERS) {
        const args = [
          !!state.bountyRequired,
          state.ve,
          state.maxNotesPerProtocol
        ]
        console.log("CONFIRM_UPDATE_PARAMETERS===============>", args)
        return callWithGasPrice(sponsorContract, 'updateParameters', args)
        .catch((err) => console.log("CONFIRM_UPDATE_PARAMETERS===============>", err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_CONTENT) {
        const args = [state.contentType, !!state.add]
        console.log("CONFIRM_UPDATE_CONTENT===============>", args)
        return callWithGasPrice(sponsorContract, 'updateContents', args)
        .catch((err) => console.log("CONFIRM_UPDATE_CONTENT===============>", err))
      }
      if (stage === LockStage.CONFIRM_PAY) {
        const method = 'payInvoicePayable'
        console.log("CONFIRM_PAY===============>", [currAccount?.owner])
        return callWithGasPrice(sponsorContract, 'payInvoicePayable', [currAccount?.owner])
        .catch((err) => console.log("CONFIRM_PAY===============>", err, sponsorContract))
      }
      if (stage === LockStage.CONFIRM_UPDATE_DESCRIPTION) {
        console.log("CONFIRM_UPDATE_DESCRIPTION===============>",[
          pool.id, 
          state.sponsorDescription, 
          state.avatar, 
          state.applicationLink, 
          state.contactChannels?.split(','), 
          state.contacts?.split(','), 
          nftFilters?.workspace?.reduce((accum, attr) => ([...accum, attr]),[],) || [], 
          nftFilters?.country?.reduce((accum, attr) => ([...accum, attr]),[],) || [], 
          nftFilters?.city?.reduce((accum, attr) => ([...accum, attr]),[],) || [], 
          nftFilters?.product?.reduce((accum, attr) => ([...accum, attr]),[],) || [],
        ])
        return callWithGasPrice(sponsorHelperContract, 'emitUpdateSponsorDescription', [
          pool.id, 
          state.sponsorDescription, 
          state.avatar, 
          state.applicationLink, 
          state.contactChannels?.split(','), 
          state.contacts?.split(','), 
          nftFilters?.workspace?.reduce((accum, attr) => ([...accum, attr]),[],) || [], 
          nftFilters?.country?.reduce((accum, attr) => ([...accum, attr]),[],) || [], 
          nftFilters?.city?.reduce((accum, attr) => ([...accum, attr]),[],) || [], 
          nftFilters?.product?.reduce((accum, attr) => ([...accum, attr]),[],) || [], 
        ])
        .catch((err) => console.log("CONFIRM_UPDATE_DESCRIPTION===============>", err))
      }
      if (stage === LockStage.CONFIRM_WITHDRAW) {
        const amount = getDecimalAmount(state.amountPayable ?? '0', currency?.decimals)
        console.log("CONFIRM_WITHDRAW===============>", [
          currency?.address, 
          amount.toString()
        ])
        return callWithGasPrice(sponsorContract, 'withdraw', [
          currency?.address, 
          amount.toString()
        ])
        .catch((err) => console.log("CONFIRM_WITHDRAW===============>", err))
      }
      if (stage === LockStage.CONFIRM_DELETE_PROTOCOL) {
        console.log("CONFIRM_DELETE_PROTOCOL===============>", [currAccount?.owner])
        return callWithGasPrice(sponsorContract, 'deleteProtocol', [currAccount?.owner])
        .catch((err) => console.log("CONFIRM_DELETE_PROTOCOL===============>", err, [currAccount?.owner]))
      }
      if (stage === LockStage.CONFIRM_DELETE) {
        console.log("CONFIRM_DELETE_PROTOCOL===============>",[pool?.id])
        return callWithGasPrice(sponsorHelperContract, 'deleteSponsor', [pool?.id])
        .catch((err) => console.log("CONFIRM_DELETE_PROTOCOL===============>", err, [pool?.id]))
      }
      if (stage === LockStage.CONFIRM_UPDATE_BOUNTY_ID) {
        console.log("CONFIRM_UPDATE_BOUNTY===============>", [state.bountyId])
        return callWithGasPrice(sponsorContract, 'updateBounty', [state.bountyId])
        .catch((err) => console.log("CONFIRM_UPDATE_BOUNTY===============>", err, [state.bountyId]))
      }
      if (stage === LockStage.CONFIRM_UPDATE_OWNER) {
        const args = variant === "admin" ? [state.owner] : [state.owner, state.tokenId]
        const method = variant === "admin" ? 'updateDevFromCollectionId' : 'updateOwner'
        console.log("CONFIRM_UPDATE_OWNER===============>",args)
        return callWithGasPrice(sponsorContract, method, args)
        .catch((err) => console.log("CONFIRM_UPDATE_OWNER===============>", err, args))
      }
      if (stage === LockStage.CONFIRM_DEPOSIT_DUE) {
        const args = [state.protocol]
        console.log("CONFIRM_DEPOSIT_DUE===============>",args)
        return callWithGasPrice(sponsorContract, 'depositDue', args)
        .catch((err) => console.log("CONFIRM_DEPOSIT_DUE===============>", err, args))
      }
      if (stage === LockStage.CONFIRM_UPDATE_TOKEN_ID) {
        console.log("CONFIRM_UPDATE_TOKEN_ID===============>", [state.tokenId])
        return callWithGasPrice(sponsorContract, 'updateTokenId', [state.tokenId])
        .catch((err) => console.log("CONFIRM_UPDATE_TOKEN_ID===============>", err, [state.tokenId]))
      }
      if (stage === LockStage.CONFIRM_VOTE) {
        const args = [pool.id, state.profileId, !!state.like]
        console.log("CONFIRM_VOTE===============>", args)
        return callWithGasPrice(sponsorHelperContract, 'vote', args)
        .catch((err) => console.log("CONFIRM_VOTE===============>", err, args))
      }
      if (stage === LockStage.CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE) {
        const args = [pool?.id,state.toAddress,state.numPeriods]
        console.log("CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE===============>", args)
        return callWithGasPrice(sponsorHelperContract, 'transferDueToNote', args)
        .catch((err) => console.log("CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE===============>", err))
      }
    },
    onSuccess: async ({ receipt }) => {
      // toastSuccess(getToastText(stage, t), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      // onSuccessSale(receipt.transactionHash)
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
          <Flex justifyContent='center' style={{ cursor: 'pointer' }} alignSelf='center' mb='10px'>
            <LinkExternal color='success' href={pool?.applicationLink} bold>
              {t('APPLY FOR A SPONSORSHIP')}
            </LinkExternal>
          </Flex>
          <Button mb="8px" variant='success' onClick={()=> setStage(LockStage.VOTE) }>
            {t('VOTE')}
          </Button>
          {pool._ve !== AddressZero ?
          <>
          <Button mb="8px" variant='secondary' onClick={()=> setStage(LockStage.UPDATE_OWNER) }>
            {t('UPDATE OWNER')}
          </Button>
          <Button mb="8px" variant='secondary' onClick={()=> setStage(LockStage.UPDATE_TOKEN_ID) }>
            {t('UPDATE TOKEN ID')}
          </Button>
          </>:null}
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
          <Button mb="8px" variant="success" onClick={()=> setStage(LockStage.PAY) }>
            {t('PAY')}
          </Button>
          <Button mb="8px" onClick={()=> setStage(LockStage.UPDATE_PARAMETERS) }>
            {t('UPDATE PARAMETERS')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={()=> setStage(LockStage.UPDATE_CONTENT) }>
            {t('UPDATE CONTENT')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={()=> setStage(LockStage.UPDATE_BOUNTY_ID) }>
            {t('UPDATE BOUNTY ID')}
          </Button>
          {location ==='fromStake' ?
          <>
          <Button variant="tertiary" mb="8px" onClick={()=> setStage(LockStage.DEPOSIT_DUE) }>
            {t('DEPOSIT DUE')}
          </Button>
          <Button variant="tertiary" mb="8px" onClick={()=> setStage(LockStage.UPDATE_OWNER) }>
            {t('UPDATE OWNER')}
          </Button>
          <Button mb="8px" onClick={()=> setStage(LockStage.TRANSFER_TO_NOTE_RECEIVABLE) }>
            {t('TRANSFER TO NOTE RECEIVABLE')}
          </Button>
          <Button variant="danger" mb="8px" onClick={()=> setStage(LockStage.WITHDRAW) }>
            {t('WITHDRAW')}
          </Button>
          <Button mb="8px" variant="danger" onClick={()=> setStage(LockStage.CLAIM_NOTE) }>
            {t('CLAIM NOTE')}
          </Button>
          </>:null}
          <Button variant="danger" mb="8px" onClick={()=> setStage(LockStage.DELETE_PROTOCOL) }>
            {t('DELETE PROTOCOL')}
          </Button>
          {location !== 'fromStake' ?
          <Button variant="danger" mb="8px" onClick={()=> setStage(LockStage.DELETE) }>
            {t('DELETE CONTRACT')}
          </Button>
          :null}
        </Flex>
      }
      {stage === LockStage.CLAIM_NOTE && 
        <ClaimNoteStage
          state={state}
          handleChange={handleChange} 
          continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.UPDATE_PARAMETERS && 
      <UpdateParametersStage 
        state={state} 
        handleChange={handleChange}
        handleRawValueChange={handleRawValueChange}
        continueToNextStage={continueToNextStage} 
      />}
      {stage === LockStage.UPDATE_CONTENT && 
      <UpdateContentStage 
        state={state} 
        handleChange={handleChange}
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
        account={pool?.id}
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
          isAdmin={variant === "admin"}
          handleChange={handleChange} 
          continueToNextStage={continueToNextStage} 
        />}
        {stage === LockStage.DEPOSIT_DUE && 
        <DepositDueStage
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
        {stage === LockStage.PAY && 
          <PayStage
            state={state}
            handleChange={handleChange} 
            continueToNextStage={continueToNextStage} 
        />}
        {stage === LockStage.TRANSFER_TO_NOTE_RECEIVABLE && 
          <UpdateTransferToNoteReceivableStage
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
