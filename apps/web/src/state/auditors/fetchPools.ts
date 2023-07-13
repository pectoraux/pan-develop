import BigNumber from 'bignumber.js'
import { firestore } from 'utils/firebase'
import { Token } from '@pancakeswap/sdk'
import { GRAPH_API_AUDITORS } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getCollection } from 'state/cancan/helpers'
import { 
  getAuditorNoteContract,
  getAuditorHelper2Contract,
  getAuditorContract,
  getBep20Contract,
} from '../../utils/contractHelpers'
import { auditorFields, protocolFields } from './queries'

export const fetchRampData = async (rampAddress) => {
  return (await firestore.collection("ramps").doc(rampAddress).get()).data()
}

export const fetchSessionInfo = async (sessionId) => {
  return (await firestore.collection("onramp").doc(sessionId).get()).data()
}

export const getProtocols = async (first = 5, skip = 0, where={}) => {
  try {
    const res = await request(
      GRAPH_API_AUDITORS,
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

export const getProtocol = async (auditorAddress: string) => {
  try {
    const res = await request(
      GRAPH_API_AUDITORS,
      gql`
        query getProtocolData($auditorAddress: String!) 
        {
          protocols(where: { auditor: $auditorAddress }) {
            ${protocolFields}
          }
        }
      `,
      { auditorAddress },
    )
    return res.protocols
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, auditorAddress)
    return null
  }
}

export const getAuditor = async (auditorAddress) => {
  try {
    const res = await request(
      GRAPH_API_AUDITORS,
      gql`
        query getAuditor($auditorAddress: String) 
        {
          auditor(id: $auditorAddress) {
            ${auditorFields}
            protocols {
              ${protocolFields}
            }
          }
        }
      `,
      { auditorAddress },
    )
    console.log("getAuditor=================>", auditorAddress, res)
    return res.auditor
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, auditorAddress)
    return null
  }
}

export const getAuditors = async (first = 5, skip = 0, where) => {
  try {
    const res = await request(
      GRAPH_API_AUDITORS,
      gql`
        query getAuditors($where: Auditor_filter) 
        {
          auditors(first: $first, skip: $skip, where: $where) {
            ${auditorFields}
            protocols {
              ${protocolFields}
            }
          }
        }
      `,
      { first, skip, where },
    )
    console.log("getAuditorsFromSg33=============>", res)
    return res.auditors
  } catch (error) {
    console.error('Failed to fetch protocol=============>', where, error)
    return null
  }
}

export const fetchAuditor = async (auditorAddress) => {
  const auditorContract = getAuditorContract(auditorAddress)
  const auditorHelper2Contract = getAuditorHelper2Contract()
  const auditor = await getAuditor(auditorAddress.toLowerCase())

  const [ 
    devaddr_,
    bountyRequired,
    collectionId,
  ] = await Promise.all([
      auditorContract.devaddr_(),
      auditorContract.bountyRequired(),
      auditorContract.collectionId(),
  ])
  const collection = await getCollection(new BigNumber(collectionId._hex).toJSON())
  const accounts =  await Promise.all(
    auditor?.protocols?.map(async (protocol) => {
      const protocolId = protocol.id.split('_')[0]
      const [[
        _token,
        bountyId,
        amountReceivable,
        paidReceivable,
        periodReceivable,
        startReceivable,
        esgRating,
        optionId
      ],
      isAutoChargeable,
      ] = await Promise.all([
        auditorContract.protocolInfo(protocolId),
        auditorContract.isAutoChargeable(protocolId),
      ])
      const adminBountyId = await auditorContract.adminBountyIds(_token)
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
        tokenContract.balanceOf(auditorAddress)
      ])
      const nextDueReceivable = await auditorHelper2Contract.getDueReceivable(auditorAddress, protocolId, 0)
      console.log("nextDuePayable=================>", amountReceivable, nextDueReceivable)

      return {
        ...protocol,
        protocolId,
        isAutoChargeable,
        adminBountyId: new BigNumber(adminBountyId._hex).toJSON(),
        esgRating: new BigNumber(esgRating._hex).toJSON(),
        bountyId: new BigNumber(bountyId._hex).toJSON(),
        optionId: new BigNumber(optionId._hex).toJSON(),
        amountReceivable: new BigNumber(amountReceivable._hex).toJSON(),
        paidReceivable: new BigNumber(paidReceivable._hex).toJSON(),
        periodReceivable: new BigNumber(periodReceivable._hex).toJSON(),
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

  // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
  return {
    ...auditor,
    collection,
    auditorAddress,
    accounts,
    bountyRequired,
    devaddr_,
    collectionId: new BigNumber(collectionId._hex).toJSON(),
  }
}

export const fetchAuditors = async ({ fromAuditor }) => {
  const auditorNoteContract = getAuditorNoteContract()
  const auditorAddresses = await auditorNoteContract.getAllAuditors(0)
  const auditors =  await Promise.all(
    auditorAddresses.filter((auditorAddress) =>
      fromAuditor ? auditorAddress?.toLowerCase() === fromAuditor?.toLowerCase() : true)
      .map(async (auditorAddress, index) => {
        const data = await fetchAuditor(auditorAddress)
        return {
          sousId: index,
          ...data
        }
    }).flat()
  )
  return auditors
}