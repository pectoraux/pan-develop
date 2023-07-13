export const profileFields = `
  id
  name
  active
  timestamp
  metadataUrl
  collectionId
` 

export const tokenFields = `
  id
  amount
  bountyId
  createdAt
  updatedAt
  tokenAddress
`

export const accountFields = `
  id
  active
  createdAt
  updatedAt
  ownerAddress
`

export const registrationFields = `
  id
  active
  createdAt
  updatedAt
  follower {
    id
  }
  followee {
    id
  }
`

export const blacklistFields = `
  id
  active
  createdAt
  updatedAt
  owner {
    id
  }
  user {
    id
  }
`