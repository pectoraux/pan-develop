import BigNumber from 'bignumber.js'
import request, { gql } from 'graphql-request'
import { VESTING_ESCROW } from 'views/Vesting/config'
import { GRAPH_API_VALUEPOOLS } from 'config/constants/endpoints'
import { AddressZero } from '@ethersproject/constants'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getSponsors } from 'state/sponsors/fetchPools'
import { getItemsSg } from 'state/cancan/helpers'
import { isAddress } from '@ethersproject/address'
import { 
  getValuepoolHelperContract,
  getValuepoolContract,
  getVaFactoryContract,
  getBep20Contract,
  getVaContract,
} from '../../utils/contractHelpers'

const valuepoolField = `
id
active
riskpool
initialized
bnpl
onePersonOneVote
name
description
ve
devaddr_
tokenAddress
veName
veSymbol
veDecimals
maxSupply
minTicketPrice
minToSwitch
countries
cities
products
timestamp
queueDuration
maxDueReceivable
minReceivable
treasuryShare
maxWithdrawable
lenderFactor
minimumSponsorPercentile
veBalance
`
const transactionFields =`
id
block
timestamp
tokenId
veAddress
user
netPrice
depositType
rank
locktime
txType
valuepool {
  id
}
`
const sponsorFields =`
id
card
active
timestamp
updatedAt
amount
percentile
`
const loanFields = `
id
createAt
updatedAt
tokenId
amount
active
borrower
token
loanType
`
const tokenFields = `
id
vePercentile
vavaPercentile
tokenId
owner
lockAmount
lockValue
lockTime
createAt
updatedAt
metadataUrl
`
const purchaseFields = `
id
timestamp
updatedAt
active
collection
from
referrer
productId
options
userTokenId
identityTokenId
tokenId
rank
epoch
price
`

export const fetchValuepool = async (valuepoolContract) => {
  try {
  const valuepoolAddress = valuepoolContract.address
  console.log("valuepoolsFromSg26=============>", valuepoolAddress)
      const [ 
        tokenAddress, 
        [
          maxUse,
          queueDuration,
          minReceivable, 
          maxDueReceivable,
          maxTreasuryShare,
          lenderFactor,
          minimumSponsorPercentile,
          minIDBadgeColor,
          dataKeeperOnly,
          uniqueAccounts,
          requiredIndentity,
          valueName
        ],
        _va,
        devaddr_,
        maxWithdrawable,
        merchantMinIDBadgeColor,
        merchantValueName,
        totalpaidBySponsors,
        treasuryShare,
        _sponsorAddresses,
        epoch
      ] = await Promise.all([
          valuepoolContract.token(),
          valuepoolContract.getParams(),
          valuepoolContract._ve(),
          valuepoolContract.devaddr_(),
          valuepoolContract.maxWithdrawable(),
          valuepoolContract.merchantMinIDBadgeColor(),
          valuepoolContract.merchantValueName(),
          valuepoolContract.totalpaidBySponsors(),
          valuepoolContract.treasuryShare(),
          valuepoolContract.getAllSponsors(0,1,false),
          valuepoolContract.epoch(),
      ])
      const initialized = _va !== AddressZero
      const sponsorAddresses = _sponsorAddresses.map((sponsorAddress) => sponsorAddress?.toLowerCase())
      const sponsors = await getSponsors(0,0,{ id_in: sponsorAddresses})
      console.log("valuepoolsFromSg3_=============>", sponsors, sponsorAddresses)
      // const arr = Array.from({length: 100}, (v, i) => i)
      // let queue =  await Promise.all(
      //   arr.slice(1,).map(async (rank) => {
      //     const currQ = await valuepoolContract.getQueue(rank)
      //     return Promise.all(
      //       currQ.map(async (q) => {
      //       return valuepoolContract.scheduledPurchases(
      //         new BigNumber(epoch._hex).toJSON(),
      //         new BigNumber(q._hex).toJSON()
      //       )
      //     })
      //     )
      //   })
      // )
      // queue = Object.values(queue.filter((q) => q.length))
      // const augmentedQ = await Promise.all(
      //   queue.map(async (q) => {
      //     const where = { currentSeller: q[0][0]?.toLowerCase(), tokenId: q[0][3] }
      //     const res = await getItemsSg(0,0, where)
      //     return {
      //       referrer: q[0][1],
      //       owner: q[0][2],
      //       userTokenId: q[0][4],
      //       rank: q[0][6],
      //       ...res
      //     }
      //   })
      // )
      // console.log("augmentedQ==================>", augmentedQ, queue)
      const tokenContract = getBep20Contract(tokenAddress)
      const [
        name,
        symbol,
        decimals,
        totalLiquidity
      ] = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.decimals(),
        tokenContract.balanceOf(valuepoolAddress)
      ])
      console.log("totalLiquidity==================>", totalLiquidity, tokenContract)
      const vaContract = getVaContract(_va)
      console.log("valuepoolsFromSg34=============>", _va)
      const supply = initialized ? (await vaContract.getParams())[0] : BIG_ZERO
      const vaName = initialized ? await vaContract.name() : ''
      const vaSymbol = initialized ? await vaContract.symbol() : ''
      const vaDecimals = initialized ? await vaContract.decimals() : 18
      // const latestTokenId = initialized ? await vaContract?.tokenId() : '0'
      const riskpool = initialized ? await vaContract?.riskpool() : undefined
      console.log("valuepoolsFromSg4=============>",totalLiquidity, supply, vaName, vaDecimals)
      const colors = {
        '3': 'Gold',
        '2': 'Silver',
        '1': 'Brown',
        '0': 'Black'
      }
    // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
    return {
      _va,
      // queue: augmentedQ,
      vaName,
      sponsors,
      vaSymbol,
      vaDecimals,
      valuepoolAddress,
      tokenAddress,
      initialized,
      supply,// : supply.(10**vaDecimals),
      // latestTokenId: initialized && latestTokenId ? latestTokenId : '0',
      totalLiquidity: new BigNumber(totalLiquidity._hex).div(10**decimals).toFixed(decimals),
      devaddr_,
      requiredIndentity,
      valueName,
      riskpool,
      totalpaidBySponsors: new BigNumber(totalpaidBySponsors._hex).toJSON(),
      treasuryShare: new BigNumber(treasuryShare._hex).div(100).toJSON(),
      maxWithdrawable: new BigNumber(100).minus(new BigNumber(maxWithdrawable._hex).div(100)).toJSON(),
      merchantMinIDBadgeColor: colors[new BigNumber(merchantMinIDBadgeColor._hex).toJSON()],
      merchantValueName,
      maxDueReceivable: new BigNumber(maxDueReceivable._hex).toJSON(),
      queueDuration: new BigNumber(queueDuration._hex).toJSON(),
    }
  } catch(err) {
    console.log("rerr==============>", err)
  }
  return {}
}

