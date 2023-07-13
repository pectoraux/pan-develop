export const pitchFields = `
  id
  active
  owner
  ve
  gauge
  bribe
  images
  title
  description
  upVotes
  downVotes
  creationTime
  votes {
    id,
    ve,
    like,
    tokenId,
    created,
    votingPower
  }
`