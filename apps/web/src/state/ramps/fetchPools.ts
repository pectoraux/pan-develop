import axios from 'axios'
import NodeRSA from 'encrypt-rsa'
import BigNumber from 'bignumber.js'
import { firestore } from 'utils/firebase'
import { Token } from '@pancakeswap/sdk'
import request, { gql } from 'graphql-request'
import { GRAPH_API_RAMPS } from 'config/constants/endpoints'
import { 
  getRampAdsContract,
  getRampContract,
  getBep20Contract,
} from '../../utils/contractHelpers'
import { rampFields, accountFields, sessionFields } from './queries'

export const fetchRampData = async (rampAddress) => {
  return (await firestore.collection("ramps").doc(rampAddress).get()).data()
}

export const fetchSessionInfo = async (sessionId) => {
  const res = await (await firestore.collection("onramp").doc(sessionId).get()).data()
  console.log("res===================>", res)
  return res
}

export const getRamps = async (first = 5, skip = 0, where={}) => {
  try {
    const res = await request(
      GRAPH_API_RAMPS,
      gql`
      # query getRamps($first: Int!, $skip: Int!, $where: NFT_filter) 
      {
        ramps(first: $first, skip: $skip, where: $where) {
          ${rampFields}
        }
      }
      `,
      { 
        first, 
        skip, 
        where,
      },
    )
    console.log("res.ramps===================>", res.ramps)
    return res.ramps
  } catch (error) {
    console.error('Failed to fetch ramps==============>', error)
    return []
  }
}

export const getNfts = async (first = 5, skip = 0, where={}) => {
  try {
    const res = await request(
      GRAPH_API_RAMPS,
      gql`
      # query getRamps($first: Int!, $skip: Int!, $where: NFT_filter) 
      {
        nfts {
          id
          profileId
          tokenAddress
          metadataUrl
        }
      }
      `,
      { 
        first, 
        skip, 
        where,
      },
    )
    console.log("res.nfts===================>", res.nfts)
    return res.nfts
  } catch (error) {
    console.error('Failed to fetch nfts==============>', error)
    return []
  }
}

export const getSession = async (sessionId: string, rampAddress: string) => {
  const sId = `${sessionId}-${rampAddress}`
  try {
    const res = await request(
      GRAPH_API_RAMPS,
      gql`
        query getSessionData($sId: String!) 
        {
          session(id: $sId) {
            ${sessionFields}
          },
          ramps(id: $rampAddress) {
            clientIds,
            secretKeys,
            publishableKeys,
          }
        }
      `,
      { sId, rampAddress },
    )
    console.log("11getSession===========>", res)

    return res.session
  } catch (error) {
    console.error('Failed to fetch session=============>', error, sessionId)
    return null
  }
}

export const getRampSg = async (rampAddress: string) => {
  try {
    const res = await request(
      GRAPH_API_RAMPS,
      gql`
        query getRampData($rampAddress: String!) 
        {
          ramp(id: $rampAddress) {
            ${rampFields}
          }
        }
      `,
      { rampAddress },
    )
    console.log("getRampSg=================>", res)
    return res.ramp
  } catch (error) {
    console.error('Failed to fetch session=============>', error)
    return null
  }
}

export const getAccountSg = async (address: string, channel: string) => {
  const ownerAddress = address?.toLowerCase()
  try {
    const res = await request(
      GRAPH_API_RAMPS,
      gql`
        query getAccountData($ownerAddress: String!, $channel: String!) 
        {
          accounts(where: { owner: $ownerAddress, channel: $channel }) {
            ${accountFields}
          }
        }
      `,
      { ownerAddress, channel },
    )
    console.log("getAccountSg=================>", res)
    return res.accounts?.length && res.accounts[0]
  } catch (error) {
    console.error('Failed to fetch account=============>', error)
    return null
  }
}

export const getTokenData = async (tokenAddress) => {
  const tokenContract = getBep20Contract(tokenAddress)
  const [
    name,
    symbol,
    decimals
  ] = await Promise.all([
    tokenContract.name(),
    tokenContract.symbol(),
    tokenContract.decimals(),
  ])
  console.log("tokenAddress================>", tokenAddress, name, symbol)
  return { name, symbol, decimals }
}

