import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import request, { gql } from 'graphql-request'
import { GRAPH_API_TRUSTBOUNTIES } from 'config/constants/endpoints'
import { getCollection } from 'state/cancan/helpers'
import { AddressZero } from '@ethersproject/constants'
import { DEFAULT_INPUT_CURRENCY } from 'config/constants/exchange'
import { getTrustBountiesContract } from '../../utils/contractHelpers'

const bountyField = `
id,
active,
avatar,
collectionId,
owner,
token,
terms,
bountySource,
parentBounty,
timestamp,
claims {
  id,
  hunter,
  winner,
  friendly,
  atPeace,
  endTime,
  amount,
}
`

const approvalField = `
id,
active,
amount,
endTime,
timestamp,
bounty {
  id
},
partnerBounty {
  id
},

`

export const getBounties = async (first: number, skip: number, where) => {
  try {
    const res = await request(
      GRAPH_API_TRUSTBOUNTIES,
      gql`
        query getBounties($first: Int!, $skip: Int!, $where: Bounty_filter)
        {
          bounties(first: $first, skip: $skip, where: $where) {
            ${bountyField},
            sentApprovals{
              ${approvalField}
            },
            receivedApprovals{
              ${approvalField}
            },
          }
        }
      `,
      { where, first, skip },
    )
    console.log("whereClause=================>", res)
    return res.bounties
  } catch(err) {
    console.log("err sg================>", err)
  }
  return []
}

export const fetchBounties = async (
  collectionId = 0, 
  fromAccelerator = false, 
  fromContributors = false,
  fromSponsors = false, 
  fromAuditors = false,
  fromBusinesses = false,
  fromRamps = false,
  fromTransfers = false,
) => {
  const trustbountiesContract = getTrustBountiesContract()
  const whereClause = Number(collectionId)
  ? {
      collectionId,
      active: true
    }
  : fromAccelerator
  ? {
      bountySource_contains_nocase: "Accelerator",
      active: true
    }
  : fromBusinesses
  ? {
      bountySource_contains_nocase: "Businesses",
      active: true
    } 
  : fromContributors
  ? {
      bountySource_contains_nocase: "Contributors",
      active: true
    } 
  : fromSponsors 
  ? {
      bountySource_contains_nocase: "Sponsors",
      active: true
    }
  : fromAuditors
  ? {
      bountySource_contains_nocase: "Auditors",
      active: true
    }
  : fromRamps
  ? {
      bountySource_contains_nocase: "Ramps",
      active: true
    }
  : fromTransfers
  ? {
    bountySource_contains_nocase: "Transfers",
    active: true
  } 
  : {
      active: true
    }
  const bountiesFromSg = await getBounties(1000, 0, whereClause)
  console.log("bountiesFromSg==============>", bountiesFromSg)
  const bounties =  await Promise.all(
    bountiesFromSg.map(async (bounty) => {
      const { id: bountyId } = bounty;
      const [[
        owner,
        token,
        ve,
        claimableBy,
        minToClaim,
        startTime,
        endTime,
        parentBountyId,
        isNFT,
      ],
      totalLiquidity,
    ] = await Promise.all([
        trustbountiesContract.bountyInfo(bountyId),
        trustbountiesContract.getBalance(bountyId),
    ])

    const collection = await getCollection(bounty.collectionId)
    const claims =  await Promise.all(
      bounty.claims.map(async (claim) => {
        const fromSg = await trustbountiesContract.claims(bountyId, parseInt(claim.id)-1)
        
        return {
          ...claim,
          atPeace: fromSg.status === 0,
          endTime: new BigNumber(fromSg.endTime._hex).toJSON(),
        }
    }))
    const friendlyClaims = claims.filter((claim) => claim.friendly && !claim.atPeace)

    return {
      ...bounty,
      collection,
      sousId: bountyId,
      ve, 
      tokenAddress: token,
      isNativeCoin: token.toLowerCase() === DEFAULT_INPUT_CURRENCY,
      token: new Token(
        56,
        token,
        18,
        'TUSD',
        'Binance-Peg TrueUSD Token',
        'https://www.trueusd.com/',
      ),
      owner, 
      claims,
      friendlyClaims,
      claimableBy: claimableBy === AddressZero ? "" : claimableBy,
      parentBountyId: new BigNumber(parentBountyId._hex).toJSON(),  
      startTime: new BigNumber(startTime._hex).toJSON(), 
      endTime: new BigNumber(endTime._hex).toJSON(), 
      minToClaim: new BigNumber(minToClaim._hex).toJSON(), 
      isNFT,
      totalLiquidity: new BigNumber(totalLiquidity._hex).toJSON(),
    }}).flat()
  )
  return bounties
}