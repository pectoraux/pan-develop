import useSWRImmutable from 'swr/immutable'
import { getVotingPower } from './helpers'


export const useGetVotingPower = (veAddress: string, tokenId: string) => {
    const { 
        data, 
        status, 
        mutate: refetch, 
    } = useSWRImmutable(['votingpower', veAddress, tokenId], async () => getVotingPower(veAddress, tokenId))
    return { data, refetch, status }
}