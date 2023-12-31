import { TokenMarketData, Image } from 'state/nftMarket/types'

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
  ADMIN_SETTINGS,
  VAVA,
  VA,
  SETTINGS,
  UPDATE,
  DEPOSIT,
  WITHDRAW,
  MINT_NOTE,
  SPLIT_SHARES,
  CLAIM_NOTE,
  UPDATE_VP,
  AUTOCHARGE,
  PAY,
  ADMIN_WITHDRAW,
  DELETE,
  NOTIFY_PAYMENT,
  REIMBURSE_BNPL,
  ADD_CREDIT,
  NOTIFY_LOAN,
  CONFIRM_NOTIFY_LOAN,
  UPDATE_MERCHANT_IDENTITY_PROOFS,
  UPDATE_USER_IDENTITY_PROOFS,
  PICK_RANK,
  CHECK_RANK,
  UPDATE_TRUSTWORTHY_AUDITORS,
  UPDATE_TRUSTWORTHY_MERCHANTS,
  UPDATE_BLACKLISTED_MERCHANTS,
  UPDATE_EXCLUDED_CONTENT,
  UPDATE_MEDIA,
  UPDATE_VOTING_BLACKLIST,
  UPDATE_VOTING_PARAMETERS,
  UPDATE_MINIMUM_LOCK,
  UPDATE_COLLECTION_ID,
  SWITCH_POOL,
  CONFIRM_SWITCH_POOL,
  CONFIRM_UPDATE_COLLECTION_ID,
  CONFIRM_UPDATE_MINIMUM_LOCK,
  CONFIRM_UPDATE_VOTING_PARAMETERS,
  CONFIRM_UPDATE_VOTING_BLACKLIST,
  CONFIRM_UPDATE_MEDIA,
  CONFIRM_UPDATE_EXCLUDED_CONTENT,
  CONFIRM_UPDATE_BLACKLISTED_MERCHANTS,
  CONFIRM_UPDATE_TRUSTWORTHY_MERCHANTS,
  CONFIRM_UPDATE_TRUSTWORTHY_AUDITORS,
  CONFIRM_CHECK_RANK,
  UPDATE_DESCRIPTION,
  UPDATE_TAX_CONTRACT,
  UPDATE_MARKETPLACE,
  CONFIRM_UPDATE_MARKETPLACE,
  CONFIRM_UPDATE_TAX_CONTRACT,
  CONFIRM_UPDATE_DESCRIPTION,
  CONFIRM_PICK_RANK,
  CONFIRM_EXECUTE_NEXT_PURCHASE,
  CONFIRM_UPDATE_USER_IDENTITY_PROOFS,
  CONFIRM_UPDATE_MERCHANT_IDENTITY_PROOFS,
  CONFIRM_ADD_CREDIT,
  CONFIRM_REIMBURSE_BNPL,
  REIMBURSE,
  CONFIRM_REIMBURSE,
  UPDATE_OWNER,
  CONFIRM_UPDATE_OWNER,
  CONFIRM_NOTIFY_PAYMENT,
  DELETE_VP,
  UPDATE_PROTOCOL,
  MERGE,
  UPDATE_ACCOUNT,
  COSIGNS,
  ADD_PAID_DAYS,
  UPDATE_COSIGN,
  SPONSORS,
  ADD_SPONSORS,
  REMOVE_SPONSORS,
  VOTE_UP,
  VOTE_DOWN,
  RESET,
  CREDITOR,
  CREATE_LOCK,
  HISTORY,
  ADMINS,
  CONFIRM_ADMINS,
  CONFIRM_CREATE_LOCK,
  CONFIRM_CREDITOR,
  CONFIRM_RESET,
  CONFIRM_VAVA,
  CONFIRM_VA,
  CONFIRM_VOTE_UP,
  CONFIRM_VOTE_DOWN,
  CONFIRM_ADD_SPONSORS,
  CONFIRM_REMOVE_SPONSORS,
  CONFIRM_UPDATE_COSIGN,
  CONFIRM_ADD_PAID_DAYS,
  CONFIRM_MERGE,
  CONFIRM_UPDATE_PROTOCOL,
  CONFIRM_UPDATE_VP,
  CONFIRM_UPDATE_ACCOUNT,
  CONFIRM_PAY,
  CONFIRM_ADMIN_WITHDRAW,
  CONFIRM_DELETE,
  CONFIRM_DELETE_VP,
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
