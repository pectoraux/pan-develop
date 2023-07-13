/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { SNAPSHOT_API, GRAPH_API_SSI } from 'config/constants/endpoints'
import { firestore } from 'utils/firebase'
import request, { gql } from 'graphql-request'
import { Proposal, ProposalState, EntryState, Vote, VoteWhere } from 'state/types'
import _chunk from 'lodash/chunk'
import { ssiFields, profileFields, identityTokenFields } from './queries'

export const getSSIDataFromAccount = async (accountAddress: string) => {
  try {
    const res = await request(
      GRAPH_API_SSI,
      gql`
        query getSSIDataFromAccount($accountAddress: String!) {
          profiles(where: { owner: $accountAddress }) {
            ${profileFields}
            userData {
              ${ssiFields}
            }
            dataAudited {
              ${ssiFields}
            }
          }
        }
      `,
      { accountAddress },
    )
    console.log("res.profiles=======================>", res.profiles)
    return res.profiles?.length && res.profiles[0]
  } catch (error) {
    console.error('Failed to fetch ssidata1=================>', error)
    return null
  }
}

export const getSSIDatum = async (profileId: string) => {
  try {
    const res = await request(
      GRAPH_API_SSI,
      gql`
        query getSSIData($profileId: String!) {
          profile(id: $profileId) {
            ${profileFields}
            userData {
              ${ssiFields}
            }
            dataAudited {
              ${ssiFields}
            }
            identityTokens {
              ${identityTokenFields}
            }
            auditedIdentityTokens{
              ${identityTokenFields}
            }
            receivedIdentityTokens{
              ${identityTokenFields}
            }
          }
        }
      `,
      { profileId },
    )
    console.log("res.profile=======================>", res.profile)
    return res.profile
  } catch (error) {
    console.error('Failed to fetch ssidata=================>', error)
    return null
  }
}

export const getUserData = async (dataId: string) => {
  try {
    const res = await request(
      GRAPH_API_SSI,
      gql`
        query getSSIData($dataId: String!) {
          userData(id: $dataId) {
            ${ssiFields}
            ownerProfileId {
              ${profileFields}              
            }
            auditorProfileId {
              ${profileFields}              
            }
          }
        }
      `,
      { dataId },
    )
    console.log("res.userData=======================>", res.userData)
    return res.userData
  } catch (error) {
    console.error('Failed to fetch userData=================>', error)
    return null
  }
}

export const getSSIData = async (first = 5, skip = 0, account) => {
  try {
    const res = await request(
      GRAPH_API_SSI,
      gql`
        query getSSIData($first: Int!, $skip: Int!, $account: String!, $orderDirection: OrderDirection) {
          userDatas(
            first: $first
            skip: $skip
            orderDirection: $orderDirection
            where: { owner: $account }
          ) {
            ${ssiFields}
            ownerProfileId {
              ${profileFields}              
            }
            auditorProfileId {
              ${profileFields}              
            }
          }
        }
      `,
      { first, skip, account, orderDirection: 'desc' },
    )
    console.log("res.userDatas=======================>", res.userDatas)
    return res.userDatas
  } catch (error) {
    console.error('Failed to fetch ssidata=================>', error)
    return null
  }
}

export const getProfileData = async (first = 5, skip = 0, account) => {
  try {
    const res = await request(
      GRAPH_API_SSI,
      gql`
        query getProfileData($first: Int!, $skip: Int!, $account: String!, $orderDirection: OrderDirection) {
          profiles(
            where: { owner: $account }
          ){
            ${profileFields}
          }
        }
      `,
      { first, skip, account, orderDirection: 'desc' },
    )
    console.log("getProfileData=======================>", res.profiles)
    return res.profiles?.length && res.profiles[0]
  } catch (error) {
    console.error('Failed to fetch profiledata=================>', error)
    return null
  }
}

export const getProposals2 = async (first = 5, skip = 0, state = ProposalState.ACTIVE): Promise<Proposal[]> => {
  const response: { proposals: Proposal[] } = await request(
    SNAPSHOT_API,
    gql`
      query getProposals($first: Int!, $skip: Int!, $state: String!, $orderDirection: OrderDirection) {
        proposals(
          first: $first
          skip: $skip
          orderBy: "end"
          orderDirection: $orderDirection
          where: { space_in: "cakevote.eth", state: $state }
        ) {
          id
          title
          body
          choices
          start
          end
          snapshot
          state
          author
        }
      }
    `,
    { first, skip, state, orderDirection: state === ProposalState.CLOSED ? 'desc' : 'asc' },
  )
  return response.proposals
}

export const getInbox = async () => {
  const ssis = await firestore.collection('sharedData')
  .where('recipientProfileId', '==', '1')
  .get()
  .then((res) => {
    return res.docs;
  })
  .catch((err) => {
    console.error("error getting entries: ", err);
    return null;
  });
  return ssis.map((ssi) => ssi.data())
}

export const getProposals = async (first = 5, skip = 0, state, where={}): Promise<Proposal[]> => {
  try {
    const res = await request(
      GRAPH_API_SSI,
      gql`
      # query getProposalss($first: Int!, $skip: Int!, $where: NFT_filter, $orderDirection: OrderDirection) 
      {
        userDatas(first: $first, skip: $skip, where: $where, orderDirection: $orderDirection) {
          ${ssiFields}
        }
      }
      `,
      { 
        first, 
        skip, 
        where,
        orderDirection: state === EntryState.EXPIRED ? 'desc' : 'asc'
      },
    )
    return res.userDatas
  } catch (error) {
    console.error('Failed to fetch user data', error)
    return []
  }
}

export const getProposal = async (id: string) => {
  const response: {
    userData: any; proposal: Proposal 
} = await request(
    GRAPH_API_SSI,
    gql`
      query getProposal($id: String) 
      {
        userData(id: $id) {
          ${ssiFields}
        }
      }
    `,
    { id },
  )
  if (response.userData?.state === EntryState.PENDING) {
    const { answer } = await (await firestore.collection("ssi").doc(response.userData.id).get()).data()
    const res =  {
      ...response.userData,
      answer
    }
    return res
  }
  return response.userData
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
