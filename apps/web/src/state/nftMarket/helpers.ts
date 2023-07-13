import { Token } from '@pancakeswap/sdk'
import { firestore } from 'utils/firebase'
import { gql, request } from 'graphql-request'
import { stringify } from 'querystring'
import { API_NFT, GRAPH_API_CANCAN } from 'config/constants/endpoints'
import { multicallv2 } from 'utils/multicall'
import { isAddress } from 'utils'
import erc721Abi from 'config/abi/erc721.json'
import range from 'lodash/range'
import groupBy from 'lodash/groupBy'
import { BigNumber as BN }from 'bignumber.js'
import { BigNumber } from '@ethersproject/bignumber'
import { 
  getBep20Contract,
  getNftMarketContract, 
  getMarketOrdersContract, 
  getMarketHelperContract, 
  getPaywallContract, 
  getPaywallMarketHelperContract,
  getNftMarketHelper3Contract,
  getNftMarketHelperContract,
} from 'utils/contractHelpers'
import { NOT_ON_SALE_SELLER } from 'config/constants'
import DELIST_COLLECTIONS from 'config/constants/nftsCollections/delist'
import { pancakeBunniesAddress } from 'views/Nft/market/constants'
import { formatBigNumber } from '@pancakeswap/utils/formatBalance'
import { getNftMarketAddress } from 'utils/addressHelpers'
import nftMarketAbi from 'config/abi/nftMarket.json'
import fromPairs from 'lodash/fromPairs'
import pickBy from 'lodash/pickBy'
import lodashSize from 'lodash/size'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import {
  ApiCollection,
  ApiCollections,
  ApiResponseCollectionTokens,
  ApiResponseSpecificToken,
  AskOrderType,
  Collection,
  CollectionMarketDataBaseFields,
  NftActivityFilter,
  NftLocation,
  NftToken,
  TokenIdWithCollectionAddress,
  TokenMarketData,
  Transaction,
  AskOrder,
  ApiSingleTokenData,
  NftAttribute,
  ApiTokenFilterResponse,
  ApiCollectionsResponse,
  MarketEvent,
  UserActivity,
} from './types'
import { 
  itemFields, 
  collectionBaseFields, 
  transactionHistoryFields, 
  announcementFields,
  askHistoryFields,
  paywallFields,
  paywallARPFields,
  nftFields,
} from './queries'

/**
 * API HELPERS
 */

/**
 * Fetch static data from all collections using the API
 * @returns
 */
export const getCollectionsApi = async () => {
  const snapshot = await firestore.collection("collections").get()
  const data = snapshot.docs.map(doc => doc.data())
  return { total: data?.length ?? 0 }
}

export const getCollectionReviewsApi = async <T>(
  collectionAddress: string,
  tokenId: string
  ) => {
  const data = await (await firestore.collection("reviews")
  .doc(`${collectionAddress}-${tokenId}`).get()).data()
  return data
}

/**
 * Fetch all collections data by combining data from the API (static metadata) and the Subgraph (dynamic market data)
 */
export const getCollections = async () => {
  try {
    return getCollectionsSg()
  } catch (error) {
    console.error('Unable to fetch data==================>:', error)
    return null
  }
}

/**
 * Fetch collection data by combining data from the API (static metadata) and the Subgraph (dynamic market data)
 */
export const getCollection = async (collectionAddress: string) => {
  try {
    return getCollectionSg(collectionAddress)
  } catch (error) {
    console.error('Unable to fetch data:', error)
    return null
  }
}

/**
 * Fetch static data from a collection using the API
 * @returns
 */
export const getCollectionApi = async (collectionAddress: string) => {
  const data = await (await firestore.collection("collections").doc(collectionAddress).get()).data()
  return data
}

/**
 * Fetch static data for all nfts in a collection using the API
 * @param collectionAddress
 * @param size
 * @param page
 * @returns
 */
export const getNftsFromCollectionApi = async (
  collectionAddress: string,
  size = 100,
  page = 1,
): Promise<ApiResponseCollectionTokens> => {
  const requestPath = `${API_NFT}/collections/${collectionAddress}/tokens${`?page=${page}&size=${size}`}`

  try {
    const res = await fetch(requestPath)
    if (res.ok) {
      const data = await res.json()
      const filteredAttributesDistribution = pickBy(data.attributesDistribution, Boolean)
      const filteredData = pickBy(data.data, Boolean)
      const filteredTotal = lodashSize(filteredData)
      return {
        ...data,
        total: filteredTotal,
        attributesDistribution: filteredAttributesDistribution,
        data: filteredData,
      }
    }
    console.error(`API: Failed to fetch NFT tokens for ${collectionAddress} collection`, res.statusText)
    return null
  } catch (error) {
    console.error(`API: Failed to fetch NFT tokens for ${collectionAddress} collection`, error)
    return null
  }
}

/**
 * Fetch a single NFT using the API
 * @param collectionAddress
 * @param tokenId
 * @returns NFT from API
 */
export const getNftApi = async (
  collectionAddress: string,
  tokenId: string,
) => {
  return (await firestore.collection("items")
  .doc(`${collectionAddress}-${tokenId}`).get()).data()
}

/**
 * Fetch a list of NFT from different collections
 * @param from Array of { collectionAddress: string; tokenId: string }
 * @returns Array of NFT from API
 */
export const getNftsFromDifferentCollectionsApi = async (
  from: { collectionAddress: string; tokenId: string }[],
) => {
  const promises = from.map((nft) => getNftApi(nft.collectionAddress, nft.tokenId))
  const responses = await Promise.all(promises)
  // Sometimes API can't find some tokens (e.g. 404 response)
  // at least return the ones that returned successfully
  return responses
    .filter((resp) => resp)
    .map((res, index) => ({
      tokenId: res.tokenId,
      name: res.name,
      collectionName: res.collection.name,
      collectionAddress: from[index].collectionAddress,
      description: res.description,
      attributes: res.attributes,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
      image: res.image,
    }))
}

