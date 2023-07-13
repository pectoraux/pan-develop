import styled from 'styled-components'
import { Modal, Grid, Flex, Text, Skeleton, Box, Input } from '@pancakeswap/uikit'
import { Currency } from '@pancakeswap/sdk'
import { CurrencyLogo } from 'components/Logo'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { multiplyPriceByAmount } from 'utils/prices'
import NumbersIcon from '@mui/icons-material/Numbers'
import { BuyingStage, LockStage } from './types'

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

export const stagesWithApproveButton = [
  LockStage.CONFIRM_DEPOSIT,
  LockStage.CONFIRM_PAY,
  LockStage.CONFIRM_MERGE,
]

export const stagesWithConfirmButton = [
  LockStage.CONFIRM_NOTIFY_PAYMENT,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_UPDATE_VP,
  LockStage.CONFIRM_ADMIN_WITHDRAW,
  LockStage.CONFIRM_DELETE,
  LockStage.CONFIRM_DELETE_VP,
  LockStage.CONFIRM_UPDATE,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_MINT_NOTE,
  LockStage.CONFIRM_SPLIT_SHARES,
  LockStage.CONFIRM_CLAIM_NOTE,
  LockStage.CONFIRM_UPDATE_PROTOCOL,
  LockStage.CONFIRM_UPDATE_ACCOUNT,
  LockStage.CONFIRM_COSIGNS,
  LockStage.CONFIRM_CREDITOR,
  LockStage.CONFIRM_UPDATE_COSIGN,
  LockStage.CONFIRM_ADD_SPONSORS,
  LockStage.CONFIRM_REMOVE_SPONSORS,
  LockStage.CONFIRM_VOTE_UP,
  LockStage.CONFIRM_VOTE_DOWN,
  LockStage.CONFIRM_RESET,
  LockStage.CONFIRM_CREATE_LOCK,
  LockStage.CONFIRM_ADMINS,
  LockStage.CONFIRM_REIMBURSE_BNPL,
  LockStage.CONFIRM_REIMBURSE,
  LockStage.CONFIRM_ADD_CREDIT,
  LockStage.CONFIRM_UPDATE_MERCHANT_IDENTITY_PROOFS,
  LockStage.CONFIRM_NOTIFY_LOAN,
  LockStage.CONFIRM_UPDATE_USER_IDENTITY_PROOFS,
  LockStage.CONFIRM_PICK_RANK,
  LockStage.CONFIRM_EXECUTE_NEXT_PURCHASE,
  LockStage.CONFIRM_UPDATE_DESCRIPTION,
  LockStage.CONFIRM_UPDATE_TAX_CONTRACT,
  LockStage.CONFIRM_UPDATE_MARKETPLACE,
  LockStage.CONFIRM_CHECK_RANK,
  LockStage.CONFIRM_UPDATE_TRUSTWORTHY_AUDITORS,
  LockStage.CONFIRM_UPDATE_TRUSTWORTHY_MERCHANTS,
  LockStage.CONFIRM_UPDATE_BLACKLISTED_MERCHANTS,
  LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT,
  LockStage.CONFIRM_UPDATE_MEDIA,
  LockStage.CONFIRM_UPDATE_MINIMUM_LOCK,
  LockStage.CONFIRM_UPDATE_VOTING_PARAMETERS,
  LockStage.CONFIRM_UPDATE_VOTING_BLACKLIST,
  LockStage.CONFIRM_SWITCH_POOL,
  LockStage.CONFIRM_UPDATE_COLLECTION_ID,
]

