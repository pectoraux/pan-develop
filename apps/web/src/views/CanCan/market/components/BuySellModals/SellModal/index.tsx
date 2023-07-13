import { useRouter } from 'next/router'
import { useState, ChangeEvent } from 'react'
import { differenceInSeconds } from 'date-fns'
import { InjectedModalProps, useToast } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import useTheme from 'hooks/useTheme'
import { getBalanceAmount, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useTranslation, ContextApi, TranslateFunction } from '@pancakeswap/localization'
import { 
  useMarketTradesContract, 
  useMarketOrdersContract, 
  useNftMarketContract, 
  useMarketHelperContract,
  useMarketCollectionsContract, 
  usePaywallMarketHelperContract,
} from 'hooks/useContract'
import { NftToken } from 'state/cancan/types'
import BigNumber from 'bignumber.js'
import { useGetLowestPriceFromNft } from 'views/CanCan/market/hooks/useGetLowestPrice'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import SetPriceStage from './SetPriceStage'
import SetOptionsStage from './SetOptionsStage'
import EditStage from './EditStage'
import { StyledModal, stagesWithBackButton } from './styles'
import { SellingStage, OptionType, FormState, ARRAY_KEYS } from './types'
import ConfirmStage from '../shared/ConfirmStage'
import RemoveStage from './RemoveStage'
import IdentityRequirementStage from './IdentityRequirementStage'
import BurnTokenForCreditStage from './BurnTokenForCreditStage'
import UserPaymentCredits from './UserPaymentCredits'
import DiscountsNCashbacks from './DiscountsNCashbacks'
import ResetIdentityLimits from './ResetIdentityLimits'
import ResetDiscountLimits from './ResetDiscountLimits'
import ResetCashbackLimits from './ResetCashbackLimits'
import LocationStage from './LocationStage'

