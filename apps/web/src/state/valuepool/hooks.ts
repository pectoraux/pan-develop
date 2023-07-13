import { useRouter } from 'next/router'
import { useMemo, useEffect, useState } from 'react'
import { firestore } from 'utils/firebase'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useWeb3React } from '@pancakeswap/wagmi'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFastRefreshEffect, useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { Pool } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import useSWR from 'swr'
import {
  fetchRampAsync,
  setInitialDataAsync,
  fetchRampsUserDataAsync,
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
  const router = useRouter()
  const { chainId } = useActiveChainId()
  const ramp  = useMemo(() => router.query.ramp, [router.query.ramp],) 

  useSWR(['ramp', ramp, chainId], async () => fetchPoolsDataWithFarms(ramp, dispatch))
}

export const fetchPoolsDataWithFarms = async (ramp, dispatch) => {
  if (ramp) {
    const data = await (await firestore.collection("ramps").doc(ramp).get()).data()
    batch(() => {
      dispatch(setInitialDataAsync(data && [data] || []))
      dispatch(fetchRampAsync(ramp))
    })
  }
}

export const usePool = (id): { pool?: any; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(id), [id])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsPageFetch = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()

  useFetchPublicPoolsData()

  useFastRefreshEffect(() => {
    batch(() => {
      if (account) {
        // dispatch(fetchRampsUserDataAsync(account))
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