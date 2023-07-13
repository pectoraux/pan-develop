export const voteFields = `
id
liked
world
createdAt
updatedAt
profileId
`

export const worldNFTFields = `
id
tokenId
metadataUrl
`

export const worldFields = `
  id
  owner
  active
  likes
  dislikes
  profileId
  applicationLink
  votes {
    ${voteFields}
  }
  worldNFTs {
    ${worldNFTFields}
  }
  notes {
    id
    metadataUrl
  }
`

export const protocolFields = `
  id
  active
  owner
  media
  description
  autoCharge
  token
`