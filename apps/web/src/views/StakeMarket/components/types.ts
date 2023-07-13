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
  START_WAITING_PERIOD,
  CONFIRM_START_WAITING_PERIOD,
  ENABLE,
  APPLY,
  ACCEPT,
  START_LITIGATIONS,
  CONFIRM_START_LITIGATIONS,
  CONFIRM_ACCEPT,
  CONFIRM_APPLY,
  ADMIN_SETTINGS,
  SETTINGS,
  UPDATE,
  DEPOSIT,
  WITHDRAW,
  MINT_NOTE,
  SPLIT_SHARES,
  CLAIM_NOTE,
  UPDATE_STAKE,
  UPDATE_OWNER,
  UPDATE_TAX_CONTRACT,
  UPDATE_BEFORE_LITIGATIONS,
  CANCEL_STAKE,
  SWITCH_STAKE,
  MINT_IOU,
  CONFIRM_MINT_IOU,
  CONFIRM_SWITCH_STAKE,
  CONFIRM_CANCEL_STAKE,
  CONFIRM_UPDATE_BEFORE_LITIGATIONS,
  CONFIRM_UPDATE_TAX_CONTRACT,
  CONFIRM_UPDATE_OWNER,
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
  CONFIRM_UPDATE_STAKE,
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
