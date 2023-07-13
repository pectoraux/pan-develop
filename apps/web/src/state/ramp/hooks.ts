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
import {
  fetchRampAsync,
  fetchRampUserDataAsync,
} from '.'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
  makePoolWithUserDataLoadingSelector2,
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
  const router = useRouter()
  const dispatch = useAppDispatch()
  const ramp  = useMemo(() => router.query.ramp, [router.query.ramp],) 
  const { chainId } = useActiveChainId()

  useSlowRefreshEffect(
    () => {
      if (ramp) {
        batch(() => {
          dispatch(fetchRampAsync(ramp))
        })
      }
    }, [ramp, chainId, dispatch],
  )
}

export const fetchPoolsDataWithFarms = async (ramp, dispatch) => {
  if (ramp) {
    batch(() => {
      dispatch(fetchRampAsync(ramp))
    })
  }
}

export const usePool = (sousId: number): { pool?: any; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(sousId), [sousId])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePool2 = (address): { pool?: any; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector2(address), [address])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsPageFetch = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()

  useFetchPublicPoolsData()

  useFastRefreshEffect(() => {
    batch(() => {
      if (account) {
        dispatch(fetchRampUserDataAsync(account))
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