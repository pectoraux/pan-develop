import BigNumber from 'bignumber.js'
import { getBusinessVoterAddress } from 'utils/addressHelpers'
import { gql, request } from 'graphql-request'
import { GRAPH_API_REFERRAL } from 'config/constants/endpoints'
import { BIG_ONE } from '@pancakeswap/utils/bigNumber'
import { getCollectionApi } from 'state/cancan/helpers'
import { collectionFields } from 'state/referralsvoting/queries'
import { 
  getBep20Contract, 
  getVestingContract,
  getGaugeContract, 
  getBribeContract, 
  getReferralVoterContract, 
} from '../../utils/contractHelpers'


export const getReferralsData = async () => {  
  try {
    const res = await request(
      GRAPH_API_REFERRAL,
      gql`
        {
          collections {
            ${collectionFields}
          }
        }
      `,
    )
    return res.collections
  } catch (error) {
    console.error('Failed sg=======>', error)
    return []
  }
}

export const fetchReferrals = async () => {
  const referralVoterContract = getReferralVoterContract()
  const gauges = await getReferralsData()
  console.log("gauges7===================>",gauges)
  const referrals =  await Promise.all(
    gauges.map(async (gauge) => {
      const collection = await getCollectionApi(gauge.id)
      const totalWeightRaw = await referralVoterContract.totalWeight(gauge.ve)
      const totalWeight = Number(totalWeightRaw) ? new BigNumber(totalWeightRaw._hex) : BIG_ONE
      const gaugeWeight = await referralVoterContract.weights(gauge.id, gauge.ve)
      const vestingContract = getVestingContract(gauge.ve)
      const vestingTokenAddress = await vestingContract.token()
      const gaugeContract = getGaugeContract(gauge.gauge)
      const gaugeEarned = await gaugeContract.totalSupply(vestingTokenAddress)
      const bribeContract = getBribeContract(gauge.bribe)
      const tokensLength = await bribeContract.rewardsListLength()
      const arry = Array.from({length: tokensLength.toNumber()}, (v, i) => i)
      const bribes = await Promise.all(
        arry.map(async (bIdx) => {

          const tokenAddress = await bribeContract.rewards(bIdx)
          const tokenContract = getBep20Contract(tokenAddress)
          const [ rewardRate, decimals, symbol ] = await Promise.all([
            bribeContract.rewardRate(tokenAddress),
            tokenContract.decimals(),
            tokenContract.symbol(),
          ])

          return {
            businessBribe: gauge.bribe,
            tokenAddress,
            decimals,
            symbol,
            rewardRate: new BigNumber(rewardRate._hex).toJSON(),
            rewardAmount: new BigNumber(rewardRate._hex).times(604800).toJSON(),
          }
        })
      )
      
      // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
      return {
        sousId: gauge.id,
        bribes,
        collection,
        vestingTokenAddress,
        gaugeWeight: new BigNumber(gaugeWeight._hex).toJSON(),
        weightPercent: new BigNumber(gaugeWeight._hex).times(100).div(totalWeight).toFixed(2),
        gaugeEarned: new BigNumber(gaugeEarned._hex).toJSON(),
        ...gauge
      }
    }).flat()
  )
  return referrals
}

export const fetchPoolsWeights = async (businesses) => {
  const businessVoterAddress = getBusinessVoterAddress()
  const calls = businesses.map((business) => ({
    address: businessVoterAddress,
    name: 'weights',
    params: [business.gauge],
  }))
  // const weights = await multicall(businessVoterABI, calls)
  return null
}