import { useMemo } from 'react'
import { BOOST_WEIGHT, DURATION_FACTOR } from 'config/constants/pools'
import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
import { getFullDecimalMultiplier } from '@pancakeswap/utils/getFullDecimalMultiplier'

import { DEFAULT_TOKEN_DECIMAL } from 'config'
import formatSecondsToWeeks, { secondsToWeeks } from '../../utils/formatSecondsToWeeks'

export default function useAvgLockDuration() {
  const totalLockedAmount = 0 
  const totalShares = 0 
  const totalCakeInVault = 0 
  const pricePerFullShare = 0

  const avgLockDurationsInSeconds = useMemo(() => {
    // const flexibleCakeAmount = totalCakeInVault.minus(totalLockedAmount)
    // const flexibleCakeShares = flexibleCakeAmount.div(pricePerFullShare).times(DEFAULT_TOKEN_DECIMAL)
    // const lockedCakeBoostedShares = totalShares.minus(flexibleCakeShares)
    // const lockedCakeOriginalShares = totalLockedAmount.div(pricePerFullShare).times(DEFAULT_TOKEN_DECIMAL)
    // const avgBoostRatio = lockedCakeBoostedShares.div(lockedCakeOriginalShares)

    return 0
  }, [totalCakeInVault, totalLockedAmount, pricePerFullShare, totalShares])

  const avgLockDurationsInWeeks = useMemo(
    () => formatSecondsToWeeks(avgLockDurationsInSeconds),
    [avgLockDurationsInSeconds],
  )

  const avgLockDurationsInWeeksNum = useMemo(
    () => secondsToWeeks(avgLockDurationsInSeconds),
    [avgLockDurationsInSeconds],
  )

  return {
    avgLockDurationsInWeeks,
    avgLockDurationsInWeeksNum,
    avgLockDurationsInSeconds: _toNumber(avgLockDurationsInSeconds),
  }
}
