import { useRouter } from 'next/router'
import { useState, useMemo } from 'react'
import { InjectedModalProps, Skeleton, useToast } from '@pancakeswap/uikit'
import { AddressZero, MaxUint256 } from '@ethersproject/constants'
import useTheme from 'hooks/useTheme'
import { useTranslation, TranslateFunction } from '@pancakeswap/localization'
import { useWorkspaceCurrency } from 'hooks/Tokens'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { 
  useERC20, 
  useMarketTradesContract, 
  useMarketHelperContract,
  usePaywallMarketTradesContract,
  usePaywallMarketHelperContract,
  useStakeMarketContract, 
  useValuepoolContract, 
  useValuepoolHelperContract 
} from 'hooks/useContract'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { requiresApproval } from 'utils/requiresApproval'
import { ToastDescriptionWithTx } from 'components/Toast'
import { NftToken } from 'state/cancan/types'
import { useGetDiscounted, useGetPaymentCredits, useGetNftFilters } from 'state/cancan/hooks'
import { stagesWithBackButton, stagesWithApproveButton, stagesWithConfirmButton, StyledModal } from './styles'
import ReviewStage from './ReviewStage'
import PaywallReviewStage from './PaywallReviewStage'
import ConfirmStage from '../shared/ConfirmStage'
import ApproveAndConfirmStage from '../shared/ApproveAndConfirmStage'
import { PaymentCurrency, BuyingStage } from './types'
import TransactionConfirmed from '../shared/TransactionConfirmed'
import PaymentCreditStage from './PaymentCreditStage'
import CashbackStage from './CashbackStage'

