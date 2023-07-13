import useSWR from 'swr'
import axios from 'axios'
import NodeRSA from 'encrypt-rsa'
import { useMemo, useEffect, useState } from 'react'
import { firestore } from 'utils/firebase'
import useSWRImmutable from 'swr/immutable'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useWeb3React } from '@pancakeswap/wagmi'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFastRefreshEffect, useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { Pool } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import { requiresApproval } from 'utils/requiresApproval'
import {
  fetchRampsAsync,
  fetchRampsUserDataAsync,
} from '.'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
} from './selectors'
import { getRampSg, getSession, getTokenData, getAccountSg } from './fetchPools'

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
  
  useSWR('ramps', async () => {
      const fetchPoolsDataWithFarms = async () => {
        batch(() => {
          dispatch(fetchRampsAsync())
        })
      }
      fetchPoolsDataWithFarms()
    },
    // [dispatch, chainId],
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
        dispatch(fetchRampsUserDataAsync(account))
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

export const useGetSessionInfoSg = (sessionId, rampAddress) => {
  const { 
    data, 
    status, 
    mutate: refetch, 
  } = useSWR(['ramp-session-info', sessionId ?? '0', rampAddress], async () => getSession(sessionId, rampAddress))
  return { data, refetch, status }
}

export const useGetTokenData = (tokenAddress) => {
  const { 
    data, 
    status, 
    mutate: refetch, 
  } = useSWR(['token-data', tokenAddress], async () => getTokenData(tokenAddress))
  return { data, refetch, status }
}

export const useGetAccountSg = (accountAddress, channel) => {
  const { 
    data, 
    status, 
    mutate: refetch, 
  } = useSWR(['account-data', accountAddress, channel], async () => getAccountSg(accountAddress, channel))
  return { data, refetch, status }
}

export const useGetSessionInfo = (sessionId, sk) => {
  console.log("useGetSessionInfo==========>", sk)
  const nodeRSA = new NodeRSA(
    process.env.NEXT_PUBLIC_PUBLIC_KEY,
    process.env.NEXT_PUBLIC_PRIVATE_KEY,
  )
  const sk0 = sk ? nodeRSA.decryptStringWithRsaPrivateKey({ 
    text: sk, 
    privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY
  }):"";
  const { 
    data, 
    status, 
    mutate: refetch, 
  } = useSWRImmutable(['stripe-session-info', sessionId ?? '0', sk0], async () => axios.post('/api/check', { sessionId, sk: sk0 }))
  return { data: data?.data, refetch, status }
}

export const useGetRamp = (rampAddress) => {
  const { 
    data, 
    status, 
    mutate: refetch, 
  } = useSWRImmutable(['ramp-info', rampAddress], async () => getRampSg(rampAddress))
  return { data, refetch, status }
}

export const useGetRequiresApproval = (c, a, s) => {
  const { data, status } = useSWR(
    ['ramps', 'allowance', s.toLowerCase()], async () => requiresApproval(c,a,s),
  )
  return {
    status,
    needsApproval: data ?? true
  }
}