export const voteFields = `
id
liked
futureCollateral
createdAt
updatedAt
profileId
`

export const futureCollateralFields = `
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
  notes {
    id
    metadataUrl
  }
`

export const futureCollateralFields2 = `
  id
  likes
  dislikes
  avatar
  futureCollateralDescription
  contacts {
    channel
    value
  }
  workspaces {
    traitType
    value
  }
  countries {
    traitType
    value
  }
  cities {
    traitType
    value
  }
  products {
    traitType
    value
  }
`

export const protocolFields = `
  id
  active
  owner
  media
  description
  ratings
  esgRating
  tokens {
    id
    metadataUrl
  }
`
