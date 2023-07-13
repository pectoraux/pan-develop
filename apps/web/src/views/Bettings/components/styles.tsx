import styled from 'styled-components'
import { Modal, Grid, Box, Input } from '@pancakeswap/uikit'
import { LockStage } from './types'

export const StyledModal = styled(Modal)<{ stage: LockStage }>`
  & > div:last-child {
    padding: 0;
  }
`

export const stagesWithApproveButton = [
  LockStage.CONFIRM_BUY_TICKETS,
]

export const stagesWithConfirmButton = [
  LockStage.CONFIRM_INJECT_FUNDS,
  LockStage.CONFIRM_SPONSOR_TAG,
  LockStage.CONFIRM_CLAIM_TICKETS,
  LockStage.CONFIRM_DELETE,
  LockStage.CONFIRM_BURN,
  LockStage.CONFIRM_UPDATE_ADMIN,
  LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT,
  LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTE,
  LockStage.CONFIRM_DELETE_PROTOCOL,
  LockStage.CONFIRM_UPDATE_PROTOCOL,
  LockStage.CONFIRM_UPDATE_PARTNER_EVENT,
  LockStage.CONFIRM_SET_BETTING_RESULTS,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_USER_WITHDRAW,
  LockStage.CONFIRM_UPDATE_PARAMETERS,
  LockStage.CONFIRM_UPDATE_URI_GENERATOR,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA,
  LockStage.CONFIRM_BURN_FOR_CREDIT,
  LockStage.CONFIRM_REGISTER_TAG,
  LockStage.CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT,
  LockStage.DELETE_PROTOCOL,
  LockStage.CONFIRM_CLOSE_BETTING,
  LockStage.CONFIRM_UPDATE_MEMBERSHIP_PARAMETERS,
]

export const stagesWithBackButton = [
  LockStage.DELETE,
  LockStage.DELETE_PROTOCOL,
  LockStage.UPDATE_PARTNER_EVENT,
  LockStage.CONFIRM_UPDATE_PARTNER_EVENT,
  LockStage.UPDATE_MEMBERSHIP_PARAMETERS,
  LockStage.CONFIRM_UPDATE_MEMBERSHIP_PARAMETERS,
  LockStage.UPDATE_PROTOCOL,
  LockStage.WITHDRAW,
  LockStage.SPONSOR_TAG,
  LockStage.UPDATE_PARAMETERS,
  LockStage.UPDATE_URI_GENERATOR,
  LockStage.UPDATE_OWNER,
  LockStage.BURN,
  LockStage.UPDATE_EXCLUDED_CONTENT,
  LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT,
  LockStage.UPDATE_PRICE_PER_MINUTE,
  LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTE,
  LockStage.CONFIRM_BURN,
  LockStage.CONFIRM_SPONSOR_TAG,
  LockStage.CONFIRM_DELETE,
  LockStage.CONFIRM_DELETE_PROTOCOL,
  LockStage.CONFIRM_UPDATE_PROTOCOL,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.USER_WITHDRAW,
  LockStage.CONFIRM_USER_WITHDRAW,
  LockStage.UPDATE_ADMIN,
  LockStage.CONFIRM_UPDATE_ADMIN,
  LockStage.CLOSE_BETTING,
  LockStage.CONFIRM_CLOSE_BETTING,
  LockStage.UPDATE_BURN_TOKEN_FOR_CREDIT,
  LockStage.CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT,
  LockStage.CLAIM_TICKETS,
  LockStage.CONFIRM_CLAIM_TICKETS,
  LockStage.SET_BETTING_RESULTS,
  LockStage.CONFIRM_SET_BETTING_RESULTS,
  LockStage.UPDATE_SPONSOR_MEDIA,
  LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA,
  LockStage.BURN_FOR_CREDIT,
  LockStage.CONFIRM_BURN_FOR_CREDIT,
  LockStage.INJECT_FUNDS,
  LockStage.CONFIRM_INJECT_FUNDS,
  LockStage.BUY_TICKETS,
  LockStage.CONFIRM_BUY_TICKETS,
  LockStage.REGISTER_TAG,
  LockStage.CONFIRM_REGISTER_TAG,
  LockStage.CONFIRM_UPDATE_PARAMETERS,
  LockStage.CONFIRM_UPDATE_URI_GENERATOR,
  LockStage.CONFIRM_UPDATE_OWNER,
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