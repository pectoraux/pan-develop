import { useWeb3React } from '@pancakeswap/wagmi'
import { useGetSubjects, useGetAmountCollected, useGetWinnersPerBracket } from 'state/bettings/hooks'
import { BetPosition, NodeRound } from 'state/types'
import { getMultiplierV2 } from '../../helpers'
import ExpiredRoundCard from './ExpiredRoundCard'
import LiveRoundCard from './LiveRoundCard'
import OpenRoundCard from './OpenRoundCard'
import SoonRoundCard from './SoonRoundCard'

interface RoundCardProps {
  round: NodeRound
  isActive?: boolean
  pos?: number
}

// eslint-disable-next-line consistent-return
const RoundCard: React.FC<any> = ({ betting, allBettings, isActive }) => {
  const chuncks = betting?.id?.split("_")
  const subjects = useGetSubjects(chuncks?.length && chuncks[0], betting?.bettingId, betting?.ticketSize)
  const amountCollected = useGetAmountCollected(chuncks?.length && chuncks[0], betting?.bettingId, betting?.currPeriod || 0)
  const countWinnersPerBracket = useGetWinnersPerBracket(chuncks?.length && chuncks[0], betting?.bettingId, betting?.idx || 0, betting?.ticketSize)
  console.log("RoundCard===========>", betting, subjects, amountCollected)
  
  // Next (open) round
  if (betting?.status === 'Next' && !allBettings) {
    return (
      <OpenRoundCard
        betting={{...betting, subjects, ...amountCollected, countWinnersPerBracket }}
        allBettings={allBettings}
      />
    )
  }

  // Live round
  if (betting?.status === 'Live') {
    return (
      <LiveRoundCard
        betting={{...betting, subjects, ...amountCollected, countWinnersPerBracket }}
        allBettings={allBettings}
      />
    )
  }

  if (!Number(betting?.finalNumber || 0)) {
    return (
      <SoonRoundCard
        betting={{...betting, subjects, ...amountCollected, countWinnersPerBracket }}
        allBettings={allBettings}
      />
    );
  }
  if (!allBettings) {
  // Past rounds
  return (
    <ExpiredRoundCard
      isActive={isActive}
      hasEnteredDown={false}
      betting={{...betting, subjects, ...amountCollected, countWinnersPerBracket }}
      allBettings={allBettings}
    />
  )
  }
}

export default RoundCard
