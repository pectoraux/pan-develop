export const sponsorFields = `
  id
  likes
  dislikes
  contents
  active
  owner
  profileId
  applicationLink
`

export const sponsorFields2 = `
  id
  likes
  dislikes
  avatar
  sponsorDescription
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
  sponsor
  media
  description
  notes {
    id
    metadataUrl
  }
`
