import { bscTokens, bscTestnetTokens } from '@pancakeswap/tokens'
import { SerializedPoolConfig, PoolCategory } from './types'

export const vestingPools: SerializedPoolConfig[] = [
  {
    sousId: 0,
    stakingToken: bscTestnetTokens.tusd,
    earningToken: bscTestnetTokens.tusd,
    contractAddress: {
      97: '0x65a359a2f4D0a8Bd10dD44Bd785C6398Af32A3e0',
      56: '0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '10',
    isFinished: false,
  },
].map((p) => ({
  ...p,
  stakingToken: p.stakingToken.serialize,
  earningToken: p.earningToken.serialize,
}))

export default [...vestingPools]
