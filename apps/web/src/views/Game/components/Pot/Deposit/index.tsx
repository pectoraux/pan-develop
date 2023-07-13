import styled from 'styled-components'
import { useState, useMemo } from 'react'
import { Flex, Box, Text, useTooltip, Balance } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { GreyCard } from 'components/Card'
import { LockTimer } from 'views/Game/components/Timer'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { usePotteryData } from 'state/pottery/hook'
import getTimePeriods from 'utils/getTimePeriods'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { PotteryDepositStatus } from 'state/types'
import { remainTimeToNextFriday } from 'views/Game/helpers'
import { useWeb3React } from '@pancakeswap/wagmi'
import YourDeposit from '../YourDeposit'
import WinRate from '../WinRate'
import DepositAction from './DepositAction'

const Container = styled(Flex)`
  flex-direction: column;
  padding: 16px 24px;
  border-bottom: solid 1px ${({ theme }) => theme.colors.cardBorder};
`

const CardAction = styled(Flex)`
  flex-direction: column;
  padding: 26px 24px 36px 24px;
`

const Deposit: React.FC<any> = ({ tokenId, setTokenId }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { data } = usePotteryData()
  const symb = ` ${data?.token?.symbol?.toUpperCase() ?? '$'}`

  // const { targetRef, tooltip, tooltipVisible } = useTooltip(t('Pottery draws on each Friday at 12 PM UTC!'), {
  //   placement: 'bottom-start',
  // })

  // const { days, hours, minutes } = getTimePeriods(secondsRemaining)

  const tokenData = useMemo(() => {
    return data?.accounts?.find((protocol) => protocol.id === tokenId)
  }, [
    data, 
    tokenId
  ])
  const { days, hours, minutes } = getTimePeriods(Number(tokenData?.deadline ?? '0'))
  const { days: daysReceivable, hours: hoursReceivable, minutes: minutesReceivable } = getTimePeriods(Number(tokenData?.gameMinutes ?? '0'))
  
  return (
    <Box>
      <Container>
        <GreyCard mb="18px">
          <Flex justifyContent="space-between">
            <YourDeposit tokenId={tokenId} setTokenId={setTokenId} />
            <WinRate />
          </Flex>
        </GreyCard>
        {/* {getStatus !== PotteryDepositStatus.BEFORE_LOCK && (
          <Flex justifyContent="space-between">
            <Text color="textSubtle">{t('Next draw date')}</Text>
            {tooltipVisible && tooltip}
            <TooltipText ref={targetRef}>
              <Text bold as="span">
                {t('in')}
              </Text>
              {days ? <Text bold as="span" ml="2px">{`${days}${t('d')}`}</Text> : null}
              {hours ? <Text bold as="span" ml="2px">{`${hours}${t('h')}`}</Text> : null}
              {minutes ? <Text bold as="span" ml="2px">{`${minutes}${t('m')}`}</Text> : null}
            </TooltipText>
          </Flex>
        )} */}
        <Flex justifyContent="space-between">
          <Text color="textSubtle">{t('Total Spent')}</Text>
          <Balance bold decimals={2} value={getBalanceNumber(tokenData?.price ?? 0, tokenData?.token?.decimals ?? 18)} unit={symb} />
        </Flex>
        <Flex justifyContent="space-between">
          <Text color="textSubtle">{t('Score')}</Text>
          <Balance bold decimals={2} value={tokenData?.score || 0} />
        </Flex>
        <Flex justifyContent="space-between">
          <Text color="textSubtle">{t('Minutes Purchased')}</Text>
          <Text bold color="textSubtle">
            {daysReceivable}{' '}{t('days')}{' '}{hoursReceivable}{' '}{t('hours')}{' '}{minutesReceivable}{' '}{t('minutes')}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text color="textSubtle">{t('Minutes Played')}</Text>
          <Text bold color="textSubtle">
            {days}{' '}{t('days')}{' '}{hours}{' '}{t('hours')}{' '}{minutes}{' '}{t('minutes')}
          </Text>
        </Flex>
      </Container>
      <CardAction>
        {account ? <DepositAction tokenId={tokenId} gameData={data} tokenData={tokenData} /> : <ConnectWalletButton />}
      </CardAction>
    </Box>
  )
}

export default Deposit
