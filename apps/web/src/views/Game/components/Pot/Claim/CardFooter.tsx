import { useMemo } from 'react'
import styled from 'styled-components'
import { Flex, Box, Text, Balance } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import { weeksToSeconds } from 'views/Pools/components/utils/formatSecondsToWeeks'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { distanceToNowStrictWithUnit } from 'utils/timeHelper'
import { DeserializedPublicData, DeserializedPotteryUserData, PotteryDepositStatus } from 'state/types'

const Container = styled(Flex)`
  flex-direction: column;
  padding: 16px 24px;
  background: ${({ theme }) => theme.colors.gradientCardHeader};
`

interface CardFooterProps {
  account: string
  publicData: DeserializedPublicData
  userData: DeserializedPotteryUserData
}

const CardFooter: React.FC<any> = ({ account, data, publicData, userData }) => {
  const { t } = useTranslation()
  const symb = ` ${data?.token?.symbol?.toUpperCase() ?? '$'}`
  const boostFactorDisplay = useMemo(() => `X${Number(data?.numPlayers ?? 0).toFixed(2)}`, [data])

  return (
    <Container>
      <Flex justifyContent="space-between">
        <Box>
          <Text fontSize="12px" color="textSubtle" textTransform="uppercase" bold as="span">
            {t('Number')}
          </Text>
          <Text fontSize="12px" ml="4px" color="secondary" textTransform="uppercase" bold as="span">
            {t('of Players')}
          </Text>
        </Box>
        <Text bold>{account ? boostFactorDisplay : '-'}</Text>
      </Flex>
      {/* {publicData.getStatus !== PotteryDepositStatus.BEFORE_LOCK && (
        <Box>
          <Flex justifyContent="space-between">
            <Box>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold as="span">
                {t('Deposit')}
              </Text>
              <Text fontSize="12px" ml="4px" color="textSubtle" textTransform="uppercase" bold as="span">
                {t('by cohort')}
              </Text>
            </Box>
            <Box>
              {account ? (
                <Flex>
                  <Balance bold decimals={2} value={totalValueLocked} />
                  <Text ml="4px" color="textSubtle" as="span">
                    CAKE
                  </Text>
                </Flex>
              ) : (
                <Text bold as="span">
                  -
                </Text>
              )}
            </Box>
          </Flex>
          <Flex justifyContent="space-between">
            <Box>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold as="span">
                {t('remaining')}
              </Text>
              <Text fontSize="12px" ml="4px" color="textSubtle" textTransform="uppercase" bold as="span">
                {t('period')}
              </Text>
            </Box>
            <Box>
              {account ? (
                <>
                  <Text bold>{distanceToNowStrictWithUnit(daysRemaining, 'day')}</Text>
                </>
              ) : (
                <Text bold as="span">
                  -
                </Text>
              )}
            </Box>
          </Flex>
        </Box>
      )} */}
      <Flex justifyContent="space-between">
        <Box>
          <Text fontSize="12px" color="textSubtle" textTransform="uppercase" bold as="span">
            {t('total #')}
          </Text>
          <Text fontSize="12px" ml="4px" color="secondary" textTransform="uppercase" bold as="span">
            {t('winnings')}
          </Text>
        </Box>
        <Text bold>{account && data?.totalEarned? data?.totalEarned : '-'}</Text>
        <Text>{symb}</Text>
      </Flex>
    </Container>
  )
}

export default CardFooter
