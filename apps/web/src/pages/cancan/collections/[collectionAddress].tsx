import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
// eslint-disable-next-line camelcase
import { SWRConfig, unstable_serialize } from 'swr'
import { getCollection } from 'state/cancan/helpers'
import CollectionPageRouter from 'views/CanCan/market/Collection/CollectionPageRouter'

const CollectionPage = ({ fallback = {} }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <SWRConfig
      value={{
        fallback,
      }}
    >
      <CollectionPageRouter />
    </SWRConfig>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: true,
    paths: [],
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { collectionAddress } = params
  if (typeof collectionAddress !== 'string') {
    return {
      notFound: true,
    }
  }

  try {
    const collectionData = await getCollection(collectionAddress)
    console.log("getTokenURI(1)============>")
    // console.log("getTokenURI(2)============>", await getTokenURI(2))
    if (collectionData) {
      return {
        props: {
          fallback: {
            [unstable_serialize(['cancan', 'collections', collectionAddress])]: { ...collectionData },
          },
        },
        revalidate: 60 * 60 * 6, // 6 hours
      }
    }
    return {
      notFound: true,
      revalidate: 60,
    }
  } catch (error) {
    console.log("getTokenURI(1)============>", error)
    return {
      notFound: true,
      revalidate: 60,
    }
  }
}

export default CollectionPage
