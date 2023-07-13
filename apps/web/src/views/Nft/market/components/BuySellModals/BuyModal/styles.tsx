import styled from 'styled-components'
import { Modal, Grid, Flex, Text, Skeleton } from '@pancakeswap/uikit'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { Currency } from '@pancakeswap/sdk'
import { CurrencyLogo } from 'components/Logo'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { multiplyPriceByAmount } from 'utils/prices'
import NumbersIcon from '@mui/icons-material/Numbers'
import { BuyingStage } from './types'

export const stagesWithBackButton = [
  BuyingStage.CONFIRM_REVIEW,
  BuyingStage.CONFIRM_PAYWALL_REVIEW,
  BuyingStage.PAYMENT_CREDIT,
  BuyingStage.CONFIRM_PAYMENT_CREDIT,
  BuyingStage.CASHBACK,
  BuyingStage.CONFIRM_CASHBACK,
  BuyingStage.STAKE,
  BuyingStage.CONFIRM_STAKE,
]

export const stagesWithApproveButton = [
  BuyingStage.CONFIRM_STAKE,
  BuyingStage.CONFIRM_REVIEW,
  BuyingStage.CONFIRM_PAYWALL_REVIEW,
  BuyingStage.CONFIRM_PAYMENT_CREDIT,
]

export const stagesWithConfirmButton = [
  BuyingStage.CONFIRM_CASHBACK,
]

export const StyledModal = styled(Modal)<{ stage: BuyingStage }>`
  & > div:last-child {
    padding: 0;
  }
  & h2:first-of-type {
    ${({ stage, theme }) =>
      stage === BuyingStage.APPROVE_AND_CONFIRM || stage === BuyingStage.CONFIRM
        ? `color: ${theme.colors.textSubtle}`
        : null};
  }
  & svg:first-of-type {
    ${({ stage, theme }) =>
      stage === BuyingStage.APPROVE_AND_CONFIRM || stage === BuyingStage.CONFIRM
        ? `fill: ${theme.colors.textSubtle}`
        : null};
  }
`

export const BorderedBox = styled(Grid)`
  margin: 16px 0;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.default};
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 8px;
`

interface BnbAmountCellProps {
  bnbAmount: number
  isLoading?: boolean
  isInsufficient?: boolean
  currency: Currency
  secondaryCurrency: Currency
}

export const BnbAmountCell: React.FC<BnbAmountCellProps> = ({ bnbAmount, isLoading, isInsufficient, currency, secondaryCurrency }) => {
  const bnbBusdPrice = useBNBBusdPrice()
  if (isLoading) {
    return (
      <Flex flexDirection="column" justifySelf="flex-end">
        <Skeleton width="86px" height="20px" mb="6px" />
        <Skeleton width="86px" height="20px" />
      </Flex>
    )
  }
  const usdAmount = multiplyPriceByAmount(bnbBusdPrice, bnbAmount)
  return (
    <Flex justifySelf="flex-end" flexDirection="column">
      <Flex justifyContent="flex-end">
        <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
        <Text bold color={isInsufficient ? 'failure' : 'text'}>{`${bnbAmount.toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: currency?.decimals,
        })}`}</Text>
      </Flex>
      {secondaryCurrency &&
      <Text small color="textSubtle" textAlign="right">
        {`(${usdAmount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: secondaryCurrency?.decimals,
        })} ${secondaryCurrency?.symbol})`}
      </Text>}
    </Flex>
  )
}

export const NumberCell: React.FC<any> = ({ bnbAmount, currency, currentCurrency, secondaryCurrency, mainToSecondaryCurrencyFactor, price, isLoading, isInsufficient }) => {
  const bnbBusdPrice = useBNBBusdPrice()
  const mprice = getBalanceNumber(price)
  if (isLoading) {
    return (
      <Flex flexDirection="column" justifySelf="flex-end">
        <Skeleton width="86px" height="20px" mb="6px" />
        <Skeleton width="86px" height="20px" />
      </Flex>
    )
  }
  const usdAmount = currency === '#' ? parseFloat(mprice.toString()) : multiplyPriceByAmount(mainToSecondaryCurrencyFactor, bnbAmount)
  return (
    <Flex justifySelf="flex-end" flexDirection="column">
      <Flex justifyContent="flex-end">
        {currency === '#' ? <NumbersIcon/>: <CurrencyLogo currency={currentCurrency} size="24px" style={{ marginRight: '8px' }} />}        <Text bold color={isInsufficient ? 'failure' : 'text'}>{`${currency === '#' && Number.isInteger(bnbAmount) ? bnbAmount :
        bnbAmount.toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 5,
        })}`}</Text>
      </Flex>
      {currency === '#' && usdAmount > 0 &&
        <Text small color="textSubtle" textAlign="right">
        {`(${usdAmount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} ${currentCurrency?.symbol})`}
      </Text>}
      {currency !== '#' && usdAmount > 0 &&
      <Text small color="textSubtle" textAlign="right">
        {`(${usdAmount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} ${secondaryCurrency?.symbol})`}
      </Text>}
    </Flex>
  )
}