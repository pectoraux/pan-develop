import PageLoader from 'components/Loader/PageLoader'
import { PageMeta } from 'components/Layout/Page'
import dynamic from 'next/dynamic'
import { NextRouter, useRouter } from 'next/router'
import { useMemo } from 'react'
import { useGetCollection } from 'state/cancan/hooks'
import Header from './Header'
import Items from './Items'

const Traits = dynamic(() => import('./Traits'), {
  loading: () => <PageLoader />,
})
const Legal = dynamic(() => import('./Legal'), {
  loading: () => <PageLoader />,
})
const Activity = dynamic(() => import('./Activity'), {
  loading: () => <PageLoader />,
})
const Requests = dynamic(() => import('./Requests'), {
  loading: () => <PageLoader />,
})
const Contracts = dynamic(() => import('views/StakeMarket'), {
  loading: () => <PageLoader />,
})
const ValuePools = dynamic(() => import('views/ValuePools'), {
  loading: () => <PageLoader />,
})

const getHashFromRouter = (router: NextRouter) => router.asPath.match(/#([a-z0-9]+)/gi)

const Collection = () => {
  const router = useRouter()
  const collectionAddress = router.query.collectionAddress as string
  const { collection } = useGetCollection(collectionAddress)
  const hash = useMemo(() => getHashFromRouter(router)?.[0], [router])

  if (!collection) {
    return <PageLoader />
  }

  let content = <Items />

  if (hash === '#traits') {
    content = <Traits />
  }

  if (hash === '#legal') {
    content = <Legal />
  }

  if (hash === '#activity') {
    content = <Activity />
  }

  if (hash === '#requests') {
    content = <Requests />
  }

  if (hash === '#stakemarket' || hash === '#trustbounties') {
    content = <Contracts />
  }

  if (hash === '#valuepools') {
    content = <ValuePools />
  }
  
  return (
    <>
      <PageMeta />
      <Header collection={collection} />
      {content}
    </>
  )
}

export default Collection
