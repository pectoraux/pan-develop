export enum LockStage {
  CONTRIBUTE_RANDOM_NUMBER_FEES,
  START_LOTTERY,
  CLAIM_TICKETS,
  CONFIRM_CLAIM_TICKETS,
  UPDATE_BURN_TOKEN_FOR_CREDIT,
  CLAIM_LOTTERY_REVENUE,
  INJECT_FUNDS,
  BURN_TOKEN_FOR_CREDIT,
  WITHDRAW,
  DRAW_FINAL_NUMBER,
  BUY_TICKETS,
  CLOSE_LOTTERY,
  ADMIN_WITHDRAW,
  CONFIRM_ADMIN_WITHDRAW,
  CONFIRM_CONTRIBUTE_RANDOM_NUMBER_FEES,
  CONFIRM_START_LOTTERY,
  CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT,
  CONFIRM_CLAIM_LOTTERY_REVENUE,
  CONFIRM_INJECT_FUNDS,
  CONFIRM_BURN_TOKEN_FOR_CREDIT,
  CONFIRM_WITHDRAW,
  CONFIRM_DRAW_FINAL_NUMBER,
  CONFIRM_BUY_TICKETS,
  CONFIRM_CLOSE_LOTTERY,
  SETTINGS,
  ADMIN_SETTINGS,
  TX_CONFIRMED,
}

export interface GameState {
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
