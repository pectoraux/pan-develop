export enum LockStage {
  APPLY,
  UPDATE_COSIGN,
  UPDATE_TOKEN_ID,
  UPDATE_BOUNTY_ID,
  VOTE,
  DELETE_PROTOCOL,
  DELETE,
  WITHDRAW,
  UPDATE_OWNER,
  UPDATE_PROTOCOL,
  PAY,
  UPDATE_PARAMETERS,
  UPDATE_CONTENT,
  UPDATE_DESCRIPTION,
  DEPOSIT_DUE,
  TRANSFER_TO_NOTE_RECEIVABLE,
  REIMBURSE_BNPL,
  CONFIRM_REIMBURSE_BNPL,
  CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE,
  CONFIRM_DEPOSIT_DUE,
  CLAIM_NOTE,
  CONFIRM_CLAIM_NOTE,
  CONFIRM_WITHDRAW,
  CONFIRM_UPDATE_PROTOCOL,
  CONFIRM_PAY,
  CONFIRM_UPDATE_PARAMETERS,
  CONFIRM_UPDATE_CONTENT,
  CONFIRM_UPDATE_DESCRIPTION,
  CONFIRM_APPLY,
  CONFIRM_UPDATE_OWNER,
  CONFIRM_UPDATE_TOKEN_ID,
  CONFIRM_UPDATE_BOUNTY_ID,
  CONFIRM_VOTE,
  COSIGNS,
  CONFIRM_DELETE,
  CONFIRM_DELETE_PROTOCOL,
  CONFIRM_COSIGNS,
  SETTINGS,
  ADMIN_SETTINGS,
  TX_CONFIRMED,
}

export interface ARPState {
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
