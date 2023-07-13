import BigNumber from 'bignumber.js'
import { firestore } from 'utils/firebase'
import { Token } from '@pancakeswap/sdk'
import { GRAPH_API_ARPS } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getCollection } from 'state/cancan/helpers'
import { 
  getARPNoteContract,
  getARPHelperContract,
  getARPContract,
  getBep20Contract,
} from '../../utils/contractHelpers'
import { arpFields, protocolFields } from './queries'

export const fetchRampData = async (rampAddress) => {
  return (await firestore.collection("ramps").doc(rampAddress).get()).data()
}

export const fetchSessionInfo = async (sessionId) => {
  return (await firestore.collection("onramp").doc(sessionId).get()).data()
}

export const getProtocols = async (first = 5, skip = 0, where={}) => {
  try {
    const res = await request(
      GRAPH_API_ARPS,
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

export const getProtocol = async (arpAddress: string) => {
  try {
    const res = await request(
      GRAPH_API_ARPS,
      gql`
        query getProtocolData($arpAddress: String!) 
        {
          protocols(where: { arp: $arpAddress }) {
            ${protocolFields}
          }
        }
      `,
      { arpAddress },
    )
    return res.protocols
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, arpAddress)
    return null
  }
}

export const getArp = async (arpAddress) => {
  try {
    const res = await request(
      GRAPH_API_ARPS,
      gql`
        query getArp($arpAddress: String) 
        {
          arp(id: $arpAddress) {
            ${arpFields}
            protocols {
              ${protocolFields}
            }
          }
        }
      `,
      { arpAddress },
    )
    console.log("getArp=================>", arpAddress, res)
    return res.arp
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, arpAddress)
    return null
  }
}

export const getArps = async (first = 5, skip = 0, where) => {
  try {
    const res = await request(
      GRAPH_API_ARPS,
      gql`
        query getArps($where: ARP_filter) 
        {
          arps(first: $first, skip: $skip, where: $where) {
            ${arpFields}
            protocols {
              ${protocolFields}
            }
          }
        }
      `,
      { first, skip, where },
    )
    console.log("getArpsFromSg33=============>", res)
    return res.arps
  } catch (error) {
    console.error('Failed to fetch protocol=============>', where, error)
    return null
  }
}

export const fetchArp = async (arpAddress) => {
  const arpContract = getARPContract(arpAddress)
  const arpNoteContract = getARPNoteContract()
  const arp = await getArp(arpAddress.toLowerCase())

  const [ 
    devaddr_,
    bountyRequired,
    profileRequired,
    collectionId,
  ] = await Promise.all([
      arpContract.devaddr_(),
      arpContract.bountyRequired(),
      arpContract.profileRequired(),
      arpContract.collectionId(),
  ])
  const accounts =  await Promise.all(
    arp?.protocols?.map(async (protocol) => {
      const protocolId = protocol.id.split('_')[0]
      const [[
        _token,
        bountyId,
        profileId,
        tokenId,
        amountPayable,
        amountReceivable,
        paidPayable,
        paidReceivable,
        periodPayable,
        periodReceivable,
        startPayable,
        startReceivable,
      ],
      optionId,
      isAutoChargeable,
      ] = await Promise.all([
        arpContract.protocolInfo(protocolId),
        arpContract.optionId(protocolId),
        arpContract.isAutoChargeable(protocolId),
      ])
      const adminBountyId = await arpContract.adminBountyId(_token)
      const tokenContract = getBep20Contract(_token)
      const [
        name,
        symbol,
        decimals,
        totalLiquidity
      ] = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.decimals(),
        tokenContract.balanceOf(arpAddress)
      ])
      const nextDueReceivable = await arpNoteContract.getDueReceivable(arpAddress, protocolId, 0)
      console.log("nextDuePayable=================>", amountReceivable, nextDueReceivable)

      return {
        ...protocol,
        protocolId,
        isAutoChargeable,
        adminBountyId: new BigNumber(adminBountyId._hex).toJSON(),
        bountyId: new BigNumber(bountyId._hex).toJSON(),
        profileId: new BigNumber(profileId._hex).toJSON(),
        tokenId: new BigNumber(tokenId._hex).toJSON(),
        optionId: new BigNumber(optionId._hex).toJSON(),
        amountReceivable: new BigNumber(amountReceivable._hex).toJSON(),
        amountPayable: new BigNumber(amountPayable._hex).toJSON(),
        paidReceivable: new BigNumber(paidReceivable._hex).toJSON(),
        paidPayable: new BigNumber(paidPayable._hex).toJSON(),
        periodReceivable: new BigNumber(periodReceivable._hex).toJSON(),
        periodPayable: new BigNumber(periodPayable._hex).toJSON(),
        startPayable: new BigNumber(startPayable._hex).toJSON(),
        startReceivable: new BigNumber(startReceivable._hex).toJSON(),
        totalLiquidity: new BigNumber(totalLiquidity._hex).toJSON(),
        nextDueReceivable: nextDueReceivable?.length ? new BigNumber(nextDueReceivable[1]._hex).toJSON() : BIG_ZERO,
        token: new Token(
          56,
          _token,
          decimals,
          symbol?.toUpperCase() ?? 'symbol',
          name ?? 'name',
          'https://www.trueusd.com/',
        ),
        // allTokens.find((tk) => tk.address === token),
      }
    })
  )
  const collection = await getCollection(new BigNumber(collectionId._hex).toJSON())
  
  // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
  return {
    ...arp,
    arpAddress,
    accounts,
    profileRequired,
    devaddr_,
    collection,
    collectionId: new BigNumber(collectionId._hex).toJSON(),
    bountyRequired: new BigNumber(bountyRequired._hex).toJSON(),
  }
}

export const fetchArps = async ({ fromArp }) => {
  const arpHelperContract = getARPHelperContract()
  const arpAddresses = await arpHelperContract.getAllARPs(0)
  const arps =  await Promise.all(
    arpAddresses.filter((arpAddress) =>
      fromArp ? arpAddress?.toLowerCase() === fromArp?.toLowerCase() : true)
      .map(async (arpAddress, index) => {
        const data = await fetchArp(arpAddress)
        return {
          sousId: index,
          ...data
        }
    }).flat()
  )
  return arps
}