export const priceReductorFields = `
id
paywall
discountStatus
cashbackStatus
discountStart
cashbackStart
cashNotCredit
checkIdentityCode
checkItemOnly
discountNumbers
discountCost
cashbackNumbers
cashbackCost
`

export const identityProofFields = `
id
paywall
requiredIndentity
valueName
minIDBadgeColor
maxUse
dataKeeperOnly
onlyTrustWorthyAuditors
`

export const reviewFields = `
id
body
power
reviewer
reviewTime
good
normalReview
item
nft
paywall
`

export const optionFields = `
min
max
unitPrice
category
element
traitType
value
currency
`

export const transactionHistoryFields = `
id
block
nfTicketId
timestamp
askPrice
netPrice
tokenType
metadataUrl
collection {
  id
}
nft {
  id
}
paywall {
  id
}
item {
  id
}
buyer {
  id
}
seller {
  id
}
`

export const askHistoryFields = `
id
block
orderType
askPrice
timestamp
collection {
  id
}
nft {
  id
}
paywall {
  id
}
item {
  id
}
seller { 
  id 
}
`

export const userFields = `
id
numberTokensListed
numberPaywallsListed
numberNftsListed
numberTokensPurchased
numberNftsPurchased
numberPaywallsPurchased
numberTokensSold
numberNftsSold
numberPaywallsSold
totalVolumeInBNBTokensPurchased
totalVolumeInBNBNftsPurchased
totalVolumeInBNBPaywallsPurchased
totalVolumeInBNBTokensSold
totalVolumeInBNBNftsSold
totalVolumeInBNBPaywallsSold
totalFeesCollectedInBNB
averageTokenPriceInBNBPurchased
averagePaywallPriceInBNBPurchased
averageNftPriceInBNBPurchased
averageTokenPriceInBNBSold
averageNftPriceInBNBSold
averagePaywallPriceInBNBSold
buyTradeHistory {
  ${transactionHistoryFields}
}
sellTradeHistory {
  ${transactionHistoryFields}
}
askOrderHistory {
  ${askHistoryFields}
}
`

export const taskFields = `
id
isSurvey
required
active
createdAt
updatedAt
codes
linkToTask
item {
  id
}
nft {
  id
}
paywall {
  id
}
`

export const baseFields = `
id
tokenId
currentSeller
lastBidder
tFIAT
ve
bountyId
badgeId
active
updatedAt
maxSupply
totalTrades
dropinTimer
bidDuration
minBidIncrementPercentage
rsrcTokenId
currentAskPrice
latestTradedPriceInBNB
tradeVolumeBNB
transferrable
isTradable
usetFIAT
likes
disLikes
superLikes
superDisLikes
reviews
reviewers
reviewTimes
options {
  ${optionFields}
}
prices
start
period
description
countries
cities
products
images
collection {
  id
  avatar
}
tasks {
  ${taskFields}
}
priceReductor {
  ${priceReductorFields}
}
identityProof {
  ${identityProofFields}
}
superReviews {
  ${reviewFields}
}
transactionHistory {
  ${transactionHistoryFields}
}
askHistory {
  ${askHistoryFields}
}
`

export const itemFields = `
${baseFields}
behindPaywall
`

export const nftFields = `
${baseFields}
behindPaywall
minter
`

export const registrationFields = `
id
block
timestamp
bountyId
active
unregister
collection { 
  id 
  owner
}
userCollection { 
  id
  name
  description
  owner
  baseToken
  large
  small
  avatar
  contactChannels
  contacts
  workspaces
  countries
  cities
  products
}
`

export const announcementFields = `
id
block
title
body
active
updatedAt
timestamp
collection {
  id
}
`

export const valuepoolFields = `
id
active
valuepool
collection {
  id
}
`

export const dayDataFields = `
id
date
dailyVolumeBNB
dailyTrades
collection {
  id
}
`

export const marketPlaceDataFields =`
id
date
dailyVolumeBNB
dailyTrades
`

export const trialFields = `
id
period
optionId
paywallARP {
  id
}
`

export const protocolFields = `
id
active
autoCharge
createdAt
updatedAt
nfticketId
optionId
referrerCollectionId
periodReceivable
startReceivable
amountReceivable
paywallARP {
  id
}
paywall {
  id
}
`

export const paywallARPFields = `
id
active
createdAt
updatedAt
paywallAddress
collection {
  id
}
freeTrials {
  ${trialFields}
}
protocols {
  ${protocolFields}
}
`

export const noteFields = `
id
start
end
lender
`

export const paywallMirrorFields = `
id
active
createdAt
updatedAt
partner
item {
  ${itemFields}
}
nft {
  ${nftFields}
}  
paywall {
  id
}
partnerPaywall {
  id
  images
  tokenId
  currentSeller
  collection {
    id
    avatar
    small
    name
    totalVolumeBNB
  }
}
`

export const paywallFields = `
${baseFields}
canPublish
mirrors {
  ${paywallMirrorFields}
}
`

export const partnerRegistrationFields = `
id
block
active
unregister
bountyId
timestamp
identityProofId
collection {
  id
  owner
}
partnerCollection {
  id
  name
  description
  owner
  baseToken
  large
  small
  avatar
  contactChannels
  contacts
  workspaces
  countries
  cities
  products
}
mirrors {
  id
  item {
    ${itemFields}
  }
  nft {
    ${nftFields}
  }
  paywall {
    ${paywallFields}
  }
}
`

export const collectionBaseFields = `
id
name
description
badgeId
tradingFee
minBounty
userMinBounty
recurringBounty
userRecurringBounty
requestUserRegistration
requestPartnerRegistration
active
totalTrades
totalVolumeBNB
numberTokensListed
numberPartnerTokensListed
numberPartnerNftsListed
numberPaywallsListed
numberNftsListed
numberPartnersListed
referrerFee
owner
baseToken
large
small
avatar
contactChannels
contacts
workspaces
countries
cities
products
userIdentityProof {
  ${identityProofFields}
}
partnerIdentityProof {
  ${identityProofFields}
}
items {
  ${itemFields}
}
nfts {
  ${nftFields}
}
paywalls {
  ${paywallFields}
}
registrations {
  ${registrationFields}
}
partnerRegistrations {
  ${partnerRegistrationFields}
}
announcements {
  ${announcementFields}
}
valuepools {
  ${valuepoolFields}
}
dayData {
  ${dayDataFields}
}
`