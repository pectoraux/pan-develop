export const collectionFields = `
  id
  active
  owner
  ve
  gauge
  bribe
  upVotes
  creationTime
  votes {
    id,
    ve,
    voter
    tokenId,
    created,
    votingPower
  }
`