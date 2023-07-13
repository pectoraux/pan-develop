import { useMemo } from 'react'
import { Box, Text, Flex, MessageText, Message } from '@pancakeswap/uikit'

import { LightGreyCard } from 'components/Card'
import { addSeconds } from 'date-fns'
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'
import { convertTimeToSeconds } from 'utils/timeHelper'
import formatSecondsToWeeks from '../../../utils/formatSecondsToWeeks'
import TextRow from './TextRow'
import BalanceRow from './BalanceRow'
import DateRow from './DateRow'
import formatiCake from '../../utils/formatICake'
import { OverviewPropsType } from '../../types'

const Overview: React.FC<any> = ({
  stakingToken,
  usdValueStaked,
  lockedAmount,
  duration,
  isValidDuration,
  newDuration,
  newLockedAmount,
  lockStartTime,
  lockEndTime,
  showLockWarning,
}) => {
  const { t } = useTranslation()
  const now = new Date()

  const unlockDate = Number(lockEndTime)
  ? new Date(convertTimeToSeconds(lockEndTime))
  : addSeconds(now, duration)

  const formattediCake = useMemo(() => {
    return formatiCake({ lockedAmount, duration })
  }, [lockedAmount, duration])
  console.log("formattediCake==============>", formattediCake, lockedAmount)
  const newFormattediCake = useMemo(() => {
    const amount = Number(newLockedAmount) ? newLockedAmount : lockedAmount
    const lockDuration = Number(newDuration) ? newDuration : duration

    return formatiCake({ lockedAmount: amount, duration: lockDuration })
  }, [lockedAmount, newLockedAmount, duration, newDuration])

  return (
    <>
      <Box>
        <Flex mb="4px">
          <Text fontSize="12px" color="secondary" bold mr="2px" textTransform="uppercase">
            {t('Lock')}
          </Text>
          <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
            {t('Overview')}
          </Text>
        </Flex>
        <LightGreyCard>
          <BalanceRow title={t('%symbol% to be locked', { symbol: stakingToken?.symbol })} value={lockedAmount} newValue={newLockedAmount} decimals={2} />
          <BalanceRow title={`ve${stakingToken?.symbol}`} decimals={2} value={formattediCake} newValue={newFormattediCake} />
          <TextRow
            title={t('duration')}
            value={isValidDuration && formatSecondsToWeeks(duration)}
            newValue={isValidDuration && newDuration && formatSecondsToWeeks(newDuration)}
          />
          {isValidDuration ? 
          <DateRow
            color={_toNumber(newDuration) ? 'failure' : 'text'}
            title={t('Unlocks on')}
            value={isValidDuration && unlockDate}
          />:null}
        </LightGreyCard>
      </Box>
      {showLockWarning && (
        <Box mt="16px" maxWidth="370px">
          <Message variant="warning">
            <MessageText>
              {t('You will be able to withdraw the staked CAKE and profit only when the staking position is unlocked')}
            </MessageText>
          </Message>
        </Box>
      )}
    </>
  )
}

export default Overview
