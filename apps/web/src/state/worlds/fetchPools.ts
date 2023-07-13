import BigNumber from 'bignumber.js'
import { firestore } from 'utils/firebase'
import { Token } from '@pancakeswap/sdk'
import { GRAPH_API_WORLDS } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { AddressZero } from '@ethersproject/constants'
import { getCollection } from 'state/cancan/helpers'
import { 
  getWorldNoteContract,
  getWorldHelper2Contract,
  getWorldHelper3Contract,
  getWorldContract,
  getBep20Contract,
} from '../../utils/contractHelpers'
import { worldFields, protocolFields } from './queries'

export const fetchRampData = async (rampAddress) => {
  return (await firestore.collection("ramps").doc(rampAddress).get()).data()
}

export const fetchSessionInfo = async (sessionId) => {
  return (await firestore.collection("onramp").doc(sessionId).get()).data()
}

export const getProtocols = async (first = 5, skip = 0, where={}) => {
  try {
    const res = await request(
      GRAPH_API_WORLDS,
      gql`
      # query getProposalss($first: Int!, $skip: Int!, $where: NFT_filter, $orderDirection: OrderDirection) 
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
    console.error('Failed to fetch protocols', error)
    return []
  }
}

export const getProtocol = async (worldAddress: string) => {
  try {
    const res = await request(
      GRAPH_API_WORLDS,
      gql`
        query getProtocolData($worldAddress: String!) 
        {
          protocols(where: { world: $worldAddress }) {
            ${protocolFields}
          }
        }
      `,
      { worldAddress },
    )
    return res.protocols
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, worldAddress)
    return null
  }
}

export const getWorld = async (worldAddress) => {
  try {
    const res = await request(
      GRAPH_API_WORLDS,
      gql`
        {
          worlds(id: $worldAddress) {
            ${worldFields}
          }
        }
      `,
      { worldAddress },
    )

    return res.worlds && res.worlds[0]
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, worldAddress)
    return null
  }
}

export const fetchWorld = async (worldAddress) => {
  const worldContract = getWorldContract(worldAddress)
  const worldNoteContract = getWorldNoteContract()
  const worldHelper2Contract = getWorldHelper2Contract()
  const worldHelper3Contract = getWorldHelper3Contract()
  const protocols = await getProtocol(worldAddress.toLowerCase())
  const world = await getWorld(worldAddress.toLowerCase())

  const worldNFTs = await Promise.all(
    world?.worldNFTs?.map(async (nft) => {
    const owner = await worldHelper2Contract.ownerOf(nft.tokenId)
    return {
      ...nft,
      owner
    }
  }))
  const [ 
    devaddr_,
    bountyRequired,
    collectionId,
    category,
    profileId,
    bountyId,
    tradingFee,
  ] = await Promise.all([
      worldContract.devaddr_(),
      worldContract.bountyRequired(),
      worldContract.collectionId(),
      worldHelper2Contract.getWorldType(worldAddress),
      worldNoteContract.worldToProfileId(worldAddress),
      worldHelper2Contract.bounties(worldAddress),
      worldHelper3Contract.tradingFee()
  ])
  const gaugeNColor = await worldNoteContract.getGaugeNColor(new BigNumber(profileId._hex).toJSON(), category)
  const pricePerAttachMinutes = await worldHelper3Contract.pricePerAttachMinutes(new BigNumber(profileId._hex).toJSON())
  const collection = await getCollection(new BigNumber(collectionId._hex).toJSON())
  const accounts =  await Promise.all(
    protocols.map(async (protocol) => {
      const protocolId = protocol.id.split('_')[0]
      const [[
        owner,
        _token,
        _bountyId,
        amountReceivable,
        paidReceivable,
        periodReceivable,
        startReceivable,
        rating,
        optionId,
      ],
      isAutoChargeable,
      ] = await Promise.all([
        worldContract.protocolInfo(protocolId),
        worldContract.isAutoChargeable(protocolId),
      ])
      const nextDueReceivable = await worldNoteContract.getDueReceivable(worldAddress, protocolId, 0)
      const fromSg = protocols.find((data) => data.owner.toLowerCase() === owner.toLowerCase())
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
      return {
        ...fromSg,
        owner,
        protocolId,
        isAutoChargeable,
        optionId: new BigNumber(optionId._hex).toJSON(),
        bountyId: new BigNumber(_bountyId._hex).toJSON(),
        amountReceivable: new BigNumber(amountReceivable._hex).toJSON(),
        paidReceivable: new BigNumber(paidReceivable._hex).toJSON(),
        periodReceivable: new BigNumber(periodReceivable._hex).toJSON(),
        startReceivable: new BigNumber(startReceivable._hex).toJSON(),
        dueReceivable: nextDueReceivable?.length ? new BigNumber(nextDueReceivable[0]._hex).toJSON() : BIG_ZERO,
        nextDueReceivable: nextDueReceivable?.length ? new BigNumber(nextDueReceivable[1]._hex).toJSON() : BIG_ZERO,
        rating: new BigNumber(rating._hex).toJSON(),
        token: new Token(
          56,
          _token,
          decimals ?? 18,
          symbol?.toUpperCase() ?? 'symbol',
          name,
          'https://www.payswap.org/',
        ),
        // allTokens.find((tk) => tk.address === token),
      }
    })
  )

  // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
  return {
    worldAddress,
    ...world,
    worldNFTs,
    accounts,
    bountyRequired,
    devaddr_,
    collection,
    category,
    color: gaugeNColor[1] === 0 ? "Black" : gaugeNColor[1] === 1 ? "Brown" : gaugeNColor[1] === 2 ? "Silver" : "Gold",
    bountyId: new BigNumber(bountyId._hex).toJSON(),
    pricePerAttachMinutes: new BigNumber(pricePerAttachMinutes._hex).toJSON(),
    tradingFee: new BigNumber(tradingFee._hex).toJSON(),
    profileId: new BigNumber(profileId._hex).toJSON(),
    collectionId: new BigNumber(collectionId._hex).toJSON(),
  }
}

export const fetchWorlds = async () => {
  const worldNoteContract = getWorldNoteContract()
  const worldAddresses = await worldNoteContract.getAllWorlds(0)
  const worlds =  await Promise.all(
  worldAddresses.map(async (worldAddress, index) => {
    const data = await fetchWorld(worldAddress)
    return {
      sousId: index,
      ...data
    }
  }).flat()
  )
  return worlds
}