/**
 * SUBGRAPH HELPERS
 */

/**
 * Fetch market data from a collection using the Subgraph
 * @returns
 */
export const getCollectionSg = async (collectionAddress: string): Promise<any> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getCollectionData($collectionAddress: String!) {
          collection(id: $collectionAddress) {
            ${collectionBaseFields}
          }
        }
      `,
      { collectionAddress },
    )
    console.log("res.collection=======================>", res.collection)
    return res.collection
  } catch (error) {
    console.error('Failed to fetch collection', error,  collectionAddress)
    return {}
  }
}

export const getPaywallSg = async (collectionAddress: string): Promise<CollectionMarketDataBaseFields> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getPaywallData($collectionAddress: String!) 
        {
          paywall(id: $collectionAddress) {
            ${paywallFields}
            transactionHistory {
              ${transactionHistoryFields}
            }
          }
        }
      `,
      { collectionAddress },
    )
    return res.paywall
  } catch (error) {
    console.error('Failed to fetch paywall=========>', error)
    return null
  }
}

export const getItemSg = async (collectionAddress: string): Promise<CollectionMarketDataBaseFields> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getItemData($collectionAddress: String!) 
        {
          item(id: $collectionAddress) {
            ${itemFields}
            transactionHistory {
              ${transactionHistoryFields}
            }
          }
        }
      `,
      { collectionAddress },
    )
    return {
      ...res.item,
      // images: getImages(res.item?.images || ""),
    }
  } catch (error) {
    console.error('Failed to fetch item=========>', error)
    return null
  }
}

export const getItemsSg = async (first: number, skip: number, where) => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        {
          items(first: $first, skip: $skip, where: $where) {
            ${itemFields}
            transactionHistory {
              ${transactionHistoryFields}
            }
          }
        }
      `,
      { first, skip, where },
    )
    return {
      ...res.items,
      // images: res.items?.map((item) => getImages(item.images)),
    }
  } catch (error) {
    console.error('Failed to fetch items====================>', error)
    return []
  }
}

export const getNftSg = async (collectionAddress: string): Promise<CollectionMarketDataBaseFields> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getNftData($collectionAddress: String!) 
        {
          nft(id: $collectionAddress) {
            ${nftFields}
            transactionHistory {
              ${transactionHistoryFields}
            }
          }
        }
      `,
      { collectionAddress },
    )
    const nftHelper3Contract = getNftMarketHelper3Contract()
    const mintValues = await nftHelper3Contract.minter(res.nft.collection.id, res.nft.tokenId)
    return {
      ...res.nft,
      // images: getImages(res.nft.images),
      minter: mintValues[0],
      nftokenId: mintValues[1]._hex,
      nftype: mintValues[2],
    }
  } catch (error) {
    console.error('Failed to fetch nft=========>', error)
    return null
  }
}

export const getNftsSg = async (first: number, skip: number, where) => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        {
          nfts(first: $first, skip: $skip, where: $where) {
            ${nftFields}
            transactionHistory {
              ${transactionHistoryFields}
            }
          }
        }
      `,
      { first, skip, where },
    )
    const nftHelper3Contract = getNftMarketHelper3Contract()
    const nfts = await Promise.all(
      res.nfts.map(async (nft) => {
      const mintValues = await nftHelper3Contract.minter(nft.collection.id, nft.tokenId)
      return {
        ...nft,
        minter: mintValues[0],
        nftokenId: mintValues[1]._hex,
        nftype: mintValues[2],
      }
    }))
    return {
      ...nfts,
      // images: res.nfts?.map((item) => getImages(item.images)),
    }
  } catch (error) {
    console.error('Failed to fetch nfts====================>', error)
    return []
  }
}

/**
 * Fetch market data from all collections using the Subgraph
 * @returns
 */
export const getCollectionsSg = async (first = 5, skip = 0, where={}): Promise<CollectionMarketDataBaseFields[]> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getCollectionsSg($first: Int!, $skip: Int!, $where: Collection_filter) {
          collections {
            ${collectionBaseFields}
          }
        }
      `,
      { 
        first, 
        skip, 
        where,
      },
    )
    return res.collections
  } catch (error) {
    console.error('Failed to fetch NFT collections====================>', error)
  }
  return []
}

/**
 * Fetch market data for nfts in a collection using the Subgraph
 * @param collectionAddress
 * @param first
 * @param skip
 * @returns
 */
export const getNftsFromCollectionSg = async (
  collectionAddress: string,
  first = 1000,
  skip = 0,
): Promise<TokenMarketData[]> => {
  // Squad to be sorted by tokenId as this matches the order of the paginated API return. For PBs - get the most recent,
  const isPBCollection = isAddress(collectionAddress) === pancakeBunniesAddress

  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getNftCollectionMarketData($collectionAddress: String!) {
          collection(id: $collectionAddress) {
            id
            items(orderBy:${isPBCollection ? 'updatedAt' : 'tokenId'}, skip: $skip, first: $first) {
             ${itemFields}
            }
          }
        }
      `,
      { collectionAddress: collectionAddress.toLowerCase(), skip, first },
    )
    return {
      ...res.collection.items,
      // images: res.collection.items?.map((item) => getImages(item.images)),
    }
  } catch (error) {
    console.error('Failed to fetch Items from collection', error)
    return []
  }
}

export const getTokenForCredit = async (
  collectionAddress: string,
  isPaywall
) => {
  try {
    const marketHelperContract = isPaywall ? getPaywallMarketHelperContract() : getMarketHelperContract()
    const arrLength = await marketHelperContract.burnTokenForCreditLength(collectionAddress)
    console.log("1credits================>", arrLength, collectionAddress, isPaywall)
    const arr = Array.from({length: arrLength.toNumber()}, (v, i) => i)
    const credits = await Promise.all(
      arr?.map(async (idx) => {
        const [
          _token,
          checker,
          destination,
          discount,
          collectionId,
          item,
        ] = await marketHelperContract.burnTokenForCredit(collectionAddress, idx)
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
          checker,
          destination,
          discount: new BN(discount._hex).toJSON(),
          collectionId: new BN(collectionId._hex).toJSON(),
          item,
          token: new Token(
            56,
            _token,
            decimals,
            symbol,
            name,
            'https://www.trueusd.com/',
          ),
        }
    }))
    console.log("2credits================>", credits)
    return credits
  } catch (error) {
    console.error('===========>Failed to fetch credits tokens', error)
    return []
  }
}

