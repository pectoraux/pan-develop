export const voteFields = `
  id
  ve
  tokenId
  profileId
  identityTokenId
  votingPower
  like
  created
  updated
`

export const proposalFields = `
id
active
owner
title
description
upVotes
downVotes
created
updated
countries
cities
products
amount
endTime
votes{
  ${voteFields}
}
`

export const valuepoolFields = `
id
period
minPeriod
minDifference
collectionId
minBountyRequired
minimumLockValue
voteOption
created
Updated
`
