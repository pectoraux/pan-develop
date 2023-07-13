import { useRouter } from 'next/router'
import { useMemo, useEffect, useState } from 'react'
import { firestore } from 'utils/firebase'
import useSWR from 'swr'
import { useWeb3React } from '@pancakeswap/wagmi'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useFastRefreshEffect, useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { Pool } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import { requiresApproval } from 'utils/requiresApproval'
import {
  fetchBountiesAsync,
  fetchBountiesUserDataAsync,
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
  const fromRamps =  router.pathname.includes('ramps')
  const fromAuditors = router.pathname.includes('auditors')
  const fromSponsors = router.pathname.includes('sponsors')
  const fromAccelerator = router.pathname.includes('accelerator')
  const fromBusinesses =  router.pathname.includes('businesses')
  const fromContributors = router.pathname.includes('contributors')
  const fromTransfers = router.pathname.includes('transfers')
  
  useSlowRefreshEffect(
    () => {
      const fetchPoolsDataWithFarms = async () => {
        batch(() => {
          dispatch(fetchBountiesAsync({
            fromAccelerator, 
            fromContributors,
            fromSponsors,
            fromAuditors,
            fromBusinesses,
            fromRamps,
            fromTransfers
          }))
        })
      }

      fetchPoolsDataWithFarms()
    },
    [dispatch, chainId],
  )
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
        dispatch(fetchBountiesUserDataAsync(account))
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
  const { data, status } = useSWR(
    ['tb', 'allowance', s.toLowerCase()], async () => requiresApproval(c,a,s),
  )
  return {
    status,
    needsApproval: data ?? true
  }
}