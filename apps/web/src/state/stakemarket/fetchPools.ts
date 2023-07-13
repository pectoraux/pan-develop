import { Token } from '@pancakeswap/sdk'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import request, { gql } from 'graphql-request'
import { GRAPH_API_STAKES } from 'config/constants/endpoints'
import { getItemSg } from 'state/cancan/helpers'
import { getStakeMarketContract, getStakeMarketNoteContract } from '../../utils/contractHelpers'

const stakeField = `
id,
stakeSource,
countries,
cities,
products,
terms,
timestamp,
appliedTo {
  id
}
tokenIds {
  id
  metadataUrl
}
`
const transactionFields =`
id
block
timestamp
stake {
  id
}
netPrice
txType
`

export const getStakes = async (first: number, skip: number, where) => {
  try {
    const res = await request(
      GRAPH_API_STAKES,
      gql`
        query getStakes($first: Int!, $skip: Int!, $where: Stake_filter)
        {
          stakes(first: $first, skip: $skip, where: $where) {
            ${stakeField}
            appliedToPartnerStake {
              ${stakeField}
            }
            transactionHistory{
              ${transactionFields}
            }
          }
        }
      `,
      { first, skip, where },
    )
    console.log("res.stakes=======================>", res.stakes, where)
    return res.stakes
  } catch(err) {
    console.log("err sg================>", err)
  }
  return null
}

export const fetchStakes = async (collectionId) => {
  const stakeMarketContract = getStakeMarketContract()
  const stakeMarketNoteContract = getStakeMarketNoteContract()
  const whereClause = Number(collectionId)
  ? {
      stakeSource: collectionId,
      active: true
    }
  : {
      active: true
    }
  const stakesFromSg = await getStakes(1000, 0, whereClause)
  console.log("stakesFromSg==============>", stakesFromSg)
  const stakes =  await Promise.all(
    stakesFromSg.map(async (stake) => {
      const { id: stakeId } = stake;
      const [[
        ve,  
        token, 
        tokenId, 
        owner, 
        [
          startPayable,
          startReceivable,
          amountPayable,
          amountReceivable,
          periodPayable,
          periodReceivable,
          paidPayable,
          paidReceivable,
          gasPercent,
          waitingPeriod,
          stakeRequired
        ],
        profileId,
        bountyId,
        parentStakeId, 
        profileRequired,
        bountyRequired,
        [
          source,
          collection,
          referrer,
          userTokenId,
          identityTokenId,
          options
        ],
        ownerAgreement,
      ],
        nextDuePayable, 
        nextDueReceivable,
        applications,
        partnerStakeIds,
        waitingDuration
      ] = await Promise.all([
        stakeMarketContract.getStake(stakeId),
        stakeMarketNoteContract.getDuePayable(stakeId, 0),
        stakeMarketNoteContract.getDueReceivable(stakeId, 0),
        stakeMarketContract.getAllApplications(stakeId, 0),
        stakeMarketContract.getAllPartners(stakeId, 0),
        stakeMarketContract.waitingPeriodDeadline(stakeId),
      ])
      const [
        status,
        totalLiquidity,
      ] = await Promise.all([
        stakeMarketContract.stakeStatus(parentStakeId),
        stakeMarketContract.stakesBalances(parentStakeId),
      ])

      const item = await getItemSg(`${collectionId}-${tokenId}`)
      if (item?.countries || item?.cities || item?.products) {
        // eslint-disable-next-line no-param-reassign
        if (!stake.countries) stake.countries = item?.countries
        // eslint-disable-next-line no-param-reassign
        if (!stake.cities) stake.cities = item?.cities
        // eslint-disable-next-line no-param-reassign
        if (!stake.products) stake.products = item?.products;
      }
      const duePayable = nextDuePayable?.length ? new BigNumber(nextDuePayable[0]._hex).toJSON() : BIG_ZERO
      const dueReceivable = nextDueReceivable?.length ? new BigNumber(nextDuePayable[0]._hex).toJSON() : BIG_ZERO

      const applicationsConverted = applications?.map((application) => {
        const appId = new BigNumber(application._hex).toJSON()
        return appId
      }) || []

      const partnersConverted = partnerStakeIds?.reduce((resultArray, partnerStakeId) => {
        resultArray.push(new BigNumber(partnerStakeId._hex).toJSON())
        return resultArray
      },[])

      return {
        ...stake,
        sousId: stakeId,
        ve, 
        status,
        source,
        collection,
        tokenAddress: token,
        token: new Token (
          56,
          token,
          18,
          'TUSD',
          'Binance-Peg TrueUSD Token',
          'https://www.trueusd.com/',
        ),
        tokenId,  
        owner, 
        referrer,
        options,
        userTokenId: new BigNumber(userTokenId._hex).toJSON(),
        identityTokenId: new BigNumber(identityTokenId._hex).toJSON(),
        partnerStakeIds: partnersConverted,
        parentStakeId: new BigNumber(parentStakeId._hex).toJSON(),    
        startPayable: new BigNumber(startPayable._hex).toJSON(), 
        startReceivable: new BigNumber(startReceivable._hex).toJSON(), 
        amountPayable: new BigNumber(amountPayable._hex).toJSON(), 
        amountReceivable: new BigNumber(amountReceivable._hex).toJSON(), 
        periodPayable: new BigNumber(periodPayable._hex).toJSON(), 
        periodReceivable: new BigNumber(periodReceivable._hex).toJSON(), 
        paidPayable: new BigNumber(paidPayable._hex).toJSON(), 
        paidReceivable: new BigNumber(paidReceivable._hex).toJSON(), 
        gasPercent: new BigNumber(gasPercent._hex).toJSON(), 
        waitingPeriod: new BigNumber(waitingPeriod._hex).toJSON(), 
        stakeRequired: new BigNumber(stakeRequired._hex).toJSON(), 
        waitingDuration: new BigNumber(waitingDuration._hex).toJSON(), 
        profileId: new BigNumber(profileId._hex).toJSON(), 
        bountyId: new BigNumber(bountyId._hex).toJSON(), 
        profileRequired,
        bountyRequired,
        ownerAgreement,
        applicationsConverted,
        duePayable,
        dueReceivable,
        nextDuePayable: nextDuePayable?.length ? new BigNumber(nextDuePayable[1]._hex).toJSON() : BIG_ZERO,
        nextDueReceivable: nextDueReceivable?.length ? new BigNumber(nextDueReceivable[1]._hex).toJSON() : BIG_ZERO,
        totalLiquidity: new BigNumber(totalLiquidity._hex).toJSON(), 
      }
    }).flat()
  )
  return stakes
}