import styled from 'styled-components'
import { Card, Box, BlockIcon, CardBody } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { NodeRound, NodeLedger } from 'state/types'
import { useGetBufferSeconds } from 'state/predictions/hooks'
import { getHasRoundFailed } from 'state/predictions/helpers'
import useTheme from 'hooks/useTheme'
import { RoundResult } from '../RoundResult'
import MultiplierArrow from './MultiplierArrow'
import CardHeader, { getBorderBackground } from './CardHeader'
import CollectWinningsOverlay from './CollectWinningsOverlay'

interface ExpiredRoundCardProps {
  round: NodeRound
  betAmount?: NodeLedger['amount']
  hasEnteredUp: boolean
  hasEnteredDown: boolean
  hasClaimedUp: boolean
  hasClaimedDown: boolean
  bullMultiplier: string
  bearMultiplier: string
  isActive?: boolean
}

const StyledExpiredRoundCard = styled(Card)`
  opacity: 0.7;
  transition: opacity 300ms;

  &:hover {
    opacity: 1;
  }
`

const ExpiredRoundCard: React.FC<any> = ({
  betting,
  hasEnteredDown,
  isActive,
  allBettings,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  // const { epoch, lockPrice, closePrice } = round
  // const betPosition = getRoundPosition(lockPrice, closePrice)
  // const bufferSeconds = useGetBufferSeconds()
  // const hasRoundFailed = getHasRoundFailed(round.oracleCalled, round.closeTimestamp, bufferSeconds)

  // if (hasRoundFailed) {
  //   return <CanceledRoundCard round={round} />
  // }

  // if (!closePrice) {
  //   return <CalculatingCard round={round} hasEnteredDown={hasEnteredDown} hasEnteredUp={hasEnteredUp} />
  // }

  const cardProps = isActive
    ? {
        isActive,
      }
    : {
        borderBackground: getBorderBackground(theme, 'expired'),
      }

  return (
    <Box position="relative">
      <StyledExpiredRoundCard {...cardProps} style={{ cursor: "pointer" }}>
        <CardHeader
          status="expired"
          icon={<BlockIcon mr="4px" width="21px" color="textDisabled" />}
          title={t('Expired')}
          epoch={betting?.idx}
        />
        <CardBody p="16px" style={{ position: 'relative' }}>
          <RoundResult betting={betting} />
          <MultiplierArrow
            allBettings={allBettings}
            action={betting?.action}
            adminShare={betting?.adminShare}
            referrerShare={betting?.referrerShare}
            bettingId={betting?.bettingId}
            rewardsBreakdown={betting?.rewardsBreakdown}
          />
        </CardBody>
      </StyledExpiredRoundCard>
      <CollectWinningsOverlay epoch={betting?.idx} isBottom={hasEnteredDown} />
    </Box>
  )
}

export default ExpiredRoundCard
