import { useState, useEffect, useMemo } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useLottery } from 'state/lottery/hooks'
import fetchPendingRevenue from 'state/lottery/fetchUnclaimedUserRewards'
import { FetchStatus } from 'config/constants/types'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'

const useGetUnclaimedRewards = ({ currentTokenId, activeIndex }) => {
  console.log("useGetUnclaimedRewards=============>1")
  const { account } = useWeb3React()
  const { lotteryData: { id: currentLotteryId, tokenData } } = useLottery()
  const [unclaimedRewards, setUnclaimedRewards] = useState([])
  const [fetchStatus, setFetchStatus] = useState(FetchStatus.Idle)
  const currTokenData = useMemo(() => tokenData?.length ? tokenData[parseInt(currentTokenId) > 0 ? parseInt(currentTokenId) - 1 : 0] : {}, [currentTokenId, tokenData])

  useEffect(() => {
    // Reset on account change and round transition
    setFetchStatus(FetchStatus.Idle)
  }, [account])

  const fetchAllRewards = async () => {
    try {
      setFetchStatus(FetchStatus.Fetching)
      const pendingRevenue = await fetchPendingRevenue(
        currentLotteryId,
        account,
        currTokenData?.token?.address,
        !!activeIndex
      )
      setUnclaimedRewards([getBalanceNumber(new BigNumber(pendingRevenue), currTokenData?.token?.decimals)])
      setFetchStatus(FetchStatus.Fetched)
    } catch(err) { console.log("fetchPendingRevenue===========>", err) }
  }

  return { fetchAllRewards, unclaimedRewards, fetchStatus }
}

export default useGetUnclaimedRewards