export const getNFTMarketTokenForCredit = async (
  collectionAddress: string
) => {
  try {
    const marketHelperContract = getNftMarketHelperContract()
    const arrLength = await marketHelperContract.burnTokenForCreditLength(collectionAddress)
    console.log("1credits================>", arrLength, collectionAddress)
    const arr = Array.from({length: arrLength.toNumber()}, (v, i) => i)
    const credits = await Promise.all(
      arr?.map(async (idx) => {
        const [
          _token,
          checker,
          destination,
          discount,
          collectionId,
          item,
        ] = await marketHelperContract.burnTokenForCredit(collectionAddress, idx)
        const tokenContract = getBep20Contract(_token)
        const [
          name,
          symbol,
          // decimals
        ] = await Promise.all([
          tokenContract.name(),
          tokenContract.symbol(),
          // tokenContract.decimals(),
        ])
        return {
          checker,
          destination,
          discount: new BN(discount._hex).toJSON(),
          collectionId: new BN(collectionId._hex).toJSON(),
          item,
          token: new Token(
            56,
            _token,
            18,
            symbol,
            name,
            'https://www.trueusd.com/',
          ),
        }
    }))
    console.log("2credits================>", credits)
    return credits
  } catch (error) {
    console.error('===========>Failed to fetch credits tokens', error)
    return []
  }
}

export const getPaywallARP = async (
  collectionAddress: string,
  first = 1000,
  skip = 0,
): Promise<TokenMarketData[]> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getPaywallARPMarketData($collectionAddress: String!) {
          paywallARP(id: $collectionAddress) {
            ${paywallARPFields}
          }
        }
      `,
      { collectionAddress, skip, first },
    )
    console.log("res.paywallARP===============>", collectionAddress, res.paywallARP)
    return res.paywallARP
  } catch (error) {
    console.error('Failed to fetch paywallARP======>', error)
    return []
  }
}

/**
 * Fetch market data for PancakeBunnies NFTs by bunny id using the Subgraph
 * @param bunnyId - bunny id to query
 * @param existingTokenIds - tokens that are already loaded into redux
 * @returns
 */
export const getNftsByBunnyIdSg = async (
  bunnyId: string,
  existingTokenIds: string[],
  orderDirection: 'asc' | 'desc',
): Promise<TokenMarketData[]> => {
  try {
    const where =
      existingTokenIds.length > 0
        ? { otherId: bunnyId, isTradable: true, tokenId_not_in: existingTokenIds }
        : { otherId: bunnyId, isTradable: true }
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getNftsByBunnyIdSg($collectionAddress: String!, $where: Item_filter, $orderDirection: String!) {
          items(first: 30, where: $where, orderBy: currentAskPrice, orderDirection: $orderDirection) {
            ${itemFields}
          }
        }
      `,
      {
        collectionAddress: pancakeBunniesAddress.toLowerCase(),
        where,
        orderDirection,
      },
    )
    const r =  res.items.map((item) => {
      console.log("item========>", item)
      return {
        ...item,
        // images: getImages(item.images),
    }})
    console.log("r===============>", r)
    return r;
  } catch (error) {
    console.error(`Failed to fetch collection Items for bunny id ${bunnyId}`, error)
    return []
  }
}

/**
 * Fetch market data for PancakeBunnies NFTs by bunny id using the Subgraph
 * @param bunnyId - bunny id to query
 * @param existingTokenIds - tokens that are already loaded into redux
 * @returns
 */
