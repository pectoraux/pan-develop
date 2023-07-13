import { useEffect, useState } from 'react'
import { Card, CardBody, Flex, Button, PlayCircleOutlineIcon, Text, useTooltip, useModal } from '@pancakeswap/uikit'
import { getNow } from 'utils/getNow'
import { useTranslation } from '@pancakeswap/localization'
import { NodeRound, NodeLedger, BetPosition } from 'state/types'
import BigNumber from 'bignumber.js'
import RoundProgress from 'components/RoundProgress'
import { useGetSubjects } from 'state/bettings/hooks'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { RoundResultBox, PrizePoolRow } from '../RoundResult'
import MultiplierArrow from './MultiplierArrow'
import CardHeader from './CardHeader'
import BuyTicketsModal from '../BuyTicketsModal/BuyTicketsModal'

interface LiveRoundCardProps {
  round: NodeRound
  betAmount?: NodeLedger['amount']
  hasEnteredUp: boolean
  hasEnteredDown: boolean
  bullMultiplier: string
  bearMultiplier: string
}

const REFRESH_PRICE_BEFORE_SECONDS_TO_CLOSE = 2

const LiveRoundCard: React.FC<any> = ({
  allBettings,
  betting,
}) => {
  const { t } = useTranslation()
  const closeTimestamp = betting?.currEnd
  const lockTimestamp = betting?.currStart
  // const { lockPrice, totalAmount, lockTimestamp, closeTimestamp } = round
  // const { price, refresh } = usePollOraclePrice()
  // const bufferSeconds = useGetBufferSeconds()
  // const { minPriceUsdDisplayed, displayedDecimals } = useConfig()

  // const [isCalculatingPhase, setIsCalculatingPhase] = useState(false)

  const variants = ["success", "primary", "secondary", "tertiary", "light", "danger"]
  const isBull = true
  const price = new BigNumber(10)
  const lockPrice = new BigNumber(10)
  const [onPresentBuyTicketsModal] = useModal(<BuyTicketsModal betting={betting} />)
  // const priceDifference = getPriceDifference(price, lockPrice)
  // const hasRoundFailed = getHasRoundFailed(round.oracleCalled, round.closeTimestamp, bufferSeconds)
  // const subjects = useGetSubjects(betting?.id, betting?.bettingId)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(t('Last price from Chainlink Oracle'), {
    placement: 'bottom',
  })

  useEffect(() => {
    const secondsToClose = closeTimestamp ? closeTimestamp - getNow() : 0
    if (secondsToClose > 0) {
      const refreshPriceTimeout = setTimeout(() => {
        // refresh()
      }, (secondsToClose) * 1000)

      const calculatingPhaseTimeout = setTimeout(() => {
        // setIsCalculatingPhase(true)
      }, secondsToClose * 1000)

      return () => {
        clearTimeout(refreshPriceTimeout)
        clearTimeout(calculatingPhaseTimeout)
      }
    }
    return undefined
  }, [closeTimestamp])

  // if (hasRoundFailed) {
  //   return <CanceledRoundCard round={round} />
  // }

  // if (isCalculatingPhase) {
  //   return <CalculatingCard round={round} hasEnteredDown={hasEnteredDown} hasEnteredUp={hasEnteredUp} />
  // }

  return (
    <Card isActive style={{ cursor: "pointer" }}>
      <CardHeader
        status="live"
        icon={<PlayCircleOutlineIcon mr="4px" width="24px" color="secondary" />}
        title={t('Live')}
        epoch={betting?.idx}
      />
      <RoundProgress variant="flat" scale="sm" 
        lockTimestamp={lockTimestamp} 
        closeTimestamp={closeTimestamp} 
      />
      <CardBody p="16px">
        <RoundResultBox betPosition={isBull ? BetPosition.BULL : BetPosition.BEAR}>
          <PrizePoolRow betting={betting} mb="8px"/>
          <Flex 
            justifyContent='flex-start'
            alignItems="center" 
            flexDirection="column" 
            overflow="auto"
            maxHeight="200px"
          >
            {betting?.subjects?.map((subject, index) => 
              <Button
                // variant={variants[index % 6]}
                width="150px"
                height="200px"
                onClick={onPresentBuyTicketsModal}
                mb="4px"
                // disabled={!true || isBufferPhase}
                // disabled={!canEnterPosition || isBufferPhase}
              >
                <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
                  {subject} ({index+1})
                </Text>
              </Button>
            )}
          </Flex>
        </RoundResultBox>
        <MultiplierArrow
          isActive={!isBull}
          allBettings={allBettings}
          action={betting?.action}
          adminShare={betting?.adminShare}
          referrerShare={betting?.referrerShare}
          bettingId={betting?.bettingId}
          rewardsBreakdown={betting?.rewardsBreakdown}
        />  
      </CardBody>
      {tooltipVisible && tooltip}
    </Card>
  )
}

export default LiveRoundCard
