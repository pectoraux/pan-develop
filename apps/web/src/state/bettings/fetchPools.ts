import BigNumber from 'bignumber.js'
import { firestore } from 'utils/firebase'
import { Token } from '@pancakeswap/sdk'
import { GRAPH_API_BETTINGS } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { getCollection } from 'state/cancan/helpers'
import { 
  getBettingMinterContract,
  getBettingContract,
  getBep20Contract,
} from '../../utils/contractHelpers'
import { bettingFields } from './queries'

export const fetchRampData = async (rampAddress) => {
  return (await firestore.collection("ramps").doc(rampAddress).get()).data()
}

export const fetchSessionInfo = async (sessionId) => {
  return (await firestore.collection("onramp").doc(sessionId).get()).data()
}

// export const getProtocols = async (first = 5, skip = 0, where={}) => {
//   try {
//     const res = await request(
//       GRAPH_API_BETTINGS,
//       gql`
//       query getProtocols($first: Int!, $skip: Int!, $where: Protocol_filter, $orderDirection: OrderDirection) 
//       {
//         protocols(first: $first, skip: $skip, where: $where) {
//           ${protocolFields}
//         }
//       }
//       `,
//       { 
//         first, 
//         skip, 
//         where,
//       },
//     )
//     return res.protocols
//   } catch (error) {
//     console.error('Failed to fetch protocols===========>', error)
//     return []
//   }
// }

// export const getProtocol = async (bettingAddress: string) => {
//   try {
//     const res = await request(
//       GRAPH_API_BETTINGS,
//       gql`
//         query getProtocolData($bettingAddress: String!) 
//         {
//           protocols(where: { betting: $bettingAddress }) {
//             ${protocolFields}
//           }
//         }
//       `,
//       { bettingAddress },
//     )
//     return res.protocols
//   } catch (error) {
//     console.error('Failed to fetch protocol=============>', error, bettingAddress)
//     return null
//   }
// }

export const getBetting = async (bettingAddress) => {
  try {
    const res = await request(
      GRAPH_API_BETTINGS,
      gql`
        query getBetting($bettingAddress: String) 
        {
          betting(id: $bettingAddress) {
            ${bettingFields}
          }
        }
      `,
      { bettingAddress },
    )
    const bettingEvents = res.betting?.bettingEvents?.map((be) => {
      const currPeriod = Number((Date.now() / 1000 - Number(be.startTime || 0)) / Number(be.bracketDuration || 0))
      const currStart = parseInt(be.startTime || 0) + currPeriod * parseInt(be.bracketDuration || 0)
      const currEnd = currStart + parseInt(be.bracketDuration)
      return {
        ...be,
        currStart,
        currEnd,
        currPeriod,
        rewardsBreakdown: be.rewardsBreakdown?.map((rwb) => parseInt(rwb) / 100)
      }
    })
    console.log("getBetting=================>", bettingAddress, res, bettingEvents)
    return {
      ...res.betting,
      bettingEvents
    }
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, bettingAddress)
    return null
  }
}

export const getBettings = async (first = 5, skip = 0, where) => {
  try {
    const res = await request(
      GRAPH_API_BETTINGS,
      gql`
        query getBettings($where: Betting_filter) 
        {
          bettings(first: $first, skip: $skip, where: $where) {
            ${bettingFields}
          }
        }
      `,
      { first, skip, where },
    )
    console.log("getBettingsFromSg33=============>", res)
    return res.bettings
  } catch (error) {
    console.error('Failed to fetch protocol=============>', where, error)
    return null
  }
}

