import { useRouter } from 'next/router'
import PageLoader from 'components/Loader/PageLoader'
import IndividualNFTPage from './OneOfAKindNftPage'

const IndividualNFTPageRouter = () => {
  const router = useRouter()
  const { collectionAddress, tokenId } = router.query
  const isPaywall = router.pathname.includes('[collectionAddress]/paywall')

  if (router.isFallback) {
    return <PageLoader />
  }
  return <IndividualNFTPage collectionAddress={String(collectionAddress)} tokenId={String(tokenId)} isPaywall={isPaywall} />
}

export default IndividualNFTPageRouter
