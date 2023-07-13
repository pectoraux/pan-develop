import { TokenMarketData, Image } from 'state/cancan/types'

export enum PaymentCurrency {
  BNB,
  WBNB,
  CONTRACT,
}




export enum BuyingStage {
  REVIEW,
  CONFIRM_REVIEW,
  PAYWALL_REVIEW,
  CONFIRM_PAYWALL_REVIEW,
  TX_CONFIRMED,
  PAYMENT_CREDIT,
  CONFIRM_PAYMENT_CREDIT,
  CASHBACK,
  CONFIRM_CASHBACK,
  STAKE,
  CONFIRM_STAKE,
  APPROVE_AND_CONFIRM,
  CONFIRM
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