export const getMarketDataForTokenIds = async (
  collectionAddress: string,
  existingTokenIds: string[],
): Promise<TokenMarketData[]> => {
  try {
    if (existingTokenIds.length === 0) {
      return []
    }
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getMarketDataForTokenIds($collectionAddress: String!, $where: Item_filter) {
          collection(id: $collectionAddress) {
            id
            items(first: 1000, where: $where) {
              ${itemFields}
            }
          }
        }
      `,
      {
        collectionAddress: collectionAddress.toLowerCase(),
        where: { tokenId_in: existingTokenIds },
      },
    )
    return {
      ...res.collection.items,
      // images: res.collection.items?.map((item) => getImages(item.images)),
    }
  } catch (error) {
    console.error(`Failed to fetch market data for Items stored tokens`, error)
    return []
  }
}

export const getNftsOnChainMarketData = async (
  collectionAddress: string,
  tokenIds: string[],
): Promise<TokenMarketData[]> => {
  try {
    const nftMarketContract = getNftMarketContract()
    const response = await nftMarketContract.viewAsksByCollectionAndTokenIds(collectionAddress.toLowerCase(), tokenIds)
    const askInfo = response?.askInfo

    if (!askInfo) return []

    return askInfo
      .map((tokenAskInfo, index) => {
        if (!tokenAskInfo.seller || !tokenAskInfo.price) return null
        const currentSeller = tokenAskInfo.seller
        const isTradable = currentSeller.toLowerCase() !== NOT_ON_SALE_SELLER
        const currentAskPrice = tokenAskInfo.price && formatBigNumber(tokenAskInfo.price)

        return {
          collection: { id: collectionAddress },
          tokenId: tokenIds[index],
          currentSeller,
          isTradable,
          currentAskPrice,
        }
      })
      .filter(Boolean)
  } catch (error) {
    console.error('Failed to fetch NFTs onchain market data', error)
    return []
  }
}

export const getNftsUpdatedMarketData = async (
  collectionAddress: string,
  tokenIds: string[],
): Promise<{ tokenId: string; currentSeller: string; currentAskPrice: BigNumber; isTradable: boolean }[]> => {
  try {
    const nftMarketContract = getNftMarketContract()
    const response = await nftMarketContract.viewAsksByCollectionAndTokenIds(collectionAddress.toLowerCase(), tokenIds)
    const askInfo = response?.askInfo

    if (!askInfo) return null

    return askInfo.map((tokenAskInfo, index) => {
      const isTradable = tokenAskInfo.seller ? tokenAskInfo.seller.toLowerCase() !== NOT_ON_SALE_SELLER : false

      return {
        tokenId: tokenIds[index],
        currentSeller: tokenAskInfo.seller,
        isTradable,
        currentAskPrice: tokenAskInfo.price,
      }
    })
  } catch (error) {
    console.error('Failed to fetch updated NFT market data', error)
    return null
  }
}

export const getAccountNftsOnChainMarketData = async (
  collections: ApiCollections,
  account: string,
): Promise<TokenMarketData[]> => {
  try {
    const nftMarketAddress = getNftMarketAddress()
    const collectionList = Object.values(collections)
    const askCalls = collectionList.map((collection) => {
      const { address: collectionAddress } = collection
      return {
        address: nftMarketAddress,
        name: 'viewAsksByCollectionAndSeller',
        params: [collectionAddress, account, 0, 1000],
      }
    })

    const askCallsResultsRaw = await multicallv2({
      abi: nftMarketAbi,
      calls: askCalls,
      options: { requireSuccess: false },
    })
    const askCallsResults = askCallsResultsRaw
      .map((askCallsResultRaw, askCallIndex) => {
        if (!askCallsResultRaw?.tokenIds || !askCallsResultRaw?.askInfo || !collectionList[askCallIndex]?.address)
          return null
        return askCallsResultRaw.tokenIds
          .map((tokenId, tokenIdIndex) => {
            if (!tokenId || !askCallsResultRaw.askInfo[tokenIdIndex] || !askCallsResultRaw.askInfo[tokenIdIndex].price)
              return null

            const currentAskPrice = formatBigNumber(askCallsResultRaw.askInfo[tokenIdIndex].price)

            return {
              collection: { id: collectionList[askCallIndex].address.toLowerCase() },
              tokenId: tokenId.toString(),
              account,
              currentAskPrice,
            }
          })
          .filter(Boolean)
      })
      .flat()
      .filter(Boolean)

    return askCallsResults
  } catch (error) {
    console.error('Failed to fetch NFTs onchain market data', error)
    return []
  }
}

export const getNftsMarketData = async (
  where = {},
  first = 1000,
  orderBy = 'id',
  orderDirection: 'asc' | 'desc' = 'desc',
  skip = 0,
): Promise<TokenMarketData[]> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getNftsMarketData($first: Int, $skip: Int!, $where: Item_filter, $orderBy: Item_orderBy, $orderDirection: OrderDirection) 
        {
          items(where: $where, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, skip: $skip) {
            ${itemFields}
          }
        }
      `,
      { where, first, skip, orderBy, orderDirection },
    )
    console.log("res.items=============>", res, where, first, skip, orderBy, orderDirection)
    const r =  res.items.map((item) => {
      console.log("item========>", item)
      return {
        ...item,
        // images: getImages(item?.images),
    }})
    console.log("r===============>", r)
    return r;
  } catch (error) {
    console.error('1Failed to fetch Items market data================>', error)
    return []
  }
}

const getImages = (img) => {
  return img
  // return [
  //   img?.split(",")[0],
  //   img?.split(",").slice(1).join(",")
  // ];
}

export const getNftsMarketData2 = async (
  where = {},
  first = 1000,
  orderBy = 'id',
  orderDirection: 'asc' | 'desc' = 'desc',
  skip = 0,
): Promise<TokenMarketData[]> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getNftsMarketData2($first: Int, $skip: Int!, $where: NFT_filter, $orderBy: NFT_orderBy, $orderDirection: OrderDirection) 
        {
          nfts(where: $where, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, skip: $skip) {
            ${nftFields}
          }
        }
      `,
      { where, first, skip, orderBy, orderDirection },
    )
    console.log("res.nfts=============>", res, where, first, skip, orderBy, orderDirection)
    return res.nfts.map((nft) => {
      return {
        ...nft,
        // images: getImages(nft.images),
      }
      
    })
  } catch (error) {
    console.error('Failed to fetch nfts market data================>', error)
    return []
  }
}

export const getPaywallsMarketData = async (
  where = {},
  first = 1000,
  orderBy = 'id',
  orderDirection: 'asc' | 'desc' = 'desc',
  skip = 0,
): Promise<TokenMarketData[]> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getPaywallsMarketData($first: Int, $skip: Int!, $where: Paywall_filter, $orderBy: Paywall_orderBy, $orderDirection: OrderDirection) 
        {
          paywalls(where: $where, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, skip: $skip) {
            ${paywallFields}
          }
        }
      `,
      { where, first, skip, orderBy, orderDirection },
    )
    return res.items
  } catch (error) {
    console.error('2Failed to fetch Items market data================>', error)
    return []
  }
}

export const getAllPancakeBunniesLowestPrice = async (bunnyIds: string[]): Promise<Record<string, number>> => {
  try {
    const singlePancakeBunnySubQueries = bunnyIds.map(
      (
        bunnyId,
      ) => `b${bunnyId}:nfts(first: 1, where: { otherId: ${bunnyId}, isTradable: true }, orderBy: currentAskPrice, orderDirection: asc) {
        currentAskPrice
      }
    `,
    )
    const rawResponse: Record<string, { currentAskPrice: string }[]> = await request(
      GRAPH_API_CANCAN,
      gql`
        query getAllPancakeBunniesLowestPrice {
          ${singlePancakeBunnySubQueries}
        }
      `,
    )
    return fromPairs(
      Object.keys(rawResponse).map((subQueryKey) => {
        const bunnyId = subQueryKey.split('b')[1]
        return [
          bunnyId,
          rawResponse[subQueryKey].length > 0 ? parseFloat(rawResponse[subQueryKey][0].currentAskPrice) : Infinity,
        ]
      }),
    )
  } catch (error) {
    console.error('Failed to fetch PancakeBunnies lowest prices', error)
    return {}
  }
}

