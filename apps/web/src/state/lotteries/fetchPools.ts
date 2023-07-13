import BigNumber from 'bignumber.js'
import { firestore } from 'utils/firebase'
import { Token } from '@pancakeswap/sdk'
import { GRAPH_API_LOTTERIES } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getCollection } from 'state/cancan/helpers'
import { 
  getLotteryContract,
  getBep20Contract,
} from '../../utils/contractHelpers'
import { lotteryFields } from './queries'

export const fetchRampData = async (rampAddress) => {
  return (await firestore.collection("ramps").doc(rampAddress).get()).data()
}

export const fetchSessionInfo = async (sessionId) => {
  return (await firestore.collection("onramp").doc(sessionId).get()).data()
}

export const getLottery = async (lotteryId) => {
  try {
    const res = await request(
      GRAPH_API_LOTTERIES,
      gql`
        query getLottery($lotteryId: Int) 
        {
          lottery(id: $lotteryId) {
            ${lotteryFields}
          }
        }
      `,
      { lotteryId },
    )
    console.log("getLottery=================>", lotteryId, res)
    return res.lottery
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, lotteryId)
    return null
  }
}

export const getLotteries = async (first = 5, skip = 0, where) => {
  try {
    const res = await request(
      GRAPH_API_LOTTERIES,
      gql`
        query getLotteries($where: Lottery_filter) 
        {
          lotteries(first: $first, skip: $skip, where: $where) {
            ${lotteryFields}
          }
        }
      `,
      { first, skip, where },
    )
    console.log("getLotteryFromSg33=============>", res)
    return res.lotteries
  } catch (error) {
    console.error('Failed to fetch protocol=============>', where, error)
    return null
  }
}

export const fetchLottery = async (lotteryId) => {
  const lotteryContract = getLotteryContract()
  const [[
    status,
    startTime,
    endTime,
    endAmount,
    discountDivisor,
    rewardsBreakdown,
    countWinnersPerBracket,
    firstTicketId,
    lockDuration,
    finalNumber,
    valuepool,
    owner,
    [
      priceTicket,
      fee,
      useNFTicket,
      referrerFee,
    ]],
    tokens,
  ] = await Promise.all([
      lotteryContract.viewLottery(lotteryId),
      lotteryContract.getAllTokens(lotteryId, 0),
  ])
  const _lottery = await getLotteries(0,0,{ id: lotteryId })
  const lottery = _lottery?.length && _lottery[0]
  const tokenData =  await Promise.all(
    tokens?.map(async (token) => {
      const tokenContract = getBep20Contract(token)
      const [
        name,
        decimals,
        symbol,
        _amountCollected,
      ] = await Promise.all([
        tokenContract.name(),
        tokenContract.decimals(),
        tokenContract.symbol(),
        lotteryContract.amountCollected(lotteryId, token),
      ])

      return {
        amountCollected: new BigNumber(_amountCollected._hex).toJSON(),
        token: new Token(
          56,
          token,
          decimals,
          symbol?.toUpperCase(),
          name,
          'https://www.trueusd.com/',
        ),
      }
    })
  )
  if (tokenData?.length === 0) {
    const tFiatAddress = "0xbE04187288D198ed6F0d90eCAAca0fE42Dd434Fe"
    const tokenContract = getBep20Contract(tFiatAddress)
      const [
        name,
        decimals,
        symbol,
        _amountCollected,
      ] = await Promise.all([
        tokenContract.name(),
        tokenContract.decimals(),
        tokenContract.symbol(),
        lotteryContract.amountCollected(lotteryId, tFiatAddress),
      ])
      tokenData.push({
        amountCollected: new BigNumber(_amountCollected._hex).toJSON(),
        token: new Token(
          56,
          tFiatAddress,
          decimals,
          symbol?.toUpperCase(),
          name,
          'https://www.trueusd.com/',
        ),
      })
  }
  
  // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
  return {
    id: lotteryId,
    users: lottery?.users,
    history: lottery?.history,
    status: status === 0 ? 'pending' : status === 1 ? 'open' : status === 2 ? 'close' : 'claimable',
    startTime: new BigNumber(startTime._hex).toJSON(),
    endTime: new BigNumber(endTime._hex).toJSON(),
    endAmount: new BigNumber(endAmount._hex).toJSON(),
    discountDivisor: new BigNumber(discountDivisor._hex).toJSON(),
    rewardsBreakdown: rewardsBreakdown.map((rwb) => new BigNumber(rwb._hex).dividedBy(100).toJSON()),
    countWinnersPerBracket: countWinnersPerBracket.map((cwb) => new BigNumber(cwb._hex).toJSON()),
    firstTicketId: new BigNumber(firstTicketId._hex).toJSON(),
    treasuryFee: new BigNumber(fee._hex).toJSON(),
    referrerFee: new BigNumber(referrerFee._hex).toJSON(),
    priceTicket: new BigNumber(priceTicket._hex).toJSON(),
    finalNumber: new BigNumber(finalNumber._hex).toJSON(),
    lockDuration: new BigNumber(lockDuration._hex).toJSON(),
    useNFTicket,
    owner,
    valuepool,
    tokenData,
  }
}

export const fetchLotteries = async ({ fromLottery }) => {
  const _lotteries = await getLotteries(0,0,{})
  
  const lotteries =  await Promise.all(
    _lotteries.map(async (lottery, index) => {
        const data = await fetchLottery(lottery.id)
        const collection = await getCollection(lottery.collectionId)
        return {
          sousId: index,
          ...lottery,
          ...data,
          collection
        }
    }).flat()
  )
  return lotteries
}