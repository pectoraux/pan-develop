export const voteFields = `
id
liked
bill
createdAt
updatedAt
profileId
`

export const billFields = `
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
    createdAt
    updatedAt
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
  optionId
  metadataUrl
  notes {
    id
    createdAt
    updatedAt
    metadataUrl
  }
`
