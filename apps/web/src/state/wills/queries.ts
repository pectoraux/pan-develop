export const protocolFields = `
  id
  active
  owner
  token
  media
  description
  profileId
  createdAt
  updatedAt
  tokens
  percentages
`

export const tokenFields = `
  id
  active
  tokenAddress
  tokenType
  value
`

export const willFields = `
  id
  profileId
  updatePeriod
  minWithdrawableNow
  minNFTWithdrawableNow
  active
  owner
  protocols {
    ${protocolFields}
  }
  tokens {
    ${tokenFields}
  }
  notes {
    id
    metadataUrl
  }
`
