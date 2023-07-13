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
]

export const stagesWithConfirmButton = [
  LockStage.CONFIRM_TRANSFER_TO_NOTE_PAYABLE,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_UPDATE_ADMIN,
  LockStage.CONFIRM_UPDATE_DATA_KEEPER,
  LockStage.CONFIRM_DEPOSIT_DUE,
  LockStage.CONFIRM_UPDATE_RATING_LEGEND,
  LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA,
  LockStage.CONFIRM_CLAIM_REVENUE_FROM_SPONSORS,
  LockStage.CONFIRM_UPDATE_TAG_REGISTRATION,
  LockStage.CONFIRM_CLAIM_NOTE,
  LockStage.CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE,
  LockStage.CONFIRM_AUTOCHARGE,
  LockStage.CONFIRM_UPDATE_DISCOUNT_DIVISOR,
  LockStage.CONFIRM_UPDATE_PENALTY_DIVISOR,
  LockStage.CONFIRM_SPONSOR_TAG,
  LockStage.CONFIRM_UPDATE_CATEGORY,
  LockStage.CONFIRM_DELETE,
  LockStage.CONFIRM_BURN,
  LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT,
  LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTE,
  LockStage.CONFIRM_DELETE_PROTOCOL,
  LockStage.CONFIRM_UPDATE_PROTOCOL,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_UPDATE_COSIGN,
  LockStage.CONFIRM_UPDATE_PARAMETERS,
  LockStage.CONFIRM_UPDATE_DESCRIPTION,
  LockStage.CONFIRM_UPDATE_URI_GENERATOR,
  LockStage.CONFIRM_ADMIN_AUTOCHARGE,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_UPDATE_BOUNTY_ID,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_VOTE,
  LockStage.CONFIRM_MINT_EXTRA,
  LockStage.CONFIRM_UPDATE_MINT_INFO,
]

export const stagesWithBackButton = [
  LockStage.TRANSFER_TO_NOTE_PAYABLE,
  LockStage.CONFIRM_TRANSFER_TO_NOTE_PAYABLE,
  LockStage.UPDATE_OWNER,
  LockStage.UPDATE_ADMIN,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_UPDATE_ADMIN,
  LockStage.UPDATE_DATA_KEEPER,
  LockStage.CONFIRM_UPDATE_DATA_KEEPER,
  LockStage.DEPOSIT_DUE,
  LockStage.CONFIRM_DEPOSIT_DUE,
  LockStage.UPDATE_RATING_LEGEND,
  LockStage.CONFIRM_UPDATE_RATING_LEGEND,
  LockStage.UPDATE_SPONSOR_MEDIA,
  LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA,
  LockStage.CLAIM_REVENUE_FROM_SPONSORS,
  LockStage.CONFIRM_CLAIM_REVENUE_FROM_SPONSORS,
  LockStage.UPDATE_TAG_REGISTRATION,
  LockStage.CONFIRM_UPDATE_TAG_REGISTRATION,
  LockStage.CLAIM_NOTE,
  LockStage.CONFIRM_CLAIM_NOTE,
  LockStage.TRANSFER_TO_NOTE_RECEIVABLE,
  LockStage.CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE,
  LockStage.AUTOCHARGE,
  LockStage.CONFIRM_AUTOCHARGE,
  LockStage.UPDATE_DISCOUNT_DIVISOR,
  LockStage.UPDATE_PENALTY_DIVISOR,
  LockStage.CONFIRM_UPDATE_DISCOUNT_DIVISOR,
  LockStage.CONFIRM_UPDATE_PENALTY_DIVISOR,
  LockStage.DELETE,
  LockStage.UPDATE_MINT_INFO,
  LockStage.DELETE_PROTOCOL,
  LockStage.UPDATE_PROTOCOL,
  LockStage.WITHDRAW,
  LockStage.SPONSOR_TAG,
  LockStage.UPDATE_COSIGN,
  LockStage.UPDATE_PARAMETERS,
  LockStage.ADMIN_AUTOCHARGE,
  LockStage.UPDATE_DESCRIPTION,
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
  LockStage.CONFIRM_COSIGNS,
  LockStage.CONFIRM_DELETE,
  LockStage.CONFIRM_DELETE_PROTOCOL,
  LockStage.CONFIRM_UPDATE_PROTOCOL,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_UPDATE_COSIGN,
  LockStage.CONFIRM_UPDATE_PARAMETERS,
  LockStage.CONFIRM_ADMIN_AUTOCHARGE,
  LockStage.CONFIRM_UPDATE_DESCRIPTION,
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