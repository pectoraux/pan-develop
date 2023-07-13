import { useRouter } from 'next/router'
import styled from 'styled-components'
import Link from 'next/link'
import { Flex, HelpIcon, Button, PrizeIcon } from '@pancakeswap/uikit'
// import { useGetBettingsStatus } from 'state/bettings/hooks'
import { PredictionStatus } from 'state/types'
import FlexRow from './FlexRow'
import { PricePairLabel, TimerLabel } from './Label'
import PrevNextNav from './PrevNextNav'
import HistoryButton from './HistoryButton'

const SetCol = styled.div`
  flex: none;
  width: auto;

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 270px;
  }
`

const HelpButtonWrapper = styled.div`
  order: 1;
  margin: 0 2px 0 8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    order: 2;
    margin: 0 0 0 8px;
  }
`

const TimerLabelWrapper = styled.div`
  order: 3;
  width: 100px;

  ${({ theme }) => theme.mediaQueries.sm} {
    order: 1;
    width: auto;
  }
`

const LeaderboardButtonWrapper = styled.div`
  display: block;

  order: 2;
  margin: 0 8px 0 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    order: 3;
    margin: 0 0 0 8px;
  }
`

const ButtonWrapper = styled.div`
  display: none;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
    margin-left: 8px;
  }
`

const Menu = ({ allBettings, ogBetting, isHistoryPaneOpen, setHistoryPaneState }) => {
  const router = useRouter()
  const { bettingId } = router.query
  const bettingEvent = ogBetting?.bettingEvents?.find((be) => Number(be.bettingId) === Number(bettingId || 1))
  const closeTimestamp = Math.ceil((parseInt(bettingEvent?.currEnd || 0) - Date.now() / 1000) / 60)
  console.log("Menu============>", bettingEvent, bettingId, ogBetting)
  console.log("closeTimestamp=================>", closeTimestamp)
  return (
    <FlexRow alignItems="center" p="16px" width="100%">
      <SetCol>
        <PricePairLabel allBettings={allBettings} ogBetting={ogBetting} />
      </SetCol>
        <>
          <FlexRow justifyContent="center">
            <PrevNextNav />
          </FlexRow>
          <SetCol>
            <Flex alignItems="center" justifyContent="flex-end">
              <TimerLabelWrapper>
                {bettingEvent?.currEnd && <TimerLabel interval={closeTimestamp} unit=" m" />}
              </TimerLabelWrapper>
              <HelpButtonWrapper>
                <Button
                  variant="subtle"
                  as="a"
                  href="https://docs.pancakeswap.finance/products/betting"
                  target="_blank"
                  rel="noreferrer noopener"
                  width="48px"
                >
                  <HelpIcon width="24px" color="white" />
                </Button>
              </HelpButtonWrapper>
              <LeaderboardButtonWrapper>
                <Link href="/betting/leaderboard" passHref>
                  <Button as="a" variant="subtle" width="48px">
                    <PrizeIcon color="white" />
                  </Button>
                </Link>
              </LeaderboardButtonWrapper>
              {!allBettings ? <ButtonWrapper style={{ order: 4 }}>
                <HistoryButton isHistoryPaneOpen={isHistoryPaneOpen} setHistoryPaneState={setHistoryPaneState} />
              </ButtonWrapper>:null}
            </Flex>
          </SetCol>
        </>
    </FlexRow>
  )
}

export default Menu
