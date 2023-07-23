export enum LockStage {
  UPDATE_ESTIMATION_TABLE,
  CONFIRM_UPDATE_ESTIMATION_TABLE,
  ADD_TO_CHANNEL,
  CONFIRM_ADD_TO_CHANNEL,
  UPDATE_BLACKLIST,
  CONFIRM_UPDATE_BLACKLIST,
  UPDATE_PARAMETERS,
  CONFIRM_UPDATE_PARAMETERS,
  SELL_COLLATERAL,
  CONFIRM_SELL_COLLATERAL,
  WITHDRAW_TREASURY,
  CONFIRM_WITHDRAW_TREASURY,
  MINT,
  CONFIRM_MINT,
  NOTIFY_REWARD,
  CONFIRM_NOTIFY_REWARD,
  ERASE_DEBT,
  CONFIRM_ERASE_DEBT,
  BURN,
  CONFIRM_BURN,
  UPDATE_ADMIN,
  CONFIRM_UPDATE_ADMIN,
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
