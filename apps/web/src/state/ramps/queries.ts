export const rampFields = `
id
owner
collectionId
description
rampAddress
applicationLink
publishableKeys
secretKeys
clientIds
avatar
channels
profileId
likes
dislikes
sessions {
    id
    user
    active
    amount
    sessionId
    mintSession
    tokenAddress
    identityTokenId
}
tokens {
    id
    addedToTokenSet
}
transactionHistory {
    id
    user
    block
    token
    txType
    netPrice
    timestamp
}
`
export const sessionFields = `
id
user
active
amount
sessionId
mintSession
tokenAddress
identityTokenId
`

export const accountFields = `
id
owner
active
channel
moreInfo
timestamp
`