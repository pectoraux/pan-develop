import { format } from 'date-fns'
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
  const { account } = useWeb3React()
  const { days: daysReceivable, hours: hoursReceivable, minutes: minutesReceivable } = getTimePeriods(Number(currAccount?.periodReceivable ?? '0'))

  const actionTitle = (
    <>
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('World Protocol Uses')}{' '}
      </Text>
      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {currAccount?.token?.symbol}
      </Text>
    </>
  )

  if (!account) {
    return (
      <ActionContainer>
        <ActionContent>
          <Button disabled>{t('Please Connect Your Wallet')}</Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!currAccount) {
    return (
      <ActionContainer>
        <ActionContent>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Pick a protocol Id")}
          </Text>
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
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={currAccount?.token?.decimals ?? 18} value={getBalanceNumber(currAccount?.paidReceivable, currAccount?.token?.decimals ?? 18)}/>
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Paid Receivable")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={currAccount?.token?.decimals ?? 18} value={getBalanceNumber(currAccount?.amountReceivable, currAccount?.token?.decimals ?? 18)}/>
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Amount Receivable")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={currAccount?.token?.decimals ?? 18} value={getBalanceNumber(currAccount?.dueReceivable, currAccount?.token?.decimals ?? 18)}/>
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Due Receivable")}
            </Text>
          </Box>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {daysReceivable}{' '}{t('days')}{' '}{hoursReceivable}{' '}{t('hours')}{' '}{minutesReceivable}{' '}{t('minutes')}
          </Text>
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t("Period Receivable")}
          </Text>
          <Text lineHeight="1" mt="4px" fontSize="12px" color="textSubtle" as="span">
            {format(new Date(parseInt(currAccount?.startReceivable || 0) * 1000), 'yyyy-MM-dd HH:mm')}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Start Receivable")}
          </Text>
        </Flex>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
        <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {currAccount?.isAutoChargeable ? "Yes" : "No"}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("AutoCharge")}
          </Text>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={currAccount?.rating} prefix='# '/>
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Rating")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {parseInt(currAccount?.bountyId) ?
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={currAccount?.bountyId} prefix='# '/>
            :<Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">N/A</Text>}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Attached Bounty Id")}
            </Text>
          </Box>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {currAccount?.optionId ?? ''}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Option ID")}
          </Text>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {currAccount?.description ?? ''}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Description")}
          </Text>
        </Flex>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
