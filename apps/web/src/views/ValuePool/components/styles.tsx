import styled from 'styled-components'
import { Modal, Grid, Box, Input } from '@pancakeswap/uikit'
import { LockStage } from './types'

export const StyledModal = styled(Modal)<{ stage: LockStage }>`
  & > div:last-child {
    padding: 0;
  }
  & h2:first-of-type {
    ${({ theme }) => `color: ${theme.colors.textSubtle}`};
  }
  & svg:first-of-type {
    ${({ theme }) => `fill: ${theme.colors.textSubtle}`};
  }
`

export const stagesWithApproveButton = [
  LockStage.CONFIRM_BUY_RAMP,
  LockStage.CONFIRM_BUY_ACCOUNT,
  LockStage.CONFIRM_BURN,
]

export const stagesWithConfirmButton = [
  LockStage.CONFIRM_COSIGNS,
  LockStage.CONFIRM_DELETE,
  LockStage.CONFIRM_DELETE_RAMP,
  LockStage.CONFIRM_UPDATE_PROTOCOL,
  LockStage.CONFIRM_ADMIN_WITHDRAW,
  LockStage.CONFIRM_UPDATE_COSIGN,
  LockStage.CONFIRM_CREATE_PROTOCOL,
  LockStage.CONFIRM_UPDATE_PARAMETERS,
  LockStage.CONFIRM_CLAIM_REVENUE,
  LockStage.CONFIRM_CLAIM,
  LockStage.CONFIRM_UNLOCK_BOUNTY,
  LockStage.CONFIRM_UPDATE_TOKEN_ID,
  LockStage.CONFIRM_UPDATE_BADGE_ID,
  LockStage.CONFIRM_UPDATE_PROFILE_ID,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_UPDATE_BOUNTY,
  LockStage.CONFIRM_MINT,
  LockStage.CONFIRM_PARTNER,
]

export const stagesWithBackButton = [
  LockStage.UPDATE_BADGE_ID,
  LockStage.UPDATE_PROFILE_ID,
  LockStage.CONFIRM_UPDATE_PROFILE_ID,
  LockStage.UPDATE_TOKEN_ID,
  LockStage.UNLOCK_BOUNTY,
  LockStage.CONFIRM_UNLOCK_BOUNTY,
  LockStage.CONFIRM_UPDATE_TOKEN_ID,
  LockStage.CONFIRM_UPDATE_BADGE_ID,
  LockStage.CONFIRM_CLAIM,
  LockStage.CONFIRM_UPDATE_PARAMETERS,
  LockStage.CLAIM_REVENUE,
  LockStage.CONFIRM_CLAIM_REVENUE,
  LockStage.UPDATE_PARAMETERS,
  LockStage.CLAIM,
  LockStage.UPDATE_OWNER,
  LockStage.UPDATE_BOUNTY,
  LockStage.UPDATE_TRUST,
  LockStage.BUY_ACCOUNT,
  LockStage.PARTNER,
  LockStage.BURN,
  LockStage.MINT,
  LockStage.CREATE_PROTOCOL,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_MINT,
  LockStage.CONFIRM_BURN,
  LockStage.CONFIRM_PARTNER,
  LockStage.CONFIRM_BUY_ACCOUNT,
  LockStage.CONFIRM_BUY_RAMP,
  LockStage.CONFIRM_UPDATE_TRUST,
  LockStage.CONFIRM_UPDATE_BOUNTY,
  LockStage.CONFIRM_CREATE_PROTOCOL,
  LockStage.ADMIN_WITHDRAW,
  LockStage.UPDATE_PROTOCOL,
  LockStage.UPDATE_COSIGN,
  LockStage.CONFIRM_UPDATE_COSIGN,
  LockStage.CONFIRM_UPDATE_PROTOCOL,
  LockStage.CONFIRM_ADMIN_WITHDRAW,
  LockStage.DELETE,
  LockStage.COSIGNS,
  LockStage.CONFIRM_DELETE,
  LockStage.CONFIRM_COSIGNS,
  LockStage.CONFIRM_DELETE_RAMP,
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