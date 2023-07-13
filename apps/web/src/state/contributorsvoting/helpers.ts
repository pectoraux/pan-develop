/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { GRAPH_API_CONTRIBUTORS_VOTER } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import _chunk from 'lodash/chunk'
import { getVestingContract } from 'utils/contractHelpers'
import { pitchFields } from './queries'

export const getPitchSg = async (pitchId: string) => {
  try {
    const res = await request(
      GRAPH_API_CONTRIBUTORS_VOTER,
      gql`
        query 
        getPitchData($pitchId: String!) 
        {
          pitch(id: $pitchId, where: { active: true }) {
            ${pitchFields}
          }
        }
      `,
      { pitchId },
    )
    const vestingContract = getVestingContract(res?.pitch?.ve)
    const votes = await Promise.all(
      res.pitch?.votes?.map(async (vote) => { 
        const voter = await vestingContract.ownerOf(vote?.tokenId)
        return { ...vote, voter }
      })
    )
    console.log("res=============>", res, res?.pitch?.ve, votes)
    return {
      ...res.pitch,
      votes
    }
  } catch (error) {
    console.error('Failed ===========> to fetch pitch', error)
    return null
  }
}