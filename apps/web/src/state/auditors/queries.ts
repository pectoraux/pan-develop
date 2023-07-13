export const voteFields = `
id
liked
auditor
createdAt
updatedAt
profileId
`

export const auditorFields = `
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

export const auditorFields2 = `
  id
  likes
  dislikes
  avatar
  auditorDescription
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
