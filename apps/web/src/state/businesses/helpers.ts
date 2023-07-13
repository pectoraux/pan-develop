import BigNumber from 'bignumber.js'
import {
  SerializedPool,
} from 'state/types'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { Token } from '@pancakeswap/sdk'
import { Pool } from '@pancakeswap/uikit'

type UserData =
  | Pool.DeserializedPool<Token>['userData']
  | {
      allowance: number | string
      stakingTokenBalance: number | string
      stakedBalance: number | string
      pendingReward: number | string
    }

export const transformUserData = (userData: UserData) => {
  return {
    allowance: userData ? new BigNumber(userData.allowance) : BIG_ZERO,
    stakingTokenBalance: userData ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO,
    stakedBalance: userData ? new BigNumber(userData.stakedBalance) : BIG_ZERO,
    pendingReward: userData ? new BigNumber(userData.pendingReward) : BIG_ZERO,
  }
}

const transformProfileRequirement = (profileRequirement?: { required: boolean; thresholdPoints: string }) => {
  return profileRequirement
    ? {
        required: profileRequirement.required,
        thresholdPoints: profileRequirement.thresholdPoints
          ? new BigNumber(profileRequirement.thresholdPoints)
          : BIG_ZERO,
      }
    : undefined
}

export const transformPool = (pool: SerializedPool) => {
  // const {
  //   vestingTokenAddress,
  //   ...rest
  // } = pool
  const earningToken = ""
  console.log("earningToken================>", earningToken)
  return pool
}
