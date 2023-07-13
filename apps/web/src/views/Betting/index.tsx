import { useWeb3React } from '@pancakeswap/wagmi'
import { PageMeta } from 'components/Layout/Page'
import { useEffect, useRef } from 'react'
import { useInitialBlock } from 'state/block/hooks'
import { initializePredictions } from 'state/predictions'
import { useAccountLocalEventListener } from 'hooks/useAccountLocalEventListener'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'

import CollectWinningsPopup from './components/CollectWinningsPopup'
import Container from './components/Container'
import SwiperProvider from './context/SwiperProvider'
import Desktop from './Desktop'

const Bettings = ({ allBettings }) => {
  // const { isDesktop } = useMatchBreakpoints()
  const { account } = useWeb3React()
  const isDesktop = true
  const dispatch = useLocalDispatch()
  const initialBlock = useInitialBlock()

  useAccountLocalEventListener()

  useEffect(() => {
    if (initialBlock > 0) {
      // Do not start initialization until the first block has been retrieved
      dispatch(initializePredictions(account))
    }
  }, [initialBlock, dispatch, account])

  // usePollPredictions()

  return (
    <>
      <PageMeta />
      {/* <RiskDisclaimer /> */}
      <SwiperProvider>
        <Container>
          {/* {isDesktop ?  */}
          <Desktop allBettings={allBettings} /> 
          {/* : <Mobile />} */}
          <CollectWinningsPopup />
        </Container>
      </SwiperProvider>
    </>
  )
}

export default Bettings