const modalTitles = (t: TranslateFunction) => ({
  [SellingStage.EDIT]: t('Price Settings'),
  [SellingStage.ADJUST_PRICE]: t('Adjust Price'),
  [SellingStage.ADJUST_OPTIONS]: t('Adjust Options'),
  [SellingStage.ADD_LOCATION]: t('Adjust Location Data'),
  [SellingStage.UPDATE_IDENTITY_REQUIREMENTS]: t('Update Identity Requirements'),
  [SellingStage.UPDATE_BURN_FOR_CREDIT_TOKENS]: t('Update Tokens To Burn For Credit'),
  [SellingStage.UPDATE_DISCOUNTS_AND_CASHBACKS]: t('Update Discounts and Cashback'),
  [SellingStage.ADD_USERS_PAYMENT_CREDIT]: t('Users Payment Credits'),
  [SellingStage.REMOVE_FROM_MARKET]: t('Remove From Market'),
  [SellingStage.REINITIALIZE_IDENTITY_LIMITS]: t('Reset Identity Limits'),
  [SellingStage.REINITIALIZE_DISCOUNTS_LIMITS]: t('Reset Discounts Limits'),
  [SellingStage.REINITIALIZE_CASHBACK_LIMITS]: t('Reset Cashback Limits'),
  [SellingStage.CONFIRM_ADJUST_PRICE]: t('Back'),
  [SellingStage.CONFIRM_ADJUST_OPTIONS]: t('Back'),
  [SellingStage.CONFIRM_ADD_LOCATION]: t('Back'),
  [SellingStage.CONFIRM_REMOVE_FROM_MARKET]: t('Back'),
  [SellingStage.CONFIRM_UPDATE_IDENTITY_REQUIREMENTS]: t('Back'),
  [SellingStage.CONFIRM_UPDATE_BURN_FOR_CREDIT_TOKENS]: t('Back'),
  [SellingStage.CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS]: t('Back'),
  [SellingStage.CONFIRM_ADD_USERS_PAYMENT_CREDIT]: t('Back'),
  [SellingStage.CONFIRM_REINITIALIZE_IDENTITY_LIMITS]: t('Back'),
  [SellingStage.CONFIRM_REINITIALIZE_DISCOUNTS_LIMITS]: t('Back'),
  [SellingStage.CONFIRM_REINITIALIZE_CASHBACK_LIMITS]: t('Back'),
  [SellingStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

const getToastText = (variant: string, stage: SellingStage, t: ContextApi['t']) => {
  if (stage === SellingStage.CONFIRM_REMOVE_FROM_MARKET) {
    return t('Your item has been removed from the marketplace')
  }
  if (stage === SellingStage.CONFIRM_UPDATE_IDENTITY_REQUIREMENTS) {
    return t('Identity requirements for your Item have been updated')
  }
  if (stage === SellingStage.CONFIRM_UPDATE_BURN_FOR_CREDIT_TOKENS) {
    return t('Tokens to burn for credit on your item have been updated')
  }
  if (stage === SellingStage.CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS) {
    return t('Discount and cashback options for your item have been updated')
  }
  if (stage === SellingStage.CONFIRM_ADD_USERS_PAYMENT_CREDIT) {
    return t('All users payment credits have been updated')
  }
  if (stage === SellingStage.CONFIRM_REINITIALIZE_IDENTITY_LIMITS) {
    return t('Identity limits on your item have been reset')
  }
  if (stage === SellingStage.CONFIRM_REINITIALIZE_DISCOUNTS_LIMITS) {
    return t('Discount limits on your item have been reset')
  }
  if (stage === SellingStage.CONFIRM_REINITIALIZE_CASHBACK_LIMITS) {
    return t('Cashback limits on your item have been reset')
  }
  return t('Your item listing has been changed.')
}

interface SellModalProps extends InjectedModalProps {
  variant: 'item' | 'paywall'
  currency?: any
  nftToSell?: any
  onSuccessSale: () => void
}
 
const SellModal: React.FC<any> = ({
  variant,
  currency,
  nftToSell,
  onDismiss,
}) => {
  const collectionId = useRouter().query.collectionAddress as string
  const options = nftToSell?.options?.map((option, index) => { 
    return {
      id: index, 
      ...option 
    }
  })
  const chunks = nftToSell?.images && nftToSell?.images?.split(",")
  const thumbnail = chunks?.length > 0 && nftToSell?.images?.split(",")[0]
  const original = chunks?.length > 1 && nftToSell?.images?.split(",").slice(1).join(",")

  const [state, setState] = useState<any>(() => ({
    // adjust price variables
    productId: nftToSell?.tokenId ?? "",
    tokenId: nftToSell?.tokenId ?? "",
    price: nftToSell?.currentAskPrice,
    bidDuration: nftToSell?.bidDuration || 0,
    minBidIncrementPercentage: nftToSell?.minBidIncrementPercentage || 0,
    transferrable: Number(nftToSell?.transferrable),
    requireUpfrontPayment: Number(nftToSell?.requireUpfrontPayment),
    rsrcTokenId: nftToSell?.rsrcTokenId || 0,
    options,
    maxSupply: nftToSell?.maxSupply || 0,
    dropInTimer: Number(nftToSell?.dropinTimer) || 0,
    // discount & cashback variables
    discountStatus: Number(nftToSell.priceReductor?.discountStatus) || 0,
    discountStart: Number(nftToSell.priceReductor?.discountStart) || 0,
    cashbackStatus: Number(nftToSell.priceReductor?.cashbackStatus) || 0,
    cashbackStart: Number(nftToSell.priceReductor?.cashbackStart) || 0,
    cashNotCredit: Number(nftToSell.priceReductor?.cashNotCredit) || 0,
    checkItemOnly: Number(nftToSell.priceReductor?.checkItemOnly) || 0,
    checkIdentityCode: Number(nftToSell.priceReductor?.checkIdentityCode) || 0,
    discountNumbers: Object.values(nftToSell.priceReductor?.discountNumbers ?? {})?.toString(),
    discountCost: Object.values(nftToSell.priceReductor?.discountCost ?? {})?.toString(),
    cashbackNumbers: Object.values(nftToSell.priceReductor?.cashbackNumbers ?? {})?.toString(),
    cashbackCost: Object.values(nftToSell.priceReductor?.cashbackCost ?? {})?.toString(),
    addPaywall: "",
    removePaywall: "",
    token: nftToSell.usetFIAT ? nftToSell?.tFIAT : nftToSell?.ve,
    onlyTrustWorthyAuditors: nftToSell?.identityProof?.onlyTrustWorthyAuditors ?? 0,
    dataKeeperOnly: nftToSell?.identityProof?.dataKeeperOnly ?? 0,
    maxUse: nftToSell?.identityProof?.maxUse ?? 0,
    minIDBadgeColor: nftToSell?.identityProof?.minIDBadgeColor ?? 0,
    valueName: nftToSell?.identityProof?.valueName ?? '',
    requiredIndentity: nftToSell?.identityProof?.requiredIndentity ?? '',
    usetFIAT: nftToSell?.usetFIAT ? 1 : 0,
    customTags: "",
    thumbnail: thumbnail ?? "",
    description: nftToSell?.description ?? "",
    original: original ?? "",
    webm: "",
    gif: "",
    checker: "",
    discountNumber: "",
    clear: 0,
    collectionId: "",
    destination: "",
    prices: nftToSell?.prices?.toString() ?? "",
    start: nftToSell?.start ?? "0",
    period: nftToSell?.period ?? "0",
    isTradable: Number(nftToSell?.isTradable) ?? 0,
    isPaywall: 0,
  }))
  console.log("options===================>", options, nftToSell)
  const [stage, setStage] = useState(SellingStage.EDIT)
  const [price, setPrice] = useState(nftToSell?.currentAskPrice)
  const [burnForCreditToken, setBurnForCreditToken] = useState('')
  const [paymentCredits, setPaymentCredits] = useState('')
  const [creditUsers, setCreditUsers] = useState('')
  const [discountNumber, setDiscountNumber] = useState(0)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const [activeButtonIndex, setActiveButtonIndex] = useState<any>(0)
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const { signer: ordersSigner } = useMarketOrdersContract()
  const { signer: tradesSigner } = useMarketTradesContract()
  const { signer: helpersSigner } = useMarketHelperContract()
  const { signer: marketCollectionsContract } = useMarketCollectionsContract()
  const { signer: paywallMarketHelperContract } = usePaywallMarketHelperContract()
  const nftMarketContract = useNftMarketContract()
  const [nftFilters, setNftFilters] = useState({
    country: nftToSell?.countries,
    city: nftToSell?.cities,
    product: nftToSell?.products,
  })

  const updateValue = (key: any, value: any) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    updateValue(inputName, ARRAY_KEYS.includes(inputName) ? value?.split(',') : value)
  }
  const handleChoiceChange = (newChoices: OptionType[]) => {
    updateValue('options', newChoices)
  }
  const handleRawValueChange = (key: string) => (value: Date | number | boolean | string) => {
    updateValue(key, value)
  }
  const { lowestPrice } = useGetLowestPriceFromNft(nftToSell)

  const goBack = () => {
    switch (stage) {
      case SellingStage.ADJUST_PRICE:
        setPrice(nftToSell?.currentAskPrice)
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_ADJUST_PRICE:
        setStage(SellingStage.ADJUST_PRICE)
        break
      case SellingStage.ADJUST_OPTIONS:
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_ADJUST_OPTIONS:
        setStage(SellingStage.ADJUST_OPTIONS)
        break
      case SellingStage.ADD_LOCATION:
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_ADD_LOCATION:
        setStage(SellingStage.ADD_LOCATION)
        break
      case SellingStage.UPDATE_IDENTITY_REQUIREMENTS:
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_UPDATE_IDENTITY_REQUIREMENTS:
        setStage(SellingStage.UPDATE_IDENTITY_REQUIREMENTS)
        break
      case SellingStage.UPDATE_BURN_FOR_CREDIT_TOKENS:
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_UPDATE_BURN_FOR_CREDIT_TOKENS:
        setStage(SellingStage.UPDATE_BURN_FOR_CREDIT_TOKENS)
        break
      case SellingStage.UPDATE_DISCOUNTS_AND_CASHBACKS:
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS:
        setStage(SellingStage.UPDATE_DISCOUNTS_AND_CASHBACKS)
        break
      case SellingStage.ADD_USERS_PAYMENT_CREDIT:
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_ADD_USERS_PAYMENT_CREDIT:
        setStage(SellingStage.ADD_USERS_PAYMENT_CREDIT)
        break
      case SellingStage.REINITIALIZE_IDENTITY_LIMITS:
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_REINITIALIZE_IDENTITY_LIMITS:
        setStage(SellingStage.REINITIALIZE_IDENTITY_LIMITS)
        break
      case SellingStage.REINITIALIZE_DISCOUNTS_LIMITS:
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_REINITIALIZE_DISCOUNTS_LIMITS:
        setStage(SellingStage.REINITIALIZE_DISCOUNTS_LIMITS)
        break
      case SellingStage.REINITIALIZE_CASHBACK_LIMITS:
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_REINITIALIZE_CASHBACK_LIMITS:
        setStage(SellingStage.REINITIALIZE_CASHBACK_LIMITS)
        break
      case SellingStage.REMOVE_FROM_MARKET:
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_REMOVE_FROM_MARKET:
        setStage(SellingStage.REMOVE_FROM_MARKET)
        break
      default:
        break
    }
  }

  const continueToNextStage = () => {
    switch (stage) {
      case SellingStage.EDIT:
        setStage(SellingStage.ADJUST_PRICE)
        break
      case SellingStage.ADJUST_PRICE:
        setStage(SellingStage.CONFIRM_ADJUST_PRICE)
        break
      case SellingStage.ADJUST_OPTIONS:
        setStage(SellingStage.CONFIRM_ADJUST_OPTIONS)
        break
      case SellingStage.ADD_LOCATION:
        setStage(SellingStage.CONFIRM_ADD_LOCATION)
        break
      case SellingStage.UPDATE_IDENTITY_REQUIREMENTS:
        setStage(SellingStage.CONFIRM_UPDATE_IDENTITY_REQUIREMENTS)
        break
      case SellingStage.UPDATE_BURN_FOR_CREDIT_TOKENS:
        setStage(SellingStage.CONFIRM_UPDATE_BURN_FOR_CREDIT_TOKENS)
        break
      case SellingStage.UPDATE_DISCOUNTS_AND_CASHBACKS:
        setStage(SellingStage.CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS)
        break
      case SellingStage.ADD_USERS_PAYMENT_CREDIT:
        setStage(SellingStage.CONFIRM_ADD_USERS_PAYMENT_CREDIT)
        break
      case SellingStage.REMOVE_FROM_MARKET:
        setStage(SellingStage.CONFIRM_REMOVE_FROM_MARKET)
        break
      case SellingStage.REINITIALIZE_IDENTITY_LIMITS:
        setStage(SellingStage.CONFIRM_REINITIALIZE_IDENTITY_LIMITS)
        break
      case SellingStage.REINITIALIZE_DISCOUNTS_LIMITS:
        setStage(SellingStage.CONFIRM_REINITIALIZE_DISCOUNTS_LIMITS)
        break
      case SellingStage.REINITIALIZE_CASHBACK_LIMITS:
        setStage(SellingStage.CONFIRM_REINITIALIZE_CASHBACK_LIMITS)
        break
      default:
        break
    }
  }

  const continueToUpdateIdentityStage = () => {
    setStage(SellingStage.UPDATE_IDENTITY_REQUIREMENTS)
  }

  const continueToAdjustOptions = () => setStage(SellingStage.ADJUST_OPTIONS)
  const continueToLocationStage = () => setStage(SellingStage.ADD_LOCATION)
  
  const continueToUpdateBurnForCreditStage = () => {
    setStage(SellingStage.UPDATE_BURN_FOR_CREDIT_TOKENS)
  }

  const continueToUpdateDiscountsAndCashbackStage = () => {
    setStage(SellingStage.UPDATE_DISCOUNTS_AND_CASHBACKS)
  }

  const continueToAddUsersPaymentCreditStage = () => {
    setStage(SellingStage.ADD_USERS_PAYMENT_CREDIT)
  }

  const continueToReinitializeIdentityLimitsStage = () => {
    setStage(SellingStage.REINITIALIZE_IDENTITY_LIMITS)
  }

  const continueToReinitializeDiscountLimitsStage = () => {
    setStage(SellingStage.REINITIALIZE_DISCOUNTS_LIMITS)
  }

  const continueToReinitializeCashbackLimitsStage = () => {
    setStage(SellingStage.REINITIALIZE_CASHBACK_LIMITS)
  }

  const continueToRemoveFromMarketStage = () => {
    setStage(SellingStage.REMOVE_FROM_MARKET)
  }

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        // const approvedForContract = await collectionContractReader.isApprovedForAll(account, nftMarketContract.address)
        // return !approvedForContract
        return false
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      return callWithGasPrice(nftMarketContract, 'setApprovalForAll', [nftMarketContract.address, true])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now put your NFT for sale!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    // eslint-disable-next-line consistent-return
    onConfirm: () => {
      if (stage === SellingStage.CONFIRM_REMOVE_FROM_MARKET) {
        console.log("CONFIRM_REMOVE_FROM_MARKET=================>", [nftToSell?.tokenId])
        return callWithGasPrice(ordersSigner, 'cancelAskOrder', [nftToSell?.tokenId])
        .catch((err) => console.log("CONFIRM_REMOVE_FROM_MARKET=================>", err))
      }
      if (stage === SellingStage.CONFIRM_ADJUST_PRICE) {
        const currentAskPrice = getDecimalAmount(state.price ?? 0)
        const dropInTimer = Math.max(differenceInSeconds(new Date(state.dropInTimer || 0), new Date(), {
          roundingMethod: 'ceil',
        }),0)
        console.log("CONFIRM_ADJUST_PRICE=================>", [
          nftToSell?.currentSeller, 
          nftToSell?.tokenId, 
          currentAskPrice.toString(),
          state.bidDuration,
          state.minBidIncrementPercentage,
          !!state.transferrable,
          !!state.requireUpfrontPayment,
          state.rsrcTokenId,
          state.maxSupply,
          dropInTimer.toString()
        ])
        return callWithGasPrice(ordersSigner, 'modifyAskOrder', [
          nftToSell?.currentSeller, 
          nftToSell?.tokenId, 
          currentAskPrice.toString(),
          state.bidDuration,
          state.minBidIncrementPercentage,
          !!state.transferrable,
          !!state.requireUpfrontPayment,
          state.rsrcTokenId,
          state.maxSupply,
          dropInTimer.toString()
        ])
        .catch((err) => console.log("CONFIRM_ADJUST_PRICE=================>", err))
      }
      if (stage === SellingStage.CONFIRM_ADJUST_OPTIONS) {
        const contract = variant === 'paywall' ? paywallMarketHelperContract : helpersSigner
        const args = variant === 'paywall' ? [
          nftToSell.tokenId,
          state.options?.reduce((accum, attr) => ([...accum, attr.min]),[],),
          state.options?.reduce((accum, attr) => ([...accum, attr.max]),[],),
          state.options?.reduce((accum, attr) => ([...accum, attr.value]),[],),  // value
          state.options?.reduce((accum, attr) => ([...accum, getDecimalAmount(attr.unitPrice)?.toString()]),[],),
          state.options?.reduce((accum, attr) => ([...accum, attr.category]),[],),
          state.options?.reduce((accum, attr) => ([...accum, attr.element]),[],),
          state.options?.reduce((accum, attr) => ([...accum, attr.category]),[],), // traitype
          state.options?.reduce((accum, attr) => ([...accum, attr.currency]),[],),
        ] : [
          nftToSell.tokenId,
          state.options?.reduce((accum, attr) => ([...accum, attr.min]),[],) || [],
          state.options?.reduce((accum, attr) => ([...accum, attr.max]),[],) || [],
          state.options?.reduce((accum, attr) => ([...accum, getDecimalAmount(attr.unitPrice ?? 0)?.toString()]),[],) || [],
          state.options?.reduce((accum, attr) => ([...accum, attr.category]),[],) || [],
          state.options?.reduce((accum, attr) => ([...accum, attr.element]),[],) || [],
          state.options?.reduce((accum, attr) => ([...accum, attr.category]),[],) || [], // traitype
          state.options?.reduce((accum, attr) => ([...accum, attr.element]),[],) || [],  // value
          state.options?.reduce((accum, attr) => ([...accum, attr.currency]),[],) || [],
        ]
        console.log("CONFIRM_ADJUST_OPTIONS===================>", args)
        return callWithGasPrice(contract, 'updateOptions', args)
        .catch((err) => console.log("CONFIRM_ADJUST_OPTIONS=================>", err))
      }
      if (stage === SellingStage.CONFIRM_ADD_LOCATION) {
        let args = []
        try  {
          const delim = state.customTags?.length ? "," : ""
          args = [
            state.tokenId,
            state.description,
            state.prices?.split(',')?.filter((val) => !!val),
            state.start,
            state.period,
            variant === 'item' ? 0 : 1,
            !!state.isTradable,
            `${state.thumbnail}, ${state.original}`,
            nftFilters?.country?.toString(),
            nftFilters?.city?.toString(),
            nftFilters?.product?.toString() + delim + state.customTags
          ]
          console.log("CONFIRM_ADD_LOCATION==============>", args)
        } catch(err) { console.log("1CONFIRM_ADD_LOCATION============>", err)}
          return callWithGasPrice(marketCollectionsContract, 'emitAskInfo', args)
          .catch((err) => console.log("CONFIRM_ADD_LOCATION================>", err))
        }
      if (stage === SellingStage.CONFIRM_UPDATE_IDENTITY_REQUIREMENTS) {
        const args = [
          nftToSell.tokenId, 
          state.requiredIndentity, 
          state.valueName,
          !!state.onlyTrustWorthyAuditors,
          !!state.dataKeeperOnly,
          state.maxUse,
          state.minIDBadgeColor
        ]
        console.log("CONFIRM_UPDATE_IDENTITY_REQUIREMENTS1=================>", args)
        return callWithGasPrice(ordersSigner, 'modifyAskOrderIdentity', args)
        .catch((err) => console.log("CONFIRM_UPDATE_IDENTITY_REQUIREMENTS===========>", err))
      }
      if (stage === SellingStage.CONFIRM_UPDATE_BURN_FOR_CREDIT_TOKENS) {
        const args = [
          state.token,
          state.checker,
          state.destination,
          parseInt(state.discountNumber)*100, 
          state.collectionId, 
          !!state.clear,
          state.productId
        ]
        console.log("CONFIRM_UPDATE_BURN_FOR_CREDIT_TOKENS===========>", args)
        return callWithGasPrice(helpersSigner, 'updateBurnTokenForCredit', args)
        .catch((err) => console.log("CONFIRM_UPDATE_BURN_FOR_CREDIT_TOKENS===========>", err))
      }
      if (stage === SellingStage.CONFIRM_ADD_USERS_PAYMENT_CREDIT) {
        const amount  = getDecimalAmount(new BigNumber(paymentCredits ?? 0))
        console.log("CONFIRM_ADD_USERS_PAYMENT_CREDIT===========>", [creditUsers, collectionId, state.productId, amount?.toString()])
        return callWithGasPrice(ordersSigner, 'incrementPaymentCredits', [creditUsers, collectionId, state.productId, amount?.toString()])
        .catch((err) => console.log("CONFIRM_ADD_USERS_PAYMENT_CREDIT===========>", err))
      }
      if (stage === SellingStage.CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS) {
        if (activeButtonIndex) {
          const cashbackStart = Math.max(differenceInSeconds(new Date(state.cashbackStart || 0), new Date(), {
            roundingMethod: 'ceil',
          }),0)
          const cursor = state.cashbackNumbers?.length ? state.cashbackNumbers[0] : 0
          const size = state.cashbackNumbers?.length ? state.cashbackNumbers[1] : 0
          const perct = state.cashbackNumbers?.length ? state.cashbackNumbers[2] : 0
          const lowerThreshold = state.cashbackNumbers?.length ? getDecimalAmount(state.cashbackNumbers[3] ?? 0) : 0
          const upperThreshold = state.cashbackNumbers?.length ? getDecimalAmount(state.cashbackNumbers[4] ?? 0) : 0
          const limit = state.cashbackNumbers?.length ? state.cashbackNumbers[5] : 0
          
          const cursor2 = state.cashbackCost?.length ? state.cashbackCost[0] : 0
          const size2 = state.cashbackCost?.length ? state.cashbackCost[1] : 0
          const perct2 = state.cashbackCost?.length ? state.cashbackCost[2] : 0
          const lowerThreshold2 = state.cashbackCost?.length ? getDecimalAmount(state.cashbackCost[3] ?? 0) : 0
          const upperThreshold2 = state.cashbackCost?.length ? getDecimalAmount(state.cashbackCost[4] ?? 0) : 0
          const limit2 = state.cashbackCost?.length ? state.cashbackCost[5] : 0
          const args = [
            nftToSell.tokenId, 
            state.cashbackStatus,
            cashbackStart,
            !!state.checkItemOnly,
            !!state.cashNotCredit,
            [cursor,size,perct,lowerThreshold?.toString(),upperThreshold?.toString(),limit],
            [cursor2,size2,perct2,lowerThreshold2?.toString(),upperThreshold2?.toString(),limit2],
          ]
          console.log("CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS1===============>", args)
          return callWithGasPrice(ordersSigner, 'modifyAskOrderCashbackPriceReductors', args)
          .catch((err) => console.log("CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS1===============>", err))
        }
        const discountStart = Math.max(differenceInSeconds(new Date(state.discountStart || 0), new Date(), {
          roundingMethod: 'ceil',
        }),0)
        const cursor = state.discountNumbers?.length ? state.discountNumbers[0] : 0
        const size = state.discountNumbers?.length ? state.discountNumbers[1] : 0
        const perct = state.discountNumbers?.length ? state.discountNumbers[2] : 0
        const lowerThreshold = state.discountNumbers?.length ? getDecimalAmount(state.discountNumbers[3] ?? 0) : 0
        const upperThreshold = state.discountNumbers?.length ? getDecimalAmount(state.discountNumbers[4] ?? 0) : 0
        const limit = state.discountNumbers?.length ? state.discountNumbers[5] : 0
        
        const cursor2 = state.discountCost?.length ? state.discountCost[0] : 0
        const size2 = state.discountCost?.length ? state.discountCost[1] : 0
        const perct2 = state.discountCost?.length ? state.discountCost[2] : 0
        const lowerThreshold2 = state.discountCost?.length ? getDecimalAmount(state.discountCost[3] ?? 0) : 0
        const upperThreshold2 = state.discountCost?.length ? getDecimalAmount(state.discountCost[4] ?? 0) : 0
        const limit2 = state.discountCost?.length ? state.discountCost[5] : 0
        const args = [
          nftToSell.tokenId, 
          state.discountStatus,
          discountStart,
          !!state.cashNotCredit,
          !!state.checkItemOnly,
          !!state.checkIdentityCode,
          [cursor,size,perct,lowerThreshold?.toString(),upperThreshold?.toString(),limit],
          [cursor2,size2,perct2,lowerThreshold2?.toString(),upperThreshold2?.toString(),limit2],
        ]
        console.log("CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS===============>", args)
        return callWithGasPrice(ordersSigner, 'modifyAskOrderDiscountPriceReductors', args)
        .catch((err) => console.log("CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS===============>", err))
      }
      if (stage === SellingStage.CONFIRM_REINITIALIZE_IDENTITY_LIMITS) {
        console.log("CONFIRM_REINITIALIZE_IDENTITY_LIMITS===============>", [nftToSell?.tokenId]) 
        return callWithGasPrice(tradesSigner, 'reinitializeIdentityLimits', [nftToSell?.tokenId])
        .catch((err) => console.log("CONFIRM_REINITIALIZE_IDENTITY_LIMITS===============>", err))
      }
      if (stage === SellingStage.CONFIRM_REINITIALIZE_DISCOUNTS_LIMITS) {
        console.log("CONFIRM_REINITIALIZE_DISCOUNTS_LIMITS===============>", [nftToSell?.tokenId]) 
        return callWithGasPrice(tradesSigner, 'reinitializeDiscountLimits', [nftToSell?.tokenId])
        .catch((err) => console.log("CONFIRM_REINITIALIZE_DISCOUNTS_LIMITS===============>", err))
      }
      if (stage === SellingStage.CONFIRM_REINITIALIZE_CASHBACK_LIMITS) {
        console.log("CONFIRM_REINITIALIZE_CASHBACK_LIMITS===============>", [nftToSell?.tokenId])
        return callWithGasPrice(tradesSigner, 'reinitializeCashbackLimits', [nftToSell?.tokenId])
        .catch((err) => console.log("CONFIRM_REINITIALIZE_CASHBACK_LIMITS===============>", err))
      }
    },
    onSuccess: async ({ receipt }) => {
      toastSuccess(getToastText(variant, stage, t), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      // onSuccessSale()
      setConfirmedTxHash(receipt.transactionHash)
      setStage(SellingStage.TX_CONFIRMED)
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
      {stage === SellingStage.EDIT && (
        <EditStage
          nftToSell={nftToSell}
          lowestPrice={lowestPrice}
          currency={currency}
          collectionId={collectionId}
          continueToAdjustPriceStage={continueToNextStage}
          continueToAdjustOptions={continueToAdjustOptions}
          continueToLocationStage={continueToLocationStage}
          continueToUpdateIdentityStage={continueToUpdateIdentityStage}
          continueToUpdateBurnForCreditStage={continueToUpdateBurnForCreditStage}
          continueToAddUsersPaymentCreditStage={continueToAddUsersPaymentCreditStage}
          continueToUpdateDiscountsAndCashbackStage={continueToUpdateDiscountsAndCashbackStage}
          continueToReinitializeIdentityLimitsStage={continueToReinitializeIdentityLimitsStage}
          continueToReinitializeDiscountLimitsStage={continueToReinitializeDiscountLimitsStage}
          continueToReinitializeCashbackLimitsStage={continueToReinitializeCashbackLimitsStage}
          continueToRemoveFromMarketStage={continueToRemoveFromMarketStage}
        />
      )}
      {stage === SellingStage.ADJUST_PRICE && (
        <SetPriceStage
          nftToSell={nftToSell}
          variant="adjust"
          currentPrice={nftToSell?.currentAskPrice}
          currency={currency}
          state={state}
          collectionId={collectionId}
          handleChange={handleChange}
          handleChoiceChange={handleChoiceChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.ADJUST_OPTIONS && (
        <SetOptionsStage
          nftToSell={nftToSell}
          state={state}
          addValue={variant === 'paywall'}
          collectionId={collectionId}
          handleChoiceChange={handleChoiceChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.UPDATE_IDENTITY_REQUIREMENTS && (
        <IdentityRequirementStage
          nftToSell={nftToSell}
          state={state}
          collectionId={collectionId}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.UPDATE_BURN_FOR_CREDIT_TOKENS && (
        <BurnTokenForCreditStage
          nftToSell={nftToSell}
          lowestPrice={lowestPrice}
          collectionId={collectionId}
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.UPDATE_DISCOUNTS_AND_CASHBACKS && (
        <DiscountsNCashbacks
          nftToSell={nftToSell}
          lowestPrice={lowestPrice}
          state={state}
          collectionId={collectionId}
          activeButtonIndex={activeButtonIndex}
          setActiveButtonIndex={setActiveButtonIndex}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.ADD_USERS_PAYMENT_CREDIT && (
        <UserPaymentCredits
          state={state}
          nftToSell={nftToSell}
          collectionId={collectionId}
          lowestPrice={lowestPrice}
          paymentCredits={paymentCredits}
          setPaymentCredits={setPaymentCredits}
          creditUsers={creditUsers}
          setCreditUsers={setCreditUsers}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.ADD_LOCATION && 
      <LocationStage 
        state={state}
        variant={variant}
        nftFilters={nftFilters} 
        setNftFilters={setNftFilters}
        updateValue={updateValue}
        handleChange={handleChange}
        handleRawValueChange={handleRawValueChange}
        continueToNextStage={continueToNextStage}
        />
      }
      {stage === SellingStage.REINITIALIZE_IDENTITY_LIMITS && (<ResetIdentityLimits continueToNextStage={continueToNextStage}/> )}
      {stage === SellingStage.REINITIALIZE_DISCOUNTS_LIMITS && (<ResetDiscountLimits continueToNextStage={continueToNextStage}/> )}
      {stage === SellingStage.REINITIALIZE_CASHBACK_LIMITS && (<ResetCashbackLimits continueToNextStage={continueToNextStage}/> )}
      {[SellingStage.CONFIRM_ADJUST_PRICE,
        SellingStage.CONFIRM_ADJUST_OPTIONS,
        SellingStage.CONFIRM_ADD_LOCATION,
        SellingStage.CONFIRM_UPDATE_IDENTITY_REQUIREMENTS,
        SellingStage.CONFIRM_UPDATE_BURN_FOR_CREDIT_TOKENS,
        SellingStage.CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS,
        SellingStage.CONFIRM_ADD_USERS_PAYMENT_CREDIT,
        SellingStage.CONFIRM_REINITIALIZE_IDENTITY_LIMITS,
        SellingStage.CONFIRM_REINITIALIZE_DISCOUNTS_LIMITS,
        SellingStage.CONFIRM_REINITIALIZE_CASHBACK_LIMITS
       ].includes(stage) && (
        <ConfirmStage isConfirming={isConfirming} handleConfirm={handleConfirm} />
      )}
      {stage === SellingStage.REMOVE_FROM_MARKET && <RemoveStage continueToNextStage={continueToNextStage} />}
      {stage === SellingStage.CONFIRM_REMOVE_FROM_MARKET && (
        <ConfirmStage isConfirming={isConfirming} handleConfirm={handleConfirm} />
      )}
      {stage === SellingStage.TX_CONFIRMED && <TransactionConfirmed txHash={confirmedTxHash} onDismiss={onDismiss} />}
    </StyledModal>
  )
}

export default SellModal
