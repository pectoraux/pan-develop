import styled from 'styled-components'
import { CurrencyLogo } from 'components/Logo'
import { Modal, Box, Flex, Text, BinanceIcon, Input } from '@pancakeswap/uikit'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { multiplyPriceByAmount } from 'utils/prices'
import { SellingStage } from './types'

export const stagesWithBackButton = [
  SellingStage.CONFIRM_ADD_LOCATION,
  SellingStage.CONFIRM_ADD_LOCATION1,
  SellingStage.CONFIRM_CREATE_ASK_ORDER,
  SellingStage.MODIFY_CONTACT,
  SellingStage.CONFIRM_MODIFY_CONTACT,
  SellingStage.SET_PRICE,
  SellingStage.ADJUST_PRICE,
  SellingStage.ADJUST_OPTIONS,
  SellingStage.CONFIRM_ADJUST_OPTIONS,
  SellingStage.APPROVE_AND_CONFIRM_SELL,
  SellingStage.CONFIRM_ADJUST_PRICE,
  SellingStage.REMOVE_FROM_MARKET,
  SellingStage.CONFIRM_REMOVE_FROM_MARKET,
  SellingStage.TRANSFER,
  SellingStage.CONFIRM_TRANSFER,
  SellingStage.UPDATE_IDENTITY_REQUIREMENTS,
  SellingStage.CONFIRM_UPDATE_IDENTITY_REQUIREMENTS,
  SellingStage.UPDATE_BURN_FOR_CREDIT_TOKENS,
  SellingStage.CONFIRM_UPDATE_BURN_FOR_CREDIT_TOKENS,
  SellingStage.UPDATE_DISCOUNTS_AND_CASHBACKS,
  SellingStage.CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS,
  SellingStage.REINITIALIZE_IDENTITY_LIMITS,
  SellingStage.CONFIRM_REINITIALIZE_IDENTITY_LIMITS,
  SellingStage.REINITIALIZE_DISCOUNTS_LIMITS,
  SellingStage.CONFIRM_REINITIALIZE_DISCOUNTS_LIMITS,
  SellingStage.REINITIALIZE_CASHBACK_LIMITS,
  SellingStage.CONFIRM_REINITIALIZE_CASHBACK_LIMITS,
  SellingStage.ADD_USERS_PAYMENT_CREDIT,
  SellingStage.CONFIRM_ADD_USERS_PAYMENT_CREDIT,

  SellingStage.CLAIM_PENDING_REVENUE,
  SellingStage.CONFIRM_CLAIM_PENDING_REVENUE,
  SellingStage.FUND_PENDING_REVENUE,
  SellingStage.CONFIRM_FUND_PENDING_REVENUE,
  SellingStage.TRANSFER_DUE_TO_NOTE,
  SellingStage.CONFIRM_TRANSFER_DUE_TO_NOTE,
  SellingStage.MODIFY_COLLECTION,
  SellingStage.CONFIRM_MODIFY_COLLECTION,
  SellingStage.MODIFY_CONTACT,
  SellingStage.UPDATE_AUDITORS,
  SellingStage.CONFIRM_UPDATE_AUDITORS,

  SellingStage.ADD_TASK,
  SellingStage.UPLOAD_MEDIA,
  SellingStage.ADD_LOCATION,
  SellingStage.ADD_LOCATION1,
  SellingStage.ADD_LOCATION2,
  SellingStage.CREATE_PAYWALL,
  SellingStage.CREATE_PAYWALL1,
  SellingStage.CREATE_PAYWALL2,
  SellingStage.CREATE_ASK_ORDER,
  SellingStage.CONFIRM_CREATE_PAYWALL1,
  SellingStage.CONFIRM_CREATE_PAYWALL2,
]

export const stagesWithApproveButton = [
  SellingStage.CONFIRM_FUND_PENDING_REVENUE
]

export const stagesWithConfirmButton = [
  SellingStage.CONFIRM_CLAIM_PENDING_REVENUE,
  SellingStage.CONFIRM_TRANSFER_DUE_TO_NOTE,
  SellingStage.CONFIRM_MODIFY_COLLECTION,
  SellingStage.CONFIRM_UPDATE_AUDITORS,
  SellingStage.CONFIRM_CREATE_ASK_ORDER,
  SellingStage.CONFIRM_CREATE_PAYWALL,
  SellingStage.CONFIRM_CREATE_PAYWALL1,
  SellingStage.CONFIRM_CREATE_PAYWALL2,
  SellingStage.CONFIRM_ADD_LOCATION,
  SellingStage.CONFIRM_ADD_LOCATION1,
  SellingStage.CONFIRM_ADD_LOCATION2,
  SellingStage.CONFIRM_MODIFY_CONTACT,
  SellingStage.CONFIRM_ADJUST_OPTIONS,
]

export const StyledModal = styled(Modal)<{ stage: SellingStage, expand?: boolean }>`
  width: ${({ expand }) => (!expand ? '360px' : '960px')};
  & > div:last-child {
    padding: 0;
  }
  & h2:first-of-type {
    ${({ stage, theme }) => (stagesWithBackButton.includes(stage) ? `color: ${theme.colors.textSubtle}` : null)};
  }
  & svg:first-of-type {
    ${({ stage, theme }) => (stagesWithBackButton.includes(stage) ? `fill: ${theme.colors.textSubtle}` : null)};
  }
`

export const GreyedOutContainer = styled(Box)`
  background-color: ${({ theme }) => theme.colors.dropdown};
  padding: 16px;
`

export const RightAlignedInput = styled(Input)`
  text-align: right;
`

interface BnbAmountCellProps {
  bnbAmount: number
}

export const BnbAmountCell: React.FC<BnbAmountCellProps> = ({ bnbAmount }) => {
  const bnbBusdPrice = useBNBBusdPrice()
  if (!bnbAmount || bnbAmount === 0) {
    return (
      <Flex alignItems="center" justifyContent="flex-end">
        <BinanceIcon width={16} height={16} mr="4px" />
        <Text bold mr="4px">
          -
        </Text>
      </Flex>
    )
  }
  const usdAmount = multiplyPriceByAmount(bnbBusdPrice, bnbAmount)
  return (
    <Flex alignItems="center" justifyContent="flex-end">
      <BinanceIcon width={16} height={16} mr="4px" />
      <Text bold mr="4px">{`${bnbAmount.toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })}`}</Text>
      <Text small color="textSubtle" textAlign="right">
        {`($${usdAmount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })})`}
      </Text>
    </Flex>
  )
}

interface FeeAmountCellProps {
  bnbAmount: number
  creatorFee: number
  tradingFee: number
}

export const FeeAmountCell: React.FC<any> = ({ bnbAmount, currency, tradingFee }) => {
  if (!bnbAmount || bnbAmount === 0) {
    return (
      <Flex alignItems="center" justifyContent="flex-end">
        <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '4px' }} />
        {/* <BinanceIcon width={16} height={16} mr="4px" /> */}
        <Text bold mr="4px">
          -
        </Text>
      </Flex>
    )
  }

  const totalFee = tradingFee
  // const totalFeeAsDecimal = totalFee / 100
  // const feeAmount = bnbAmount * totalFeeAsDecimal
  return (
    <Flex alignItems="center" justifyContent="flex-end">
      <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '4px' }} />
      <Text bold mr="4px">{`${bnbAmount.toLocaleString(undefined, {
        minimumFractionDigits: 4,
        maximumFractionDigits: 6,
      })}`}</Text>
      <Text small color="textSubtle" textAlign="right">
        ({totalFee}%)
      </Text>
    </Flex>
  )
}
