import BigNumber from 'bignumber.js'
import { getAcceleratorVoterAddress } from 'utils/addressHelpers'
import { gql, request } from 'graphql-request'
import { GRAPH_API_PROFILE, GRAPH_API_SSI } from 'config/constants/endpoints'
import { getCollectionApi } from 'state/cancan/helpers'
import { blacklistFields, registrationFields, accountFields, tokenFields, profileFields } from 'state/profile/queries'
import { identityTokenFields } from 'state/ssi/queries'
import { 
  getBep20Contract,
  getProfileContract,
  getProfileHelperContract,
  getTrustBountiesContract,
} from '../../utils/contractHelpers'

export const getProfileData = async (profileId) => {
  try {
    const res = await request(
      GRAPH_API_PROFILE,
      gql`
      query getProfileData($profileId: String) 
      {
        profile(id: $profileId) {
          ${profileFields}
          tokens {
            ${tokenFields}
          }
          accounts {
            ${accountFields}
          }
          following {
            ${registrationFields}
          }
          followers {
            ${registrationFields}
          }
          blacklist {
            ${blacklistFields}
          }
        }
      }
      `,
      { profileId },
    )
    console.log('fetched profile===========>', res.profile)
    return res.profile
  } catch (error) {
    console.error('Failed to fetch profile===========>', error)
  }
  return null
}

export const getProfilesData = async (first = 5, skip = 0, where={}) => {
  try {
    const res = await request(
      GRAPH_API_PROFILE,
      gql`
      query getProfilesData($where: Profile_filter) 
      {
        profiles(first: $first, skip: $skip, where: $where) {
          ${profileFields}
          tokens {
            ${tokenFields}
          }
          accounts {
            ${accountFields}
          }
          following {
            ${registrationFields}
          }
          followers {
            ${registrationFields}
          }
          blacklist {
            ${blacklistFields}
          }
        }
      }
      `,
      { first, skip, where },
    )
    console.log('Failed to fetch profiles===========>', res)
    return res.profiles
  } catch (error) {
    console.error('Failed to fetch profiles===========>', error)
    return []
  }
}

export const getSharedEmail = async (accountAddress) => {
  const profileContract = getProfileContract()
  return profileContract.sharedEmail(accountAddress?.toLowerCase());
}

export const getIsNameUsed = async (name) => {
  const profileContract = getProfileContract()
  return profileContract.getIsNameTaken(name);
}

export const getProfileDataFromUser = async (address) => {
  console.log("2getProfilesData=================>", address)
  const profileContract = getProfileContract()
  const _profileId = await profileContract.addressToProfileId(address)
  const profileId = new BigNumber(_profileId._hex).toJSON()
  const profileData = await getProfileData(profileId)
  return {
    ...profileData,
  }
}

export const getSSIDatum = async (account: string) => {
  try {
    const res = await request(
      GRAPH_API_SSI,
      gql`
        query getSSIData($account: String!) {
          identityTokens(
            where: { owner: $account }
          ) {
              ${identityTokenFields}
            }
        }
      `,
      { account },
    )
    console.log("1res.profile=======================>", account, res)
    return res.identityTokens
  } catch (error) {
    console.error('Failed to fetch ssidata=================>', error)
    return null
  }
}

export const fetchProfiles = async () => {
  const profileContract = getProfileContract()
  const profileHelperContract = getProfileHelperContract()
  const gauges = await getProfilesData()
  const profiles = await Promise.all(
    gauges.map(async (gauge) => {
      const [[ 
        ssid,
        name,
        ssidAuditorProfileId,
        createdAt,
        activePeriod,
        paidPayable,
        _collectionId,
        [blackLateSeconds, blackLateValue],
        [brownLateSeconds, brownLateValue],
        [silverLateSeconds, silverLateValue],
        [goldLateSeconds, goldLateValue],
      ],
        _badgeIds,
        broadcast,
      ] = await Promise.all([
        profileContract.profileInfo(gauge.id),
        profileContract.getAllBadgeIds(gauge.id, 0),
        profileHelperContract.broadcast(gauge.id),
      ])
      let collection;
      if (Number(gauge.collectionId)) {
        collection = await getCollectionApi(gauge.collectionId);
      } 
      const badgeIds = _badgeIds.map((badgeId) => new BigNumber(badgeId._hex).toJSON())
      const tokens = await Promise.all(
        gauge?.tokens?.map(async (token) => {
          const tokenContract = getBep20Contract(token.tokenAddress ?? '')
          const trustbountiesContract = getTrustBountiesContract()
          const [ tokenName, decimals, symbol, bountyBalance ] = await Promise.all([
            tokenContract.name(),
            tokenContract.decimals(),
            tokenContract.symbol(),
            trustbountiesContract.getBalance(token.bountyId ?? 0),
          ])
          return { 
            ...token,
            tokenName,
            decimals,
            symbol,
            bountyBalance: new BigNumber(bountyBalance._hex).toJSON()
          }
        })
      )

      // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
      return {
        sousId: gauge.id,
        ...gauge,
        tokens,
        badgeIds,
        broadcast,
        collection,
        ssid,
        name,
        ssidAuditorProfileId: new BigNumber(ssidAuditorProfileId._hex).toJSON(),
        createdAt: new BigNumber(createdAt._hex).toJSON(),
        activePeriod: new BigNumber(activePeriod._hex).toJSON(),
        paidPayable: new BigNumber(paidPayable._hex).toJSON(),
        blackLateSeconds: new BigNumber(blackLateSeconds._hex).toJSON(),
        blackLateValue: new BigNumber(blackLateValue._hex).toJSON(),
        brownLateSeconds: new BigNumber(brownLateSeconds._hex).toJSON(),
        brownLateValue: new BigNumber(brownLateValue._hex).toJSON(),
        silverLateSeconds: new BigNumber(silverLateSeconds._hex).toJSON(),
        silverLateValue: new BigNumber(silverLateValue._hex).toJSON(),
        goldLateSeconds: new BigNumber(goldLateSeconds._hex).toJSON(),
        goldLateValue: new BigNumber(goldLateValue._hex).toJSON(),
      }
    }).flat()
  )
  return profiles
}

export const fetchPoolsWeights = async (businesses) => {
  // const acceleratorVoterAddress = getAcceleratorVoterAddress()
  // const calls = businesses.map((business) => ({
  //   address: acceleratorVoterAddress,
  //   name: 'weights',
  //   params: [business.gauge],
  // }))
  // const weights = await multicall(contributorsABI, calls)
  return null
}