// eslint-disable-next-line consistent-return
export const fetchRamp = async (address) => {
  try {
    const rampAddress = address?.toLowerCase()
    const gauge = await getRampSg(rampAddress)
    console.log("fetchRamp=========>", rampAddress, gauge)
    const rampContract = getRampContract(rampAddress)
    const rampAdsContract = getRampAdsContract()
    // const serializedTokens = serializeTokens()
    const [ 
      devaddr_,
      tokens,
      [
        rampBadgeId,
        rampTokenId,
        mintFee,
        burnFee,
        rampSalePrice,
        soldAccounts,
        automatic,
        _ve,
      ]
    ] = await Promise.all([
        rampContract.devaddr_(),
        rampContract.getAllTokens(0),
        rampContract.getParams(),
    ])
    console.log("fetchRamp1=========>", _ve)
    const { 
      sessions, 
      clientIds,
      secretKeys,
      publishableKeys,
      ...rest 
    } = gauge 
    const nodeRSA = new NodeRSA(
      process.env.NEXT_PUBLIC_PUBLIC_KEY,
      process.env.NEXT_PUBLIC_PRIVATE_KEY,
    )
    const allSessions =  await Promise.all(
      sessions.filter((session) => session?.active)
      .map(async (session) => {
        let ppData
        const sk = gauge.secretKeys?.length && gauge.secretKeys[0]
        const sk0 = sk ? nodeRSA.decryptStringWithRsaPrivateKey({ 
          text: sk, 
          privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY
        }):"";
        const tokenContract = getBep20Contract(session?.tokenAddress)
        const [
          name,
          symbol,
          decimals
        ] = await Promise.all([
          tokenContract.name(),
          tokenContract.symbol(),
          tokenContract.decimals()
        ])
        if (session.mintSession) {
          ppData = await Promise.all([axios.post('/api/check', { sessionId: session.sessionId, sk: sk0 })])
        }

        return {
          ...session,
          ppDataFound: !ppData || !ppData?.error,
          ppData: ppData?.data,
          token: new Token(
            56,
            session?.tokenAddress,
            decimals,
            symbol?.toUpperCase() ?? 'symbol',
            name ?? 'name',
            'https://www.trueusd.com/',
          ),
        }
      }))
    console.log("fetchRamp2=========>", allSessions, rampAddress, tokens)
    let accounts = []
    try {
      accounts =  await Promise.all(
      tokens.map(async (token) => {
        const [[
          status,
          tokenId,
          bountyId,
          profileId,
          badgeId,
          minted,
          burnt,
          salePrice,
          maxPartners,
          cap
        ],
        [
          mintable,
          balance,
          collateralStatus
        ]
        ] = await Promise.all([
          rampContract.protocolInfo(token),
          rampAdsContract.mintAvailable(rampAddress, token)
        ])
        return {
          status: status === 0 
          ? "Sold" 
          : status === 1 
          ? "Open"
          : "Close",
          isOverCollateralised: collateralStatus === 0,
          backingBalance: new BigNumber(balance._hex).toJSON(),
          mintable: new BigNumber(mintable._hex).toJSON(),
          tokenId: new BigNumber(tokenId._hex).toJSON(),
          bountyId: new BigNumber(bountyId._hex).toJSON(),
          profileId: new BigNumber(profileId._hex).toJSON(),
          badgeId: new BigNumber(badgeId._hex).toJSON(),
          minted: new BigNumber(minted._hex).toJSON(),
          burnt: new BigNumber(burnt._hex).toJSON(),
          salePrice: new BigNumber(salePrice._hex).toJSON(),
          maxPartners: new BigNumber(maxPartners._hex).toJSON(),
          cap: new BigNumber(cap._hex).toJSON(),
          token: new Token(
            56,
            token,
            18,
            'TUSD',
            'Binance-Peg TrueUSD Token',
            'https://www.trueusd.com/',
          ),
          // allTokens.find((tk) => tk.address === token),
        }
      })
    )
  } catch(err) { 
    console.log("mintAvailable========>", err)
  }
  console.log("fetchRamp3=========>", accounts)
    const cIds = clientIds || ["","","","",""]
    const sks = secretKeys || ["","","","",""]
    const pks = publishableKeys || ["","","","",""]
    const pk0 = pks[0] ? nodeRSA.decryptStringWithRsaPrivateKey({ 
      text: pks[0], 
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY
    }):"";
    console.log("pks=======================>", pks[0], pk0)
    const pk1 = pks[1] ? nodeRSA.decryptStringWithRsaPrivateKey({ 
      text: pks[1], 
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY
    }):"";
    const pk2 = pks[2] ? nodeRSA.decryptStringWithRsaPrivateKey({ 
      text: pks[2], 
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY
    }):"";
    const pk3 = pks[3] ? nodeRSA.decryptStringWithRsaPrivateKey({ 
      text: pks[3], 
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY
    }):"";
    const pk4 = pks[4] ? nodeRSA.decryptStringWithRsaPrivateKey({ 
      text: pks[4], 
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY
    }):"";
    const sk0 = sks[0] ? nodeRSA.decryptStringWithRsaPrivateKey({ 
      text: sks[0], 
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY
    }):"";
    const sk1 = sks[1] ? nodeRSA.decryptStringWithRsaPrivateKey({ 
      text: sks[1], 
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY
    }):"";
    const sk2 = sks[2] ? nodeRSA.decryptStringWithRsaPrivateKey({ 
      text: sks[2], 
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY
    }):"";
    const sk3 = sks[3] ? nodeRSA.decryptStringWithRsaPrivateKey({ 
      text: sks[3], 
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY
    }):"";
    const sk4 = sks[4] ? nodeRSA.decryptStringWithRsaPrivateKey({ 
      text: sks[4], 
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY
    }):"";

    const cId0 = cIds[0] ? nodeRSA.decryptStringWithRsaPrivateKey({ 
      text: cIds[0], 
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY
    }):"";
    const cId1 = cIds[1] ? nodeRSA.decryptStringWithRsaPrivateKey({ 
      text: cIds[1], 
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY
    }):"";
    const cId2 = cIds[2] ? nodeRSA.decryptStringWithRsaPrivateKey({ 
      text: cIds[2], 
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY
    }):"";
    const cId3 = cIds[3] ? nodeRSA.decryptStringWithRsaPrivateKey({ 
      text: cIds[3], 
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY
    }):"";
    const cId4 = cIds[4] ? nodeRSA.decryptStringWithRsaPrivateKey({ 
      text: cIds[4], 
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY
    }):"";
    console.log("secretKeys================>", [sk0,sk1,sk2,sk3,sk4])
    // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
    return {
      ...rest,
      secretKeys: [sk0,sk1,sk2,sk3,sk4],
      clientIds: [cId0,cId1,cId2,cId3,cId4],
      publishableKeys: [pk0,pk1,pk2,pk3,pk4],
      allSessions,
      rampAddress,
      accounts,
      devaddr_,
      automatic,
      _ve,
      rampBadgeId: new BigNumber(rampBadgeId._hex).toJSON(),
      rampTokenId: new BigNumber(rampTokenId._hex).toJSON(),
      mintFee: new BigNumber(mintFee._hex).toJSON(),
      burnFee: new BigNumber(burnFee._hex).toJSON(),
      rampSalePrice: new BigNumber(rampSalePrice._hex).toJSON(),
      soldAccounts: new BigNumber(soldAccounts._hex).toJSON(),
    }
  } catch(err) {
    console.log("fetchRamp err================>", err, address)
  }
}

export const fetchRamps = async () => {
  const gauges = await getRamps()
  const nfts = await getNfts()
  const ramps =  await Promise.all(
  gauges.filter((gauge) => !!gauge)
  .map(async (gauge, index) => {
    const data = await fetchRamp(gauge.id)
    console.log("2gauges=============>", data)

    return {
      sousId: index,
      ...data,
      nfts
    }
  }).flat())
  return ramps
}