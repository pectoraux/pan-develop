export enum LockStage {
  USER_WITHDRAW,
  CONFIRM_USER_WITHDRAW,
  UPDATE_ADMIN,
  CONFIRM_UPDATE_ADMIN,
  CLOSE_BETTING,
  CONFIRM_CLOSE_BETTING,
  UPDATE_BURN_TOKEN_FOR_CREDIT,
  CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT,
  CLAIM_TICKETS,
  INJECT_FUNDS,
  UPDATE_PARTNER_EVENT,
  UPDATE_MEMBERSHIP_PARAMETERS,
  CONFIRM_UPDATE_MEMBERSHIP_PARAMETERS,
  CONFIRM_UPDATE_PARTNER_EVENT,
  CONFIRM_INJECT_FUNDS,
  CONFIRM_CLAIM_TICKETS,
  SET_BETTING_RESULTS,
  CONFIRM_SET_BETTING_RESULTS,
  UPDATE_SPONSOR_MEDIA,
  CONFIRM_UPDATE_SPONSOR_MEDIA,
  BURN_FOR_CREDIT,
  CONFIRM_BURN_FOR_CREDIT,
  INITIALIZE_BRACKET_CALCULATOR,
  CONFIRM_INITIALIZE_BRACKET_CALCULATOR,
  BUY_TICKETS,
  CONFIRM_BUY_TICKETS,
  REGISTER_TAG,
  CONFIRM_REGISTER_TAG,
  CONFIRM_UPDATE_PARAMETERS,
  CONFIRM_UPDATE_OWNER,
  UPDATE_OWNER,
  UPDATE_URI_GENERATOR,
  UPDATE_BOUNTY_ID,
  DELETE_PROTOCOL,
  DELETE,
  WITHDRAW,
  SPONSOR_TAG,
  UPDATE_PROTOCOL,
  UPDATE_PARAMETERS,
  BURN,
  UPDATE_PRICE_PER_MINUTE,
  UPDATE_EXCLUDED_CONTENT,
  CONFIRM_UPDATE_EXCLUDED_CONTENT,
  CONFIRM_UPDATE_PRICE_PER_MINUTE,
  CONFIRM_BURN,
  CONFIRM_WITHDRAW,
  CONFIRM_SPONSOR_TAG,
  CONFIRM_UPDATE_PROTOCOL,
  CONFIRM_UPDATE_URI_GENERATOR,
  CONFIRM_DELETE,
  CONFIRM_DELETE_PROTOCOL,
  SETTINGS,
  ADMIN_SETTINGS,
  TX_CONFIRMED
}

export interface BettingState {
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
