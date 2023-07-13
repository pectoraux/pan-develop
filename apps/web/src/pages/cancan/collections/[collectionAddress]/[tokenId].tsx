import IndividualNFT from 'views/CanCan/market/Collection/IndividualNFTPage'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { getCollection, getItemSg } from 'state/cancan/helpers'
// eslint-disable-next-line camelcase
import { SWRConfig, unstable_serialize } from 'swr'

const IndividualNFTPage = ({ fallback = {} }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <SWRConfig
      value={{
        fallback,
      }}
    >
      <IndividualNFT />
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
  const { collectionAddress, tokenId } = params

  if (typeof collectionAddress !== 'string' || typeof tokenId !== 'string') {
    return {
      notFound: true,
    }
  }
  const collection = await getCollection(collectionAddress)
  const nft = await getItemSg(`${collectionAddress}-${tokenId}`)

  // const nft: NftToken = {
  //   tokenId,
  //   collectionAddress,
  //   collectionName: collection.name,
  //   attributes: [],
  // }
  return {
    props: {
      fallback: {
        [unstable_serialize(['cancan', collectionAddress, tokenId])]: nft,
        ...(collection && {
          [unstable_serialize(['cancan', 'collections', collectionAddress])]: collection,
        }),
      },
    },
    revalidate: 60 * 60 * 6, // 6 hours
  }
}

export default IndividualNFTPage
