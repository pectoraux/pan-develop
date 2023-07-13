import { Button, Text, Flex, Box, Balance, Pool } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import getTimePeriods from 'utils/getTimePeriods'

import { ActionContainer, ActionTitles, ActionContent } from './styles'

const HarvestAction: React.FunctionComponent<any> = ({
  pool,
  currAccount
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  // const { days: daysReceivable, hours: hoursReceivable, minutes: minutesReceivable } = getTimePeriods(Number(currAccount?.periodReceivable ?? '0'))

  const actionTitle = (
    <>
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('Pool Uses')}{' '}
      </Text>
      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {pool?.symbol}
      </Text>
    </>
  )

  if (!account) {
    return (
      <ActionContainer>
        <ActionContent>
          <Button disabled>{t('History')}</Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>{actionTitle}</ActionTitles>
      <ActionContent>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={5} value={getBalanceNumber(currAccount?.amount, pool.decimals)} unit={` ${pool.symbol}`} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Amount Staked")}
            </Text>
          </Box>
        </Flex>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
