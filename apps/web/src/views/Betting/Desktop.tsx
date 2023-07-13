import { useRouter } from 'next/router'
import { memo, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Split, { SplitInstance } from 'split-grid'
import { Box } from '@pancakeswap/uikit'
import debounce from 'lodash/debounce'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { usePoolsPageFetch, usePoolsWithFilterSelector } from 'state/bettings/hooks'
import { setChartPaneState } from 'state/predictions'
import History from './History'
import Positions from './Positions'
import Menu from './components/Menu'

const SplitWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 24px 0;
  flex: 1;
  overflow: hidden;
`

const HistoryPane = styled.div<{ isHistoryPaneOpen: boolean; isChartPaneOpen: boolean }>`
  flex: none;
  overflow: hidden;
  transition: width 200ms ease-in-out;
  background: ${({ theme }) => theme.card.background};
  padding-bottom: ${({ isChartPaneOpen }) => (isChartPaneOpen ? 0 : '24px')};
  width: ${({ isHistoryPaneOpen }) => (isHistoryPaneOpen ? '384px' : 0)};
`

const StyledDesktop = styled.div`
  ${({ theme }) => theme.mediaQueries.lg} {
    display: flex;
    height: calc(100vh - 100px);
  }
`

const PositionPane = styled.div`
  align-items: center;
  display: flex;
  max-width: 100%;
  overflow-y: auto;
  overflow-x: hidden;

  & > div {
    flex: 1;
    overflow: hidden;
  }
`

const Desktop: React.FC<any> = ({ allBettings }) => {
  const splitWrapperRef = useRef<HTMLDivElement>()
  const chartRef = useRef<HTMLDivElement>()
  const gutterRef = useRef<HTMLDivElement>()
  const [isHistoryPaneOpen, setHistoryPaneState] = useState(false)
  const isChartPaneOpen = true 
  const dispatch = useLocalDispatch()
  const splitInstance = useRef<SplitInstance>()

  useEffect(() => {
    const height = 0
    if (height > 0 && !isChartPaneOpen) {
      dispatch(setChartPaneState(true))
    }
  }, [isChartPaneOpen, dispatch])

  // unmount
  useEffect(() => {
    return () => {
      dispatch(setChartPaneState(false))
    }
  }, [dispatch])

  useEffect(() => {
    const threshold = 100
    const handleDrag = debounce(() => {
      const height = 0
      // If the height of the chart pane goes below the "snapOffset" threshold mark the chart pane as closed
      dispatch(setChartPaneState(height > threshold))
    }, 50)

    if (isChartPaneOpen && !splitInstance.current) {
      splitInstance.current = Split({
        dragInterval: 1,
        snapOffset: threshold,
        onDrag: handleDrag,
        rowGutters: [
          {
            track: 1,
            element: gutterRef.current,
          },
        ],
      })
    } else if (!isChartPaneOpen && splitInstance.current) {
      splitInstance.current?.destroy()
      splitInstance.current = undefined
    }

    return () => {
      splitInstance.current?.destroy()
      splitInstance.current = undefined
    }
  }, [gutterRef, chartRef, dispatch, isChartPaneOpen])
  const router = useRouter()
  const { betting } = router.query as any
  const { pools, userDataLoaded } = usePoolsWithFilterSelector()
  const ogBetting = pools?.find((pool) => pool?.id?.toLowerCase() === betting?.toLowerCase())
  usePoolsPageFetch()
  console.log("1bettings==================>", userDataLoaded, pools, ogBetting, betting, router.query)
  
  return (
    <>
      <StyledDesktop>
        <SplitWrapper ref={splitWrapperRef}>
          <PositionPane>
              <Box>
                <Menu allBettings={allBettings} ogBetting={ogBetting} isHistoryPaneOpen={isHistoryPaneOpen} setHistoryPaneState={setHistoryPaneState} />
                <Positions allBettings={allBettings} ogBetting={ogBetting} />
              </Box>
          </PositionPane>
        </SplitWrapper>
        <HistoryPane isHistoryPaneOpen={isHistoryPaneOpen} isChartPaneOpen={isChartPaneOpen}>
          <History ogBetting={ogBetting} isHistoryPaneOpen={isHistoryPaneOpen} setHistoryPaneState={setHistoryPaneState} />
        </HistoryPane>
      </StyledDesktop>
    </>
  )
}

export default memo(Desktop)