export const getValuepoolsSg = async (first: number, skip: number, where) => {
  try {
    const res = await request(
      GRAPH_API_VALUEPOOLS,
      gql`
        query getValuepools($where: Valuepool_filter) 
        {
          valuepools(first: $first, skip: $skip, where: $where) {
            ${valuepoolField}
            sponsorAddresses {
              ${sponsorFields}
            }
            loans {
              ${loanFields}
            }
            tokens {
              ${tokenFields}
            }
            purchaseHistory {
              ${purchaseFields}
            }
            transactionHistory{
              ${transactionFields}
            }
          }
        }
      `,
      { first, skip, where },
    )
    console.log("res.valuepools================>", res.valuepools)
    return res.valuepools
  } catch(err) {
      console.log("err sg================>", err)
  }
  return []
}

export const fetchValuepools = async ({ fromVesting, fromValuepool }) => {
  const valuepoolHelperContract = getValuepoolHelperContract()
  console.log("fromValuepool==========>", fromValuepool, isAddress(fromValuepool))
  const whereClause = isAddress(fromValuepool) && fromValuepool !== AddressZero
  ? {
    active: true,
    id_in: [ fromValuepool?.toLowerCase() ]
  } : fromVesting
  ? {
    active: true,
    id_in: VESTING_ESCROW
  } : {
    active: true
  }
  const valuepoolsFromSg = await getValuepoolsSg(0, 0, whereClause)
  console.log("valuepoolsFromSg===================>", valuepoolsFromSg)
  try {
    const valuepools =  await Promise.all(
      valuepoolsFromSg.map(async ({ id, ...rest }, index) => {
        console.log("valuepoolsFromSg1===================>")
        const valuepoolContract = getValuepoolContract(id)
        const data = await fetchValuepool(valuepoolContract)
        console.log("valuepoolsFromSg2===================>", data)
        const onePersonOneVote = await valuepoolHelperContract.onePersonOneVote(id)
        const res = {
          sousId: index.toString(),
          id,
          onePersonOneVote,
          ...data,
          ...rest,
        }
        console.log("valuepoolsFromSg3===================>", onePersonOneVote, res)
        
        return res
      }).flat()
    )
    console.log("valuepoolsFromSg5===================>")
    return valuepools
  } catch (err) {
    console.log("rerr1=====================>", err)
  }
  return valuepoolsFromSg
}

export const fetchPoolVA = async(valuepoolAddress) => {
  const vaFactory = getVaFactoryContract()
  // const _va = await vaFactory.ves(valuepoolAddress)
  return valuepoolAddress
}