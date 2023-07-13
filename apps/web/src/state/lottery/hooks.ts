import BigNumber from 'bignumber.js'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useSelector, batch } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import useSWRImmutable from 'swr/immutable'
import { State } from '../types'
import { getLotteryContract } from '../../utils/contractHelpers'
import { fetchLotteryAsync, fetchUserTicketsAndLotteries } from '.'
import { makeLotteryGraphDataByIdSelector, lotterySelector } from './selectors'

// Lottery
export const useGetCurrentLotteryId = () => {
  return useSelector((state: State) => state.lottery.currentLotteryId)
}

export const useGetUserLotteriesGraphData = () => {
  return useSelector((state: State) => state.lottery.userLotteryData)
}

export const useGetLotteriesGraphData = () => {
  return useSelector((state: State) => state.lottery.lotteriesData)
}

export const useGetLotteryGraphDataById = (lotteryId: string) => {
  const lotteryGraphDataByIdSelector = useMemo(() => makeLotteryGraphDataByIdSelector(lotteryId), [lotteryId])
  return useSelector(lotteryGraphDataByIdSelector)
}

export const useFetchLottery = (fetchPublicDataOnly = false) => {
  const { address: account } = useAccount()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const currentLotteryId  = useMemo(() => router.query.lotteryId, [router.query.lotteryId],) 
  
  // useEffect(() => {
  //   // get current lottery ID & max ticket buy
  //   dispatch(fetchCurrentLotteryId(currentLotteryId))
  // }, [dispatch])
  console.log("currentLotteryId==============>", currentLotteryId)
  useFastRefreshEffect(() => {
    if (currentLotteryId) {
      batch(() => {
        // Get historical lottery data from nodes +  last 100 subgraph entries
        // dispatch(fetchPublicLotteries({ currentLotteryId }))
        // get public data for current lottery
        dispatch(fetchLotteryAsync(currentLotteryId))
      })
    }
  }, [dispatch, currentLotteryId])

  useEffect(() => {
    // get user tickets for current lottery, and user lottery subgraph data
    if (account && currentLotteryId && !fetchPublicDataOnly) {
      dispatch(fetchUserTicketsAndLotteries({ account, currentLotteryId }))
    }
  }, [dispatch, currentLotteryId, account, fetchPublicDataOnly])
}

export const useLottery = () => {
  return useSelector(lotterySelector)
}

export const useGetPendingReward = (userAddress, lotteryId, tokenAddress) => {
  const lotteryContract = getLotteryContract()
  const { data: pendingReward } = useSWRImmutable(['reward', userAddress, lotteryId, tokenAddress], async () => {
    const reward = await lotteryContract.getPendingReward(lotteryId, userAddress, tokenAddress, false)
    return new BigNumber(reward._hex).toJSON()
  })
  console.log("useGetPendingReward============>", userAddress, lotteryId, tokenAddress)
  return pendingReward
}