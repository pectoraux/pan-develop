import styled from 'styled-components'
import { Modal, Grid, Box, Input } from '@pancakeswap/uikit'
import { LockStage } from './types'

export const StyledModal = styled(Modal)<{ stage: LockStage }>`
  & > div:last-child {
    padding: 0;
  }
`

export const stagesWithApproveButton = [
  LockStage.CONFIRM_CONTRIBUTE_RANDOM_NUMBER_FEES,
  LockStage.CONFIRM_INJECT_FUNDS,
  LockStage.CONFIRM_BURN_TOKEN_FOR_CREDIT,
  LockStage.CONFIRM_BUY_TICKETS,
]

export const stagesWithConfirmButton = [
  LockStage.CONFIRM_ADMIN_WITHDRAW,
  LockStage.CONFIRM_START_LOTTERY,
  LockStage.CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT,
  LockStage.CONFIRM_CLAIM_LOTTERY_REVENUE,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_DRAW_FINAL_NUMBER,
  LockStage.CONFIRM_CLOSE_LOTTERY,
  LockStage.CONFIRM_CLAIM_TICKETS,
]

export const stagesWithBackButton = [
  LockStage.CLAIM_TICKETS,
  LockStage.CONFIRM_CLAIM_TICKETS,
  LockStage.CONTRIBUTE_RANDOM_NUMBER_FEES,
  LockStage.START_LOTTERY,
  LockStage.UPDATE_BURN_TOKEN_FOR_CREDIT,
  LockStage.CLAIM_LOTTERY_REVENUE,
  LockStage.INJECT_FUNDS,
  LockStage.BURN_TOKEN_FOR_CREDIT,
  LockStage.WITHDRAW,
  LockStage.DRAW_FINAL_NUMBER,
  LockStage.BUY_TICKETS,
  LockStage.CLOSE_LOTTERY,
  LockStage.ADMIN_WITHDRAW,
  LockStage.CONFIRM_ADMIN_WITHDRAW,
  LockStage.CONFIRM_CONTRIBUTE_RANDOM_NUMBER_FEES,
  LockStage.CONFIRM_START_LOTTERY,
  LockStage.CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT,
  LockStage.CONFIRM_CLAIM_LOTTERY_REVENUE,
  LockStage.CONFIRM_INJECT_FUNDS,
  LockStage.CONFIRM_BURN_TOKEN_FOR_CREDIT,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_DRAW_FINAL_NUMBER,
  LockStage.CONFIRM_BUY_TICKETS,
  LockStage.CONFIRM_CLOSE_LOTTERY,
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