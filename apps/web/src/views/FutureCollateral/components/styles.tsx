import styled from 'styled-components'
import { Modal, Grid, Box, Input } from '@pancakeswap/uikit'
import { LockStage } from './types'

export const StyledModal = styled(Modal)<{ stage: LockStage }>`
  & > div:last-child {
    padding: 0;
  }
`

export const stagesWithApproveButton = [
  LockStage.CONFIRM_MINT,
  LockStage.CONFIRM_ERASE_DEBT,
  LockStage.CONFIRM_NOTIFY_REWARD,
]

export const stagesWithBackButton = [
  LockStage.UPDATE_ESTIMATION_TABLE,
  LockStage.CONFIRM_UPDATE_ESTIMATION_TABLE,
  LockStage.ADD_TO_CHANNEL,
  LockStage.CONFIRM_ADD_TO_CHANNEL,
  LockStage.UPDATE_BLACKLIST,
  LockStage.CONFIRM_UPDATE_BLACKLIST,
  LockStage.UPDATE_PARAMETERS,
  LockStage.CONFIRM_UPDATE_PARAMETERS,
  LockStage.SELL_COLLATERAL,
  LockStage.CONFIRM_SELL_COLLATERAL,
  LockStage.WITHDRAW_TREASURY,
  LockStage.CONFIRM_WITHDRAW_TREASURY,
  LockStage.MINT,
  LockStage.CONFIRM_MINT,
  LockStage.NOTIFY_REWARD,
  LockStage.CONFIRM_NOTIFY_REWARD,
  LockStage.ERASE_DEBT,
  LockStage.CONFIRM_ERASE_DEBT,
  LockStage.BURN,
  LockStage.CONFIRM_BURN,
]

export const stagesWithConfirmButton = [
  LockStage.CONFIRM_BURN,
  LockStage.CONFIRM_SELL_COLLATERAL,
  LockStage.CONFIRM_WITHDRAW_TREASURY,
  LockStage.CONFIRM_UPDATE_PARAMETERS,
  LockStage.CONFIRM_UPDATE_BLACKLIST,
  LockStage.CONFIRM_ADD_TO_CHANNEL,
  LockStage.CONFIRM_UPDATE_ESTIMATION_TABLE,
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