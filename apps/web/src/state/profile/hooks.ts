import { useMemo } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import { getAchievements } from 'state/achievements/helpers'
import { FetchStatus } from 'config/constants/types'
import useSWR, { KeyedMutator } from 'swr'
import { localStorageMiddleware } from 'hooks/useSWRContract'
import useSWRImmutable from 'swr/immutable'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { getProfile, GetProfileResponse } from './helpers'
import { Profile } from '../types'
import {
  fetchProfilesAsync,
} from '.'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
} from './selectors'
import { getIsNameUsed, getProfileData, getProfileDataFromUser, getSSIDatum, getSharedEmail } from './fetchPools'

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  
  useSlowRefreshEffect(
    () => {
      const fetchPoolsDataWithFarms = async () => {
        batch(() => {
          dispatch(fetchProfilesAsync())
        })
      }

      fetchPoolsDataWithFarms()
    },
    [dispatch, chainId],
  )
}

export const usePool = (id) => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(id), [id])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsPageFetch = () => {
  useFetchPublicPoolsData()
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

export const useProfileForAddress = (
  address: string,
  fetchConfiguration = {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  },
): {
  profile?: any
  isFetching: boolean
  isValidating: boolean
  refresh: KeyedMutator<GetProfileResponse>
} => {
  const { data, status, mutate, isValidating } = useSWR(
    address ? [address, 'profile1'] : null,
    () => getProfileDataFromUser(address),
    fetchConfiguration,
  )
  return {
    profile: data,
    isFetching: status === FetchStatus.Fetching,
    isValidating,
    refresh: mutate,
  }
}

export const useSSIForAddress = (
  address: string,
  fetchConfiguration = {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  },
): {
  nfts?: any
  isFetching: boolean
  isValidating: boolean
  refresh: KeyedMutator<GetProfileResponse>
} => {
  console.log("getSSIDatum===============>1")
  const { data, status, mutate, isValidating } = useSWR(
    address ? [address, 'identityTokens'] : null,
    () => getSSIDatum(address),
    fetchConfiguration,
  )
  console.log("getSSIDatum===============>", data)
  return {
    nfts: data,
    isFetching: status === FetchStatus.Fetching,
    isValidating,
    refresh: mutate,
  }
}

export const useAchievementsForAddress = (address: string) => {
  const { data, status, mutate } = useSWRImmutable(address ? [address, 'achievements'] : null, () =>
    getAchievements(address),
  )

  return {
    achievements: data || [],
    isFetching: status === FetchStatus.Fetching,
    refresh: mutate,
  }
}

export const useProfile = (): {
  profile?: Profile
  hasProfile: boolean
  hasActiveProfile: boolean
  isInitialized: boolean
  isLoading: boolean
  refresh: KeyedMutator<any>
} => {
  const { account } = useWeb3React()
  const { data, status, mutate } = useSWRImmutable(account ? [account, 'profile'] : null, () => getProfile(account), {
    use: [localStorageMiddleware],
  })

  const { profile, profileId } = data ?? ({ profile: null, profileId: 0 })
  
  const isLoading = status === FetchStatus.Fetching
  const isInitialized = status === FetchStatus.Fetched || status === FetchStatus.Failed
  const hasProfile = isInitialized && Number(profileId) > 0
  const hasActiveProfile = true
  return { profile, hasProfile, hasActiveProfile, isInitialized, isLoading, refresh: mutate }
}

export const useGetSharedEmail = (account) => {
  const { data, status } = useSWR(
    ['sharedEmail', account?.toLowerCase()], async () => getSharedEmail(account?.toLowerCase())
  )
  return {
    status,
    sharedEmail: data ?? false
  }
}

export const useGetProfileData = (profileId) => {
  const { data, status, mutate } = useSWR(['profileData', profileId], async () => getProfileData(profileId))
  return {
    status,
    refetch: mutate,
    profile: data
  }
}

export const useGetIsNameUsed = (name) => {
  const { data, status, mutate } = useSWR(
    ['isNameUsed', name?.toLowerCase()], 
    async () => getIsNameUsed(name?.toLowerCase()))
  return {
    status,
    refetch: mutate,
    isNameUsed: data ?? false
  }
}