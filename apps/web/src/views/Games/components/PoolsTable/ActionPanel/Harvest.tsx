import { Text, Flex, Box, Balance } from '@pancakeswap/uikit'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import getTimePeriods from 'utils/getTimePeriods'
import CopyAddress from 'components/Menu/UserMenu/CopyAddress2'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { AddressZero } from '@ethersproject/constants'
import { useGetGame } from 'state/games/hooks'

import { ActionContainer, ActionTitles, ActionContent } from './styles'

const HarvestAction: React.FunctionComponent<any> = ({ pool, currAccount }) => {
  const { t } = useTranslation()
  const { days, hours, minutes } = getTimePeriods(Number(currAccount?.deadline ?? '0'))
  const { days: daysReceivable, hours: hoursReceivable, minutes: minutesReceivable } = getTimePeriods(Number(currAccount?.gameMinutes ?? '0'))
  const gameData = useGetGame(pool?.collection?.name?.toLowerCase(), currAccount?.id ?? '0')
  console.log("gamepool1====>", gameData)

  const actionTitle = (
    <>
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('Game Uses')}{' '}
      </Text>
      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {pool?.token?.symbol?.toUpperCase() ?? ''}
      </Text>
    </>
  )

  return (
    <ActionContainer>
      <ActionTitles>{actionTitle}</ActionTitles>
      <ActionContent>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={18} value={getBalanceNumber(pool?.totalPaid, pool?.token?.decimals ?? 18)} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Total Paid")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={18} value={getBalanceNumber(pool?.pricePerMinutes, pool?.token?.decimals ?? 18)} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Price Per Paper Minutes")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={18} value={getBalanceNumber(pool?.totalEarned, pool?.token?.decimals ?? 18)} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Total Earnings")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={1} value={parseInt(pool?.teamShare) / 100} unit="%" />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Team Share")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={1} value={parseInt(pool?.creatorShare) / 100} unit="%" />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Creator Share")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={1} value={parseInt(pool?.referrerFee) / 100} unit="%" />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Referrer Fee")}
            </Text>
          </Box>
        <Box mr="8px" height="32px">
            {parseInt(currAccount?.id) ?
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={currAccount?.id} prefix='# '/>
            :<Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">N/A</Text>}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Attached veNFT Token Id")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {parseInt(currAccount?.score) ?
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={currAccount?.score}/>
            :<Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">N/A</Text>}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Score")}
            </Text>
          </Box>
          <CopyAddress title={truncateHash(currAccount?.receiver)} account={currAccount?.receiver} />
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t("Receiver")}
          </Text>
          </Flex>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <Box mr="8px" height="32px">
            {parseInt(currAccount?.scorePercentile) ?
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={currAccount?.scorePercentile}/>
            :<Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">N/A</Text>}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Score Percentile")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {parseInt(currAccount?.price) ?
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={18} value={getBalanceNumber(currAccount?.price, pool?.token?.decimals ?? 18)}/>
            :<Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">N/A</Text>}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Price")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {parseInt(currAccount?.pricePercentile) ?
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={currAccount?.pricePercentile}/>
            :<Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">N/A</Text>}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Price Percentile")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {parseInt(currAccount?.won) ?
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={18} value={getBalanceNumber(currAccount?.won, pool?.token?.decimals ?? 18)}/>
            :<Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">N/A</Text>}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Winnings")}
            </Text>
          </Box>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {daysReceivable}{' '}{t('days')}{' '}{hoursReceivable}{' '}{t('hours')}{' '}{minutesReceivable}{' '}{t('minutes')}
          </Text>
          <Text color="primary" mb="3px" fontSize="12px" bold as="span" textTransform="uppercase">
            {t("Time Purchased")}
          </Text>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {days}{' '}{t('days')}{' '}{hours}{' '}{t('hours')}{' '}{minutes}{' '}{t('minutes')}
          </Text>
          <Text color="primary" mb="3px" fontSize="12px" bold as="span" textTransform="uppercase">
            {t("Time Played")}
          </Text>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {currAccount?.objectNames?.length ? currAccount?.objectNames?.toString() : "N/A"}
          </Text>
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t("Object Names")}
          </Text>
          {currAccount && currAccount?.lender !== AddressZero ?
          <>
          <CopyAddress title={truncateHash(currAccount?.lender)} account={currAccount?.lender} />
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t("Lender")}
          </Text>
          </>:null}
          {gameData && Object.keys(gameData)?.map((elt) => 
            <>
              <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
                {gameData[elt]?.toString()}
              </Text>
              <Text color="primary"  mb="3px" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                {elt ?? ''}
              </Text>
            </>
          )}
        </Flex>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
