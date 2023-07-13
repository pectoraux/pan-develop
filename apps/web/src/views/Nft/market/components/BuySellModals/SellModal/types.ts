export enum SellingStage {
  // Sell flow
  SELL,
  SET_PRICE,
  APPROVE_AND_CONFIRM_SELL,
  // Adjust price flow
  EDIT,
  ADJUST_PRICE,
  ADJUST_OPTIONS,
  CONFIRM_ADJUST_OPTIONS,
  CONFIRM_ADJUST_PRICE,
  // Remove from market flow
  REMOVE_FROM_MARKET,
  CONFIRM_REMOVE_FROM_MARKET,
  // Transfer flow
  TRANSFER,
  CONFIRM_TRANSFER,
  // Update identity requirements flow
  UPDATE_IDENTITY_REQUIREMENTS,
  CONFIRM_UPDATE_IDENTITY_REQUIREMENTS,
  // Update burn for credit tokens flow
  UPDATE_BURN_FOR_CREDIT_TOKENS,
  CONFIRM_UPDATE_BURN_FOR_CREDIT_TOKENS,
  // Update discounts and cashbacks flow
  UPDATE_DISCOUNTS_AND_CASHBACKS,
  CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS,
  // Reinitialize identity limits
  REINITIALIZE_IDENTITY_LIMITS,
  CONFIRM_REINITIALIZE_IDENTITY_LIMITS,
  // Reinitialize discounts limits
  REINITIALIZE_DISCOUNTS_LIMITS,
  CONFIRM_REINITIALIZE_DISCOUNTS_LIMITS,
  // Reinitialize cashback limits
  REINITIALIZE_CASHBACK_LIMITS,
  CONFIRM_REINITIALIZE_CASHBACK_LIMITS,
  // Sponsoring
  SET_SPONSOR_PRICE,
  APPROVE_AND_CONFIRM_SPONSOR_PRICE,
  // Add Users' Payment Credits
  ADD_USERS_PAYMENT_CREDIT,
  CONFIRM_ADD_USERS_PAYMENT_CREDIT,
  // Shipping
  SHIP,
  BUY_SUBSCRIPTION,
  ADD_TASK,
  UPLOAD_MEDIA,
  ADD_LOCATION,
  ADD_LOCATION1,
  ADD_LOCATION2,
  CREATE_PAYWALL,
  CREATE_ASK_ORDER,
  CONFIRM_CREATE_ASK_ORDER,
  CONFIRM_CREATE_PAYWALL,
  CONFIRM_ADD_LOCATION,
  CONFIRM_ADD_LOCATION1,
  CONFIRM_ADD_LOCATION2,
  // General Settings
  SETTINGS,
  CLAIM_PENDING_REVENUE,
  CONFIRM_CLAIM_PENDING_REVENUE,
  FUND_PENDING_REVENUE,
  CONFIRM_FUND_PENDING_REVENUE,
  TRANSFER_DUE_TO_NOTE,
  CONFIRM_TRANSFER_DUE_TO_NOTE,
  MODIFY_COLLECTION,
  CONFIRM_MODIFY_COLLECTION,
  UPDATE_AUDITORS,
  CONFIRM_UPDATE_AUDITORS,
  MODIFY_CONTACT,
  CONFIRM_MODIFY_CONTACT,
  CREATE_PAYWALL1,
  CREATE_PAYWALL2,
  CONFIRM_BUY_SUBSCRIPTION,
  CONFIRM_CREATE_PAYWALL1,
  CONFIRM_CREATE_PAYWALL2,
  // Common
  TX_CONFIRMED,
}

export interface OptionType {
  id: string
  category: string
  element: string
  price: number
}

export interface FormState {
  // price change variables
  price: string,
  bidDuration: string,
  minBidIncrementPercentage: string,
  transferrable: boolean,
  rsrcTokenId: string,
  options: OptionType[],
  maxSupply: string,
  dropinDate: number,
  // discount variables
  discountStatus: number,
  discountStart: number,
  cashbackStatus: number,
  cashbackStart: number,
  cashNotCredit: number,
  checkIdentityCode: number,
  discountNumbers: string[],
  discountCost: string[],
  cashbackNumbers: string[],
  cashbackCost: string[],
  addPaywall: string
  removePaywall: string
}

export const ARRAY_KEYS = [
  'discountNumbers',
  'discountCost',
  'cashbackNumbers',
  'cashbackCost'
]

export interface EnlistFormState {
    tokenId: string
    direction: string
    dropinDate: string
    maxSupply: string
    ABTesting: boolean
    ABMin: string
    ABMax: string
    // ABDeadline: string
    lastBidder: string
    bidDuration: string
    // firstBidTime: string
    minBidIncrementPercentage: string
    rsrcTokenId: string
    options: string[]
    transferrable: boolean
    // identityProof: {
    //   [key: string]: string
    // }
    // priceReductor: {
    //   [key: string]: string
    // }
    // metadataUrl: string
    currentAskPrice: string
    // currentSeller: string
    // updatedAt: string
    workspace: string
    country: {
      [key: string]: string
    }
    city: {
      [key: string]: string
    }
    product: {
      [key: string]: string
    }
    behindPaywall: {
      [key: string]: string
    }
    tFIAT: string
    arp: string
}

export interface MarketPlace {
  collection: string 
  tokenMinter: string
  referrerFee: string
  name: string
  badgeId: string
  recurringBounty: string
  addAuditors: number
  auditors: string[]
  token: string
  tokenId: string
  fromNote: number
  amount: string
  cashbackFund: number
  start: string
  end: string
}