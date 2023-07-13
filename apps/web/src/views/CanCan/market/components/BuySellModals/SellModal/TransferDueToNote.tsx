import { useState } from 'react'
import { Flex, Box, Text, Button } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Currency } from "@pancakeswap/sdk"
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import _toNumber from 'lodash/toNumber'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { DatePicker, DatePickerPortal } from 'views/Voting/components/DatePicker'
import { GreyedOutContainer } from './styles'
import { Divider } from '../shared/styles'

interface RemoveStageProps {
  state: any
  handleRawValueChange?: any
  continueToNextStage: () => void
}

const TransferDueToNote: React.FC<any> = ({ 
  state, 
  handleRawValueChange,
  continueToNextStage 
}) => {
  const { t } = useTranslation()
  const [lockedAmount, setLockedAmount] = useState('')
  const stakingTokenBalance = BIG_ZERO
  const usdValueStaked = useBUSDCakeAmount(_toNumber(lockedAmount))

  return (
    <>
      <Box p="16px" maxWidth="360px">
        <Text fontSize="24px" bold>
          {t('Transfer Due To Note')}
        </Text>
        <GreyedOutContainer>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('From Date')}
          </Text>
          <DatePicker
            name="start"
            onChange={handleRawValueChange('start')}
            selected={state.start}
            placeholderText="YYYY/MM/DD"
          />
          <DatePickerPortal/>
        </GreyedOutContainer>
        <GreyedOutContainer>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('To Date')}
          </Text>
          <DatePicker
            name="end"
            onChange={handleRawValueChange('end')}
            selected={state.end}
            placeholderText="YYYY/MM/DD"
          />
          <DatePickerPortal/>
        </GreyedOutContainer>
        <Text mt="16px" color="textSubtle">
          {t('Continue?')}
        </Text>
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Confirm')}
        </Button>
      </Flex>
    </>
  )
}

export default TransferDueToNote
