export const auditorFields = `
  id
  likes
  dislikes
  avatar
  applicationLink
  auditorDescription
  contactChannels
  contacts
  workspaces
  countries
  cities
  products
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

export const pairFields = `
  id
  timestamp
  accounts {
    id
    ve
    tokenId
    amount
  }
`
