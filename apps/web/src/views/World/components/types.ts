export enum LockStage {
  APPLY,
  UPDATE_AUTOCHARGE,
  UPDATE_OWNER,
  UPDATE_TOKEN_ID,
  UPDATE_BOUNTY_ID,
  VOTE,
  DELETE_PROTOCOL,
  DELETE,
  WITHDRAW,
  UPDATE_COSIGN,
  UPDATE_PROTOCOL,
  ADMIN_AUTOCHARGE,
  UPDATE_PARAMETERS,
  UPDATE_DESCRIPTION,
  CONFIRM_WITHDRAW,
  CONFIRM_UPDATE_COSIGN,
  CONFIRM_UPDATE_PROTOCOL,
  CONFIRM_ADMIN_AUTOCHARGE,
  CONFIRM_UPDATE_PARAMETERS,
  CONFIRM_UPDATE_DESCRIPTION,
  CONFIRM_APPLY,
  CONFIRM_UPDATE_AUTOCHARGE,
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
