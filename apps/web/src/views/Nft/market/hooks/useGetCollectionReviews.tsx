import { getCollectionReviewsApi } from 'state/cancan/helpers'
import { ApiCollectionDistribution } from 'state/cancan/types'
import useSWRImmutable from 'swr/immutable'
import { FetchStatus } from 'config/constants/types'

const useGetCollectionReviews = (collectionAddress: string, tokenId: string) => {
  const { data, status } = useSWRImmutable(
    collectionAddress ? ['reviews', collectionAddress] : null,
    async () => getCollectionReviewsApi<ApiCollectionDistribution>(collectionAddress, tokenId),
  )
  return {
    data,
    isFetching: status !== FetchStatus.Fetched,
  }
}

export default useGetCollectionReviews
