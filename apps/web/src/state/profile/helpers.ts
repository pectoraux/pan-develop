import BigNumber from 'bignumber.js'
import { Profile } from 'state/types'
import { PancakeProfile } from 'config/abi/types/PancakeProfile'
import profileABI from 'config/abi/pancakeProfile.json'
import { API_PROFILE } from 'config/constants/endpoints'
import { getTeam } from 'state/teams/helpers'
import { NftToken } from 'state/nftMarket/types'
import { getNftApi } from 'state/nftMarket/helpers'
import { multicallv2 } from 'utils/multicall'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { getProfileContract } from '../../utils/contractHelpers'

export interface GetProfileResponse {
  hasRegistered: boolean
  profile?: Profile
}

const transformProfileResponse = (
  profileResponse: Awaited<ReturnType<PancakeProfile['getUserProfile']>>,
): Partial<Profile> => {
  const { 0: userId, 1: numberPoints, 2: teamId, 3: collectionAddress, 4: tokenId, 5: isActive } = profileResponse

  return {
    userId: userId.toNumber(),
    points: numberPoints.toNumber(),
    teamId: teamId.toNumber(),
    tokenId: tokenId.toNumber(),
    collectionAddress,
    isActive,
  }
}

export const getUsername = async (address: string): Promise<string> => {
  try {
    const response = await fetch(`${API_PROFILE}/api/users/${address.toLowerCase()}`)

    if (!response.ok) {
      return ''
    }

    const { username = '' } = await response.json()

    return username
  } catch (error) {
    return ''
  }
}

export const getProfile = async (address: string) => {
  try {
    const profileContract = getProfileContract()
    const profileIdData = await profileContract.addressToProfileId(address)
    const profileId = new BigNumber(profileIdData._hex ?? 0).toJSON()
    let profileInfo;
    if (parseInt(profileId) > 0) {
      profileInfo = await profileContract.profileInfo(profileId)
    }
    const res = {
      profile: profileInfo,
      profileId
    }
    console.log("profileContract================>", res, profileContract)
    return res
  } catch (e) {
    console.log("profileCallsResult4==================>", e)
    console.error(e)
    return null
  }
}
