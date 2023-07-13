import poolsConfig from 'config/constants/pools'
import sousChefABI from 'config/abi/sousChef.json'
import erc20ABI from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import { bscRpcProvider } from 'utils/providers'
import BigNumber from 'bignumber.js'
import uniq from 'lodash/uniq'
import { getBep20Contract, getPoolGaugeContract, getVestingContract } from 'utils/contractHelpers'
import fromPairs from 'lodash/fromPairs'
import { getPairs } from './fetchPools'

// Pool 0, Cake / Cake is a different kind of contract (master chef)
// BNB pools use the native BNB token (wrapping ? unwrapping is done at the contract level)
const nonBnbPools = poolsConfig.filter((pool) => pool.stakingToken.symbol !== 'BNB')
const bnbPools = poolsConfig.filter((pool) => pool.stakingToken.symbol === 'BNB')
const nonMasterPools = poolsConfig.filter((pool) => pool.sousId !== 0)

export const fetchPoolsAllowance = async (account) => {
  const calls = nonBnbPools.map((pool) => ({
    address: pool.stakingToken.address,
    name: 'allowance',
    params: [account, getAddress(pool.contractAddress)],
  }))

  const allowances = await multicall(erc20ABI, calls)
  return fromPairs(nonBnbPools.map((pool, index) => [pool.sousId, new BigNumber(allowances[index]).toJSON()]))
}

export const fetchUserBalances = async (accountAddress) => {
  const pairsFromSg = await getPairs()
  const pairs = await Promise.all(
    pairsFromSg.map(async (pair, index) => {
      const allAccounts = await Promise.all(
        pair.accounts.map(async (account) => {
          const veContract = await getVestingContract(account.ve)
          const owner = await veContract.ownerOf(account.tokenId)
          return {
            owner,
            ...account
          }
        })
      )
      const _accounts = allAccounts.filter((account) => account.owner?.toLowerCase() === accountAddress?.toLowerCase())
      const poolGaugeContract = await getPoolGaugeContract()
      const accounts = await Promise.all(
        _accounts.map(async (account) => {
          const earned = await poolGaugeContract.earned(pair.id, account.ve, account.tokenId)
          const balanceOf = await poolGaugeContract.balanceOf(pair.id, `${account.ve} ${account.tokenId}`)

          return {
            ...account,
            earned: new BigNumber(earned._hex).toJSON(),
            balanceOf: new BigNumber(balanceOf._hex).toJSON(),
          }
        }))

      return {
        sousId: index,
        accounts
      }
    }
  ).flat()
  )
  return pairs
}

export const fetchUserStakeBalances = async (account) => {
  const calls = nonMasterPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'userInfo',
    params: [account],
  }))
  const userInfo = await multicall(sousChefABI, calls)
  return fromPairs(
    nonMasterPools.map((pool, index) => [pool.sousId, new BigNumber(userInfo[index].amount._hex).toJSON()]),
  )
}

export const fetchUserPendingRewards = async (account) => {
  const calls = nonMasterPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'pendingReward',
    params: [account],
  }))
  const res = await multicall(sousChefABI, calls)
  return fromPairs(nonMasterPools.map((pool, index) => [pool.sousId, new BigNumber(res[index]).toJSON()]))
}
