import BigNumber from 'bignumber.js'
import {
  SerializedPool,
} from 'state/types'
import { deserializeToken } from '@pancakeswap/token-lists'
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

export const transformUserData = (userData: any) => {
  return {
    allowance: userData ? new BigNumber(userData.allowance) : BIG_ZERO,
    stakingTokenBalance: userData ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO,
    stakedBalance: userData ? new BigNumber(userData.stakedBalance) : BIG_ZERO,
    pendingReward: userData ? new BigNumber(userData.pendingReward) : BIG_ZERO,
    bribes: userData?.bribes,
    protocolId: userData?.protocolId,
    duePayable: userData?.duePayable,
    dueReceivable: userData?.dueReceivable,
    nextDuePayable: userData?.nextDuePayable,
    nextDueReceivable: userData?.nextDueReceivable,
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
  const {
    totalStaked,
    stakingLimit,
    numberBlocksForUserLimit,
    userData,
    stakingToken,
    earningToken,
    profileRequirement,
    startBlock,
    ...rest
  } = pool

  return {
    ...rest,
    startBlock,
    profileRequirement: transformProfileRequirement(profileRequirement),
    stakingToken: deserializeToken(stakingToken),
    earningToken: deserializeToken(earningToken),
    userData: transformUserData(userData),
    totalStaked: new BigNumber(totalStaked),
    stakingLimit: new BigNumber(stakingLimit),
    stakingLimitEndBlock: numberBlocksForUserLimit + startBlock,
  }
}
