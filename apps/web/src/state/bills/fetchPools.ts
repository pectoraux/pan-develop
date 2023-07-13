import BigNumber from 'bignumber.js'
import { firestore } from 'utils/firebase'
import { Token } from '@pancakeswap/sdk'
import { GRAPH_API_BILLS } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getCollection } from 'state/cancan/helpers'
import { 
  getBILLNoteContract,
  getBILLMinterContract,
  getBILLContract,
  getBep20Contract,
} from '../../utils/contractHelpers'
import { billFields, protocolFields } from './queries'

export const fetchRampData = async (rampAddress) => {
  return (await firestore.collection("ramps").doc(rampAddress).get()).data()
}

export const fetchSessionInfo = async (sessionId) => {
  return (await firestore.collection("onramp").doc(sessionId).get()).data()
}

export const getProtocols = async (first = 5, skip = 0, where={}) => {
  try {
    const res = await request(
      GRAPH_API_BILLS,
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

export const getProtocol = async (billAddress: string) => {
  try {
    const res = await request(
      GRAPH_API_BILLS,
      gql`
        query getProtocolData($billAddress: String!) 
        {
          protocols(where: { bill: $billAddress }) {
            ${protocolFields}
          }
        }
      `,
      { billAddress },
    )
    return res.protocols
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, billAddress)
    return null
  }
}

export const getBill = async (billAddress) => {
  try {
    const res = await request(
      GRAPH_API_BILLS,
      gql`
        query getBill($billAddress: String) 
        {
          bill(id: $billAddress) {
            ${billFields}
            protocols {
              ${protocolFields}
            }
          }
        }
      `,
      { billAddress },
    )
    console.log("getBill=================>", billAddress, res)
    return res.bill
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, billAddress)
    return null
  }
}

export const getBills = async (first = 5, skip = 0, where) => {
  try {
    const res = await request(
      GRAPH_API_BILLS,
      gql`
        query getBills($where: BILL_filter) 
        {
          bills(first: $first, skip: $skip, where: $where) {
            ${billFields}
            protocols {
              ${protocolFields}
            }
          }
        }
      `,
      { first, skip, where },
    )
    console.log("getBillsFromSg33=============>", res)
    return res.bills
  } catch (error) {
    console.error('Failed to fetch protocol=============>', where, error)
    return null
  }
}

export const fetchBill = async (billAddress) => {
  const billContract = getBILLContract(billAddress)
  const billNoteContract = getBILLNoteContract()
  const bill = await getBill(billAddress.toLowerCase())

  const [ 
    devaddr_,
    bountyRequired,
    profileRequired,
    collectionId,
  ] = await Promise.all([
      billContract.devaddr_(),
      billContract.bountyRequired(),
      billContract.profileRequired(),
      billContract.collectionId(),
  ])
  const collection = await getCollection(new BigNumber(collectionId._hex).toJSON())
  const accounts =  await Promise.all(
    bill?.protocols?.map(async (protocol) => {
      const protocolId = protocol.id.split('_')[0]
      const [[
        _token,
        version,
        bountyId,
        profileId,
        credit,
        debit,
        startPayable,
        startReceivable,
        periodPayable,
        periodReceivable,
        creditFactor,
        debitFactor,
      ],
      optionId,
      isAutoChargeable,
      ] = await Promise.all([
        billContract.protocolInfo(protocolId),
        billContract.optionId(protocolId),
        billContract.isAutoChargeable(protocolId),
      ])
      const adminBountyId = await billContract.adminBountyId(_token)
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
        tokenContract.balanceOf(billAddress)
      ])
      const receivables = await billNoteContract.getDueReceivable(billAddress, protocolId)
      const payables = await billNoteContract.getDuePayable(billAddress, protocolId)
      console.log("nextDuePayable=================>", receivables, payables)

      return {
        ...protocol,
        protocolId,
        isAutoChargeable,
        adminBountyId: new BigNumber(adminBountyId._hex).toJSON(),
        bountyId: new BigNumber(bountyId._hex).toJSON(),
        profileId: new BigNumber(profileId._hex).toJSON(),
        version: new BigNumber(version._hex).toJSON(),
        optionId: new BigNumber(optionId._hex).toJSON(),
        credit: new BigNumber(credit._hex).toJSON(),
        debit: new BigNumber(debit._hex).toJSON(),
        creditFactor: new BigNumber(creditFactor._hex).toJSON(),
        debitFactor: new BigNumber(debitFactor._hex).toJSON(),
        periodReceivable: new BigNumber(periodReceivable._hex).toJSON(),
        periodPayable: new BigNumber(periodPayable._hex).toJSON(),
        startPayable: new BigNumber(startPayable._hex).toJSON(),
        startReceivable: new BigNumber(startReceivable._hex).toJSON(),
        totalLiquidity: new BigNumber(totalLiquidity._hex).toJSON(),
        dueReceivable: receivables?.length ? new BigNumber(receivables[0]._hex).toJSON() : BIG_ZERO,
        nextDueReceivable: receivables?.length ? new BigNumber(receivables[1]._hex).toJSON() : BIG_ZERO,
        duePayable: payables?.length ? new BigNumber(payables[0]._hex).toJSON() : BIG_ZERO,
        nextDuePayable: payables?.length ? new BigNumber(payables[1]._hex).toJSON() : BIG_ZERO,
        token: new Token(
          56,
          _token,
          decimals,
          symbol?.toUpperCase() ?? 'symbol',
          name ?? 'name',
          'https://www.payswap.org/',
        ),
        // allTokens.find((tk) => tk.address === token),
      }
    })
  )

  // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
  return {
    ...bill,
    billAddress,
    accounts,
    profileRequired,
    devaddr_,
    collection,
    collectionId: new BigNumber(collectionId._hex).toJSON(),
    bountyRequired: new BigNumber(bountyRequired._hex).toJSON(),
  }
}

export const fetchBills = async ({ fromBill }) => {
  const billMinterContract = getBILLMinterContract()
  const billAddresses = await billMinterContract.getAllBills(0)
  const bills =  await Promise.all(
    billAddresses.filter((billAddress) =>
      fromBill ? billAddress?.toLowerCase() === fromBill?.toLowerCase() : true)
      .map(async (billAddress, index) => {
        const data = await fetchBill(billAddress)
        return {
          sousId: index,
          ...data
        }
    }).flat()
  )
  return bills
}