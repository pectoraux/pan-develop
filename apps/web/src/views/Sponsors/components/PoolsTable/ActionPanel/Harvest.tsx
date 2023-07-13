import { format } from 'date-fns'
import { convertTimeToSeconds } from 'utils/timeHelper'
import { Button, Text, Flex, Box, Balance, Pool } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import getTimePeriods from 'utils/getTimePeriods'

import { ActionContainer, ActionTitles, ActionContent } from './styles'

const HarvestAction: React.FunctionComponent<any> = ({
  currAccount,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { days: daysPayable, hours: hoursPayable, minutes: minutesPayable } = getTimePeriods(Number(currAccount?.periodPayable ?? '0'))

  const actionTitle = (
    <>
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('Protocol Uses')}{' '}
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
            {t("Pick a protocol id to display its data")}
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
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={currAccount?.token?.decimals ?? 18} value={getBalanceNumber(currAccount?.paidPayable, currAccount?.token?.decimals)} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Paid Payable")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={currAccount?.token?.decimals ?? 18} value={getBalanceNumber(currAccount?.duePayable, currAccount?.token?.decimals)} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Due Payable")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={currAccount?.token?.decimals ?? 18} value={getBalanceNumber(currAccount?.amountPayable, currAccount?.token?.decimals)} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Amount Payable")}
            </Text>
          </Box>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {daysPayable}{' '}{t('days')}{' '}{hoursPayable}{' '}{t('hours')}{' '}{minutesPayable}{' '}{t('minutes')}
          </Text>
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t("Period Payable")}
          </Text>
          <Text lineHeight="1" mt="4px" fontSize="12px" color="textSubtle" as="span">
            {format(convertTimeToSeconds(currAccount?.startPayable ?? 0), 'yyyy-MM-dd HH:mm')}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Start Payable")}
          </Text>
        </Flex>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
        <Box mr="8px" height="32px">
            {parseInt(currAccount?.adminBountyId) ?
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={currAccount?.adminBountyId} prefix='# '/>
            :<Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">N/A</Text>}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Admin Bounty Id")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {parseInt(currAccount?.tokenId) ?
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={currAccount?.tokenId} prefix='# '/>
            :<Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">N/A</Text>}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Attached veNFT Token Id")}
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
          <Text lineHeight="1" mt="2px" fontSize="12px" color="textSubtle" as="span">
            {currAccount?.description ?? ''}
          </Text>
          <Text color="primary" mt="2px" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Description")}
          </Text>
        </Flex>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