export const fetchBetting = async (bettingAddress) => {
  const bettingFromSg = await getBetting(bettingAddress)
  const bettingContract = getBettingContract(bettingAddress)
  const bettingMinterContract = getBettingMinterContract()
  const [
    collectionId, 
    devaddr_,
  ] = await Promise.all([
    bettingContract.collectionId(),
    bettingContract.devaddr_(),
  ])
  const collection = await getCollection(new BigNumber(collectionId._hex).toJSON())
  console.log("2bettingFromSg===================>", bettingFromSg, collection, collectionId)
  const bettingEvents =  await Promise.all(
    bettingFromSg?.bettingEvents?.map(async (bettingEvent) => {
      const [[
      _token,  
      action,
      alphabetEncoding,
      startTime,  
      numberOfPeriods,
      nextToClose,
      adminShare,
      referrerShare,
      bracketDuration,
      pricePerTicket,
      discountDivisor,
      newTicketRange,
      newMinTicketNumber,
    ],
    // [
    //   burnToken,
    //   checker,
    //   destination,
    //   discount,
    //   burnCollectionId,
    //   item,
    // ],
      ticketSize,
    ] = await Promise.all([
      bettingContract.protocolInfo(bettingEvent.bettingId),
        // bettingFactoryContract.burnTokenForCredit(bettingId)
      bettingContract.ticketSizes(bettingEvent.bettingId),
    ])
    // const tickets = await Promise.all(
    //   bettingEvent?.tickets.map(async (ticket) => {
    //     const metadataUrl = await bettingMinterContract.tokenURI(ticket.id)
    //     return {
    //       ...ticket,
    //       metadataUrl2: metadataUrl
    //     }
    //   })
    // )
    console.log("protocolInfo==============>",
    // tickets,
    _token,  
    action,
    startTime,  
    adminShare,
    referrerShare,
    bracketDuration,
    pricePerTicket,
    discountDivisor,)
    const tokenContract = getBep20Contract(_token)
    const [
      name,
      symbol,
      decimals
    ] = await Promise.all([
      tokenContract.name(),
      tokenContract.symbol(),
      tokenContract.decimals(),
    ])
    // const currPeriod = parseInt((Date.now() / 1000 - parseInt(new BigNumber(startTime._hex).toJSON())) / parseInt(new BigNumber(bracketDuration._hex).toJSON()))
    // console.log("currPeriod=============>", currPeriod)
    // console.log("currPeriod=============>", 
    // Date.now(), 
    // startTime, 
    // parseInt(new BigNumber(bracketDuration._hex).toJSON()), 
    // Date.now() / 1000 - parseInt(new BigNumber(startTime._hex).toJSON()),
    // currPeriod)
    // const arrLength = parseInt(new BigNumber(numberOfPeriods._hex).toJSON()) === 0 ? bettingEvent.currPeriod + 5 : Math.min(bettingEvent.currPeriod + 5, numberOfPeriods.toNumber())
    // const arr = Array.from({length: Number(bettingEvent?.periods?.length || 0)}, (v, i) => i)
    // const arr2 = Array.from({length: ticketSize.toNumber()}, (v, i) => i)
    // console.log("arrLength================>", arrLength)
    // const rewardsBreakdown =  bettingEvent?.rewardsBreakdown.map((rwb) => parseInt(rwb) / 100)
    // await Promise.all(
    //   arr2?.map(async (idx) => {
    //     const rwb = await bettingContract.rewardsBreakdown(bettingEvent.bettingId, idx)
    //     return parseInt(new BigNumber(rwb._hex).toJSON()) / 100
    // }))
    // console.log("rewardsBreakdown===============>", rewardsBreakdown)
    // let subjects;
    // try {
    //   subjects =  await Promise.all(
    //     arr2?.map(async (idx) => bettingContract.subjects(bettingEvent.bettingId, idx))
    //   )
    // } catch(err) { console.log("subjects err========>", err)}
    // console.log("subjects==============>", subjects)
    // const brackets =  await Promise.all(
    //   arr.map(async (idx) => {
    //     try {
    //       // const _status = await bettingContract.status(bettingEvent.bettingId, idx)
    //       // const amount = await bettingContract.amountCollected(bettingEvent.bettingId, idx)
    //       // const _finalNumber = await bettingContract.finalNumbers(bettingEvent.bettingId, idx)
    //       // const _countWinnersPerBracket =  await Promise.all(
    //       //   arr2?.map(async (i) => {
    //       //     const wc = await bettingContract.countWinnersPerBracket(bettingEvent.bettingId, idx, i)
    //       //     return new BigNumber(wc._hex).toJSON()
    //       // }))
    //       return {
    //         idx,
    //         subjects,
    //         rewardsBreakdown,
    //         action,
    //         pricePerTicket: new BigNumber(pricePerTicket._hex).toJSON(),
    //         adminShare: new BigNumber(adminShare._hex).toJSON(),
    //         referrerShare: new BigNumber(referrerShare._hex).toJSON(),
    //         finalNumber: new BigNumber(_finalNumber._hex).toJSON(),
    //         countWinnersPerBracket: _countWinnersPerBracket,
    //         amountCollected: new BigNumber(amount._hex).toJSON(),
    //         status: currPeriod === idx 
    //         ? "Pending" 
    //         : _status === 1 
    //         ? "Open" 
    //         : _status === 2
    //         ? "Close"
    //         : "Claimable"
    //       }
    //     } catch(err) { 
    //       console.log("1brackets==========>", err) 
    //     }
    //   })
    // )
  // console.log("brackets==============>", brackets)
  return {
    id: bettingAddress,
    ...bettingEvent,
    // tickets2: tickets,
    alphabetEncoding,
    ticketSize: new BigNumber(ticketSize._hex).toJSON(),
    startTime: new BigNumber(startTime._hex).toJSON(),
    nextToClose: new BigNumber(nextToClose._hex).toJSON(),
    adminShare: new BigNumber(adminShare._hex).toJSON(),
    numberOfPeriods: new BigNumber(numberOfPeriods._hex).toJSON(),
    referrerShare: new BigNumber(referrerShare._hex).toJSON(),
    bracketDuration: new BigNumber(bracketDuration._hex).toJSON(),
    pricePerTicket: new BigNumber(pricePerTicket._hex).toJSON(),
    discountDivisor: new BigNumber(discountDivisor._hex).toJSON(),
    newTicketRange: new BigNumber(newTicketRange._hex).toJSON(),
    newMinTicketNumber: new BigNumber(newMinTicketNumber._hex).toJSON(),
    token: new Token(
      56,
      _token,
      decimals,
      symbol,
      name,
      'https://www.trueusd.com/',
    ),
  }}))
  return {
    ...bettingFromSg,
    collection,
    devaddr_,
    collectionId: new BigNumber(collectionId._hex).toJSON(),
    bettingEvents
  }
}

export const fetchBettings = async ({ fromBetting }) => {
  const bettingsFromSg = await getBettings(0,0,{})
  const bettings =  await Promise.all(
    bettingsFromSg.filter((betting) => fromBetting ? betting?.id === fromBetting : true)
      .map(async (betting, index) => {
        const data = await fetchBetting(betting.id)
        console.log("bettingsFromSg=============>", data)
        return {
          sousId: index,
          ...data
        }
    }).flat()
  )
  return bettings
}