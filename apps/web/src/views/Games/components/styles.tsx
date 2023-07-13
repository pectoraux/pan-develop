import styled from 'styled-components'
import { Modal, Grid, Box, Input } from '@pancakeswap/uikit'
import { LockStage } from './types'

export const StyledModal = styled(Modal)<{ stage: LockStage }>`
  & > div:last-child {
    padding: 0;
  }
`

export const stagesWithApproveButton = [
  LockStage.CONFIRM_BUY_MINUTES,
  LockStage.CONFIRM_BURN_TOKEN_FOR_CREDIT,
  LockStage.CONFIRM_MINT_OBJECT,
  LockStage.CONFIRM_SPONSOR_TAG,
]

export const stagesWithConfirmButton = [
  LockStage.CONFIRM_CREATE_GAMING_NFT,
  LockStage.CONFIRM_PROCESS_SCORE,
  LockStage.CONFIRM_UPDATE_SCORE,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_BURN_OBJECT,
  LockStage.CONFIRM_UPDATE_DESTINATION,
  LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA,
  LockStage.CONFIRM_ATTACH_KILL_DETACH_TOKEN,
  LockStage.CONFIRM_BURN_TOKEN,
  LockStage.CONFIRM_UPDATE_GAME,
  LockStage.CONFIRM_UPDATE_TOKEN_ID,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_UPDATE_OBJECT,
  LockStage.CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT,
  LockStage.CONFIRM_UPDATE_MAX_USE,
  LockStage.CONFIRM_UPDATE_URI_GENERATOR,
  LockStage.CONFIRM_UPDATE_TASK_CONTRACT,
  LockStage.CONFIRM_BLACKLIST_AUDITOR,
  LockStage.CONFIRM_BLACKLIST_GAME_NFT_TOKEN,
  LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT,
  LockStage.CONFIRM_UPDATE_TAG_REGISTRATION,
  LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTE,
  LockStage.CONFIRM_DELETE_GAME,
]

export const stagesWithBackButton = [
  LockStage.CREATE_GAMING_NFT,
  LockStage.BUY_MINUTES,
  LockStage.BURN_TOKEN_FOR_CREDIT,
  LockStage.PROCESS_SCORE,
  LockStage.UPDATE_SCORE,
  LockStage.WITHDRAW,
  LockStage.MINT_OBJECT,
  LockStage.BURN_OBJECT,
  LockStage.UPDATE_DESTINATION,
  LockStage.SPONSOR_TAG,
  LockStage.UPDATE_SPONSOR_MEDIA,
  LockStage.ATTACH_KILL_DETACH_TOKEN,
  LockStage.BURN_TOKEN,
  LockStage.UPDATE_GAME,
  LockStage.UPDATE_TOKEN_ID,
  LockStage.UPDATE_OWNER,
  LockStage.UPDATE_OBJECT,
  LockStage.UPDATE_BURN_TOKEN_FOR_CREDIT,
  LockStage.UPDATE_MAX_USE,
  LockStage.UPDATE_URI_GENERATOR,
  LockStage.UPDATE_TASK_CONTRACT,
  LockStage.BLACKLIST_AUDITOR,
  LockStage.BLACKLIST_GAME_NFT_TOKEN,
  LockStage.UPDATE_EXCLUDED_CONTENT,
  LockStage.UPDATE_TAG_REGISTRATION,
  LockStage.UPDATE_PRICE_PER_MINUTE,
  LockStage.DELETE_GAME,
  LockStage.CONFIRM_BUY_MINUTES,
  LockStage.CONFIRM_BURN_TOKEN_FOR_CREDIT,
  LockStage.CONFIRM_MINT_OBJECT,
  LockStage.CONFIRM_SPONSOR_TAG,
  LockStage.CONFIRM_CREATE_GAMING_NFT,
  LockStage.CONFIRM_PROCESS_SCORE,
  LockStage.CONFIRM_UPDATE_SCORE,
  LockStage.CONFIRM_WITHDRAW,
  LockStage.CONFIRM_BURN_OBJECT,
  LockStage.CONFIRM_UPDATE_DESTINATION,
  LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA,
  LockStage.CONFIRM_ATTACH_KILL_DETACH_TOKEN,
  LockStage.CONFIRM_BURN_TOKEN,
  LockStage.CONFIRM_UPDATE_GAME,
  LockStage.CONFIRM_UPDATE_TOKEN_ID,
  LockStage.CONFIRM_UPDATE_OWNER,
  LockStage.CONFIRM_UPDATE_OBJECT,
  LockStage.CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT,
  LockStage.CONFIRM_UPDATE_MAX_USE,
  LockStage.CONFIRM_UPDATE_URI_GENERATOR,
  LockStage.CONFIRM_UPDATE_TASK_CONTRACT,
  LockStage.CONFIRM_BLACKLIST_AUDITOR,
  LockStage.CONFIRM_BLACKLIST_GAME_NFT_TOKEN,
  LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT,
  LockStage.CONFIRM_UPDATE_TAG_REGISTRATION,
  LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTE,
  LockStage.CONFIRM_DELETE_GAME,
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