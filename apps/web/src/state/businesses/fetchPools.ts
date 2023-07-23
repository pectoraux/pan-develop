import BigNumber from 'bignumber.js'
import { gql, request } from 'graphql-request'
import { GRAPH_API_BUSINESS } from 'config/constants/endpoints'
import { BIG_ONE } from '@pancakeswap/utils/bigNumber'
import { getCollectionApi } from 'state/cancan/helpers'
import { collectionFields } from 'state/businessvoting/queries'
import { 
  getBep20Contract, 
  getVestingContract,
  getGaugeContract, 
  getBribeContract, 
  getBusinessVoterContract, 
} from '../../utils/contractHelpers'


export const getBusinessesData = async () => {  
  try {
    const res = await request(
      GRAPH_API_BUSINESS,
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

export const fetchBusinesses = async () => {
  const businessVoterContract = getBusinessVoterContract()
  const gauges = await getBusinessesData()
  console.log("gauges7===================>",gauges)
  const businesses =  await Promise.all(
    gauges.map(async (gauge) => {
      const collection = await getCollectionApi(gauge.id)
      const totalWeightRaw = await businessVoterContract.totalWeight(gauge.ve)
      const totalWeight = Number(totalWeightRaw) ? new BigNumber(totalWeightRaw._hex) : BIG_ONE
      const gaugeWeight = await businessVoterContract.weights(gauge.id, gauge.ve)
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

      const tokenContract = getBep20Contract(vestingTokenAddress)
      const [ vestingTokenName, vestingTokenDecimals, vestingTokenSymbol ] = await Promise.all([
        tokenContract.name(),
        tokenContract.decimals(),
        tokenContract.symbol(),
      ])
      
      // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
      return {
        sousId: gauge.id,
        bribes,
        collection,
        vestingTokenAddress,
        vestingTokenSymbol,
        vestingTokenName,
        vestingTokenDecimals,
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
  // const businessVoterAddress = getBusinessVoterAddress()
  // const calls = businesses.map((business) => ({
  //   address: businessVoterAddress,
  //   name: 'weights',
  //   params: [business.gauge],
  // }))
  // const weights = await multicall(businessVoterABI, calls)
  return null
}