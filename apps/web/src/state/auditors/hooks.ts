import { useRouter } from 'next/router'
import { useMemo, useEffect, useState } from 'react'
import { firestore } from 'utils/firebase'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { Pool } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import {
  fetchAuditorsAsync,
  fetchAuditorSgAsync,
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
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const fromAuditor = router.query.auditor

  useSlowRefreshEffect(
    () => {
      const fetchPoolsDataWithFarms = async () => {
        batch(() => {
          dispatch(fetchAuditorSgAsync({ fromAuditor }))
          dispatch(fetchAuditorsAsync({ fromAuditor }))
        })
      }

      fetchPoolsDataWithFarms()
    },
    [dispatch, chainId, fromAuditor],
  )
}

export const usePool = (sousId): { pool?: any; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(sousId), [sousId])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsPageFetch = () => {
  // const { account } = useWeb3React()
  // const dispatch = useAppDispatch()
  useFetchPublicPoolsData()

  // useFastRefreshEffect(() => {
  //   batch(() => {
  //     if (account) {
  //       dispatch(fetchAuditorsUserDataAsync(account))
  //     }
  //   })
  // }, [account, dispatch])
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