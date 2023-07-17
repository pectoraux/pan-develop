import BigNumber from 'bignumber.js'
import { firestore } from 'utils/firebase'
import { Token } from '@pancakeswap/sdk'
import { GRAPH_API_WILLS } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { getCollection } from 'state/cancan/helpers'
import { getWillContract, getWillNoteContract, getBep20Contract } from '../../utils/contractHelpers'
import { willFields, protocolFields } from './queries'

export const fetchRampData = async (rampAddress) => {
  return (await firestore.collection("ramps").doc(rampAddress).get()).data()
}

export const fetchSessionInfo = async (sessionId) => {
  return (await firestore.collection("onramp").doc(sessionId).get()).data()
}

export const getProtocols = async (first = 5, skip = 0, where={}) => {
  try {
    const res = await request(
      GRAPH_API_WILLS,
      gql`
      query getProtocols($first: Int!, $skip: Int!, $where: Protocol_filter, $orderDirection: OrderDirection) 
      {
        protocols(first: $first, skip: $skip, where: $where) {
          ${protocolFields}
        }
      }
      `,
      { 
        first, 
        skip, 
        where,
      },
    )
    return res.protocols
  } catch (error) {
    console.error('Failed to fetch protocols===========>', error)
    return []
  }
}

export const getProtocol = async (willAddress: string) => {
  try {
    const res = await request(
      GRAPH_API_WILLS,
      gql`
        query getProtocolData($willAddress: String!) 
        {
          protocols(where: { will: $willAddress }) {
            ${protocolFields}
          }
        }
      `,
      { willAddress },
    )
    return res.protocols
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, willAddress)
    return null
  }
}

export const getWill = async (willAddress) => {
  try {
    const res = await request(
      GRAPH_API_WILLS,
      gql`
        query getWill($willAddress: String) 
        {
          will(id: $willAddress) {
            ${willFields}
          }
        }
      `,
      { willAddress },
    )
    console.log("getWill=================>", willAddress, res)
    return res.will
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, willAddress)
    return null
  }
}

export const getWills = async (first = 5, skip = 0, where) => {
  try {
    const res = await request(
      GRAPH_API_WILLS,
      gql`
        query getWills($where: WILL_filter) 
        {
          wills(first: $first, skip: $skip, where: $where) {
            ${willFields}
          }
        }
      `,
      { first, skip, where },
    )
    console.log("getWillsFromSg33=============>", res)
    return res.wills
  } catch (error) {
    console.error('Failed to fetch protocol=============>', where, error)
    return null
  }
}

