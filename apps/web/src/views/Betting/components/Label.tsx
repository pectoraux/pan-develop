import { Box, CoinSwitcher, Flex, PocketWatchIcon, Text, CloseIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
// import { BETTING_TOOLTIP_DISMISS_KEY } from 'config/constants'
import styled, { keyframes, useTheme } from 'styled-components'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { formatRoundTime } from '../helpers'
import useCountdown from '../hooks/useCountdown'
import LabelPrice from './LabelPrice'

const Token = styled(Box)`
  margin-top: -24px;
  position: absolute;
  top: 50%;
  z-index: 30;

  & > svg {
    height: 48px;
    width: 48px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-top: -32px;

    & > svg {
      height: 64px;
      width: 64px;
    }
  }
`

const Title = styled(Text)`
  font-size: 16px;
  line-height: 21px;

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 20px;
    line-height: 22px;
  }
`

const ClosingTitle = styled(Text)`
  font-size: 9px;
  line-height: 21px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 20px;
    line-height: 22px;
  }
`

const Interval = styled(Text)`
  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: center;
    width: 32px;
  }
`

const tooltipAnimation = keyframes`
  0%{
    opacity:0;
  }
  20%{
    opacity:1;
  }
  30%{
    transform: translateX(5px);
  }
  40%{
    transform: translateX(0px);
  }
  50%{
    transform: translateX(5px);
  }
  60%{
    transform: translateX(5px);
  }
  100%{
    opacity:1;
  }
`

export const Tooltip = styled.div`
  position: absolute;
  top: -5px;
  left: 55px;
  border-radius: 16px;
  padding: 16px;
  background: ${({ theme }) => theme.tooltip.background};
  box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
  white-space: nowrap;
  opacity: 0;
  z-index: 100;
  animation: ${tooltipAnimation} 3s forwards ease-in-out;
  ${Text},svg {
    color: ${({ theme }) => theme.tooltip.text};
  }
  ${({ theme }) => theme.mediaQueries.md} {
    top: -10px;
    left: 81px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 21px;
    left: -6px;
    width: 15px;
    height: 15px;
    border-radius: 3px;
    background: ${({ theme }) => theme.tooltip.background};
    transform: rotate(45deg);
  }
`

const Label = styled(Flex)<{ dir: 'left' | 'right'; backgroundOpacity?: boolean }>`
  position: relative;
  z-index: 1;
  background-color: ${({ theme }) => theme.card.background};
  box-shadow: ${({ theme }) => theme.shadows.level1};
  align-items: ${({ dir }) => (dir === 'right' ? 'flex-end' : 'flex-start')};
  border-radius: ${({ dir }) => (dir === 'right' ? '8px 8px 8px 24px' : '8px 8px 24px 8px')};
  flex-direction: column;
  overflow: initial;
  padding: ${({ dir }) => (dir === 'right' ? '0 28px 0 8px' : '0 8px 0 24px')};

  ${({ theme }) => theme.mediaQueries.lg} {
    background-color: ${({ theme, backgroundOpacity }) => (backgroundOpacity ? 'transparent' : theme.card.background)};
    align-items: center;
    border-radius: ${({ theme }) => theme.radii.card};
    flex-direction: row;
    padding: ${({ dir }) => (dir === 'right' ? '8px 40px 8px 8px' : '8px 8px 8px 40px')};
    transition: 0.3s background-color ease-in-out;
    will-change: background-color;
  }
`

export const PricePairLabel: React.FC<any> = ({ allBettings, ogBetting }) => {
  const router = useRouter()
  const { t } = useTranslation()
  const { bettingId } = router.query
  const bettingEvent = ogBetting?.bettingEvents?.find((be) => Number(be.bettingId) === Number(bettingId || 1))

  return (
    <>
      <Box pl={['20px', '20px', '20px', '20px', '40px']} position="relative" display="inline-block">
        <Label dir="left" backgroundOpacity={false}>
          <Title bold textTransform="uppercase">
            {allBettings ? t("All Bettings") : t("Betting #%val%", { val: (bettingId ?? '')?.toString() })}
          </Title>
          <LabelPrice 
            allBettings={allBettings} 
            count={ogBetting?.bettingEvents?.length} 
            price={bettingEvent?.pricePerTicket || 0} 
            decimals={bettingEvent?.token?.decimals || 18} 
            symbol={bettingEvent?.token?.symbol?.toUpperCase() || ''} 
          />
        </Label>
      </Box>
    </>
  )
}

interface TimerLabelProps {
  interval: string
  unit: 'm' | 'h' | 'd'
}

export const TimerLabel: React.FC<any> = ({ interval, unit }) => {
  const { t } = useTranslation()

  return (
    <Box pr="24px" position="relative">
      <Label dir="right">
        <ClosingTitle bold color="secondary">
          {t('Closing')}
        </ClosingTitle>
        <Interval fontSize="12px">{`${interval}${t(unit)}`}</Interval>
      </Label>
      <Token right={0}>
        <PocketWatchIcon />
      </Token>
    </Box>
  )
}
