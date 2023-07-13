import { useRouter } from 'next/router'
import { useGetCollection } from 'state/cancan/hooks'
import RequestHistory from '../../RequestHistory/RequestHistory'

const Activity = () => {
  const collectionAddress = useRouter().query.collectionAddress as string
  const { collection } = useGetCollection(collectionAddress)

  return (
    <>
      <RequestHistory collection={collection} />
    </>
  )
}

export default Activity
