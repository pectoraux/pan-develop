import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Card, Text, Skeleton, CardHeader, Box } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useAppDispatch } from 'state'
import { useLottery } from 'state/lottery/hooks'
import { fetchLottery } from 'state/lotteries/fetchPools'
import { LotteryStatus } from 'config/constants/types'
import RoundSwitcher from './RoundSwitcher'
import { getDrawnDate, processLotteryResponse } from '../../helpers'
import PreviousRoundCardBody from '../PreviousRoundCard/Body'
import PreviousRoundCardFooter from '../PreviousRoundCard/Footer'

const StyledCard = styled(Card)`
  width: 100%;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 756px;
  }
`

const StyledCardHeader = styled(CardHeader)`
  z-index: 2;
  background: none;
  border-bottom: 1px ${({ theme }) => theme.colors.cardBorder} solid;
`

const AllHistoryCard = ({ currentTokenId }) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const dispatch = useAppDispatch()
  const { lotteryData } = useLottery()
  const { id: currentLotteryId, history } = lotteryData
  const [latestRoundId, setLatestRoundId] = useState(null)
  const [selectedRoundId, setSelectedRoundId] = useState('')
  const [selectedLotteryNodeData, setSelectedLotteryNodeData] = useState(lotteryData)
  const timer = useRef(null)
  // const numRoundsFetched = lotteriesData?.length

  useEffect(() => {
    if (currentLotteryId) {
      const mostRecentFinishedRoundId = history?.length ? history[history?.length - 1]?.id : null
      setLatestRoundId(mostRecentFinishedRoundId)
      setSelectedRoundId(mostRecentFinishedRoundId ?? '')
    }
  }, [currentLotteryId, history])

  useEffect(() => {
    setSelectedLotteryNodeData(null)

    const fetchLotteryData = async () => {
      const _lotteryData = await fetchLottery(selectedRoundId)
      // const processedLotteryData = processLotteryResponse(lotteryData)
      setSelectedLotteryNodeData(_lotteryData)
    }

    timer.current = setInterval(() => {
      if (selectedRoundId) {
        fetchLotteryData()
      }
      clearInterval(timer.current)
    }, 1000)

    return () => clearInterval(timer.current)
  }, [selectedRoundId, currentLotteryId, dispatch])

  const handleInputChange = (event) => {
    const {
      target: { value },
    } = event
    if (value) {
      setSelectedRoundId(value)
      if (parseInt(value, 10) <= 0) {
        setSelectedRoundId('')
      }
      if (parseInt(value, 10) >= latestRoundId) {
        setSelectedRoundId(latestRoundId.toString())
      }
    } else {
      setSelectedRoundId('')
    }
  }

  const handleArrowButtonPress = (targetRound) => {
    if (targetRound) {
      setSelectedRoundId(targetRound.toString())
    } else {
      // targetRound is NaN when the input is empty, the only button press that will trigger this func is 'forward one'
      setSelectedRoundId(currentLotteryId)
    }
  }

  return (
    <StyledCard>
      <StyledCardHeader>
        <RoundSwitcher
          isLoading={false}
          selectedRoundId={selectedRoundId}
          mostRecentRound={latestRoundId}
          handleInputChange={handleInputChange}
          handleArrowButtonPress={handleArrowButtonPress}
        />
        <Box mt="8px">
          {Number(selectedLotteryNodeData?.endTime ?? 0) ? (
              <Text fontSize="14px">
                {t('Drawn')} {getDrawnDate(locale, selectedLotteryNodeData?.endTime)}
              </Text>
            ) : (
              <Skeleton width="185px" height="21px" />
            )}
        </Box>
      </StyledCardHeader>
      <PreviousRoundCardBody 
        lotteryNodeData={selectedLotteryNodeData} 
        lotteryId={selectedRoundId}
        latestId={history?.length ? history[history?.length - 1]?.id : currentLotteryId}
      />
      <PreviousRoundCardFooter currentTokenId={currentTokenId} lotteryNodeData={selectedLotteryNodeData} lotteryId={selectedRoundId} />
    </StyledCard>
  )
}

export default AllHistoryCard
