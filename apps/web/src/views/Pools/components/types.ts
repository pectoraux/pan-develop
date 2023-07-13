export enum LockStage {
  DISTRIBUTE,
  DEPOSIT_ALL,
  DEPOSIT,
  WITHDRAW,
  WITHDRAW_ALL,
  UNSTAKE,
  ADD_REWARDS,
  CONFIRM_ADD_REWARDS,
  CONFIRM_DISTRIBUTE,
  CONFIRM_DEPOSIT_ALL,
  CONFIRM_DEPOSIT,
  CONFIRM_WITHDRAW,
  CONFIRM_WITHDRAW_ALL,
  CONFIRM_UNSTAKE,
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
