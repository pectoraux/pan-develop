import styled from 'styled-components'
import { Modal, Grid, Flex, Text, Skeleton, Box, Input } from '@pancakeswap/uikit'
import { Currency } from '@pancakeswap/sdk'
import { CurrencyLogo } from 'components/Logo'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { multiplyPriceByAmount } from 'utils/prices'
import NumbersIcon from '@mui/icons-material/Numbers'
import { BuyingStage, LockStage } from './types'

export const StyledModal = styled(Modal)<{ stage: LockStage }>`
  & > div:last-child {
    padding: 0;
  }
`

export const stagesWithApproveButton = [
  LockStage.CONFIRM_DEPOSIT,
  LockStage.CONFIRM_PAY,
  LockStage.CONFIRM_ADD_APPROVAL,
  LockStage.CONFIRM_ADD_BALANCE,
]

export const stagesWithConfirmButton = [
  LockStage.CONFIRM_DELETE_APPROVAL,
  LockStage.CONFIRM_ADMIN_WITHDRAW,
  LockStage.CONFIRM_DELETE,
  LockStage.CONFIRM_DELETE_ARP,
  LockStage.CONFIRM_UPDATE,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_MINT_NOTE,
  LockStage.CONFIRM_SPLIT_SHARES,
  LockStage.CONFIRM_CLAIM,
  LockStage.CONFIRM_UPDATE_PROTOCOL,
  LockStage.CONFIRM_MINT_FT,
  LockStage.CONFIRM_UPDATE_ACCOUNT,
  LockStage.CONFIRM_COSIGNS,
  LockStage.CONFIRM_ADD_PAID_DAYS,
  LockStage.CONFIRM_UPDATE_COSIGN,
  LockStage.CONFIRM_APPLY,
  LockStage.CONFIRM_ACCEPT,
  LockStage.CONFIRM_START_LITIGATIONS,
  LockStage.CONFIRM_DELETE_BALANCE,
  LockStage.CONFIRM_APPLY_RESULTS,
  LockStage.CONFIRM_DELETE_BOUNTY,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_CLEAN_UP_BALANCES,
  LockStage.CONFIRM_CLEAN_UP_APPROVALS,
  LockStage.CONFIRM_ADD_RECURRING_BALANCE,
]

export const stagesWithBackButton = [
  LockStage.ADD_RECURRING_BALANCE,
  LockStage.CLEAN_UP_APPROVALS,
  LockStage.CLEAN_UP_BALANCES,
  LockStage.CONFIRM_CLEAN_UP_BALANCES,
  LockStage.CONFIRM_CLEAN_UP_APPROVALS,
  LockStage.CONFIRM_ADD_RECURRING_BALANCE,
  LockStage.UPDATE_OWNER,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.APPLY,
  LockStage.ADD_APPROVAL,
  LockStage.DELETE_APPROVAL,
  LockStage.CLAIM,
  LockStage.CONFIRM_ADD_APPROVAL,
  LockStage.CONFIRM_DELETE_APPROVAL,
  LockStage.CONFIRM_CLAIM,
  LockStage.START_LITIGATIONS,
  LockStage.CONFIRM_START_LITIGATIONS,
  LockStage.CONFIRM_APPLY,
  LockStage.CONFIRM_ACCEPT,
  LockStage.UPDATE,
  LockStage.DEPOSIT,
  LockStage.WITHDRAW,
  LockStage.MINT_NOTE,
  LockStage.SPLIT_SHARES,
  LockStage.CLAIM_NOTE,
  LockStage.UPLOAD,
  LockStage.UPDATE_ARP,
  LockStage.PAY,
  LockStage.ADMIN_WITHDRAW,
  LockStage.DELETE,
  LockStage.DELETE_ARP,
  LockStage.UPDATE_PROTOCOL,
  LockStage.MINT_FT,
  LockStage.UPDATE_ACCOUNT,
  LockStage.COSIGNS,
  LockStage.ADD_PAID_DAYS,
  LockStage.UPDATE_COSIGN,
  LockStage.ADD_BALANCE,
  LockStage.APPLY_RESULTS,
  LockStage.DELETE_BOUNTY,
  LockStage.DELETE_BALANCE,
  LockStage.CONFIRM_DELETE_BALANCE,
  LockStage.CONFIRM_APPLY_RESULTS,
  LockStage.CONFIRM_ADD_BALANCE,
  LockStage.CONFIRM_ADD_PAID_DAYS,
  LockStage.CONFIRM_MINT_FT,
  LockStage.CONFIRM_PAY,
  LockStage.CONFIRM_UPDATE_PROTOCOL,
  LockStage.CONFIRM_UPDATE_ARP,
  LockStage.CONFIRM_UPDATE_ACCOUNT,
  LockStage.CONFIRM_ADMIN_WITHDRAW,
  LockStage.CONFIRM_COSIGNS,
  LockStage.CONFIRM_DELETE,
  LockStage.CONFIRM_DELETE_ARP,
  LockStage.CONFIRM_UPDATE,
  LockStage.CONFIRM_DEPOSIT,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_MINT_NOTE,
  LockStage.CONFIRM_SPLIT_SHARES,
  LockStage.CONFIRM_CLAIM_NOTE,
  LockStage.CONFIRM_UPDATE_COSIGN,
  LockStage.CONFIRM_DELETE_BOUNTY,

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
  console.log("secondaryCurrency===========>", secondaryCurrency)
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
  const bnbBusdPrice = useBNBBusdPrice()
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