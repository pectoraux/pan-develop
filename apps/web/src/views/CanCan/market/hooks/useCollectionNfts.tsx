import { useEffect, useState, useRef, useMemo } from 'react'
import {
  NftAttribute,
  NftToken,
  Collection,
} from 'state/cancan/types'
import { 
  useGetNftFilters, 
  useGetNftOrdering, 
  useGetNftShowOnlyOnSale, 
  useGetNftShowOnlyUsers, 
  useGetCollection 
} from 'state/cancan/hooks'
import { FetchStatus } from 'config/constants/types'
import {
  getNftApi,
  getCollectionApi,
  getUsersItemsData,
  getNftsMarketData,
} from 'state/cancan/helpers'
import useSWRInfinite from 'swr/infinite'
import uniqBy from 'lodash/uniqBy'
import { REQUEST_SIZE } from '../Collection/config'

interface ItemListingSettings {
  field: string
  direction: 'asc' | 'desc'
  showOnlyNftsOnSale: boolean
  showOnlyNftsUsers: boolean
  nftFilters: Record<string, NftAttribute>
}

const fetchMarketDataNfts = async (
  collection: Collection,
  settings: ItemListingSettings,
  page: number,
) => {
  const whereClause = { 
    collection_: {id: collection.id},
    behindPaywall_lt: "1",
  }
  const subgraphRes = await getNftsMarketData(
    whereClause,
    REQUEST_SIZE,
    settings.field,
    settings.direction,
    page * REQUEST_SIZE,
  )
  console.log("subgraphRes===========>", subgraphRes)
  return subgraphRes as any
}

export const useCollectionNfts = (collectionAddress: string) => {
  const fetchedNfts = useRef<NftToken[]>([])
  const fallbackMode = useRef(false)
  const fallbackModePage = useRef(0)
  const isLastPage = useRef(false)
  const { collection } = useGetCollection(collectionAddress)
  const { field, direction } = useGetNftOrdering(collectionAddress)
  const showOnlyNftsOnSale = useGetNftShowOnlyOnSale(collectionAddress)
  const showOnlyNftsUsers = useGetNftShowOnlyUsers(collectionAddress)
  const nftFilters = useGetNftFilters(collectionAddress)
  const [itemListingSettings, setItemListingSettings] = useState<ItemListingSettings>({
    field,
    direction,
    showOnlyNftsOnSale,
    showOnlyNftsUsers,
    nftFilters,
  })

  // We don't know the amount in advance if nft filters exist
  const resultSize =
    !Object.keys(nftFilters).length && collection
      ? showOnlyNftsOnSale
        ? collection.numberTokensListed
        : collection?.totalSupply
      : null

  const itemListingSettingsJson = JSON.stringify(itemListingSettings)
  const filtersJson = JSON.stringify(nftFilters)

  useEffect(() => {
    setItemListingSettings(() => ({
      field,
      direction,
      showOnlyNftsOnSale,
      showOnlyNftsUsers,
      nftFilters: JSON.parse(filtersJson),
    }))
    fallbackMode.current = false
    fallbackModePage.current = 0
    fetchedNfts.current = []
    isLastPage.current = false
    }, [field, direction, showOnlyNftsOnSale, showOnlyNftsUsers, filtersJson])

  const {
    data: nfts,
    status,
    size,
    setSize,
  } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (pageIndex !== 0 && previousPageData && !previousPageData.length) return null
      return [collectionAddress, itemListingSettingsJson, pageIndex, 'collectionNfts']
    },
    async (address, settingsJson, page) => {
      const settings: ItemListingSettings = JSON.parse(settingsJson.toString())
      let newNfts: NftToken[] = []
      if (settings.showOnlyNftsUsers) {
        newNfts = collection.registrations?.filter((reg) => !reg.unregister)
      } else if (settings.showOnlyNftsOnSale) {
        newNfts = collection.partnerRegistrations?.filter((reg) => !reg.unregister && reg.partnerCollection?.id)
      } else {
        newNfts = await fetchMarketDataNfts(collection, settings, Number(page))
      }
      if (newNfts.length < REQUEST_SIZE) {
        isLastPage.current = true
      }
      return newNfts
    },
    { revalidateAll: true },
  )

  const uniqueNftList: NftToken[] = useMemo(() => (nfts ? uniqBy(nfts.flat(), showOnlyNftsUsers ? 'address' : 'tokenId') : []), [nfts])
  fetchedNfts.current = uniqueNftList
  const paywallMirrorsCount = collection?.paywalls?.reduce((acc, cur) => (acc + cur?.mirrors?.length), 0)
  return {
    nfts: uniqueNftList,
    isFetchingNfts: status !== FetchStatus.Fetched,
    page: size,
    setPage: setSize,
    resultSize: showOnlyNftsUsers || showOnlyNftsOnSale ? uniqueNftList.length : uniqueNftList.length + paywallMirrorsCount,
    isLastPage: isLastPage.current,
  }
}
