export const litigationFields = `
  id
  attackerId
  defenderId
  creationTime
  endTime
  percentile
  gas
  active
  upVotes
  downVotes
  ve
  token
  title
  votes {
    id,
    voter,
    choice,
    created,
    votingPower
  }
  attackerContent
  defenderContent
  countries
  cities
  products
`
