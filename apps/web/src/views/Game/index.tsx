import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { PageMeta } from 'components/Layout/Page'
import { Box, ScrollToTopButtonV2 } from '@pancakeswap/uikit'
import { usePotteryFetch } from 'state/pottery/hook'
import Banner from 'views/Game/components/Banner/index'
import Pot from 'views/Game/components/Pot/index'
import SubgraphHealthIndicator from 'components/SubgraphHealthIndicator'
import { useRouter } from 'next/router'
import { useGetCollection } from 'state/cancan/hooks'
import { usePool, usePoolsPageFetch } from 'state/games/hooks'
import FinishedRounds from './components/FinishedRounds'
import HowToPlay from './components/HowToPlay'
import PrizeFunds from './components/PrizeFunds'
import FAQ from './components/FAQ'

const Pottery: React.FC<React.PropsWithChildren> = () => {
  usePotteryFetch()
  const potWrapperEl = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const collectionAddress = router.query.game as string
  const { collection } = useGetCollection(collectionAddress)
  const [tokenId, setTokenId] = useState('')
  const { pool } = usePool(collectionAddress)
  console.log("ball1==============>", pool)

  usePoolsPageFetch()

  const handleScroll = () => {
    window.scrollTo({
      top: potWrapperEl.current.offsetTop,
      behavior: 'smooth',
    })
  }

  return (
    <Box position="relative">
      <PageMeta />
      {/* <Header collection={collection} /> */}
      <Banner collection={collection} handleScroll={handleScroll} />
      <Box ref={potWrapperEl}>
        <Pot collection={collection} tokenId={tokenId} setTokenId={setTokenId} />
      </Box>
      <FinishedRounds tokenId={tokenId} />
      <HowToPlay pool={pool} />
      <PrizeFunds />
      <FAQ />
      {createPortal(
        <>
          <ScrollToTopButtonV2 />
          <SubgraphHealthIndicator subgraphName="pancakeswap/pottery" />
        </>,
        document.body,
      )}
    </Box>
  )
}

export default Pottery
