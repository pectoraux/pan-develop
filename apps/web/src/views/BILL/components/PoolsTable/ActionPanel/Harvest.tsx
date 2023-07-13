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
  const { days: daysPayable, hours: hoursPayable, minutes: minutesPayable } = getTimePeriods(Number(currAccount?.periodPayable ?? '0'))
  const { days: daysReceivable, hours: hoursReceivable, minutes: minutesReceivable } = getTimePeriods(Number(currAccount?.periodReceivable ?? '0'))

  const actionTitle = (
    <>
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('BILL Uses')}{' '}
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

  return (
    <ActionContainer>
      <ActionTitles>{actionTitle}</ActionTitles>
      <ActionContent>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={5} value={getBalanceNumber(currAccount?.paidReceivable, currAccount?.token?.decimals)} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Due Receivable")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={5} value={getBalanceNumber(currAccount?.amountPayable, currAccount?.token?.decimals)} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Due Payable")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={5} value={getBalanceNumber(currAccount?.credit, currAccount?.token?.decimals)} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Credit")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={5} value={getBalanceNumber(currAccount?.debit, currAccount?.token?.decimals)} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Debit")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={currAccount?.creditFactor} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Credit Factor")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={currAccount?.debitFactor} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Debit Factor")}
            </Text>
          </Box>
          <Text lineHeight="1" mt="2px" fontSize="12px" color="textSubtle" as="span">
            {daysReceivable}{' '}{t('days')}{' '}{hoursReceivable}{' '}{t('hours')}{' '}{minutesReceivable}{' '}{t('minutes')}
          </Text>
          <Text color="primary" mt="2px" fontSize="12px" bold as="span" textTransform="uppercase">
            {t("Period Receivable")}
          </Text>
        </Flex>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
        <Text lineHeight="1" mt="2px" fontSize="12px" color="textSubtle" as="span">
            {daysPayable}{' '}{t('days')}{' '}{hoursPayable}{' '}{t('hours')}{' '}{minutesPayable}{' '}{t('minutes')}
          </Text>
          <Text color="primary" mt="2px" fontSize="12px" bold as="span" textTransform="uppercase">
            {t("Period Payable")}
          </Text>
        <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={5} value={getBalanceNumber(pool?.bountyRequired, currAccount?.token?.decimals)} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Minimum Bounty Required")}
            </Text>
          </Box>
        <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {currAccount?.isAutoChargeable ? "Yes" : "No"}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("AutoCharge")}
          </Text>
        <Box mr="8px" height="32px">
            {parseInt(currAccount?.adminBountyId) ?
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={currAccount?.adminBountyId} prefix='# '/>
            :<Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">N/A</Text>}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Admin Bounty Id")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {parseInt(currAccount?.profileId) ?
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={currAccount?.profileId} prefix='# '/>
            :<Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">N/A</Text>}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Attached Profile Id")}
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
            {currAccount?.version ?? ''}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Version")}
          </Text>
        </Flex>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
