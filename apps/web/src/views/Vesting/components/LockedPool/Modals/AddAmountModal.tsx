import { useState, useCallback } from 'react'
import { differenceInSeconds } from 'date-fns'
import { convertTimeToSeconds } from 'utils/timeHelper'
import { Button, Box, MessageText, Message, Checkbox, Flex, Text, Skeleton } from '@pancakeswap/uikit'
import _noop from 'lodash/noop'
import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import { getBalanceNumber, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { ONE_WEEK_DEFAULT } from 'config/constants/pools'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useAppDispatch } from 'state'
import { setCurrPoolData } from 'state/valuepools'
import { useCurrPool } from 'state/valuepools/hooks'

import BalanceField from '../Common/BalanceField'
import LockedBodyModal from '../Common/LockedModalBody'
import Overview from '../Common/Overview'
import { AddAmountModalProps } from '../types'

const RenewDuration = ({ setCheckedState, checkedState }) => {
  const { t } = useTranslation()

  return (
    <>
      <Flex alignItems="center" maxWidth="420px">
      {!checkedState && (
        <Message variant="warning" mb="16px">
          <MessageText>
            {t(
              'Adding more token will renew your lock, setting it to remaining duration. Due to shorter lock period, benefits decrease. To keep similar benefits, extend your lock.',
            )}
          </MessageText>
        </Message>
      )}
      </Flex>
      <Flex alignItems="center">
        <Checkbox checked={checkedState} onChange={() => setCheckedState((prev) => !prev)} scale="sm" />
        <Text ml="8px" color="text">
          {t('Renew and extend your lock to keep similar benefits.')}
        </Text>
      </Flex>
    </>
  )
}
// add 60s buffer in order to make sure minium duration by pass on renew extension
const MIN_DURATION_BUFFER = 60

const AddAmountModal: React.FC<any> = ({
  pool,
  onDismiss,
  currentBalance,
  currentLockedAmount,
  stakingToken,
  lockEndTime,
  stakingTokenBalance,
}) => {
  const ceiling = new BigNumber(1460).toJSON()
  const [lockedAmount, setLockedAmount] = useState('')
  const dispatch = useAppDispatch()
  const currState = useCurrPool()
  const [checkedState, setCheckedState] = useState(false)
  const { t } = useTranslation() 
  const { tokenAddress, userData } = pool
  const lockedAmountAsBigNumber = !Number.isNaN(new BigNumber(lockedAmount).toNumber())
    ? new BigNumber(lockedAmount)
    : BIG_ZERO
  const totalLockedAmount: number = getBalanceNumber(
    currentLockedAmount.plus(getDecimalAmount(lockedAmountAsBigNumber)),
  )
  const usdValueStaked = useBUSDCakeAmount(lockedAmountAsBigNumber.toNumber())
  const usdValueNewStaked = useBUSDCakeAmount(totalLockedAmount)
  const remainingDuration = differenceInSeconds(new Date(convertTimeToSeconds(lockEndTime)), new Date(), {
    roundingMethod: 'ceil',
  })

  // if you locked for 1 week, then add cake without renew the extension, it's possible that remainingDuration + passedDuration less than 1 week.
  const atLeastOneWeekNewDuration = Math.max(ONE_WEEK_DEFAULT + MIN_DURATION_BUFFER, remainingDuration)
  const prepConfirmArg = useCallback(() => {
    const extendDuration = atLeastOneWeekNewDuration - remainingDuration
    return {
      finalDuration: checkedState ? extendDuration : 0,
      methodName: 'increase_amount',
      checkedState
    }
  }, [atLeastOneWeekNewDuration, checkedState, remainingDuration])

  const customOverview = useCallback(
    ({ duration }) => (
      <Overview
        isValidDuration
        openCalculator={_noop}
        stakingToken={stakingToken}
        duration={remainingDuration}
        newDuration={checkedState ? duration : null}
        lockedAmount={currentLockedAmount.toNumber()}
        newLockedAmount={totalLockedAmount}
        usdValueStaked={usdValueNewStaked}
        lockEndTime={lockEndTime}
        ceiling={ceiling}
      />
    ),
    [
      stakingToken,
      remainingDuration,
      checkedState,
      currentLockedAmount,
      // atLeastOneWeekNewDuration,
      totalLockedAmount,
      usdValueNewStaked,
      lockEndTime,
      ceiling,
    ],
  )

  return (
    <>
      <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
        {t('Pick a token ID')}
      </Text>
      <Flex flexWrap="wrap" justifyContent="center" alignItems="center">
      {userData.nfts?.length ? 
        userData.nfts.map((balance) => (
        <Button
          key={balance.id}
          onClick={() => {
            const newState = { ...currState, [pool?.valuepoolAddress]: balance.id}
            dispatch(setCurrPoolData(newState))
          }}
          mt="4px"
          mr={['2px', '2px', '4px', '4px']}
          scale="sm"
          variant={currState[pool?.valuepoolAddress] === balance.id ? 'subtle' : 'tertiary'}
        >
          {balance.id}
        </Button>
        )): <Skeleton width={180} height="32px" mb="2px" />}
        </Flex>
        <Box mb="16px">
          <BalanceField
            stakingAddress={stakingToken.address}
            stakingSymbol={stakingToken.symbol}
            stakingDecimals={stakingToken.decimals}
            lockedAmount={lockedAmount}
            usedValueStaked={usdValueStaked}
            stakingMax={currentBalance}
            setLockedAmount={setLockedAmount}
            stakingTokenBalance={stakingTokenBalance}
          />
        </Box>
        <LockedBodyModal
          pool={pool}
          currentBalance={currentBalance}
          stakingToken={stakingToken}
          onDismiss={onDismiss}
          lockedAmount={lockedAmountAsBigNumber}
          editAmountOnly={<RenewDuration checkedState={checkedState} setCheckedState={setCheckedState} />}
          checkedState={checkedState}
          prepConfirmArg={prepConfirmArg}
          customOverview={customOverview}
        />
    </>
  )
}

export default AddAmountModal
