import styled from 'styled-components'
import { Modal, Grid, Box, Input } from '@pancakeswap/uikit'
import { LockStage } from './types'

export const StyledModal = styled(Modal)<{ stage: LockStage }>`
  & > div:last-child {
    padding: 0;
  }
`

export const stagesWithApproveButton = [
  LockStage.CONFIRM_DEPOSIT,
  LockStage.CONFIRM_ADD_REWARDS,
  LockStage.CONFIRM_DEPOSIT_ALL,
]

export const stagesWithConfirmButton = [
  LockStage.CONFIRM_DISTRIBUTE,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_WITHDRAW_ALL,
  LockStage.CONFIRM_UNSTAKE
]

export const stagesWithBackButton = [
  LockStage.DISTRIBUTE,
  LockStage.DEPOSIT_ALL,
  LockStage.DEPOSIT,
  LockStage.WITHDRAW,
  LockStage.WITHDRAW_ALL,
  LockStage.UNSTAKE,
  LockStage.ADD_REWARDS,
  LockStage.CONFIRM_ADD_REWARDS,
  LockStage.CONFIRM_DISTRIBUTE,
  LockStage.CONFIRM_DEPOSIT_ALL,
  LockStage.CONFIRM_DEPOSIT,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_WITHDRAW_ALL,
  LockStage.CONFIRM_UNSTAKE
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