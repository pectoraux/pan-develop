import { useRouter } from 'next/router'
import { useMemo, useEffect, useState } from 'react'
import { firestore } from 'utils/firebase'
import { useWeb3React } from '@pancakeswap/wagmi'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFastRefreshEffect, useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { Pool } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import {
  fetchAuditorAsync,
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

// export const useFetchPublicPoolsData = () => {
//   const dispatch = useAppDispatch()
//   const router = useRouter()
//   const auditor  = useMemo(() => router.query.auditor, [router.query.auditor],) 

//   useSlowRefreshEffect (() => dispatch(fetchAuditorAsync(auditor)), [dispatch],)
// }

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const auditor  = useMemo(() => router.query.auditor, [router.query.auditor],) 

  useSlowRefreshEffect(
    () => {
      const fetchPoolsDataWithFarms = async () => {
        await dispatch(fetchAuditorAsync(auditor))
      }

      fetchPoolsDataWithFarms()
    },
    [dispatch, auditor],
  )
}

export const fetchPoolsDataWithFarms = async (auditor, dispatch) => {
  if (auditor) {
    batch(() => {
      dispatch(fetchAuditorAsync(auditor))
    })
  }
}

export const usePool = (sousId: number): { pool?: any; userDataLoaded: boolean } => {
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