export const fetchWill = async (willAddress) => {
  const willContract = getWillContract(willAddress)
  const will = await getWill(willAddress.toLowerCase())
  const tokens = await Promise.all(
    will?.tokens?.map(async(token) => {
      const tokenContract = getBep20Contract(token.tokenAddress)
      const [
        name,
        symbol,
        decimals,
        totalLiquidity
      ] = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.decimals(),
        tokenContract.balanceOf(willAddress)
      ])
      return {
        ...token,
        name,
        decimals,
        symbol: symbol?.toUpperCase(),
        totalLiquidity: new BigNumber(totalLiquidity._hex).toJSON()
      }
  }))
  const [ 
    devaddr_,
    bountyRequired,
    _profileId,
    contractMedia,
    willWithdrawalPeriod,
    minWithdrawableNow,
    minNFTWithdrawableNow,
    updatePeriod,
    unlocked,
    collectionId,
  ] = await Promise.all([
      willContract.devaddr_(),
      willContract.adminBountyRequired(),
      willContract.profileId(),
      willContract.media(),
      willContract.willWithdrawalPeriod(),
      willContract.minWithdrawableNow(),
      willContract.minNFTWithdrawableNow(),
      willContract.updatePeriod(),
      willContract.unlocked(),
      willContract.collectionId(),
  ])
  const collection = await getCollection(new BigNumber(collectionId._hex).toJSON())
  const accounts =  await Promise.all(
    will?.protocols?.map(async (protocol) => {
      const protocolId = protocol.id.split('_')[0]
      const [
        [
        createdAt,
        updatedAt,
        media,
        description,
      ],
      locked,
      ] = await Promise.all([
        willContract.protocolInfo(protocolId),
        willContract.locked(protocolId),
      ])
      console.log("tokens===============>",1)
      const _tokens = await Promise.all(protocol?.percentages?.map(async(perct, idx) => willContract.tokens(protocolId, idx)))
      console.log("tokens===============>", _tokens)
      const percentages = protocol?.percentages?.map((percentage) => parseInt(percentage) / 100)
      const tokenData =  await Promise.all(
        _tokens?.map(async (token) => {
        const tokenContract = getBep20Contract(token)
        const totalLiquidity = await tokenContract.balanceOf(willAddress)
        const tokenName = await tokenContract.name()
        const decimals = await tokenContract.decimals()
        const symbol = await tokenContract.symbol()
        const [
            willActivePeriod,
            balanceOf,
            totalRemoved,
            tokenType,
            _adminBountyId,
            totalProcessed,
          ] = await Promise.all([
            willContract.willActivePeriod(token),
            willContract.balanceOf(token),
            willContract.totalRemoved(token),
            willContract.tokenType(token),
            willContract.adminBountyId(token),
            willContract.totalProcessed(token),
          ])
          return {
            willActivePeriod: new BigNumber(willActivePeriod._hex).toJSON(),
            balanceOf: new BigNumber(balanceOf._hex).toJSON(),
            totalRemoved: new BigNumber(totalRemoved._hex).toJSON(),
            adminBountyId: new BigNumber(_adminBountyId._hex).toJSON(),
            totalProcessed: new BigNumber(totalProcessed._hex).toJSON(),
            totalLiquidity: new BigNumber(totalLiquidity._hex).toJSON(),
            tokenType,
            token: new Token(
              56,
              token,
              decimals,
              symbol,
              tokenName,
              'https://www.trueusd.com/',
            ),
          }
        })
      )

      return {
        ...protocol,
        protocolId,
        tokenData,
        percentages,
        media,
        description,
        locked,
        collectionId: new BigNumber(collectionId._hex).toJSON(),
        createdAt: new BigNumber(createdAt._hex).toJSON(),
        updatedAt: new BigNumber(updatedAt._hex).toJSON(),
        // allTokens.find((tk) => tk.address === token),
      }
    })
  )

  // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
  return {
    ...will,
    tokens,
    willAddress,
    accounts,
    unlocked,
    collection,
    contractMedia,
    willWithdrawalPeriod: new BigNumber(willWithdrawalPeriod._hex).toJSON(),
    minWithdrawableNow: new BigNumber(minWithdrawableNow._hex).toJSON(),
    minNFTWithdrawableNow: new BigNumber(minNFTWithdrawableNow._hex).toJSON(),
    updatePeriod: new BigNumber(updatePeriod._hex).toJSON(),
    devaddr_,
    profileId: new BigNumber(_profileId._hex).toJSON(),
    bountyRequired: new BigNumber(bountyRequired._hex).toJSON(),
  }
}

export const fetchWills = async ({ fromWill }) => {
  const willHelperContract = getWillNoteContract()
  const willAddresses = await willHelperContract.getAllWills(0)
  console.log("1fetchWills==================>", willAddresses)
  const wills =  await Promise.all(
    willAddresses.filter((willAddress) =>
      fromWill ? willAddress?.toLowerCase() === fromWill?.toLowerCase() : true)
      .map(async (willAddress, index) => {
        console.log("2fetchWills==================>2")
        const data = await fetchWill(willAddress)
        console.log("3fetchWills==================>", data)
        return {
          sousId: index,
          ...data
        }
    }).flat()
  )
  return wills
}