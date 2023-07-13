import { memo } from 'react'
import styled from 'styled-components'
import { Box, Flex } from '@pancakeswap/uikit'
// import { useGetBettingsStatus, useIsChartPaneOpen, useIsHistoryPaneOpen } from 'state/bettings/hooks'
// import { BettingStatus } from 'state/types'
import MobileMenu from './components/MobileMenu'
import History from './History'
import Positions from './Positions'
import MobileChart from './MobileChart'
import { ErrorNotification, PauseNotification } from './components/Notification'
import { PageView } from './types'
import Menu from './components/Menu'
import LoadingSection from './components/LoadingSection'

const StyledMobile = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;

  ${({ theme }) => theme.mediaQueries.xl} {
    display: none;
  }
`

const PowerLinkStyle = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 16px;
`

const getView = (isHistoryPaneOpen: boolean, isChartPaneOpen: boolean): PageView => {
  if (isHistoryPaneOpen) {
    return PageView.HISTORY
  }

  if (isChartPaneOpen) {
    return PageView.CHART
  }

  return PageView.POSITIONS
}

const Mobile: React.FC<React.PropsWithChildren> = () => {
  const isHistoryPaneOpen = true
  const isChartPaneOpen = true
  const view = getView(isHistoryPaneOpen, isChartPaneOpen)
  const status = "BettingStatus.LIVE"
  return <></>
  // return (
  //   <StyledMobile>
  //     <Box height="100%">
  //       {/* {view === PageView.POSITIONS && (
  //         <Flex justifyContent="center" alignItems="center" flexDirection="column" minHeight="100%">
  //           {/* {status === BettingStatus.ERROR && <ErrorNotification />} */}
  //           {/* {status === BettingStatus.PAUSED && <PauseNotification />} */}
  //           {/* {[BettingStatus.INITIAL, BettingStatus.LIVE].includes(status) && ( */}
  //             <Box width="100%">
  //               {/* <Menu /> */}
  //               {/* {status === BettingStatus.LIVE ? <Positions view={view} /> : <LoadingSection />} */}
  //               <PowerLinkStyle>
  //                 <img
  //                   src="/images/powered-by-chainlink.png"
  //                   alt="Powered by ChainLink"
  //                   style={{ width: '170px', maxHeight: '100%' }}
  //                 />
  //               </PowerLinkStyle>
  //             </Box>
  //           )}
  //         </Flex>
  //       )} */}
  //       {view === PageView.CHART && <MobileChart />}
  //       {/* {view === PageView.HISTORY && <History />} */}
  //     </Box>
  //     <MobileMenu />
  //   </StyledMobile>
  // )
}

export default memo(Mobile)