export const getAllPancakeBunniesRecentUpdatedAt = async (bunnyIds: string[]): Promise<Record<string, number>> => {
  try {
    const singlePancakeBunnySubQueries = bunnyIds.map(
      (
        bunnyId,
      ) => `b${bunnyId}:nfts(first: 1, where: { otherId: ${bunnyId}, isTradable: true }, orderBy: updatedAt, orderDirection: desc) {
        updatedAt
      }
    `,
    )
    const rawResponse: Record<string, { updatedAt: string }[]> = await request(
      GRAPH_API_CANCAN,
      gql`
        query getAllPancakeBunniesLowestPrice {
          ${singlePancakeBunnySubQueries}
        }
      `,
    )
    return fromPairs(
      Object.keys(rawResponse).map((subQueryKey) => {
        const bunnyId = subQueryKey.split('b')[1]
        return [
          bunnyId,
          rawResponse[subQueryKey].length > 0 ? Number(rawResponse[subQueryKey][0].updatedAt) : -Infinity,
        ]
      }),
    )
  } catch (error) {
    console.error('Failed to fetch PancakeBunnies latest market updates', error)
    return {}
  }
}

/**
 * Returns the lowest/highest price of any NFT in a collection
 */
export const getLeastMostPriceInCollection = async (
  collectionAddress: string,
  orderDirection: 'asc' | 'desc' = 'asc',
) => {
  try {
    const response = await getNftsMarketData(
      { collection: collectionAddress },
      1,
      'currentAskPrice',
      orderDirection,
    )

    if (response.length === 0) {
      return 0
    }

    const [nftSg] = response
    return parseFloat(nftSg.currentAskPrice)
  } catch (error) {
    console.error(`Failed to lowest price NFTs in collection ${collectionAddress}`, error)
    return 0
  }
}

/**
 * Fetch user trading data for buyTradeHistory, sellTradeHistory and askOrderHistory from the Subgraph
 * @param where a User_filter where condition
 * @returns a UserActivity object
 */
export const getUserActivity = async (address: string): Promise<UserActivity> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getUserActivity($address: String!) {
          user(id: $address) {
            buyTradeHistory(first: 250, orderBy: timestamp, orderDirection: desc) {
              ${transactionHistoryFields}
              item {
                ${itemFields}
              }
            }
            sellTradeHistory(first: 250, orderBy: timestamp, orderDirection: desc) {
              ${transactionHistoryFields}
              item {
                ${itemFields}
              }
            }
            askOrderHistory(first: 500, orderBy: timestamp, orderDirection: desc) {
              id
              block
              timestamp
              orderType
              askPrice
              item {
                ${itemFields}
              }
            }
          }
        }
      `,
      { address },
    )

    return res.user || { askOrderHistory: [], buyTradeHistory: [], sellTradeHistory: [] }
  } catch (error) {
    console.error('Failed to fetch user Activity', error)
    return {
      askOrderHistory: [],
      buyTradeHistory: [],
      sellTradeHistory: [],
    }
  }
}

export const getCollectionActivity = async (
  address: string,
  nftActivityFilter: NftActivityFilter,
  itemPerQuery,
  query = 'item_',
) => {
  const getAskOrderEvent = (orderType: MarketEvent) => {
    console.log("getAskOrderEvent==============>", orderType)
    switch (orderType) {
      case MarketEvent.UNLISTED:
        return ["CancelItem", "CancelPaywall", "CancelNFT"]
      // case MarketEvent.MODIFIED:
      //   return "ModifyItem, ModifyPaywall, ModifyNFT"
      case MarketEvent.NEW:
        return ["NewItem", "NewPaywall", "NewNFT"]
      default:
        return ["ModifyItem", "ModifyPaywall", "ModifyNFT"]
        // return AskOrderType.MODIFY
    }
  }

  const hasCollectionFilter = nftActivityFilter.collectionFilters.length > 0

  const collectionFilterGql = hasCollectionFilter
    ? `${query}: { products_contains_nocase: ${JSON.stringify(nftActivityFilter.collectionFilters)}, collection: "${address}"}`
    : `collection: ${JSON.stringify(address)}`

    const askOrderTypeFilter = nftActivityFilter.typeFilters
    .filter((marketEvent) => marketEvent !== MarketEvent.SOLD)
    .map((marketEvent) => getAskOrderEvent(marketEvent))

  const askOrderIncluded = nftActivityFilter.typeFilters.length === 0 || askOrderTypeFilter.length > 0

  const askOrderTypeFilterGql =
    askOrderTypeFilter.length > 0 ? `orderType_in: [${askOrderTypeFilter}]` : ``
  console.log("1collectionFilterGql=============>", askOrderTypeFilter, hasCollectionFilter, nftActivityFilter, collectionFilterGql, askOrderTypeFilterGql)

  const transactionIncluded =
    nftActivityFilter.typeFilters.length === 0 ||
    nftActivityFilter.typeFilters.some(
      (marketEvent) => marketEvent === MarketEvent.BUY || marketEvent === MarketEvent.SOLD,
    )

  let askOrderQueryItem = itemPerQuery / 2
  let transactionQueryItem = itemPerQuery / 2

  if (!askOrderIncluded || !transactionIncluded) {
    askOrderQueryItem = !askOrderIncluded ? 0 : itemPerQuery
    transactionQueryItem = !transactionIncluded ? 0 : itemPerQuery
  }

  const askOrderGql = askOrderIncluded
    ? `askOrders(first: ${askOrderQueryItem}, orderBy: timestamp, orderDirection: desc, where:{
            ${collectionFilterGql}, ${askOrderTypeFilterGql}
          }) {
              id
              block
              timestamp
              orderType
              askPrice
              seller {
                id
              }
              item {
                ${itemFields}
              }
              paywall {
                ${paywallFields}
              }
              nft {
                ${nftFields}
              }
          }`
    : ``

  const transactionGql = transactionIncluded
    ? `transactions(first: ${transactionQueryItem}, orderBy: timestamp, orderDirection: desc, where:{
            ${collectionFilterGql}
          }) {
            ${transactionHistoryFields}
            item {
                ${itemFields}
              }
          }`
    : ``

  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getCollectionActivity {
          ${askOrderGql}
          ${transactionGql}
        }
      `,
    )
    console.log("GRAPH_API_CANCAN============>", res, askOrderGql, transactionGql)
    return res || { askOrders: [], transactions: [] }
  } catch (error) {
    console.error('1Failed to fetch collection Activity===========>', askOrderGql, error)
    return {
      askOrders: [],
      transactions: [],
    }
  }
}

