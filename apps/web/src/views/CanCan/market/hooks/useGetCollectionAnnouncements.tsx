import useSWRImmutable from 'swr/immutable'
import { FetchStatus } from 'config/constants/types'
import { getCollectionAnnouncements } from 'state/cancan/helpers'

const useGetCollectionAnnouncements = (collectionAddress: string) => {
  const where = { collection_: {id: collectionAddress}, isTradable: true }
  const { data, status } = useSWRImmutable(
    collectionAddress ? ['announcements', collectionAddress] : null,
    async () => (await getCollectionAnnouncements(0,0, where)).data,
  )

  return {
    data,
    isFetching: status !== FetchStatus.Fetched,
  }
}

export default useGetCollectionAnnouncements