export const stagesWithBackButton = [
  LockStage.SWITCH_POOL,
  LockStage.UPDATE_COLLECTION_ID,
  LockStage.CONFIRM_SWITCH_POOL,
  LockStage.CONFIRM_UPDATE_COLLECTION_ID,
  LockStage.UPDATE_MINIMUM_LOCK,
  LockStage.UPDATE_VOTING_PARAMETERS,
  LockStage.UPDATE_VOTING_BLACKLIST,
  LockStage.CONFIRM_UPDATE_MINIMUM_LOCK,
  LockStage.CONFIRM_UPDATE_VOTING_PARAMETERS,
  LockStage.CONFIRM_UPDATE_VOTING_BLACKLIST,
  LockStage.UPDATE_MEDIA,
  LockStage.CONFIRM_UPDATE_MEDIA,
  LockStage.UPDATE_EXCLUDED_CONTENT,
  LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT,
  LockStage.UPDATE_BLACKLISTED_MERCHANTS,
  LockStage.CONFIRM_UPDATE_BLACKLISTED_MERCHANTS,
  LockStage.UPDATE_TRUSTWORTHY_MERCHANTS,
  LockStage.CONFIRM_UPDATE_TRUSTWORTHY_MERCHANTS,
  LockStage.UPDATE_TRUSTWORTHY_AUDITORS,
  LockStage.CONFIRM_UPDATE_TRUSTWORTHY_AUDITORS,
  LockStage.CHECK_RANK,
  LockStage.CONFIRM_CHECK_RANK,
  LockStage.UPDATE_MARKETPLACE,
  LockStage.CONFIRM_UPDATE_MARKETPLACE,
  LockStage.UPDATE_TAX_CONTRACT,
  LockStage.CONFIRM_UPDATE_TAX_CONTRACT,
  LockStage.UPDATE_DESCRIPTION,
  LockStage.CONFIRM_UPDATE_DESCRIPTION,
  LockStage.CONFIRM_EXECUTE_NEXT_PURCHASE,
  LockStage.PICK_RANK,
  LockStage.CONFIRM_PICK_RANK,
  LockStage.UPDATE_USER_IDENTITY_PROOFS,
  LockStage.CONFIRM_UPDATE_USER_IDENTITY_PROOFS,
  LockStage.NOTIFY_LOAN,
  LockStage.CONFIRM_NOTIFY_LOAN,
  LockStage.UPDATE_MERCHANT_IDENTITY_PROOFS,
  LockStage.CONFIRM_UPDATE_MERCHANT_IDENTITY_PROOFS,
  LockStage.ADD_CREDIT,
  LockStage.CONFIRM_ADD_CREDIT,
  LockStage.REIMBURSE,
  LockStage.CONFIRM_REIMBURSE,
  LockStage.REIMBURSE_BNPL,
  LockStage.CONFIRM_REIMBURSE_BNPL,
  LockStage.UPDATE_OWNER,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.MERGE,
  LockStage.UPDATE,
  LockStage.DEPOSIT,
  LockStage.WITHDRAW,
  LockStage.CREDITOR,
  LockStage.SPLIT_SHARES,
  LockStage.CLAIM_NOTE,
  LockStage.UPLOAD,
  LockStage.UPDATE_VP,
  LockStage.PAY,
  LockStage.ADMIN_WITHDRAW,
  LockStage.DELETE,
  LockStage.DELETE_VP,
  LockStage.UPDATE_PROTOCOL,
  LockStage.UPDATE_ACCOUNT,
  LockStage.COSIGNS,
  LockStage.ADMINS,
  LockStage.CONFIRM_ADMINS,
  LockStage.HISTORY,
  LockStage.ADD_PAID_DAYS,
  LockStage.UPDATE_COSIGN,
  LockStage.VOTE_UP,
  LockStage.VOTE_DOWN,
  LockStage.RESET,
  LockStage.NOTIFY_PAYMENT,
  LockStage.CONFIRM_NOTIFY_PAYMENT,
  LockStage.CONFIRM_RESET,
  LockStage.CONFIRM_VOTE_UP,
  LockStage.CONFIRM_VOTE_DOWN,
  LockStage.REMOVE_SPONSORS,
  LockStage.CREATE_LOCK,
  LockStage.CONFIRM_CREATE_LOCK,
  LockStage.CONFIRM_ADD_SPONSORS,
  LockStage.CONFIRM_REMOVE_SPONSORS,
  LockStage.CONFIRM_CREDITOR,
  LockStage.CONFIRM_MERGE,
  LockStage.CONFIRM_PAY,
  LockStage.CONFIRM_UPDATE_PROTOCOL,
  LockStage.CONFIRM_UPDATE_VP,
  LockStage.CONFIRM_UPDATE_ACCOUNT,
  LockStage.CONFIRM_ADMIN_WITHDRAW,
  LockStage.CONFIRM_COSIGNS,
  LockStage.CONFIRM_DELETE,
  LockStage.CONFIRM_DELETE_VP,
  LockStage.CONFIRM_UPDATE,
  LockStage.CONFIRM_DEPOSIT,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_MINT_NOTE,
  LockStage.CONFIRM_SPLIT_SHARES,
  LockStage.CONFIRM_CLAIM_NOTE,
  LockStage.CONFIRM_UPDATE_COSIGN,
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