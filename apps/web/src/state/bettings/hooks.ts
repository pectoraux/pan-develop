import { useRouter } from 'next/router'
import BigNumber from 'bignumber.js'
import { useMemo, useEffect, useState } from 'react'
import { firestore } from 'utils/firebase'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { Pool } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import useSWRImmutable from 'swr/immutable'
import { getBettingContract } from '../../utils/contractHelpers'
import {
  fetchBettingsAsync,
  fetchBettingSgAsync,
} from '.'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
} from './selectors'

export const useGetAmountCollected = (bettingAddress, bettingId, period) => {
  const bettingContract = getBettingContract(bettingAddress ?? '')
  const { data: amountCollected, mutate: refetch } = useSWRImmutable(['amountCollected', bettingAddress, bettingId], async () => {
    const amount = await bettingContract.amountCollected(bettingId, period)
    return new BigNumber(amount._hex).toJSON()
  })
  return {
    amountCollected,
    refetch
  }
}

export const useGetSubjects = (bettingAddress, bettingId, ticketSize) => {
  const bettingContract = getBettingContract(bettingAddress ?? '')
  const { data: subjects } = useSWRImmutable(['subjects', bettingAddress, bettingId, ticketSize], async () => {
    try {
      const arr = Array.from({length: Number(ticketSize)}, (v, i) => i)
      const res =  await Promise.all(
        arr?.map(async (idx) => bettingContract.subjects(bettingId, idx))
      )
      return res
    } catch(err) {
      console.log("rerr==========>", err)
    }
    return []
  })
  console.log("subjects============>", bettingAddress, bettingId, subjects)
  return subjects
}

export const useGetWinnersPerBracket = (bettingAddress, bettingId, period, ticketSize) => {
  const bettingContract = getBettingContract(bettingAddress ?? '')
  const { data: winners } = useSWRImmutable(['winners', bettingAddress, bettingId, period, ticketSize], async () => {
    try {
      const arr = Array.from({length: Number(ticketSize)}, (v, i) => i)
      const res =  await Promise.all(
        arr?.map(async (idx) => {
          const count = await bettingContract.countWinnersPerBracket(bettingId, period, idx)
          return new BigNumber(count._hex).toJSON()
        })
      )
      return res
    } catch(err) {
      console.log("rerr==========>", err)
    }
    return []
  })
  console.log("winners============>", bettingAddress, bettingId, period, ticketSize)
  return winners
}

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
  const fromBetting = router.query.betting

  useSWRImmutable(['bettings', fromBetting, chainId],
    () => {
      const fetchPoolsDataWithFarms = async () => {
        batch(() => {
          dispatch(fetchBettingSgAsync({ fromBetting }))
          dispatch(fetchBettingsAsync({ fromBetting }))
        })
      }

      fetchPoolsDataWithFarms()
    },
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
  //       dispatch(fetchBettingsUserDataAsync(account))
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