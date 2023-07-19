export enum LockStage {
  APPLY,
  AUTOCHARGE,
  PAY,
  VOTE,
  SPONSOR_TAG,
  UPDATE_AUTOCHARGE,
  UPDATE_TAX_CONTRACT,
  UPDATE_PROFILE_ID,
  UPDATE_USER_OWNER,
  MINT_EXTRA,
  UPDATE_BOUNTY_ID,
  UPDATE_TOKEN_ID,
  TRANSFER_TO_NOTE_PAYABLE,
  CLAIM_NOTE,
  UPDATE_SPONSOR_MEDIA,
  BURN,
  UPDATE_CAP,
  UPDATE_PROTOCOL,
  UPDATE_ADMIN,
  UPDATE_OWNER,
  UPDATE_USER_PERCENTILES,
  UPDATE_PAID_PAYABLE,
  UPDATE_DISCOUNT_DIVISOR,
  UPDATE_PENALTY_DIVISOR,
  NOTIFY_REWARDS,
  NOTIFY_DEBT,
  UPDATE_PARAMETERS,
  UPDATE_URI_GENERATOR,
  UPDATE_MINT_INFO,
  TRANSFER_TO_NOTE_RECEIVABLE,
  UPDATE_DUE_BEFORE_PAYABLE,
  UPDATE_TAG_REGISTRATION,
  UPDATE_PRICE_PER_MINUTE,
  UPDATE_EXCLUDED_CONTENT,
  UPDATE_CATEGORY,
  WITHDRAW,
  DELETE_PROTOCOL,
  DELETE,
  ADD_BALANCE,
  REMOVE_BALANCE,
  CONFIRM_ADD_BALANCE,
  CONFIRM_REMOVE_BALANCE,
  CONFIRM_AUTOCHARGE,
  CONFIRM_PAY,
  CONFIRM_VOTE,
  CONFIRM_SPONSOR_TAG,
  CONFIRM_UPDATE_AUTOCHARGE,
  CONFIRM_UPDATE_TAX_CONTRACT,
  CONFIRM_UPDATE_PROFILE_ID,
  CONFIRM_UPDATE_USER_OWNER,
  CONFIRM_MINT_EXTRA,
  CONFIRM_UPDATE_TOKEN_ID,
  CONFIRM_TRANSFER_TO_NOTE_PAYABLE,
  CONFIRM_CLAIM_NOTE,
  CONFIRM_UPDATE_SPONSOR_MEDIA,
  CONFIRM_BURN,
  CONFIRM_UPDATE_CAP,
  CONFIRM_UPDATE_PROTOCOL,
  CONFIRM_UPDATE_ADMIN,
  CONFIRM_UPDATE_OWNER,
  CONFIRM_UPDATE_USER_PERCENTILES,
  CONFIRM_UPDATE_PAID_PAYABLE,
  CONFIRM_UPDATE_DISCOUNT_DIVISOR,
  CONFIRM_UPDATE_PENALTY_DIVISOR,
  CONFIRM_NOTIFY_REWARDS,
  CONFIRM_NOTIFY_DEBT,
  CONFIRM_UPDATE_PARAMETERS,
  CONFIRM_UPDATE_BOUNTY_ID,
  CONFIRM_UPDATE_URI_GENERATOR,
  CONFIRM_UPDATE_MINT_INFO,
  CONFIRM_UPDATE_MINT_EXTRA,
  CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE,
  CONFIRM_UPDATE_DUE_BEFORE_PAYABLE,
  CONFIRM_UPDATE_TAG_REGISTRATION,
  CONFIRM_UPDATE_PRICE_PER_MINUTE,
  CONFIRM_UPDATE_EXCLUDED_CONTENT,
  CONFIRM_UPDATE_CATEGORY,
  CONFIRM_WITHDRAW,
  CONFIRM_DELETE_PROTOCOL,
  CONFIRM_DELETE,
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
