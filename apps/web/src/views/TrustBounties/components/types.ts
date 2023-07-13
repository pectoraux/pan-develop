import { TokenMarketData, Image } from 'state/cancan/types'

export enum PaymentCurrency {
  BNB,
  WBNB,
  CONTRACT,
}

export enum BuyingStage {
  REVIEW,
  APPROVE_AND_CONFIRM,
  CONFIRM,
  TX_CONFIRMED,
  PAYMENT_CREDIT,
  CASHBACK,
  STAKE,
}

export enum LockStage {
  CREATE_STAKE,
  ENABLE,
  APPLY,
  ACCEPT,
  START_LITIGATIONS,
  ADD_BALANCE,
  ADD_APPROVAL,
  DELETE_APPROVAL,
  CLAIM,
  APPLY_RESULTS,
  DELETE_BOUNTY,
  DELETE_BALANCE,
  CONFIRM_ADD_APPROVAL,
  CONFIRM_DELETE_APPROVAL,
  CONFIRM_CLAIM,
  CONFIRM_DELETE_BALANCE,
  CONFIRM_DELETE_BOUNTY,
  CONFIRM_APPLY_RESULTS,
  CONFIRM_ADD_BALANCE,
  CONFIRM_START_LITIGATIONS,
  CONFIRM_ACCEPT,
  CONFIRM_APPLY,
  UPDATE_OWNER,
  ADD_RECURRING_BALANCE,
  CLEAN_UP_APPROVALS,
  CLEAN_UP_BALANCES,
  CONFIRM_CLEAN_UP_BALANCES,
  CONFIRM_CLEAN_UP_APPROVALS,
  CONFIRM_ADD_RECURRING_BALANCE,
  CONFIRM_UPDATE_OWNER,
  ADMIN_SETTINGS,
  SETTINGS,
  UPDATE,
  DEPOSIT,
  WITHDRAW,
  MINT_NOTE,
  SPLIT_SHARES,
  CLAIM_NOTE,
  UPDATE_ARP,
  AUTOCHARGE,
  PAY,
  ADMIN_WITHDRAW,
  DELETE,
  DELETE_ARP,
  UPDATE_PROTOCOL,
  MINT_FT,
  UPDATE_ACCOUNT,
  COSIGNS,
  ADD_PAID_DAYS,
  UPDATE_COSIGN,
  CONFIRM_UPDATE_COSIGN,
  CONFIRM_ADD_PAID_DAYS,
  CONFIRM_MINT_FT,
  CONFIRM_UPDATE_PROTOCOL,
  CONFIRM_UPDATE_ARP,
  CONFIRM_UPDATE_ACCOUNT,
  CONFIRM_PAY,
  CONFIRM_ADMIN_WITHDRAW,
  CONFIRM_DELETE,
  CONFIRM_DELETE_ARP,
  CONFIRM_UPDATE,
  CONFIRM_DEPOSIT,
  CONFIRM_WITHDRAW,
  CONFIRM_MINT_NOTE,
  CONFIRM_SPLIT_SHARES,
  CONFIRM_CLAIM_NOTE,
  CONFIRM_COSIGNS,
  UPLOAD,
  TX_CONFIRMED,
}

export interface BuyNFT {
  collection: {
    address: string
    name: string
  }
  token: TokenMarketData
  name: string
  image: Image
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
