/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import BigNumber from 'bignumber.js'
import { firestore } from 'utils/firebase'
import { SNAPSHOT_API, GRAPH_API_VP_VOTER } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { Proposal, ProposalState, Vote, VoteWhere } from 'state/types'
import _chunk from 'lodash/chunk'
import { getValuepoolVoterContract } from '../../utils/contractHelpers'
import { proposalFields } from './queries'

export const getProposals = async () => {
  return firestore.collection("proposals").get()
}

export const getProposal = async (id: string) => {
  return (await firestore.collection("proposals").doc(id).get()).data()
}

export const getVavaVotes = async (vaAddress, limit=10) => {
  const vaVoterContract = await getValuepoolVoterContract()
  const poolsLength = await vaVoterContract.length(vaAddress)
  const arr = Array.from({length: poolsLength.toNumber()}, (v, i) => i)
  const votePools =  await Promise.all(
    arr.map(async (idx) => {
      const votePool = await vaVoterContract.pools(vaAddress, idx)
      // const upVotes = await vaVoterContract.upVotes(vaAddress, votePool)
      // const downVotes = await vaVoterContract.downVotes(vaAddress, votePool)
      // const weights = await vaVoterContract.weights(vaAddress, votePool)
      const { amount, start } = await vaVoterContract.gauges(vaAddress, votePool)

      return {
        votePool,
        upVotes: '0',
        downVotes: '0',
        weights: '0',
        amount: new BigNumber(amount._hex).toJSON(),
        start: new BigNumber(start._hex).toJSON(),
      }
    }).flat()
  )
  return votePools
}

export const getVotes = async (first: number, skip: number, where: VoteWhere): Promise<Vote[]> => {
  const response: { votes: Vote[] } = await request(
    SNAPSHOT_API,
    gql`
      query getVotes($first: Int, $skip: Int, $where: VoteWhere) {
        votes(first: $first, skip: $skip, where: $where) {
          id
          voter
          created
          choice
          proposal {
            choices
          }
          vp
        }
      }
    `,
    { first, skip, where },
  )
  return response.votes
}

// TODO: lazy get all votes when user click load more
export const getAllVotes = async (proposal: Proposal, votesPerChunk = 30000): Promise<Vote[]> => {
  const voters = await new Promise<Vote[]>((resolve, reject) => {
    let votes: Vote[] = []

    const fetchVoteChunk = async (newSkip: number) => {
      try {
        const voteChunk = await getVotes(votesPerChunk, newSkip, { proposal: proposal.id })

        if (voteChunk.length === 0) {
          resolve(votes)
        } else {
          votes = [...votes, ...voteChunk]
          fetchVoteChunk(newSkip + votesPerChunk)
        }
      } catch (error) {
        reject(error)
      }
    }

    fetchVoteChunk(0)
  })

  return voters.map((v) => ({
    ...v,
    metadata: {
      votingPower: String(v.vp) || '0',
    },
  }))
}

export const getProposalsSg = async (
  where = {},
  first = 1000,
  orderBy = 'id',
  orderDirection: 'asc' | 'desc' = 'desc',
  skip = 0,
) => {
  try {
    const res = await request(
      GRAPH_API_VP_VOTER,
      gql`
        # query getLitigationsData($first: Int, $skip: Int!, $where: NFT_filter, $orderBy: NFT_orderBy, $orderDirection: OrderDirection) 
        {
          proposals(where: $where, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, skip: $skip) {
            ${proposalFields}
          }
        }
      `,
      { where, first, skip, orderBy, orderDirection },
    )
    console.log("res===============>", res)
    return res.proposals
  } catch (error) {
    console.error('Failed to fetch proposals=============>', error)
    return []
  }
}

export const getProposalSg = async (proposalId: string) => {
  try {
    const res = await request(
      GRAPH_API_VP_VOTER,
      gql`
        query 
        getCollectionData($proposalId: String!) 
        {
          proposal(id: $proposalId) {
            ${proposalFields}
          }
        }
      `,
      { proposalId },
    )
    console.log("res=============>", res)
    return res.proposal
  } catch (error) {
    console.error('Failed to fetch proposal===========>', error)
    return null
  }
}