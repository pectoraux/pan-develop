import BigNumber from 'bignumber.js'
import multicall from 'utils/multicall'
import erc20ABI from 'config/abi/erc20.json'
import { getTrustBountiesAddress } from '../../utils/addressHelpers'
import { getTrustBountiesContract, getBep20Contract } from '../../utils/contractHelpers'

export const fetchBountiesUserData = async (account) => {
  const trustbountiesContract = getTrustBountiesContract()
  // const latestBountyId = await trustbountiesContract.bountyId()
  const arr = Array.from({length: 0}, (v, i) => i)
  const allowances =  await Promise.all(
    arr.slice(1,).map(async (bountyId) => {
      const { token } = await trustbountiesContract.bountyInfo(bountyId)
      const tokenContract = getBep20Contract(token)
      const allowance = await tokenContract.allowance(account, trustbountiesContract.address)

      // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
      return {
        sousId: bountyId,
        allowance: new BigNumber(allowance._hex).toJSON(),
      }
    }).flat()
  )
  return allowances
}

export const fetchTBAllowance = async (account, tokenAddress) => {
  const trustBountiesAddress = getTrustBountiesAddress()
  const call = [{
    address: tokenAddress,
    name: 'allowance',
    params: [account, trustBountiesAddress],
  }]
  const allowance = await multicall(erc20ABI, call)
  return new BigNumber(allowance[0][0]._hex).toJSON()
}