export const getTokenActivity = async (
  tokenId: string,
  collectionAddress: string,
): Promise<{ askOrders: AskOrder[]; transactions: Transaction[] }> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getCollectionActivity($tokenId: BigInt!, $collectionAddress: ID!) {
          items(where:{tokenId: $tokenId, collection_: {id: $collectionAddress}}) {
            transactionHistory(orderBy: timestamp, orderDirection: desc) {
              ${transactionHistoryFields}
            }
            askHistory(orderBy: timestamp, orderDirection: desc) {
                ${askHistoryFields}
            }
          }
        }
      `,
      { tokenId, collectionAddress },
    )
    if (res.items.length > 0) {
      return { askOrders: res.items[0].askHistory, transactions: res.items[0].transactionHistory }
    }
    return { askOrders: [], transactions: [] }
  } catch (error) {
    console.error('1Failed to fetch token Activity==================>', error)
    return {
      askOrders: [],
      transactions: [],
    }
  }
}

/**
 * Get the most recently listed NFTs
 * @param first Number of nfts to retrieve
 * @returns NftTokenSg[]
 */
export const getLatestListedNfts = async (first: number): Promise<TokenMarketData[]> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getLatestNftMarketData($first: Int) {
          items(orderBy: updatedAt , orderDirection: desc, first: $first) {
            ${itemFields}
            collection {
              id
            }
          }
        }
      `,
      { first },
    )

    return {
      ...res.items,
      // images: res.items?.map((item) => getImages(item.images)),
    }
  } catch (error) {
    console.error('3Failed to fetch Items market data========>', error)
    return []
  }
}

/**
 * Filter NFTs from a collection
 * @param collectionAddress
 * @returns
 */
export const fetchNftsFiltered = async (
  collectionAddress: string,
  filters: Record<string, string | number>,
): Promise<ApiTokenFilterResponse> => {
  const res = await fetch(`${API_NFT}/collections/${collectionAddress}/filter?${stringify(filters)}`)

  if (res.ok) {
    const data = await res.json()
    return data
  }

  console.error(`API: Failed to fetch NFT collection ${collectionAddress}`, res.statusText)
  return null
}

/**
 * OTHER HELPERS
 */

export const getMetadataWithFallback = (apiMetadata: ApiResponseCollectionTokens['data'], bunnyId: string) => {
  // The fallback is just for the testnet where some bunnies don't exist
  return (
    apiMetadata[bunnyId] ?? {
      name: '',
      description: '',
      collection: { name: 'Pancake Bunnies' },
      image: {
        original: '',
        thumbnail: '',
      },
    }
  )
}

export const getPancakeBunniesAttributesField = (bunnyId: string) => {
  // Generating attributes field that is not returned by API
  // but can be "faked" since objects are keyed with bunny id
  return [
    {
      traitType: 'bunnyId',
      value: bunnyId,
      displayType: null,
    },
  ]
}

export const combineApiAndSgResponseToNftToken = (
  apiMetadata: ApiSingleTokenData,
  marketData: TokenMarketData,
  attributes: NftAttribute[],
) => {
  return {
    tokenId: marketData.tokenId,
    name: apiMetadata.name,
    description: apiMetadata.description,
    collectionName: apiMetadata.collection.name,
    collectionAddress: pancakeBunniesAddress,
    image: apiMetadata.image,
    marketData,
    attributes,
  }
}

// export const getTokenURI = async(tokenId) => {
//   const nfticketHelper2Contract = getNFTicketHelper2()
//   const [
//     metadataUrl
//   ] = Promise.all([
//     nfticketHelper2Contract.tokenURI(tokenId)
//   ])
//   return metadataUrl
// }

