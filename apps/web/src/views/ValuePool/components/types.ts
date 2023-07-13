export enum LockStage {
  CREATE_PROTOCOL,
  UPDATE_BADGE_ID,
  UPDATE_TOKEN_ID,
  UNLOCK_BOUNTY,
  UPDATE_PROFILE_ID,
  MINT,
  BURN,
  PARTNER,
  BUY_ACCOUNT,
  BUY_RAMP,
  UPDATE_TRUST,
  UPDATE_BOUNTY,
  UPDATE_OWNER,
  CLAIM,
  PRE_MINT,
  UPDATE_PARAMETERS,
  CLAIM_REVENUE,
  CONFIRM_UNLOCK_BOUNTY,
  CONFIRM_UPDATE_PROFILE_ID,
  CONFIRM_UPDATE_TOKEN_ID,
  CONFIRM_UPDATE_BADGE_ID,
  CONFIRM_CLAIM_REVENUE,
  CONFIRM_UPDATE_PARAMETERS,
  CONFIRM_CLAIM,
  CONFIRM_UPDATE_OWNER,
  CONFIRM_MINT,
  CONFIRM_BURN,
  CONFIRM_PARTNER,
  CONFIRM_BUY_ACCOUNT,
  CONFIRM_BUY_RAMP,
  CONFIRM_UPDATE_TRUST,
  CONFIRM_UPDATE_BOUNTY,
  CONFIRM_CREATE_PROTOCOL,
  ADMIN_WITHDRAW,
  UPDATE_PROTOCOL,
  UPDATE_COSIGN,
  CONFIRM_UPDATE_COSIGN,
  CONFIRM_UPDATE_PROTOCOL,
  CONFIRM_ADMIN_WITHDRAW,
  DELETE,
  DELETE_RAMP,
  COSIGNS,
  CONFIRM_DELETE,
  CONFIRM_DELETE_RAMP,
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