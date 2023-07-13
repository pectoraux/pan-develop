import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
// import { useChartView } from 'state/bettings/hooks'
// import { setChartView } from 'state/bettings'
// import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
// import dynamic from 'next/dynamic'
// import { BettingsChartView } from 'state/types'
import { TabToggleGroup, TabToggle } from 'components/TabToggle'
import { useTranslation } from '@pancakeswap/localization'
// import Menu from './components/Menu'
// import TradingView from './components/TradingView'

// const ChainlinkChart = dynamic(() => import('./components/ChainlinkChart'), { ssr: false })

const MenuWrapper = styled.div`
  flex: none;
`

const ChartWrapper = styled.div`
  flex: 1;
  height: 100%;
  background-color: ${({ theme }) => theme.card.background};
`

const MobileChartWrapper = styled(Flex)`
  flex-direction: column;
  height: 100%;
  @media only screen and (max-width: 575px) and (max-height: 739px) {
    height: 100vh;
  }
`

const MobileChart = () => {
  // const chartView = useChartView()
  // const dispatch = useLocalDispatch()
  const { t } = useTranslation()

  return (
    <MobileChartWrapper>
      {/* <MenuWrapper>
        <Menu />
      </MenuWrapper> */}
      <div style={{ height: 'min-content' }}>
        <TabToggleGroup>
          <TabToggle
            // isActive={chartView === BettingsChartView.TradingView}
            isActive
            // onClick={() => dispatch(setChartView(BettingsChartView.TradingView))}
          >
            TradingView {t('Chart')}
          </TabToggle>
          <TabToggle
            // isActive={chartView === BettingsChartView.Chainlink}
            isActive={false}
            // onClick={() => dispatch(setChartView(BettingsChartView.Chainlink))}
          >
            Chainlink {t('Chart')}
          </TabToggle>
        </TabToggleGroup>
      </div>
      {/* <ChartWrapper>
        {chartView === BettingsChartView.TradingView ? <TradingView /> : <ChainlinkChart pt="8px" isMobile />}
      </ChartWrapper> */}
    </MobileChartWrapper>
  )
}

export default MobileChart