export const fetchWalletTokenIdsForCollections = async (
  account: string,
  collections: ApiCollections,
): Promise<TokenIdWithCollectionAddress[]> => {
  const balanceOfCalls = Object.values(collections).map((collection) => {
    const { address: collectionAddress } = collection
    return {
      address: collectionAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const balanceOfCallsResultRaw = await multicallv2({
    abi: erc721Abi,
    calls: balanceOfCalls,
    options: { requireSuccess: false },
  })
  const balanceOfCallsResult = balanceOfCallsResultRaw.flat()

  const tokenIdCalls = Object.values(collections)
    .map((collection, index) => {
      const balanceOf = balanceOfCallsResult[index]?.toNumber() ?? 0
      const { address: collectionAddress } = collection

      return range(balanceOf).map((tokenIndex) => {
        return {
          address: collectionAddress,
          name: 'tokenOfOwnerByIndex',
          params: [account, tokenIndex],
        }
      })
    })
    .flat()

  const tokenIdResultRaw = await multicallv2({
    abi: erc721Abi,
    calls: tokenIdCalls,
    options: { requireSuccess: false },
  })
  const tokenIdResult = tokenIdResultRaw.flat()

  const nftLocation = NftLocation.WALLET

  const walletNfts = tokenIdResult.reduce((acc, tokenIdBn, index) => {
    if (tokenIdBn) {
      const { address: collectionAddress } = tokenIdCalls[index]
      acc.push({ tokenId: tokenIdBn.toString(), collectionAddress, nftLocation })
    }
    return acc
  }, [])

  return walletNfts
}

/**
 * Helper to combine data from the collections' API and subgraph
 */
export const combineCollectionData = (
  collectionApiData: any,
  collectionSgData: any,
): Record<string, Collection> => {
  const collectionsMarketObj: Record<string, CollectionMarketDataBaseFields> = fromPairs(
    collectionSgData.map((current) => [current.id, current]),
  )

  return fromPairs(
    collectionApiData
      .filter((collection) => collection?.id)
      .map((current) => {
        const collectionMarket = collectionsMarketObj[current.id]
        const collection = {
          ...current,
          ...collectionMarket,
        }

        if (current.name) {
          collection.name = current.name
        }

        return [current.id, collection]
      }),
  )
}

/**
 * Evaluate whether a market NFT is in a users wallet, their profile picture, or on sale
 * @param tokenId string
 * @param tokenIdsInWallet array of tokenIds in wallet
 * @param tokenIdsForSale array of tokenIds on sale
 * @param profileNftId Optional tokenId of users' profile picture
 * @returns NftLocation enum value
 */
export const getNftLocationForMarketNft = (
  tokenId: string,
  tokenIdsInWallet: string[],
  tokenIdsForSale: string[],
  profileNftId?: string,
): NftLocation => {
  if (tokenId === profileNftId) {
    return NftLocation.PROFILE
  }
  if (tokenIdsForSale.includes(tokenId)) {
    return NftLocation.FORSALE
  }
  if (tokenIdsInWallet.includes(tokenId)) {
    return NftLocation.WALLET
  }
  console.error(`Cannot determine location for tokenID ${tokenId}, defaulting to NftLocation.WALLET`)
  return NftLocation.WALLET
}

/**
 * Construct complete TokenMarketData entities with a users' wallet NFT ids and market data for their wallet NFTs
 * @param walletNfts TokenIdWithCollectionAddress
 * @param marketDataForWalletNfts TokenMarketData[]
 * @returns TokenMarketData[]
 */
export const attachMarketDataToWalletNfts = (
  walletNfts: TokenIdWithCollectionAddress[],
  marketDataForWalletNfts: TokenMarketData[],
): TokenMarketData[] => {
  const walletNftsWithMarketData = walletNfts.map((walletNft) => {
    const marketData = marketDataForWalletNfts.find(
      (marketNft) =>
        marketNft.tokenId === walletNft.tokenId &&
        marketNft.collection.id.toLowerCase() === walletNft.collectionAddress.toLowerCase(),
    )
    return (
      marketData ?? {
        tokenId: walletNft.tokenId,
        collection: {
          id: walletNft.collectionAddress.toLowerCase(),
        },
        nftLocation: walletNft.nftLocation,
        metadataUrl: null,
        transactionHistory: null,
        currentSeller: null,
        isTradable: null,
        currentAskPrice: null,
        latestTradedPriceInBNB: null,
        tradeVolumeBNB: null,
        totalTrades: null,
        otherId: null,
      }
    )
  })
  return walletNftsWithMarketData
}

/**
 * Attach TokenMarketData and location to NftToken
 * @param nftsWithMetadata NftToken[] with API metadata
 * @param nftsForSale  market data for nfts that are on sale (i.e. not in a user's wallet)
 * @param walletNfts market data for nfts in a user's wallet
 * @param tokenIdsInWallet array of token ids in user's wallet
 * @param tokenIdsForSale array of token ids of nfts that are on sale
 * @param profileNftId profile picture token id
 * @returns NFT[]
 */
export const combineNftMarketAndMetadata = (
  nftsWithMetadata: NftToken[],
  nftsForSale: TokenMarketData[],
  walletNfts: TokenMarketData[],
  tokenIdsInWallet: string[],
  tokenIdsForSale: string[],
  profileNftId?: string,
): NftToken[] => {
  const completeNftData = nftsWithMetadata.map<NftToken>((nft) => {
    // Get metadata object
    let marketData = nftsForSale.find(
      (forSaleNft) =>
        forSaleNft.tokenId === nft.tokenId &&
        forSaleNft.collection &&
        forSaleNft.collection.id === nft.collectionAddress,
    )
    if (!marketData) {
      marketData = walletNfts.find(
        (marketNft) =>
          marketNft.collection &&
          marketNft.collection.id === nft.collectionAddress &&
          marketNft.tokenId === nft.tokenId,
      )
    }
    const location = getNftLocationForMarketNft(nft.tokenId, tokenIdsInWallet, tokenIdsForSale, profileNftId)
    return { ...nft, marketData, location }
  })
  return completeNftData
}

const fetchWalletMarketData = async (walletNftsByCollection: {
  [collectionAddress: string]: TokenIdWithCollectionAddress[]
}): Promise<TokenMarketData[]> => {
  const walletMarketDataRequests = Object.entries(walletNftsByCollection).map(
    async ([collectionAddress, tokenIdsWithCollectionAddress]) => {
      const tokenIdIn = tokenIdsWithCollectionAddress.map((walletNft) => walletNft.tokenId)
      const [nftsOnChainMarketData, nftsMarketData] = await Promise.all([
        getNftsOnChainMarketData(collectionAddress.toLowerCase(), tokenIdIn),
        getNftsMarketData({
          tokenId_in: tokenIdIn,
          collection: collectionAddress.toLowerCase(),
        }),
      ])

      return tokenIdIn
        .map((tokenId) => {
          const nftMarketData = nftsMarketData.find((tokenMarketData) => tokenMarketData.tokenId === tokenId)
          const onChainMarketData = nftsOnChainMarketData.find(
            (onChainTokenMarketData) => onChainTokenMarketData.tokenId === tokenId,
          )

          if (!nftMarketData && !onChainMarketData) return null

          return { ...nftMarketData, ...onChainMarketData }
        })
        .filter(Boolean)
    },
  )

  const walletMarketDataResponses = await Promise.all(walletMarketDataRequests)
  return walletMarketDataResponses.flat()
}

/**
 * Get in-wallet, on-sale & profile pic NFT metadata, complete with market data for a given account
 * @param account
 * @param collections
 * @param profileNftWithCollectionAddress
 * @returns Promise<NftToken[]>
 */
export const getCompleteAccountNftData = async (
  account: string,
  collections: ApiCollections,
  profileNftWithCollectionAddress?: TokenIdWithCollectionAddress,
) => {
  // // Add delist collections to allow user reclaim their NFTs
  // const collectionsWithDelist = { ...collections, ...DELIST_COLLECTIONS }

  // const [walletNftIdsWithCollectionAddress, onChainForSaleNfts] = await Promise.all([
  //   fetchWalletTokenIdsForCollections(account, collectionsWithDelist),
  //   getAccountNftsOnChainMarketData(collectionsWithDelist, account),
  // ])

  // if (profileNftWithCollectionAddress?.tokenId) {
  //   walletNftIdsWithCollectionAddress.unshift(profileNftWithCollectionAddress)
  // }

  // const walletNftsByCollection = groupBy(
  //   walletNftIdsWithCollectionAddress,
  //   (walletNftId) => walletNftId.collectionAddress,
  // )

  // const walletMarketData = await fetchWalletMarketData(walletNftsByCollection)

  // const walletNftsWithMarketData = attachMarketDataToWalletNfts(walletNftIdsWithCollectionAddress, walletMarketData)

  // const walletTokenIds = walletNftIdsWithCollectionAddress
  //   .filter((walletNft) => {
  //     // Profile Pic NFT is no longer wanted in this array, hence the filter
  //     return profileNftWithCollectionAddress?.tokenId !== walletNft.tokenId
  //   })
  //   .map((nft) => nft.tokenId)

  // const tokenIdsForSale = onChainForSaleNfts.map((nft) => nft.tokenId)

  // const forSaleNftIds = onChainForSaleNfts.map((nft) => {
  //   return { collectionAddress: nft.collection.id, tokenId: nft.tokenId }
  // })

  // const metadataForAllNfts = await getNftsFromDifferentCollectionsApi([
  //   ...forSaleNftIds,
  //   ...walletNftIdsWithCollectionAddress,
  // ])

  // const completeNftData = combineNftMarketAndMetadata(
  //   metadataForAllNfts,
  //   onChainForSaleNfts,
  //   walletNftsWithMarketData,
  //   walletTokenIds,
  //   tokenIdsForSale,
  //   profileNftWithCollectionAddress?.tokenId,
  // )

  // return completeNftData
}

/**
 * Fetch distribution information for a collection
 * @returns
 */
export const getCollectionDistributionApi = async <T>(collectionAddress: string) => {
  const data = await (await firestore.collection("distribution").doc(collectionAddress).get()).data()
  return { total: data?.length ?? 0, data }
}

export const getCollectionContracts = async (
  collectionAddress: string,
) => {
  return (await firestore.collection("contracts").doc(collectionAddress).get()).data()
}

export const getUsersItemsData = async (
  collectionId,
  where = {},
  first = 1000,
  orderBy = 'id',
  orderDirection: 'asc' | 'desc' = 'desc',
  skip = 0,
): Promise<TokenMarketData[]> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getCollectionData($collectionId: String!) 
        {
          collection(id: $collectionId) {
            registrations {
              user {
                id
              }
            }
          }
        }
      `,
      { where, first, skip, orderBy, orderDirection },
    )
    return res.collection?.registrations
  } catch (error) {
    console.error('5Failed to fetch Items market data============>', error)
    return []
  }
}

export const getCollectionAnnouncements = async (first: number, skip: number, where) => {
  try {
    const res = await request(
        GRAPH_API_CANCAN,
        gql`
          {
            items(first: $first, skip: $skip, where: $where) {
              ${announcementFields}
            }
          }
        `,
        { first, skip, where },
      )
      return res.announcements
    } catch (error) {
      console.error('Failed to fetch announcements====================>', error)
      return []
    }
  }

export const getPaymentCredits = async (collectionAddress: string, tokenId: string, address: string) => {
  try {
    const marketOrdersContract = getMarketOrdersContract()
    const credits = await marketOrdersContract.getPaymentCredits(address, collectionAddress, tokenId)
    return new BN(credits._hex).toJSON()
  } catch (error) {
    console.error('===========>Failed to fetch payment credits', error)
    return []
  }
}

export const getSubscriptionStatus = async (paywallAddress: string, account: string, nfticketId: string, tokenId: string) => {
    console.log("isOngoing=============>", paywallAddress, account)
    try {
    const paywallContract = getPaywallContract(paywallAddress ?? '')
    const isOngoing = await paywallContract.ongoingSubscription(account ?? '', nfticketId, tokenId)
    console.log("isOngoing=============>", isOngoing)
    return isOngoing
  } catch (error) {
    console.error('===========>Failed to fetch ongoing subscription', error)
    return false
  }
}

export const getDiscounted = async (collectionAddress: string, account: string, tokenId: string, price, options, identityTokenId=0, isPaywall=false) => {
  console.log("0data================>", collectionAddress, account, tokenId,price, options, identityTokenId, isPaywall)
  try {
    const marketHelperContract = isPaywall ? getPaywallMarketHelperContract() : getMarketHelperContract()
    const data = await marketHelperContract.getRealPrice(collectionAddress, account, tokenId, options, identityTokenId, price)
    console.log("1data================>", data, options, isPaywall)
    const res = {
      discount: data?.length > 0 ? new BN(data[0]._hex).toJSON() : BIG_ZERO,
      discounted: data?.length > 1 ? data[1] : false,
    }
    console.log("2data================>", res)
    return res
  } catch (error) {
    console.error('===========>Failed to fetch discounted price', error)
    return {
      discount: BIG_ZERO,
      discounted: false
    }
  }
}