const modalTitles = (t: TranslateFunction) => ({
  [BuyingStage.REVIEW]: t('Review'),
  [BuyingStage.PAYWALL_REVIEW]: t('Subscription Review'),
  [BuyingStage.STAKE]: t('StakeMarket'),
  [BuyingStage.CASHBACK]: t('Cashback'),
  [BuyingStage.PAYMENT_CREDIT]: t('Payment Credit'),
  [BuyingStage.CONFIRM_REVIEW]: t('Back'),
  [BuyingStage.CONFIRM_PAYWALL_REVIEW]: t('Back'),
  [BuyingStage.CONFIRM_STAKE]: t('Back'),
  [BuyingStage.CONFIRM_CASHBACK]: t('Back'),
  [BuyingStage.CONFIRM_PAYMENT_CREDIT]: t('Back'),
  [BuyingStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

interface BuyModalProps extends InjectedModalProps {
  nftToBuy: NftToken
  variant: 'item' | 'paywall'
}

const BuyModal: React.FC<any> = ({ variant='item', nftToBuy, onDismiss }) => {
  const referrer = useRouter().query.referrer as string
  const collectionId = useRouter().query.collectionAddress as string
  const [stage, setStage] = useState(variant==='paywall' ? BuyingStage.PAYWALL_REVIEW : BuyingStage.REVIEW)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const [tokenId, setTokenId] = useState<any>(null)
  const [credit, setCredit] = useState<any>(0)
  const [userTokenId, setUserTokenId] = useState(0)
  const [identityTokenId, setIdentityTokenId] = useState(0)
  const [merchantIdentityTokenId, setMerchantIdentityTokenId] = useState(0)
  const [requireUpfrontPayment, setRequireUpfrontPayment] = useState(0)
  const [checkRank, setCheckRank] = useState(false)
  const [paymentCurrency, setPaymentCurrency] = useState<PaymentCurrency>(PaymentCurrency.BNB)
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { account } = useWeb3React()
  const {
    mainCurrency,
    secondaryCurrency,
    mainToSecondaryCurrencyFactor,
  } = useWorkspaceCurrency(
    nftToBuy?.ve?.toLowerCase(), 
    nftToBuy?.tFIAT, 
    nftToBuy?.usetFIAT, 
    nftToBuy?.currentAskPrice
  )
  const inputCurrency = mainCurrency?.address
  const bnbContractReader = useERC20(inputCurrency ?? '', false)
  const bnbContractApprover = useERC20(inputCurrency ?? '')
  const { signer: nftMarketContract } = useMarketTradesContract()
  const { signer: paywallMarketTradesContract } = usePaywallMarketTradesContract()
  const { signer: nftMarketHelperContract } = useMarketHelperContract()
  const { signer: paywallMarketHelperContract } = usePaywallMarketHelperContract()
  const callContract = variant === 'paywall' ? paywallMarketTradesContract : nftMarketContract
  const helperContract = variant === 'paywall' ? paywallMarketHelperContract : nftMarketHelperContract
  const p = getDecimalAmount(nftToBuy?.currentAskPrice, 18)
  console.log("cred==========================>", nftToBuy, mainCurrency)
  const { toastSuccess } = useToast()
  const nftFilters = useGetNftFilters(account)
  const [recipient, setRecipient] = useState<string>('')
  const [tokenId2, setTokenId2] = useState<string>('')
  const nftPrice = parseFloat(nftToBuy?.currentAskPrice)
  const paymentCredits = useGetPaymentCredits(nftToBuy?.collection?.id, nftToBuy?.tokenId, account) as any
  const valuepoolContract = useValuepoolContract(recipient)
  const valuepoolHelperContract = useValuepoolHelperContract()
  const userOptions = useMemo(() => { 
    let opt = []
      Object.values(nftFilters)?.map((vals) => {
        Object.keys(vals).map((elt) => {
          const id = variant === 'paywall' ?
          nftToBuy.options?.findIndex((cat) => parseFloat(cat.value) === parseFloat(elt))
          : nftToBuy.options?.findIndex((cat) => cat.element?.toLowerCase() === elt.toLowerCase())
          const count = vals[elt]?.count
          opt = [...opt, ...Array(count).fill(id)]
          return opt
        })
        return null
      })
      return opt
   },[variant, nftToBuy, nftFilters])
  console.log("userOptions=================>", userOptions)
  const { discount, discounted, status } = useGetDiscounted(nftToBuy?.currentSeller, account, nftToBuy?.tokenId, p.toFixed(), userOptions, 0, variant === 'paywall')
  console.log("res111==================>", discounted, userOptions, paymentCredits, discount, Number(discount), Number(discount) - paymentCredits)
  const totalPayment = Math.max(Number(discount ?? 0) - paymentCredits, 0)
  console.log("1res112==================>", totalPayment)

  // BNB - returns ethers.BigNumber
  const { signer: stakeMarketContract} = useStakeMarketContract()

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      return requiresApproval(bnbContractReader, account, callContract.address) ||
      requiresApproval(bnbContractReader, account, stakeMarketContract.address)
      // requiresApproval(bnbContractReader, account, helperContract.address) ||
    },
    // eslint-disable-next-line consistent-return
    onApprove: () => {
      if (paymentCurrency === PaymentCurrency.BNB) {
        return callWithGasPrice(bnbContractApprover, 'approve', [callContract.address, MaxUint256])
      } 
      if (paymentCurrency === PaymentCurrency.WBNB) {
        return callWithGasPrice(bnbContractApprover, 'approve', [stakeMarketContract.address, MaxUint256])
      }
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now make your purchase!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    // eslint-disable-next-line consistent-return
    onConfirm: () => {
      if (stage === BuyingStage.CONFIRM_CASHBACK) {
        const args = [
          nftToBuy?.currentSeller,
          nftToBuy.tokenId,
          !!credit,
          tokenId2
        ]
        console.log("CONFIRM_CASHBACK================>", args)
        return callWithGasPrice(callContract, 'processCashBack', args)
        .catch((err) => console.log("CONFIRM_CASHBACK================>", err))
      }
      if (paymentCurrency === PaymentCurrency.BNB) {
        console.log("BNB================>", [
          nftToBuy?.currentSeller,
          account,
          referrer || AddressZero,
          nftToBuy.tokenId,
          userTokenId,
          identityTokenId,
          userOptions,
        ])
        return callWithGasPrice(callContract, 'buyWithContract', [
          nftToBuy?.currentSeller,
          account,
          referrer || AddressZero,
          nftToBuy.tokenId,
          userTokenId,
          identityTokenId,
          userOptions,
        ])
        .catch((err) => console.log("BNB================>", err))
      } 
      if (paymentCurrency === PaymentCurrency.WBNB) {
        // [amountPayable,amountReceivable,periodPayable,periodReceivable,waitingPeriod,startPayable,startReceivable]
        const args = [
          [nftToBuy.ve,inputCurrency, callContract.address,referrer || AddressZero, nftToBuy?.currentSeller, nftToBuy?.currentSeller],
          nftToBuy.tokenId,
          collectionId,
          userOptions,
          userTokenId,
          identityTokenId,
          [0,totalPayment.toString(),0,0,0,0,0],
          (!!requireUpfrontPayment || !!nftToBuy.requireUpfrontPayment)
        ]
        console.log("WBNB=================>", args)
        return callWithGasPrice(stakeMarketContract, 'createStake', args)
        .catch((err) => console.log("WBNB=================>", err))
      }
      if (paymentCurrency === 2) {
        const contract = !checkRank ?  valuepoolContract : valuepoolHelperContract
        const method = !checkRank ? 'pickRank' : 'checkRank'
        const args = !checkRank ? [tokenId, identityTokenId] : [
          recipient,
          nftToBuy?.currentSeller,
          referrer || AddressZero,
          nftToBuy.tokenId,
          userOptions,
          [userTokenId, identityTokenId, merchantIdentityTokenId, tokenId, totalPayment.toString()]
        ]
        console.log("3=================>", contract, method, args)
        return callWithGasPrice(contract, method, args)
        .catch((err) => console.log("3=================>", err))
      }
    },
    onSuccess: async ({ receipt }) => {
      setConfirmedTxHash(receipt.transactionHash)
      setStage(BuyingStage.TX_CONFIRMED)
      toastSuccess(
        t('Your purchase has been successfully processed'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
  })

  const continueToNextStage = () => {
    switch (stage) {
      case BuyingStage.STAKE:
        setStage(BuyingStage.CONFIRM_STAKE)
        break
      case BuyingStage.REVIEW:
        setStage(BuyingStage.CONFIRM_REVIEW)
        break
      case BuyingStage.PAYWALL_REVIEW:
        setStage(BuyingStage.CONFIRM_PAYWALL_REVIEW)
        break
      case BuyingStage.PAYMENT_CREDIT:
        setStage(BuyingStage.CONFIRM_PAYMENT_CREDIT)
        break
      case BuyingStage.CASHBACK:
        setStage(BuyingStage.CONFIRM_CASHBACK)
        break
      default:
        break
    }
  }

  const continueToPaymentCreditStage = () => {
    setStage(BuyingStage.PAYMENT_CREDIT)
  }

  const continueToCashbackStage = () => {
    setStage(BuyingStage.CASHBACK)
  }

  const goBack = () => {
    switch (stage) {
      case BuyingStage.CONFIRM_STAKE:
        setStage(BuyingStage.STAKE)
        break
      case BuyingStage.CONFIRM_REVIEW:
        setStage(BuyingStage.REVIEW)
        break
      case BuyingStage.CONFIRM_PAYWALL_REVIEW:
        setStage(BuyingStage.PAYWALL_REVIEW)
        break
      case BuyingStage.CONFIRM_PAYMENT_CREDIT:
        setStage(BuyingStage.PAYMENT_CREDIT)
        break
      case BuyingStage.CONFIRM_CASHBACK:
        setStage(BuyingStage.CASHBACK)
        break
      default:
        setStage(BuyingStage.REVIEW)
        break
    }
  }

  const showBackButton = stagesWithBackButton.includes(stage) && !isConfirming && !isApproving

  return (
    <StyledModal
      title={modalTitles(t)[stage]}
      stage={stage}
      onDismiss={onDismiss}
      onBack={showBackButton ? goBack : null}
      headerBackground={theme.colors.gradientCardHeader}
    >
      {(stage === BuyingStage.REVIEW || stage === BuyingStage.PAYWALL_REVIEW) && (
        <ReviewStage
          isPaywall={variant==='paywall'}
          status={status}
          nftToBuy={nftToBuy}
          checkRank={checkRank}
          userTokenId={userTokenId}
          setUserTokenId={setUserTokenId}
          identityTokenId={identityTokenId}
          setIdentityTokenId={setIdentityTokenId}
          merchantIdentityTokenId={merchantIdentityTokenId}
          setMerchantIdentityTokenId={setMerchantIdentityTokenId}
          requireUpfrontPayment={requireUpfrontPayment}
          setRequireUpfrontPayment={setRequireUpfrontPayment}
          paymentCurrency={paymentCurrency}
          setPaymentCurrency={setPaymentCurrency}
          paymentCredits={paymentCredits}
          discounted={discounted}
          totalPayment={totalPayment}
          nftPrice={nftPrice}
          recipient={recipient}
          setRecipient={setRecipient}
          tokenId={tokenId}
          setTokenId={setTokenId}
          mainCurrency={mainCurrency}
          setCheckRank={setCheckRank}
          secondaryCurrency={secondaryCurrency}
          mainToSecondaryCurrencyFactor={mainToSecondaryCurrencyFactor}
          continueToNextStage={continueToNextStage}
          continueToCashbackStage={continueToCashbackStage}
          continueToPaymentCreditStage={continueToPaymentCreditStage} 
        />
      )}
      {stage === BuyingStage.PAYMENT_CREDIT && (
        <PaymentCreditStage 
          nftToBuy={nftToBuy}
          isPaywall={variant === 'paywall'}
          collectionId={collectionId}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === BuyingStage.CASHBACK && (
        <CashbackStage 
          nftToBuy={nftToBuy}
          collectionId={collectionId}
          credit={credit}
          tokenId={tokenId2}
          setCredit={setCredit}
          setTokenId={setTokenId2}
          continueToNextStage={continueToNextStage}
        />
      )}
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
      {stage === BuyingStage.TX_CONFIRMED && <TransactionConfirmed txHash={confirmedTxHash} calendarEnabled taskEnabled onDismiss={onDismiss} />}
    </StyledModal>
  )
}

export default BuyModal