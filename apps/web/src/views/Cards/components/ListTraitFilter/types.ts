import { NftAttribute } from 'state/cancan/types'

export interface Item {
  label: string
  attr: NftAttribute
  count?: number
  image?: string
}
