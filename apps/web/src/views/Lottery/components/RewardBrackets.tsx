import { useState, useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { Flex, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useTranslation } from '@pancakeswap/localization'
import { LotteryRound } from 'state/types'
import RewardBracketDetail from './RewardBracketDetail'

const Wrapper = styled(Flex)`
  width: 100%;
  flex-direction: column;
`

const RewardsInner = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);
  row-gap: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(4, 1fr);
  }
`

interface RewardMatchesProps {
  lotteryNodeData: LotteryRound
  isHistoricRound?: boolean
}

interface RewardsState {
  isLoading: boolean
  cakeToBurn: BigNumber
  rewardsLessTreasuryFee: BigNumber
  rewardsBreakdown: string[]
  countWinnersPerBracket: string[]
}

const RewardBrackets: React.FC<any> = ({
  lotteryNodeData,
  isHistoricRound,
  currentTokenId,
}) => {
  const { t } = useTranslation()
  // const [state, setState] = useState<RewardsState>({
  //   isLoading: true,
  //   cakeToBurn: BIG_ZERO,
  //   rewardsLessTreasuryFee: BIG_ZERO,
  //   rewardsBreakdown: null,
  //   countWinnersPerBracket: null,
  // })

  // useEffect(() => {
  //   if (lotteryNodeData) {
  //     const { treasuryFee, 
  //       // tokenData, 
  //       rewardsBreakdown, countWinnersPerBracket } = lotteryNodeData

  //     const feeAsPercentage = new BigNumber(treasuryFee).div(100)
  //     const cakeToBurn = feeAsPercentage.div(100).times(new BigNumber(currTokenData?.token?.amountCollected || 0))
  //     const amountLessTreasuryFee = new BigNumber(currTokenData?.token?.amountCollected || 0).minus(cakeToBurn)
  //     setState({
  //       isLoading: false,
  //       cakeToBurn,
  //       rewardsLessTreasuryFee: amountLessTreasuryFee,
  //       rewardsBreakdown,
  //       countWinnersPerBracket,
  //     })
  //   } else {
  //     setState({
  //       isLoading: true,
  //       cakeToBurn: BIG_ZERO,
  //       rewardsLessTreasuryFee: BIG_ZERO,
  //       rewardsBreakdown: null,
  //       countWinnersPerBracket: null,
  //     })
  //   }
  // }, [lotteryNodeData, currTokenData])

  const getCakeRewards = (bracket: number) => {
    const shareAsPercentage = new BigNumber(lotteryNodeData?.rewardsBreakdown[bracket])
    return new BigNumber(currTokenData?.amountCollected).div(100).times(shareAsPercentage)
  }

  // const { isLoading, countWinnersPerBracket, cakeToBurn } = state
  const currTokenData = useMemo(() => lotteryNodeData?.tokenData?.length 
  ? lotteryNodeData?.tokenData[parseInt(currentTokenId)] : {}, [lotteryNodeData, currentTokenId])

  const rewardBrackets = [0, 1, 2, 3, 4, 5]

  return (
    <Wrapper>
      <Text fontSize="14px" mb="24px">
        {t('Match the winning number in the same order to share prizes.')}{' '}
        {!isHistoricRound && t('Current prizes up for grabs:')}
      </Text>
      <RewardsInner>
        {rewardBrackets.map((bracketIndex) => (
          <RewardBracketDetail
            key={bracketIndex}
            rewardBracket={bracketIndex}
            currTokenData={currTokenData}
            cakeAmount={getCakeRewards(bracketIndex)}
            numberWinners={lotteryNodeData?.countWinnersPerBracket[bracketIndex]}
            isHistoricRound={isHistoricRound}
          />
        ))}
      </RewardsInner>
    </Wrapper>
  )
}

export default RewardBrackets
