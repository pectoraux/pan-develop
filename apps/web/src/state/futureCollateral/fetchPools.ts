import BigNumber from 'bignumber.js'
import { firestore } from 'utils/firebase'
import { Token } from '@pancakeswap/sdk'
import { GRAPH_API_AUDITORS } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getCollection } from 'state/cancan/helpers'
import { 
  getFutureCollateralNoteContract,
  getFutureCollateralHelper2Contract,
  getFutureCollateralContract,
  getBep20Contract,
} from '../../utils/contractHelpers'
import { futureCollateralFields, protocolFields } from './queries'

export const fetchRampData = async (rampAddress) => {
  return (await firestore.collection("ramps").doc(rampAddress).get()).data()
}

export const fetchSessionInfo = async (sessionId) => {
  return (await firestore.collection("onramp").doc(sessionId).get()).data()
}

export const getProtocolsSg = async (userAddress: string): Promise<any> => {
  try {
    const res = await request(
      GRAPH_API_AUDITORS,
      gql`
        query getProtocolsData($userAddress: String!) {
          protocols(where: { owner: $userAddress }) {
            tokens {
              metadataUrl
            }
          }
        }
      `,
      { userAddress },
    )
    console.log("res.protocols=======================>", res.protocols, userAddress)
    return res.protocols
  } catch (error) {
    console.error('Failed to fetch userAddress==========>', error,  userAddress)
    return {}
  }
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

export const getProtocol = async (futureCollateralAddress: string) => {
  try {
    const res = await request(
      GRAPH_API_AUDITORS,
      gql`
        query getProtocolData($futureCollateralAddress: String!) 
        {
          protocols(where: { futureCollateral: $futureCollateralAddress }) {
            ${protocolFields}
          }
        }
      `,
      { futureCollateralAddress },
    )
    return res.protocols
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, futureCollateralAddress)
    return null
  }
}

export const getFutureCollateral = async (futureCollateralAddress) => {
  try {
    const res = await request(
      GRAPH_API_AUDITORS,
      gql`
        query getFutureCollateral($futureCollateralAddress: String) 
        {
          futureCollateral(id: $futureCollateralAddress) {
            ${futureCollateralFields}
            protocols {
              ${protocolFields}
            }
          }
        }
      `,
      { futureCollateralAddress },
    )
    console.log("getFutureCollateral=================>", futureCollateralAddress, res)
    return res.futureCollateral
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, futureCollateralAddress)
    return null
  }
}

export const getFutureCollaterals = async (first = 5, skip = 0, where) => {
  try {
    const res = await request(
      GRAPH_API_AUDITORS,
      gql`
        query getFutureCollaterals($where: FutureCollateral_filter) 
        {
          futureCollaterals(first: $first, skip: $skip, where: $where) {
            ${futureCollateralFields}
            protocols {
              ${protocolFields}
            }
          }
        }
      `,
      { first, skip, where },
    )
    console.log("getFutureCollateralsFromSg33=============>", res)
    return res.futureCollaterals
  } catch (error) {
    console.error('Failed to fetch protocol=============>', where, error)
    return null
  }
}

export const fetchFutureCollateral = async (futureCollateralAddress) => {
  const futureCollateralContract = getFutureCollateralContract(futureCollateralAddress)
  const futureCollateralHelper2Contract = getFutureCollateralHelper2Contract()
  const futureCollateral = await getFutureCollateral(futureCollateralAddress.toLowerCase())

  const [ 
    devaddr_,
    bountyRequired,
    collectionId,
  ] = await Promise.all([
      futureCollateralContract.devaddr_(),
      futureCollateralContract.bountyRequired(),
      futureCollateralContract.collectionId(),
  ])
  const collection = await getCollection(new BigNumber(collectionId._hex).toJSON())
  const accounts =  await Promise.all(
    futureCollateral?.protocols?.map(async (protocol) => {
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
        futureCollateralContract.protocolInfo(protocolId),
        futureCollateralContract.isAutoChargeable(protocolId),
      ])
      const adminBountyId = await futureCollateralContract.adminBountyIds(_token)
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
        tokenContract.balanceOf(futureCollateralAddress)
      ])
      const nextDueReceivable = await futureCollateralHelper2Contract.getDueReceivable(futureCollateralAddress, protocolId, 0)
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
    ...futureCollateral,
    collection,
    futureCollateralAddress,
    accounts,
    bountyRequired,
    devaddr_,
    collectionId: new BigNumber(collectionId._hex).toJSON(),
  }
}

export const fetchFutureCollaterals = async ({ fromFutureCollateral }) => {
  const futureCollateralNoteContract = getFutureCollateralNoteContract()
  const futureCollateralAddresses = await futureCollateralNoteContract.getAllFutureCollaterals(0)
  const futureCollaterals =  await Promise.all(
    futureCollateralAddresses.filter((futureCollateralAddress) =>
      fromFutureCollateral ? futureCollateralAddress?.toLowerCase() === fromFutureCollateral?.toLowerCase() : true)
      .map(async (futureCollateralAddress, index) => {
        const data = await fetchFutureCollateral(futureCollateralAddress)
        return {
          sousId: index,
          ...data
        }
    }).flat()
  )
  return futureCollaterals
}