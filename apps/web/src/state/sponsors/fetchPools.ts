import BigNumber from 'bignumber.js'
import { firestore } from 'utils/firebase'
import { Token } from '@pancakeswap/sdk'
import { GRAPH_API_SPONSORS } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getCollection } from 'state/cancan/helpers'
import { AddressZero } from '@ethersproject/constants'
import { 
  getSponsorHelperContract,
  getSponsorContract,
  getBep20Contract,
} from '../../utils/contractHelpers'
import { sponsorFields, protocolFields } from './queries'

export const fetchRampData = async (rampAddress) => {
  return (await firestore.collection("ramps").doc(rampAddress).get()).data()
}

export const fetchSessionInfo = async (sessionId) => {
  return (await firestore.collection("onramp").doc(sessionId).get()).data()
}

export const getProtocols = async (first = 5, skip = 0, where={}) => {
  try {
    const res = await request(
      GRAPH_API_SPONSORS,
      gql`
      query getProposals($first: Int!, $skip: Int!, $where: Protocol_filter) 
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

export const getProtocol = async (sponsorAddress: string) => {
  try {
    const res = await request(
      GRAPH_API_SPONSORS,
      gql`
        query getProtocolData($sponsorAddress: String!) 
        {
          protocols(where: { sponsor: $sponsorAddress }) {
            ${protocolFields}
          }
        }
      `,
      { sponsorAddress },
    )
    return res.protocols
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, sponsorAddress)
    return null
  }
}

export const getSponsor = async (sponsorAddress) => {
  try {
    const res = await request(
      GRAPH_API_SPONSORS,
      gql`
        query getSponsor($sponsorAddress: String) 
        {
          sponsor(id: $sponsorAddress) {
            ${sponsorFields}
            protocols {
              ${protocolFields}
            }
          }
        }
      `,
      { sponsorAddress },
    )
    console.log("getSponsor=================>", sponsorAddress, res)
    return res.sponsor
  } catch (error) {
    console.error('Failed to fetch sponsor=============>', error, sponsorAddress)
    return null
  }
}

export const getSponsors = async (first = 5, skip = 0, where) => {
  try {
    const res = await request(
      GRAPH_API_SPONSORS,
      gql`
        query getSponsors($where: Sponsor_filter) 
        {
          sponsors(first: $first, skip: $skip, where: $where) {
            ${sponsorFields}
            protocols {
              ${protocolFields}
            }
          }
        }
      `,
      { first, skip, where },
    )
    console.log("getSponsorsFromSg33=============>", res)
    return res.sponsors
  } catch (error) {
    console.error('Failed to fetch protocol=============>', where, error)
    return null
  }
}

export const fetchSponsor = async (sponsorAddress) => {
  const sponsorContract = getSponsorContract(sponsorAddress)
  const sponsorHelperContract = getSponsorHelperContract()
  const sponsor = await getSponsor(sponsorAddress.toLowerCase())
  const [ 
    cosignEnabled,
    devaddr_,
    minCosigners,
    requiredIndentity,
    valueName,
    _ve,
    bountyRequired,
    collectionId,
  ] = await Promise.all([
      sponsorContract.cosignEnabled(),
      sponsorContract.devaddr_(),
      sponsorContract.minCosigners(),
      sponsorContract.requiredIndentity(),
      sponsorContract.valueName(),
      sponsorContract._ve(),
      sponsorContract.bountyRequired(),
      sponsorContract.collectionId()
    ])
  const collection = await getCollection(new BigNumber(collectionId._hex).toJSON())
  console.log("nextDuePayable0=================>", sponsor, sponsor.protocols)
  const accounts =  await Promise.all(
    sponsor?.protocols?.map(async (protocol) => {
      const protocolId = protocol.id.split('_')[0]
      const [[
        owner,
        _token,
        bountyId,
        tokenId,
        amountPayable,
        paidPayable,
        periodPayable,
        startPayable,
      ]] = await Promise.all([
        sponsorContract.protocolInfo(protocolId),
      ])
      if (_token === AddressZero) return null
      const adminBountyId = await sponsorContract.adminBountyIds(_token)
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
        tokenContract.balanceOf(sponsorAddress)
      ])
      const nextDuePayable = await sponsorHelperContract.getDuePayable(sponsorAddress, owner, 0)
      console.log("nextDuePayable=================>", amountPayable, nextDuePayable)
      return {
        ...protocol,
        owner,
        protocolId,
        adminBountyId: new BigNumber(adminBountyId._hex).toJSON(),
        tokenId: new BigNumber(tokenId._hex).toJSON(),
        bountyId: new BigNumber(bountyId._hex).toJSON(),
        amountPayable: new BigNumber(amountPayable._hex).toJSON(),
        totalLiquidity: new BigNumber(totalLiquidity._hex).toJSON(),
        paidPayable: new BigNumber(paidPayable._hex).toJSON(),
        periodPayable: new BigNumber(periodPayable._hex).toJSON(),
        startPayable: new BigNumber(startPayable._hex).toJSON(),
        duePayable: nextDuePayable?.length ? new BigNumber(nextDuePayable[0]._hex).toJSON() : BIG_ZERO,
        nextDuePayable: nextDuePayable?.length ? new BigNumber(nextDuePayable[1]._hex).toJSON() : BIG_ZERO,
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
    ...sponsor,
    sponsorAddress,
    accounts: accounts.filter((acct) => !!acct),
    bountyRequired,
    devaddr_,
    cosignEnabled,
    collection,
    collectionId: new BigNumber(collectionId._hex).toJSON(),
    minCosigners: new BigNumber(minCosigners._hex).toJSON(),
    requiredIndentity,
    valueName,
    _ve
  }
}

export const fetchSponsors = async ({ fromSponsor }) => {
  const sponsorHelperContract = getSponsorHelperContract()
  const sponsorAddresses = await sponsorHelperContract.getAllSponsors(0)
  const sponsors =  await Promise.all(
    sponsorAddresses.filter((sponsorAddress) => 
    fromSponsor ? sponsorAddress?.toLowerCase() === fromSponsor?.toLowerCase() : true)
    .map(async (sponsorAddress, index) => {
      const data = await fetchSponsor(sponsorAddress)
      return {
        sousId: index,
        ...data
      }
    }).flat()
  )
  return sponsors
}