import BigNumber from 'bignumber.js'
import { 
  getBribeContract, 
  getBep20Contract,
  getVestingContract,
  getProfileContract, 
 } from '../../utils/contractHelpers'

export const fetchReferralsUserData = async (account, pools) => {
  const augmentedPools = await Promise.all(
    pools?.map(async (pool) => {
      const vestingContract = getVestingContract(pool.ve)
      const balanceOf = await vestingContract.balanceOf(account)
      const arr = Array.from({length: balanceOf.toNumber()}, (v, i) => i)
      const tokenIds =  await Promise.all(
        arr.map(async (idx) => {
          const tokenId = await vestingContract.tokenOfOwnerByIndex(account, idx)
          return new BigNumber(tokenId._hex).toJSON()
      }))
      const profileContract = getProfileContract()
      const profileIdHex = await profileContract.addressToProfileId(account)
      const profileId = new BigNumber(profileIdHex._hex).toJSON()
      const augmentedBribes = await Promise.all(
        pool.bribes.map(async (bribe) => {
          const bribeContract = getBribeContract(bribe.businessBribe)
          const tokenContract = getBep20Contract(bribe.tokenAddress)
          const [ allowance ] = await Promise.all([
            tokenContract.allowance(account, bribe.businessBribe),
          ])
          const earned = await bribeContract.earned(bribe.tokenAddress, profileId)

          return {
              ...bribe,
              earned: new BigNumber(earned._hex).toJSON(),
              allowance: new BigNumber(allowance._hex).toJSON(),
          }
        })
      )
      return {
        ...pool,
        tokenIds,
        profileId,
        augmentedBribes,
      }}).flat()
    )
  return augmentedPools
}