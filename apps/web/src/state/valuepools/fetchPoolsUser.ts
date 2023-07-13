import poolsConfig from 'config/constants/pools'
import sousChefABI from 'config/abi/sousChef.json'
import erc20ABI from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import { bscRpcProvider } from 'utils/providers'
import BigNumber from 'bignumber.js'
import uniq from 'lodash/uniq'
import fromPairs from 'lodash/fromPairs'
import { 
  getVaContract, 
  getBribeContract, 
  getBep20Contract, 
  getValuepoolContract,
  getValuepoolHelperContract,
  getValuepoolVoterContract,
 } from 'utils/contractHelpers'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { AddressZero } from '@ethersproject/constants'
import { getValuepoolsSg } from './fetchPools'

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

export const fetchUserBalances = async (account) => {
  // Non BNB pools
  const tokens = uniq(nonBnbPools.map((pool) => pool.stakingToken.address))
  const calls = tokens.map((token) => ({
    address: token,
    name: 'balanceOf',
    params: [account],
  }))
  const [tokenBalancesRaw, bnbBalance] = await Promise.all([
    multicall(erc20ABI, calls),
    bscRpcProvider.getBalance(account),
  ])
  const tokenBalances = fromPairs(tokens.map((token, index) => [token, tokenBalancesRaw[index]]))

  const poolTokenBalances = fromPairs(
    nonBnbPools
      .map((pool) => {
        if (!tokenBalances[pool.stakingToken.address]) return null
        return [pool.sousId, new BigNumber(tokenBalances[pool.stakingToken.address]).toJSON()]
      })
      .filter(Boolean),
  )

  // BNB pools
  const bnbBalanceJson = new BigNumber(bnbBalance.toString()).toJSON()
  const bnbBalances = fromPairs(bnbPools.map((pool) => [pool.sousId, bnbBalanceJson]))

  return { ...poolTokenBalances, ...bnbBalances }
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

export const fetchVaContractNFTs = async (account, valuepoolAddress, decimals=18) => {
  try {
    const valuepoolContract = getValuepoolContract(valuepoolAddress)
    const vaContractAddress = await valuepoolContract._ve()
    if (vaContractAddress === AddressZero) {
      return {
        isAdmin: false,
        nfts: []
      }
    }
    const devaddr_ = await valuepoolContract.devaddr_()
    const isAdmin = devaddr_?.toLowerCase() === account?.toLowerCase()
    const vaContract = getVaContract(vaContractAddress)
    let nftsLength 
    if (isAdmin) {
      // nftsLength = await vaContract.tokenId()
      nftsLength = await vaContract.balanceOf(account)
    } else {
      nftsLength = await vaContract.balanceOf(account)
    }
    const arr = Array.from({length: nftsLength.toNumber()}, (v, i) => i)
    const nfts =  await Promise.all(
      arr.map(async (idx) => {

        const tokenIndex = await vaContract.tokenOfOwnerByIndex(account, idx)
        const tokenIdx = new BigNumber(tokenIndex._hex).toJSON()
        const locked = await vaContract.locked(tokenIdx)
        const lockValue = await vaContract.balanceOfNFT(tokenIdx)
        const percentile = await vaContract.percentiles(tokenIdx)
        const maxWithdrawable = await vaContract.getWithdrawable(tokenIdx)
        // const minimumBalance = await vaContract.minimumBalance(tokenIdx)
        const minimumBalance = BIG_ZERO
        const name = await vaContract.name()
        const symbol = await vaContract.symbol()
        const veDecimals = await vaContract.decimals()
        const [userPercentile,] = await valuepoolContract.userInfo(tokenIdx)
        
        // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
        return {
          name,
          symbol,
          id: tokenIdx,
          veDecimals,
          lockEnds: new BigNumber(locked.end._hex).toJSON(),
          percentile: new BigNumber(percentile._hex).toJSON(),
          userPercentile: new BigNumber(userPercentile._hex).toJSON(),
          minimumBalance: '0',
          maxWithdrawable: new BigNumber(maxWithdrawable._hex).div(10**veDecimals).toFixed(veDecimals),
          lockAmount: new BigNumber(locked.amount._hex).div(10**decimals).toFixed(decimals),
          lockValue: new BigNumber(lockValue._hex).div(10**veDecimals).toFixed(veDecimals)
        }
      }).flat()
    )
    return { isAdmin, nfts }
  } catch(err) {
    console.log("rerr==============>", err)
  }
  return {}
}

export const fetchValuepoolsUserData = async (account) => {
  const valuepoolsFromSg = await getValuepoolsSg(0, 0, { active: true})
  try {
    const protocolIds =  await Promise.all(
      valuepoolsFromSg.map(async ({id, rest}, index) => {
        const userData = await fetchValuepoolUserData(account, id)
        const { isAdmin, nfts } = await fetchVaContractNFTs(account, id, userData.decimals)

        // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
        return {
          ...rest,
          ...userData,
          nfts,
          isAdmin,
          sousId: index,
        }
      }).flat()
    )
    return protocolIds
  } catch(err) {
    console.log("rerr==============>", err)
  }
  return []
}


export const fetchValuepoolUserData = async (account, valuepoolAddress) => {
  const valuepoolContract = getValuepoolContract(valuepoolAddress)
  const vaAddress = await valuepoolContract._ve()
  const tokenAddress = await valuepoolContract.token()
  const valuepoolVoterContract = getValuepoolVoterContract()
  const tokenContract = getBep20Contract(tokenAddress)
  let vaAllowance;
  let minimumLockValue;
  const [ 
    allowance, 
    decimals
  ] = await Promise.all([
    tokenContract.allowance(account, valuepoolAddress),
    tokenContract.decimals()
  ])
  if (vaAddress !== AddressZero) {
    vaAllowance = await tokenContract.allowance(account, vaAddress)
    try{
      minimumLockValue = await valuepoolVoterContract.minimumLockValue(vaAddress)
    } catch(err) {
      console.log("fetchValuepoolUserData============>", err)
    }
  }
  
  // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
  return {
    owner: account,
    allowance: new BigNumber(allowance._hex).toJSON(),
    vaAllowance: vaAllowance ? new BigNumber(vaAllowance._hex).toJSON() : BIG_ZERO,
    minimumLockValue: minimumLockValue ? new BigNumber(minimumLockValue._hex).toJSON() : BIG_ZERO,
    decimals,
  }
}