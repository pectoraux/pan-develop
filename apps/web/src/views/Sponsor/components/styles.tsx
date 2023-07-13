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
  LockStage.CONFIRM_COSIGNS,
  LockStage.CONFIRM_DELETE,
  LockStage.CONFIRM_DELETE_PROTOCOL,
  LockStage.CONFIRM_UPDATE_PROTOCOL,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_UPDATE_COSIGN,
  LockStage.CONFIRM_UPDATE_PARAMETERS,
  LockStage.CONFIRM_UPDATE_DESCRIPTION,
  LockStage.CONFIRM_UPDATE_TOKEN_ID,
  LockStage.CONFIRM_ADMIN_AUTOCHARGE,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_UPDATE_BOUNTY_ID,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_VOTE,
]

export const stagesWithBackButton = [
  LockStage.COSIGNS,
  LockStage.DELETE,
  LockStage.DELETE_PROTOCOL,
  LockStage.UPDATE_PROTOCOL,
  LockStage.WITHDRAW,
  LockStage.UPDATE_COSIGN,
  LockStage.UPDATE_PARAMETERS,
  LockStage.ADMIN_AUTOCHARGE,
  LockStage.UPDATE_DESCRIPTION,
  LockStage.UPDATE_AUTOCHARGE,
  LockStage.UPDATE_TOKEN_ID,
  LockStage.UPDATE_OWNER,
  LockStage.UPDATE_BOUNTY_ID,
  LockStage.UPDATE_OWNER,
  LockStage.VOTE,
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
  LockStage.CONFIRM_UPDATE_TOKEN_ID,
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