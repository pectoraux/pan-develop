import { ChainId } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@pancakeswap/wagmi'
import { FetchStatus } from 'config/constants/types'
import useSWRImmutable from 'swr/immutable'
import { getAddress } from 'utils/addressHelpers'
import { getActivePools } from 'utils/calls'
import { bscRpcProvider } from 'utils/providers'
import { useVeContract } from 'hooks/useContract'
import { getVotingPower } from 'state/stakemarketvoting/helpers'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
// import { getVotingPower } from '../helpers'

interface State {
  cakeBalance?: number
  cakeVaultBalance?: number
  cakePoolBalance?: number
  poolsBalance?: number
  cakeBnbLpBalance?: number
  ifoPoolBalance?: number
  total: number
  lockedCakeBalance?: number
  lockedEndTime?: number
}

const useGetVotingPower = (veAddress, tokenId) => {
  const { data, status, error } = useSWRImmutable(['votingPower', `${tokenId}`], async () => getVotingPower(veAddress, tokenId))
  if (error) console.error(error)
  return { 
    total: data.balance,
    percentile: data.percentile,
    decimals: data.decimals,  
    isLoading: status !== FetchStatus.Fetched, 
    isError: status === FetchStatus.Failed 
  }
}

// const useGetVotingPower2 = (block?: number, isActive = true): State & { isLoading: boolean; isError: boolean } => {
//   const { account } = useWeb3React()
//   const { data, status, error } = useSWRImmutable(
//     account && isActive ? [account, block, 'votingPower'] : null,
//     async () => {
//       const blockNumber = block || (await bscRpcProvider.getBlockNumber())
//       const eligiblePools = await getActivePools(blockNumber)
//       const poolAddresses = eligiblePools.map(({ contractAddress }) => getAddress(contractAddress, ChainId.BSC))
//       const {
//         cakeBalance,
//         cakeBnbLpBalance,
//         cakePoolBalance,
//         total,
//         poolsBalance,
//         cakeVaultBalance,
//         ifoPoolBalance,
//         lockedCakeBalance,
//         lockedEndTime,
//       } = await getVotingPower(account, poolAddresses, blockNumber)
//       return {
//         cakeBalance,
//         cakeBnbLpBalance,
//         cakePoolBalance,
//         poolsBalance,
//         cakeVaultBalance,
//         ifoPoolBalance,
//         total,
//         lockedCakeBalance,
//         lockedEndTime,
//       }
//     },
//   )
//   if (error) console.error(error)

//   return { ...data, isLoading: status !== FetchStatus.Fetched, isError: status === FetchStatus.Failed }
// }

export default useGetVotingPower
