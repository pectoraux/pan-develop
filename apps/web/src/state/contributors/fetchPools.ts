import BigNumber from 'bignumber.js'
import { getAcceleratorVoterAddress } from 'utils/addressHelpers'
import { gql, request } from 'graphql-request'
import { GRAPH_API_CONTRIBUTORS_VOTER } from 'config/constants/endpoints'
import { BIG_ONE } from '@pancakeswap/utils/bigNumber'
import { getCollectionApi } from 'state/cancan/helpers'
import { pitchFields } from 'state/acceleratorvoting/queries'
import { 
  getBep20Contract, 
  getVestingContract,
  getGaugeContract, 
  getBribeContract, 
  getContributorsVoterContract,
} from '../../utils/contractHelpers'


export const getContributorsData = async () => {  
  try {
    const res = await request(
      GRAPH_API_CONTRIBUTORS_VOTER,
      gql`
        {
          pitches {
            ${pitchFields}
          }
        }
      `,
    )
    return res.pitches
  } catch (error) {
    console.error('Failed to fetch pitches========>', error)
    return []
  }
}

export const fetchContributors = async () => {
  const contributorsVoterContract = getContributorsVoterContract()
  const gauges = await getContributorsData()
  const businesses =  await Promise.all(
    gauges.map(async (gauge) => {
      const collection = await getCollectionApi(gauge.id)
      const totalWeightRaw = await contributorsVoterContract.totalWeight(gauge.ve)
      const totalWeight = Number(totalWeightRaw) ? new BigNumber(totalWeightRaw._hex) : BIG_ONE
      const gaugeWeight = await contributorsVoterContract.weights(gauge.id, gauge.owner)
      const claimable = await contributorsVoterContract.claimable(gauge.gauge)
      const vestingContract = getVestingContract(gauge.ve)
      const vestingTokenAddress = await vestingContract.token()
      const gaugeContract = getGaugeContract(gauge.gauge)
      const gaugeEarned = await gaugeContract.totalSupply(vestingTokenAddress)
      const vestingTokenContract = getBep20Contract(vestingTokenAddress)
      const vestingTokenSymbol = await vestingTokenContract.symbol()
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
        vestingTokenSymbol,
        claimable: new BigNumber(claimable._hex).toJSON(),
        gaugeWeight: new BigNumber(gaugeWeight._hex).toJSON(),
        weightPercent: new BigNumber(gaugeWeight._hex).times(100).div(totalWeight).toFixed(2),
        gaugeEarned: new BigNumber(gaugeEarned._hex).toJSON(),
        ...gauge
      }
    }).flat()
  )
  return businesses
}

export const fetchPoolsWeights = async (businesses) => {
  const acceleratorVoterAddress = getAcceleratorVoterAddress()
  const calls = businesses.map((business) => ({
    address: acceleratorVoterAddress,
    name: 'weights',
    params: [business.gauge],
  }))
  // const weights = await multicall(contributorsABI, calls)
  return null
}