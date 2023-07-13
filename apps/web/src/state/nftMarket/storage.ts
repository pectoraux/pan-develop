import { NftFilter, NftActivityFilter, MarketEvent, NftAttribute } from 'state/nftMarket/types'
import { useAtom } from 'jotai'
import cloneDeep from 'lodash/cloneDeep'
import { nftMarketFiltersAtom, nftMarketActivityFiltersAtom, tryVideoNftMediaAtom } from 'state/nftMarket/atoms'
import { useCallback } from 'react'

const initialNftFilterState: any = {
  activeFilters: {},
  showOnlyOnSale: true,
  ordering: {
    field: 'currentAskPrice',
    direction: 'asc',
  },
}

const initialNftActivityFilterState: any = {
  typeFilters: [],
  collectionFilters: [],
}

export function useNftStorage() {
  const [nftMarketFilters, setNftMarketFilters] = useAtom(nftMarketFiltersAtom)
  const [nftMarketActivityFilters, setNftMarketActivityFilters] = useAtom(nftMarketActivityFiltersAtom)
  const [tryVideoNftMedia, setTryVideoNftMedia] = useAtom(tryVideoNftMediaAtom)

  const addActivityTypeFilters = useCallback(
    ({ collection, field }) => {
      if (nftMarketActivityFilters[collection]) {
        nftMarketActivityFilters[collection].typeFilters.push(field)
      } else {
        nftMarketActivityFilters[collection] = {
          ...cloneDeep(initialNftActivityFilterState),
          typeFilters: [field],
        }
      }
      setNftMarketActivityFilters({ ...nftMarketActivityFilters })
    },
    [setNftMarketActivityFilters, nftMarketActivityFilters],
  )

  const addActivityCollectionFilters = useCallback(
    ({ collection }) => {
      if (nftMarketActivityFilters['']) {
        nftMarketActivityFilters[''].collectionFilters.push(collection)
      } else {
        nftMarketActivityFilters[''] = {
          ...cloneDeep(initialNftActivityFilterState),
          collectionFilters: [collection],
        }
      }
      setNftMarketActivityFilters({ ...nftMarketActivityFilters })
    },
    [setNftMarketActivityFilters, nftMarketActivityFilters],
  )

  const removeActivityTypeFilters = useCallback(
    ({ collection, field }) => {
      if (nftMarketActivityFilters[collection]) {
        nftMarketActivityFilters[collection].typeFilters = nftMarketActivityFilters[collection].typeFilters.filter(
          (activeFilter) => activeFilter !== field,
        )
      }
      setNftMarketActivityFilters({ ...nftMarketActivityFilters })
    },
    [setNftMarketActivityFilters, nftMarketActivityFilters],
  )

  const removeActivityCollectionFilters = useCallback(
    ({ collection }) => {
      if (nftMarketActivityFilters['']) {
        nftMarketActivityFilters[collection].collectionFilters = nftMarketActivityFilters[
          collection
        ].collectionFilters.filter((activeFilter) => activeFilter !== collection)
      }
      setNftMarketActivityFilters({ ...nftMarketActivityFilters })
    },
    [setNftMarketActivityFilters, nftMarketActivityFilters],
  )

  const removeAllActivityFilters = useCallback(
    (collectionAddress: any) => {
      nftMarketActivityFilters[collectionAddress] = cloneDeep(initialNftActivityFilterState)
      setNftMarketActivityFilters({ ...nftMarketActivityFilters })
    },
    [nftMarketActivityFilters, setNftMarketActivityFilters],
  )

  const removeAllActivityCollectionFilters = useCallback(() => {
    nftMarketActivityFilters[''].collectionFilters = []
    setNftMarketActivityFilters({ ...nftMarketActivityFilters })
  }, [nftMarketActivityFilters, setNftMarketActivityFilters])

  const setShowOnlyOnSale = useCallback(
    ({ collection, showOnlyOnSale }: { collection: any; showOnlyOnSale: any }) => {
      if (nftMarketFilters[collection]) {
        nftMarketFilters[collection].showOnlyOnSale = showOnlyOnSale
      } else {
        nftMarketFilters[collection] = {
          ...cloneDeep(initialNftFilterState),
          showOnlyOnSale,
        }
      }
      setNftMarketFilters({ ...nftMarketFilters })
    },
    [setNftMarketFilters, nftMarketFilters],
  )

  const setOrdering = useCallback(
    ({ collection, field, direction }: { collection: any; field: any; direction: 'asc' | 'desc' }) => {
      if (nftMarketFilters[collection]) {
        nftMarketFilters[collection].ordering = {
          field,
          direction,
        }
      } else {
        nftMarketFilters[collection] = {
          ...cloneDeep(initialNftFilterState),
          ordering: {
            field,
            direction,
          },
        }
      }
      setNftMarketFilters({ ...nftMarketFilters })
    },
    [setNftMarketFilters, nftMarketFilters],
  )

  const removeAllItemFilters = useCallback(
    (collectionAddress: any) => {
      nftMarketFilters[collectionAddress] = { ...cloneDeep(initialNftActivityFilterState) }
      setNftMarketFilters({ ...nftMarketFilters })
    },
    [nftMarketFilters, setNftMarketFilters],
  )

  const updateItemFilters = useCallback(
    ({ collectionAddress, nftFilters }: { collectionAddress: any; nftFilters: any }) => {
      if (nftMarketFilters[collectionAddress]) {
        nftMarketFilters[collectionAddress] = {
          ...nftMarketFilters[collectionAddress],
          activeFilters: { ...nftFilters },
        }
      } else {
        nftMarketFilters[collectionAddress] = {
          ...cloneDeep(initialNftFilterState),
          activeFilters: { ...nftFilters },
        }
      }
      setNftMarketFilters({ ...nftMarketFilters })
    },
    [nftMarketFilters, setNftMarketFilters],
  )

  return {
    nftMarketFilters,
    nftMarketActivityFilters,
    tryVideoNftMedia,
    addActivityTypeFilters,
    addActivityCollectionFilters,
    removeActivityTypeFilters,
    removeActivityCollectionFilters,
    removeAllActivityFilters,
    removeAllActivityCollectionFilters,
    setShowOnlyOnSale,
    setOrdering,
    setTryVideoNftMedia,
    removeAllItemFilters,
    updateItemFilters,
  }
}
