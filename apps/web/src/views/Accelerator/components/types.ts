import { TokenMarketData, Image } from 'state/cancan/types'


export enum LockStage {
  ADMIN_SETTINGS,
  SETTINGS,
  DISTRIBUTE,
  UPLOAD_MEDIA,
  UPDATE_BRIBES,
  UPLOAD_AD_KIT,
  UPDATE_PARAMETERS,
  UPDATE_GEO_CODES,
  APPROVE_AND_CONFIRM,
  CONFIRM,
  MINT_RPNFT,
  WITHDRAW,
  DELETE,
  DEPOSIT,
  WITHDRAW_FROM_NFT,
  ADMIN_WITHDRAW,
  UPDATE_BOUNTY,
  BUY_WORLD,
  VOTE_UP,
  VOTE_DOWN,
  CONFIRM_DISTRIBUTE,
  CONFIRM_VOTE_UP,
  CONFIRM_VOTE_DOWN,
  CONFIRM_UPDATE_BRIBES,
  CONFIRM_UPDATE_PARAMETERS,
  CONFIRM_UPDATE_BOUNTY,
  CONFIRM_ADMIN_WITHDRAW,
  CONFIRM_MINT_RPNFT,
  CONFIRM_WITHDRAW,
  CONFIRM_DELETE,
  CONFIRM_WITHDRAW_FROM_NFT,
  CONFIRM_BUY_WORLD,
  CONFIRM_DEPOSIT,
  CONFIRM_CLAIM_BOUNTY,
  TX_CONFIRMED,
  CLAIM_BOUNTY
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
