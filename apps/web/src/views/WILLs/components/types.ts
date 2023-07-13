export enum LockStage {
  APPLY,
  PAY,
  UPDATE_TAX,
  TRANSFER_TO_NOTE_PAYABLE,
  TRANSFER_TO_NOTE_RECEIVABLE,
  BURN,
  UPDATE_MEDIA,
  ADD_BALANCE,
  UPDATE_ACTIVE_PERIOD,
  REMOVE_BALANCE,
  UPDATE_PARAMETERS,
  UPDATE_PROTOCOL,
  CONFIRM_UPDATE_PROTOCOL,
  UPDATE_OWNER,
  CLAIM_NOTE,
  STOP_WITHDRAWAL_COUNTDOWN,
  WITHDRAW,
  DELETE,
  DELETE_PROTOCOL,
  CONFIRM_PAY,
  CONFIRM_UPDATE_TAX,
  CONFIRM_TRANSFER_TO_NOTE_PAYABLE,
  CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE,
  CONFIRM_BURN,
  CONFIRM_UPDATE_MEDIA,
  CONFIRM_ADD_BALANCE,
  CONFIRM_UPDATE_ACTIVE_PERIOD,
  CONFIRM_REMOVE_BALANCE,
  CONFIRM_UPDATE_PARAMETERS,
  CONFIRM_UPDATE_OWNER,
  CONFIRM_CLAIM_NOTE,
  CONFIRM_STOP_WITHDRAWAL_COUNTDOWN,
  CONFIRM_WITHDRAW,
  CONFIRM_DELETE,
  CONFIRM_DELETE_PROTOCOL,
  SETTINGS,
  ADMIN_SETTINGS,
  TX_CONFIRMED,
}

export interface WILLState {
  owner: string
  bountyId: string
  profileId: string
  tokenId: string
  amountPayable: string
  amountReceivable: string
  paidPayable: string
  paidReceivable: string
  periodPayable: string
  periodReceivable: string
  startPayable: string
  startReceivable: string
  description: string
  numPeriods: string
  name: string
  symbol: string
  requestAddress: string
  requestAmount: string
  requests: string[],
  amounts: string[]
}
