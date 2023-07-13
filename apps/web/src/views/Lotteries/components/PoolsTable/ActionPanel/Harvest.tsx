import { Button, Text, Flex, Box, Balance, Pool } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import getTimePeriods from 'utils/getTimePeriods'

import { ActionContainer, ActionTitles, ActionContent } from './styles'

const HarvestAction: React.FunctionComponent<any> = ({
  pool,
  currAccount,
}) => {
  const { t } = useTranslation()
  const { days: daysReceivable, hours: hoursReceivable, minutes: minutesReceivable } = getTimePeriods(Number(pool?.lockDuration ?? '0'))

  const actionTitle = (
    <>
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('Lottery Uses')}{' '}
      </Text>
      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {currAccount?.token?.symbol ?? t('No Tokens Yet')}
      </Text>
    </>
  )

  return (
    <ActionContainer>
      <ActionTitles>{actionTitle}</ActionTitles>
      <ActionContent>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
        <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {t(pool?.status ?? '')}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Status")}
          </Text>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={5} value={getBalanceNumber(pool?.priceTicket || 0, currAccount?.token?.decimals ?? 18)} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Price Per Ticket")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={1} value={parseInt(pool?.discountDivisor) / 100} unit="%" />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Discount Divisor")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={1} value={parseInt(currAccount?.treasuryFee) / 100} unit="%" />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Admin Share")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={1} value={parseInt(currAccount?.referrerFee) / 100} unit="%" />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Referrer Share")}
            </Text>
          </Box>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {pool?.useNFTicket ? 'True' : 'False'}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Use NFTickets")}
          </Text>
        </Flex>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={pool?.tokenData?.length} prefix="#" />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Number of Tokens")}
            </Text>
          </Box>
          {parseInt(pool?.lockDuration) ?
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {daysReceivable}{' '}{t('days')}{' '}{hoursReceivable}{' '}{t('hours')}{' '}{minutesReceivable}{' '}{t('minutes')}
          </Text>:<Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">N/A</Text>}
            <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t("Lock Duration")}
          </Text>
          <Box mr="8px" height="32px">
            {parseInt(pool?.finalNumber) ?
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={pool?.finalNumber} prefix='# '/>
            :<Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">N/A</Text>}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Winning Ticket")}
            </Text>
          </Box>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {pool?.rewardsBreakdown?.length ? pool?.rewardsBreakdown.map((rwb) => `${rwb}%, `) : 'N/A'}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Rewards BreakDown")}
          </Text>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {pool?.countWinnersPerBracket?.length ? pool?.countWinnersPerBracket.map((cwb) => `${cwb}, `) : 'N/A'}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Count Of Winners Per Bracket")}
          </Text>
        </Flex>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
