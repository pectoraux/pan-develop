import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Flex, Spinner, Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import styled from 'styled-components'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import { fetchNodeHistory } from 'state/predictions'
import { getFilteredBets } from 'state/predictions/helpers'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import Items from './components/Items'
// import {
//   useGetCurrentEpoch,
//   useGetCurrentHistoryPage,
//   useGetHistory,
//   useGetHistoryFilter,
//   useGetIsFetchingHistory,
//   useIsHistoryPaneOpen,
// } from 'state/predictions/hooks'
import { Header, HistoryTabs } from './components/History'
import RoundsTab from './components/History/RoundsTab'
import PnlTab from './components/History/PnlTab/PnlTab'

const StyledHistory = styled.div`
  background-color: ${({ theme }) => theme.card.background};
  display: flex;
  flex-direction: column;
  height: 100%;
`

const BetWrapper = styled.div`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  position: relative;
`

const SpinnerWrapper = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.card.background};
  display: flex;
  left: 0;
  height: 100%;
  justify-content: center;
  position: absolute;
  top: 0;
  width: 100%;
`

const History = ({ ogBetting, isHistoryPaneOpen, setHistoryPaneState }) => {
  const { account } = useWeb3React()
  const dispatch = useLocalDispatch()
  const historyFilter = "ALL"
  const currentEpoch = 1 
  const { t } = useTranslation()
  const bets = [] 
  const [activeTab, setActiveTab] = useState(HistoryTabs.ROUNDS)
  const { bettingId } = useRouter().query
  const currEvent = ogBetting?.bettingEvents?.length && ogBetting?.bettingEvents[Number(bettingId || 1) - 1]

  useEffect(() => {
    if (account && isHistoryPaneOpen) {
      dispatch(fetchNodeHistory({ account }))
    }
  }, [account, currentEpoch, isHistoryPaneOpen, dispatch])

  const results = getFilteredBets(bets, null)
  const hasBetHistory = results && results.length > 0

  let activeTabComponent = null

  switch (activeTab) {
    case HistoryTabs.PNL:
      activeTabComponent = <PnlTab hasBetHistory={hasBetHistory} bets={results} />
      break
    case HistoryTabs.ROUNDS:
    default:
      activeTabComponent = <RoundsTab hasBetHistory={hasBetHistory} bets={results} />
      break
  }

  if (!account) {
    activeTabComponent = (
      <Flex justifyContent="center" alignItems="center" flexDirection="column" mt="32px">
        <ConnectWalletButton />
        <Text mt="8px">{t('Connect your wallet to view your betting history')}</Text>
      </Flex>
    )
  }

  return (
    <StyledHistory>
      <Header activeTab={activeTab} setHistoryPaneState={setHistoryPaneState} setActiveTab={setActiveTab} />
    <Flex overflowY="auto" maxHeight="500px">
      <BetWrapper>
        {/* {isFetchingHistory && currentHistoryPage === 1 ? (
          <SpinnerWrapper>
            <Spinner size={72} />
          </SpinnerWrapper>
        ) : (
          activeTabComponent
        )} */}
        {activeTab === 0 ? <RoundsTab hasBetHistory={hasBetHistory} currEvent={currEvent} /> : null}
        {activeTab === 1 ? <Items /> : null}
      </BetWrapper>
      </Flex>
    </StyledHistory>
  )
}

export default History
