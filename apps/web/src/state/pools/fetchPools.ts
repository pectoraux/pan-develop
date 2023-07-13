import BigNumber from 'bignumber.js'
import { firestore } from 'utils/firebase'
import { GRAPH_API_PAIRS } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { getFeeToAddress, getPoolGaugeAddress } from 'utils/addressHelpers'
import { 
  getPoolGaugeContract,
  getBep20Contract,
} from '../../utils/contractHelpers'
import { pairFields } from './queries'

export const fetchRampData = async (rampAddress) => {
  return (await firestore.collection("ramps").doc(rampAddress).get()).data()
}

export const fetchSessionInfo = async (sessionId) => {
  return (await firestore.collection("onramp").doc(sessionId).get()).data()
}

export const getPairs = async (first = 5, skip = 0, where={}) => {
  try {
    const res = await request(
      GRAPH_API_PAIRS,
      gql`
      # query getProtocols($first: Int!, $skip: Int!, $where: NFT_filter, $orderDirection: OrderDirection) 
      {
        pairs(first: $first, skip: $skip, where: $where) {
          ${pairFields}
        }
      }
      `,
      { 
        first, 
        skip, 
        where,
      },
    )
    return res.pairs
  } catch (error) {
    console.error('Failed to fetch pairs', error)
    return []
  }
}

export const fetchPair = async (pairAddress) => {
  const tokenContract = await getBep20Contract(pairAddress)
  const poolGaugeContract = await getPoolGaugeContract()
  const [
    name,
    symbol,
    decimals,
    periodFinish,
    totalLiquidity,
    toDistribute
  ] = await Promise.all([
    tokenContract.name(),
    tokenContract.symbol(),
    tokenContract.decimals(),
    poolGaugeContract.periodFinish(pairAddress),
    tokenContract.balanceOf(getPoolGaugeAddress()),
    tokenContract.balanceOf(getFeeToAddress())
  ])

  let nextDue = parseInt(new BigNumber(periodFinish._hex).toJSON());
  if (nextDue === 0) {
    nextDue = Date.now() / 1000 + 86400 * 7
    nextDue = Number(nextDue)
  }
  // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
  return {
    name,
    symbol,
    decimals,
    nextDue,
    totalLiquidity: new BigNumber(totalLiquidity._hex).toJSON(),
    toDistribute: new BigNumber(toDistribute._hex).toJSON(),
  }
}

export const fetchPairs = async () => {
  const pairsFromSg = await getPairs()
  const pairs =  await Promise.all(
    pairsFromSg.map(async (pair, index) => {
    const data = await fetchPair(pair.id)
    return {
      sousId: index,
      ...pair,
      ...data
    }
  }).flat()
  )
  return pairs
}