import styled from 'styled-components'
import { Modal, Grid, Box, Input } from '@pancakeswap/uikit'
import { LockStage } from './types'

export const StyledModal = styled(Modal)<{ stage: LockStage }>`
  & > div:last-child {
    padding: 0;
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
  LockStage.CONFIRM_INIT_RAMP,
  LockStage.CONFIRM_UNLOCK_BOUNTY,
  LockStage.CONFIRM_UPDATE_TOKEN_ID,
  LockStage.CONFIRM_UPDATE_DEV_TOKEN_ID,
  LockStage.CONFIRM_UPDATE_BADGE_ID,
  LockStage.CONFIRM_UPDATE_PROFILE_ID,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_UPDATE_BOUNTY,
  LockStage.CONFIRM_MINT,
  LockStage.CONFIRM_PARTNER,
  LockStage.CONFIRM_UPDATE_ADMIN,
  LockStage.CONFIRM_UPDATE_DEV,
  LockStage.CONFIRM_UPDATE_INDIVIDUAL_PROTOCOL,
  LockStage.CONFIRM_UPDATE_BLACKLIST,
  LockStage.CONFIRM_ADD_EXTRA_TOKEN,
  LockStage.CONFIRM_REMOVE_EXTRA_TOKEN,
  LockStage.CONFIRM_CLAIM_SPONSOR_REVENUE,
  LockStage.CONFIRM_SPONSOR_TAG,
  LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA,
]

export const stagesWithBackButton = [
  LockStage.UPDATE_SPONSOR_MEDIA,
  LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA,
  LockStage.SPONSOR_TAG,
  LockStage.CONFIRM_SPONSOR_TAG,
  LockStage.CONFIRM_CLAIM_SPONSOR_REVENUE,
  LockStage.REMOVE_EXTRA_TOKEN,
  LockStage.CONFIRM_REMOVE_EXTRA_TOKEN,
  LockStage.ADD_EXTRA_TOKEN,
  LockStage.CONFIRM_ADD_EXTRA_TOKEN,
  LockStage.UPDATE_BLACKLIST,
  LockStage.CONFIRM_UPDATE_BLACKLIST,
  LockStage.UPDATE_INDIVIDUAL_PROTOCOL,
  LockStage.CONFIRM_UPDATE_INDIVIDUAL_PROTOCOL,
  LockStage.UPDATE_ADMIN,
  LockStage.UPDATE_DEV,
  LockStage.CONFIRM_UPDATE_ADMIN,
  LockStage.CONFIRM_UPDATE_DEV,
  LockStage.UPDATE_BADGE_ID,
  LockStage.UPDATE_PROFILE_ID,
  LockStage.CONFIRM_UPDATE_PROFILE_ID,
  LockStage.CONFIRM_INIT_RAMP,
  LockStage.INIT_RAMP,
  LockStage.UPDATE_TOKEN_ID,
  LockStage.UPDATE_DEV_TOKEN_ID,
  LockStage.UNLOCK_BOUNTY,
  LockStage.CONFIRM_UNLOCK_BOUNTY,
  LockStage.CONFIRM_UPDATE_TOKEN_ID,
  LockStage.CONFIRM_UPDATE_DEV_TOKEN_ID,
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