import styled from 'styled-components'
import { Modal, Grid, Box, Input } from '@pancakeswap/uikit'
import { LockStage } from './types'

export const StyledModal = styled(Modal)<{ stage: LockStage }>`
  & > div:last-child {
    padding: 0;
  }
`

export const stagesWithApproveButton = [
  LockStage.CONFIRM_UPDATE_AUTOCHARGE,
  LockStage.CONFIRM_ADD_BALANCE,
]

export const stagesWithConfirmButton = [
  LockStage.CONFIRM_REMOVE_BALANCE,
  LockStage.CONFIRM_SPONSOR_TAG,
  LockStage.CONFIRM_UPDATE_CATEGORY,
  LockStage.CONFIRM_UPDATE_CAP,
  LockStage.CONFIRM_DELETE,
  LockStage.CONFIRM_BURN,
  LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT,
  LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTE,
  LockStage.CONFIRM_DELETE_PROTOCOL,
  LockStage.CONFIRM_UPDATE_PROTOCOL,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_UPDATE_PARAMETERS,
  LockStage.CONFIRM_PAY,
  LockStage.CONFIRM_UPDATE_URI_GENERATOR,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_UPDATE_BOUNTY_ID,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_VOTE,
  LockStage.CONFIRM_MINT_EXTRA,
  LockStage.CONFIRM_UPDATE_MINT_INFO,
  LockStage.CONFIRM_AUTOCHARGE,
  LockStage.CONFIRM_UPDATE_ADMIN,
  LockStage.CONFIRM_UPDATE_USER_PERCENTILES,
  LockStage.CONFIRM_UPDATE_PAID_PAYABLE,
  LockStage.CONFIRM_UPDATE_DISCOUNT_DIVISOR,
  LockStage.CONFIRM_UPDATE_PENALTY_DIVISOR,
  LockStage.CONFIRM_NOTIFY_DEBT,
  LockStage.CONFIRM_NOTIFY_REWARDS,
  LockStage.CONFIRM_TRANSFER_TO_NOTE_PAYABLE,
  LockStage.CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE,
  LockStage.CONFIRM_CLAIM_NOTE,
  LockStage.CONFIRM_UPDATE_DUE_BEFORE_PAYABLE,
  LockStage.CONFIRM_UPDATE_TAG_REGISTRATION,
  LockStage.CONFIRM_UPDATE_TAX_CONTRACT,
  LockStage.CONFIRM_UPDATE_PROFILE_ID,
  LockStage.CONFIRM_UPDATE_USER_OWNER,
  LockStage.CONFIRM_UPDATE_TOKEN_ID,
  LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA,
]

export const stagesWithBackButton = [
  LockStage.ADD_BALANCE,
  LockStage.REMOVE_BALANCE,
  LockStage.CONFIRM_ADD_BALANCE,
  LockStage.CONFIRM_REMOVE_BALANCE,
  LockStage.UPDATE_SPONSOR_MEDIA,
  LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA,
  LockStage.UPDATE_TOKEN_ID,
  LockStage.CONFIRM_UPDATE_TOKEN_ID,
  LockStage.UPDATE_USER_OWNER,
  LockStage.CONFIRM_UPDATE_USER_OWNER,
  LockStage.UPDATE_PROFILE_ID,
  LockStage.CONFIRM_UPDATE_PROFILE_ID,
  LockStage.UPDATE_TAX_CONTRACT,
  LockStage.CONFIRM_UPDATE_TAX_CONTRACT,
  LockStage.UPDATE_TAG_REGISTRATION,
  LockStage.CONFIRM_UPDATE_TAG_REGISTRATION,
  LockStage.UPDATE_DUE_BEFORE_PAYABLE,
  LockStage.CONFIRM_UPDATE_DUE_BEFORE_PAYABLE,
  LockStage.CLAIM_NOTE,
  LockStage.CONFIRM_CLAIM_NOTE,
  LockStage.TRANSFER_TO_NOTE_PAYABLE,
  LockStage.CONFIRM_TRANSFER_TO_NOTE_PAYABLE,
  LockStage.TRANSFER_TO_NOTE_RECEIVABLE,
  LockStage.CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE,
  LockStage.NOTIFY_REWARDS,
  LockStage.CONFIRM_NOTIFY_REWARDS,
  LockStage.NOTIFY_DEBT,
  LockStage.CONFIRM_NOTIFY_DEBT,
  LockStage.UPDATE_DISCOUNT_DIVISOR,
  LockStage.CONFIRM_UPDATE_DISCOUNT_DIVISOR,
  LockStage.UPDATE_PENALTY_DIVISOR,
  LockStage.CONFIRM_UPDATE_PENALTY_DIVISOR,
  LockStage.UPDATE_ADMIN,
  LockStage.CONFIRM_UPDATE_ADMIN,
  LockStage.UPDATE_CAP,
  LockStage.CONFIRM_UPDATE_CAP,
  LockStage.DELETE,
  LockStage.UPDATE_MINT_INFO,
  LockStage.DELETE_PROTOCOL,
  LockStage.UPDATE_PROTOCOL,
  LockStage.AUTOCHARGE,
  LockStage.CONFIRM_AUTOCHARGE,
  LockStage.WITHDRAW,
  LockStage.SPONSOR_TAG,
  LockStage.UPDATE_PARAMETERS,
  LockStage.PAY,
  LockStage.CONFIRM_PAY,
  LockStage.UPDATE_PAID_PAYABLE,
  LockStage.CONFIRM_UPDATE_PAID_PAYABLE,
  LockStage.UPDATE_USER_PERCENTILES,
  LockStage.CONFIRM_UPDATE_USER_PERCENTILES,
  LockStage.UPDATE_AUTOCHARGE,
  LockStage.UPDATE_URI_GENERATOR,
  LockStage.UPDATE_OWNER,
  LockStage.UPDATE_BOUNTY_ID,
  LockStage.UPDATE_OWNER,
  LockStage.VOTE,
  LockStage.BURN,
  LockStage.MINT_EXTRA,
  LockStage.UPDATE_CATEGORY,
  LockStage.UPDATE_EXCLUDED_CONTENT,
  LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT,
  LockStage.UPDATE_PRICE_PER_MINUTE,
  LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTE,
  LockStage.CONFIRM_BURN,
  LockStage.CONFIRM_UPDATE_CATEGORY,
  LockStage.CONFIRM_UPDATE_MINT_INFO,
  LockStage.CONFIRM_MINT_EXTRA,
  LockStage.CONFIRM_SPONSOR_TAG,
  LockStage.CONFIRM_DELETE,
  LockStage.CONFIRM_DELETE_PROTOCOL,
  LockStage.CONFIRM_UPDATE_PROTOCOL,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_UPDATE_PARAMETERS,
  LockStage.CONFIRM_UPDATE_AUTOCHARGE,
  LockStage.CONFIRM_UPDATE_URI_GENERATOR,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_UPDATE_BOUNTY_ID,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_VOTE,
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