import { useMemo, useEffect, useState } from 'react'
import { firestore } from 'utils/firebase'
import useSWR from 'swr'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { Pool } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import { requiresApproval } from 'utils/requiresApproval'

import { useFastRefreshEffect, useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { useWeb3React } from '@pancakeswap/wagmi'
import {
  fetchPairsAsync, fetchPoolsUserDataAsync,
} from '.'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
} from './selectors'

export const useFetchPublicPoolsStats = () => {
  const [data, setData] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await firestore.collection("businesses_stats").get()
        setData(snapshot.docs.map(doc => doc.data()))
      } catch (error) {
        console.error('Unable to fetch stripe account:', error)
      }
    }

    fetchData()
  }, [setData])
  return data
}

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  
  useSlowRefreshEffect(
    () => {
      const fetchPoolsDataWithFarms = async () => {
        batch(() => {
          dispatch(fetchPairsAsync())
        })
      }

      fetchPoolsDataWithFarms()
    },
    [dispatch, chainId],
  )
}

export const usePool = (sousId: number) => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(sousId), [sousId])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsPageFetch = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  useFetchPublicPoolsData()

  useFastRefreshEffect(() => {
    batch(() => {
      if (account) {
        dispatch(fetchPoolsUserDataAsync(account))
      }
    })
  }, [account, dispatch])
}

export const useCurrBribe = () => {
  return useSelector(currBribeSelector)
}

export const useCurrPool = () => {
  return useSelector(currPoolSelector)
}

export const usePoolsWithFilterSelector = () => {
  return useSelector(poolsWithFilterSelector)
}

export const useGetRequiresApproval = (c, a, s) => {
  const { data, mutate: refetch } = useSWR(
    ['pools', 'allowance', s.toLowerCase()], async () => requiresApproval(c,a,s),
  )
  return { needsApproval: data, refetch }
}