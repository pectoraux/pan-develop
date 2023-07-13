import styled from 'styled-components'
import { Modal, Grid, Flex, Text, Skeleton, Box, Input } from '@pancakeswap/uikit'
import { Currency } from '@pancakeswap/sdk'
import { CurrencyLogo } from 'components/Logo'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { multiplyPriceByAmount } from 'utils/prices'
import NumbersIcon from '@mui/icons-material/Numbers'
import { LockStage } from './types'

export const StyledModal = styled(Modal)<{ stage: LockStage }>`
  & > div:last-child {
    padding: 0;
  }
  & h2:first-of-type {
    ${({ stage, theme }) =>
      stage === LockStage.APPROVE_AND_CONFIRM || stage === LockStage.CONFIRM
        ? `color: ${theme.colors.textSubtle}`
        : null};
  }
  & svg:first-of-type {
    ${({ stage, theme }) =>
      stage === LockStage.APPROVE_AND_CONFIRM || stage === LockStage.CONFIRM
        ? `fill: ${theme.colors.textSubtle}`
        : null};
  }
`

export const stagesWithApproveButton = [
  LockStage.CONFIRM_PAY,
]

export const stagesWithConfirmButton = [
  LockStage.CONFIRM_FOLLOW,
  LockStage.CONFIRM_DELETE,
  LockStage.CONFIRM_UPDATE_BOUNTY,
  LockStage.CONFIRM_UPDATE_LATE_DAYS,
  LockStage.CONFIRM_UNFOLLOW,
  LockStage.CONFIRM_ADD_ACCOUNT,
  LockStage.CONFIRM_ADD_ACCOUNT2,
  LockStage.CONFIRM_ADD_ACCOUNT_FROM_PROOF,
  LockStage.CONFIRM_UPDATE_COLLECTION_ID,
  LockStage.CONFIRM_UPDATE_BOUNTY,
  LockStage.CONFIRM_UPDATE_SSID,
  LockStage.CONFIRM_UPDATE_BADGE_ID,
  LockStage.CONFIRM_UPDATE_BLACKLIST,
  LockStage.CONFIRM_BROADCAST,
  LockStage.CONFIRM_CLAIM_REVENUE,
  LockStage.CONFIRM_REMOVE_ACCOUNT,
  LockStage.CONFIRM_CREATE,
]

export const stagesWithBackButton = [
  LockStage.FOLLOW,
  LockStage.PAY,
  LockStage.UPDATE_LATE_DAYS,
  LockStage.UNFOLLOW,
  LockStage.UPDATE_BOUNTY,
  LockStage.ADD_ACCOUNT,
  LockStage.ADD_ACCOUNT_FROM_PROOF,
  LockStage.UPDATE_COLLECTION_ID,
  LockStage.DELETE,
  LockStage.UPDATE_BADGE_ID,
  LockStage.UPDATE_BLACKLIST,
  LockStage.CLAIM_REVENUE,
  LockStage.BROADCAST,
  LockStage.REMOVE_ACCOUNT,
  LockStage.CONFIRM_FOLLOW,
  LockStage.CONFIRM_DELETE,
  LockStage.CONFIRM_PAY,
  LockStage.CONFIRM_CREATE,
  LockStage.CONFIRM_UPDATE_BOUNTY,
  LockStage.CONFIRM_UPDATE_LATE_DAYS,
  LockStage.CONFIRM_UNFOLLOW,
  LockStage.CONFIRM_ADD_ACCOUNT,
  LockStage.CONFIRM_ADD_ACCOUNT2,
  LockStage.CONFIRM_ADD_ACCOUNT_FROM_PROOF,
  LockStage.CONFIRM_UPDATE_COLLECTION_ID,
  LockStage.CONFIRM_UPDATE_BOUNTY,
  LockStage.CONFIRM_UPDATE_SSID,
  LockStage.CONFIRM_UPDATE_BADGE_ID,
  LockStage.CONFIRM_UPDATE_BLACKLIST,
  LockStage.CONFIRM_BROADCAST,
  LockStage.CONFIRM_CLAIM_REVENUE,
  LockStage.CONFIRM_REMOVE_ACCOUNT,
]

export const Divider = styled.div`
  margin: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

export const GreyedOutContainer = styled(Box)`
  background-color: ${({ theme }) => theme.colors.dropdown};
  padding: 16px;
`

export const RightAlignedInput = styled(Input)`
  text-align: right;
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
          maximumFractionDigits: 5,
        })}`}</Text>
      </Flex>
      <Text small color="textSubtle" textAlign="right">
        {`(${usdAmount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} ${secondaryCurrency?.symbol})`}
      </Text>
    </Flex>
  )
}

export const NumberCell: React.FC<any> = ({ bnbAmount, currency, currentCurrency, secondaryCurrency, mainToSecondaryCurrencyFactor, price, isLoading, isInsufficient }) => {
  if (isLoading) {
    return (
      <Flex flexDirection="column" justifySelf="flex-end">
        <Skeleton width="86px" height="20px" mb="6px" />
        <Skeleton width="86px" height="20px" />
      </Flex>
    )
  }
  const usdAmount = currency === '#' ? parseFloat(price) : multiplyPriceByAmount(mainToSecondaryCurrencyFactor, bnbAmount)
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