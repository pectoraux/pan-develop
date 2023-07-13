import styled from 'styled-components'
import { Modal, Grid, Box, Input } from '@pancakeswap/uikit'
import { LockStage } from './types'

export const StyledModal = styled(Modal)<{ stage: LockStage }>`
  & > div:last-child {
    padding: 0;
  }
`

export const stagesWithApproveButton = [
  LockStage.CONFIRM_ADD_BALANCE,
]

export const stagesWithConfirmButton = [
  LockStage.CONFIRM_PAY,
  LockStage.CONFIRM_UPDATE_TAX,
  LockStage.CONFIRM_TRANSFER_TO_NOTE_PAYABLE,
  LockStage.CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE,
  LockStage.CONFIRM_BURN,
  LockStage.CONFIRM_UPDATE_PROTOCOL,
  LockStage.CONFIRM_UPDATE_MEDIA,
  LockStage.CONFIRM_UPDATE_ACTIVE_PERIOD,
  LockStage.CONFIRM_REMOVE_BALANCE,
  LockStage.CONFIRM_UPDATE_PARAMETERS,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_CLAIM_NOTE,
  LockStage.CONFIRM_STOP_WITHDRAWAL_COUNTDOWN,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_DELETE,
  LockStage.CONFIRM_DELETE_PROTOCOL,
]

export const stagesWithBackButton = [
  LockStage.PAY,
  LockStage.UPDATE_TAX,
  LockStage.TRANSFER_TO_NOTE_PAYABLE,
  LockStage.TRANSFER_TO_NOTE_RECEIVABLE,
  LockStage.BURN,
  LockStage.UPDATE_PROTOCOL,
  LockStage.CONFIRM_UPDATE_PROTOCOL,
  LockStage.UPDATE_MEDIA,
  LockStage.ADD_BALANCE,
  LockStage.UPDATE_ACTIVE_PERIOD,
  LockStage.REMOVE_BALANCE,
  LockStage.UPDATE_PARAMETERS,
  LockStage.UPDATE_OWNER,
  LockStage.CLAIM_NOTE,
  LockStage.STOP_WITHDRAWAL_COUNTDOWN,
  LockStage.WITHDRAW,
  LockStage.DELETE,
  LockStage.DELETE_PROTOCOL,
  LockStage.CONFIRM_PAY,
  LockStage.CONFIRM_UPDATE_TAX,
  LockStage.CONFIRM_TRANSFER_TO_NOTE_PAYABLE,
  LockStage.CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE,
  LockStage.CONFIRM_BURN,
  LockStage.CONFIRM_UPDATE_MEDIA,
  LockStage.CONFIRM_ADD_BALANCE,
  LockStage.CONFIRM_UPDATE_ACTIVE_PERIOD,
  LockStage.CONFIRM_REMOVE_BALANCE,
  LockStage.CONFIRM_UPDATE_PARAMETERS,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_CLAIM_NOTE,
  LockStage.CONFIRM_STOP_WITHDRAWAL_COUNTDOWN,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_DELETE,
  LockStage.CONFIRM_DELETE_PROTOCOL,
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