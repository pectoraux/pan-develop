import { useMemo } from 'react'
import styled, { DefaultTheme } from 'styled-components'
import { BigNumber } from '@ethersproject/bignumber'
import { Box, Flex, FlexProps, Skeleton, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { BetPosition, NodeRound, Round } from 'state/types'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { formatBnb, formatUsd } from '../History/helpers'
import PositionTag from '../PositionTag'

// PrizePoolRow
interface PrizePoolRowProps extends FlexProps {
  totalAmount: NodeRound['totalAmount']
}

// const getPrizePoolAmount = (totalAmount: PrizePoolRowProps['totalAmount'], displayedDecimals: number) => {
//   if (!totalAmount) {
//     return '0'
//   }

//   return formatBnbv2(totalAmount, displayedDecimals)
// }

const Row = ({ children, ...props }) => {
  return (
    <Flex alignItems="center" justifyContent="space-between" {...props}>
      {children}
    </Flex>
  )
}

export const PrizePoolRow: React.FC<any> = ({ betting, ...props }) => {
  const { t } = useTranslation()
  const totalAmount = getBalanceAmount(betting?.amountCollected || 0, betting?.token?.decimals ?? 18)
  return (
    <Row {...props}>
      <Text bold>{t('Prize Pool')}:</Text>
      <Text bold>{`${totalAmount}`}</Text>
      {betting?.token?.symbol?.toUpperCase() || ''}
    </Row>
  )
}

export const PrizePoolRow2: React.FC<any> = ({ betting, ...props }) => {
  const { t } = useTranslation()
  const totalAmount = getBalanceAmount(betting?.amountCollected?.amountCollected || 0, betting?.token?.decimals ?? 18)
  return (
    <Row {...props}>
      <Text bold>{t('Prize Pool')}:</Text>
      <Text bold>{`${totalAmount}`}</Text>
      {betting?.token?.symbol?.toUpperCase() || ''}
    </Row>
  )
}

// Payout Row
interface PayoutRowProps extends FlexProps {
  positionLabel: string
  multiplier: number
  amount: number
}

export const PayoutRow: React.FC<any> = ({
  positionLabel,
  multiplier,
  amount,
  ...props
}) => {
  const { t } = useTranslation()
  const formattedMultiplier = `${multiplier.toLocaleString(undefined, { maximumFractionDigits: 2 })}x`
  // const { token, displayedDecimals } = useConfig()

  return (
    <Row height="18px" {...props}>
      <Text fontSize="12px" textTransform="uppercase">
        {positionLabel}:
      </Text>
      <Flex alignItems="center">
        <Text fontSize="12px" lineHeight="18px" bold>
          {t('%multiplier% Payout', { multiplier: formattedMultiplier })}
        </Text>
        <Text mx="4px">|</Text>
        <Text fontSize="12px" lineHeight="18px">{`${formatBnb(amount, 18)}`} 
        {/* {token.symbol} */}
        </Text>
      </Flex>
    </Row>
  )
}

interface LockPriceRowProps extends FlexProps {
  lockPrice: NodeRound['lockPrice']
}

export const LockPriceRow: React.FC<any> = ({ countOfWinners, ...props }) => {
  const { t } = useTranslation()
  // const { displayedDecimals, minPriceUsdDisplayed } = useConfig()

  return (
    <Row {...props}>
      <Text fontSize="14px">#{t('Winner')}:</Text>
      <Text fontSize="14px">{countOfWinners}</Text>
    </Row>
  )
}

// RoundResultBox
interface RoundResultBoxProps {
  betPosition?: BetPosition
  isNext?: boolean
  isLive?: boolean
  hasEntered?: boolean
}

const getBackgroundColor = ({
  theme,
  betPosition,
  isNext,
  isLive,
  hasEntered,
}: RoundResultBoxProps & { theme: DefaultTheme }) => {
  if (isNext) {
    return 'linear-gradient(180deg, #53DEE9 0%, #7645D9 100%)'
  }

  if (hasEntered || isLive) {
    return theme.colors.secondary
  }

  switch (betPosition) {
    case BetPosition.BULL:
      return theme.colors.success
    case BetPosition.BEAR:
      return theme.colors.failure
    case BetPosition.HOUSE:
      return theme.colors.textDisabled
    default:
      return theme.colors.cardBorder
  }
}

const Background = styled(Box)<RoundResultBoxProps>`
  background: ${getBackgroundColor};
  border-radius: 16px;
  padding: 2px;
`

const StyledRoundResultBox = styled.div`
  background: ${({ theme }) => theme.card.background};
  border-radius: 14px;
  padding: 16px;
`

export const RoundResultBox: React.FC<any> = ({
  isNext = false,
  hasEntered = false,
  isLive = false,
  children,
  ...props
}) => {
  return (
    <Background isNext={isNext} hasEntered={hasEntered} isLive={isLive} {...props}>
      <StyledRoundResultBox>{children}</StyledRoundResultBox>
    </Background>
  )
}

interface RoundPriceProps {
  lockPrice: BigNumber
  closePrice: BigNumber
}

export const RoundPrice: React.FC<any> = ({ percentReward, option, countOfWinners }) => {
  // const { displayedDecimals, minPriceUsdDisplayed } = useConfig()
  const betPosition = BetPosition.BULL
  // const priceDifference = getPriceDifference(closePrice, lockPrice)

  const textColor = 'success'
  // useMemo(() => {
  //   switch (betPosition: any) {
  //     case 0:
  //       return 'success'
  //     case 1:
  //       return 'failure'
  //     case 2:
  //     default:
  //       return 'textDisabled'
  //   }
  // }, [betPosition])

  return (
    <Flex alignItems="center" justifyContent="space-between" mb="16px">
      {option ? (
        <Text color={textColor} bold fontSize="24px">
          {option}
        </Text>
      ) : (
        <Skeleton height="34px" my="1px" />
      )}
      <PositionTag ml="18px" betPosition={betPosition}>
        {percentReward}% {`(${countOfWinners})`}
      </PositionTag>
    </Flex>
  )
}

/**
 * TODO: Remove
 *
 * This is a temporary function until we consolidate the data coming from the graph versus the node
 */
interface PrizePoolHistoryRowProps extends FlexProps {
  totalAmount: number
}

const getPrizePoolAmountHistory = (totalAmount: PrizePoolHistoryRowProps['totalAmount'], displayedDecimals: number) => {
  if (!totalAmount) {
    return '0'
  }

  return formatBnb(totalAmount, displayedDecimals)
}

export const PrizePoolHistoryRow: React.FC<any> = ({
  totalAmount,
  ...props
}) => {
  const { t } = useTranslation()
  // const { token, displayedDecimals } = useConfig()

  return (
    <Row {...props}>
      <Text bold>{t('Prize Pool')}:</Text>
      <Text bold>{`${getPrizePoolAmountHistory(totalAmount, 18)}`} 
      {/* //{token.symbol} */}
      </Text>
    </Row>
  )
}

interface LockPriceHistoryRowProps extends FlexProps {
  lockPrice: Round['lockPrice']
}

export const LockPriceHistoryRow: React.FC<any> = ({
  lockPrice,
  ...props
}) => {
  const { t } = useTranslation()
  // const { displayedDecimals } = useConfig()

  return (
    <Row {...props}>
      <Text fontSize="14px">{t('Locked Price')}:</Text>
      <Text fontSize="14px">{formatUsd(lockPrice, 18)}</Text>
    </Row>
  )
}
/**
 * END TEMPORARY COMPONENTS
 */
