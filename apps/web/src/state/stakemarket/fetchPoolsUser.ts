import BigNumber from 'bignumber.js'
import multicall from 'utils/multicall'
import erc20ABI from 'config/abi/erc20.json'
import { getStakeMarketAddress } from '../../utils/addressHelpers'
import { getStakeMarketContract, getBep20Contract } from '../../utils/contractHelpers'

export const fetchStakesUserData = async (account) => {
  const stakeMarketContract = getStakeMarketContract()
  // const latestStakeId = await stakeMarketContract.stakeId()
  const arr = Array.from({length: 0}, (v, i) => i)
  const allowances =  await Promise.all(
    arr.slice(1,).map(async (stakeId) => {
      const { token } = await stakeMarketContract.getStake(stakeId)
      const tokenContract = getBep20Contract(token)
      const allowance = await tokenContract.allowance(account, stakeMarketContract.address)

      // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
      return {
        sousId: stakeId,
        allowance: new BigNumber(allowance._hex).toJSON(),
      }
    }).flat()
  )
  return allowances
}

export const fetchSMAllowance = async (account, tokenAddress) => {
  const stakemarketAddress = getStakeMarketAddress()
  const tokenContract = getBep20Contract(tokenAddress)
  const allowance = await tokenContract.allowance(account, stakemarketAddress)
  return new BigNumber(allowance._hex).toJSON()
}