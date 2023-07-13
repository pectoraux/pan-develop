import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, ButtonMenuItem, ButtonMenu, Input, ErrorIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { DatePicker, DatePickerPortal, TimePicker } from 'views/Voting/components/DatePicker'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  state: any,
  handleChange?: (any) => void
  handleRawValueChange?: any
  continueToNextStage?: () => void
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const SetPriceStage: React.FC<any> = ({
  state,
  handleChange,
  handleRawValueChange,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Valuepool address')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='valuepool'
        value={state.valuepool}
        placeholder={t('input valuepool address')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Ending Amount')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='endAmount'
        value={state.endAmount}
        placeholder={t('input an ending amount')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Amount Receivable')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='amountReceivable'
        value={state.amountReceivable}
        placeholder={t('input an amount receivable')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Lock Duration')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='lockDuration'
        value={state.lockDuration}
        placeholder={t('input lock duration')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Start Date')}
        </Text>
        <DatePicker
          onChange={handleRawValueChange('startReceivable')}
          selected={state.startReceivable}
          placeholderText="YYYY/MM/DD"
        />
        <DatePickerPortal/>
      </GreyedOutContainer>
      <GreyedOutContainer>
      <Box mb="24px">
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Start Time')}
        </Text>
          <TimePicker
            name="startTime"
            onChange={handleRawValueChange('startTime')}
            selected={state.startTime}
            placeholderText="00:00"
          />
        </Box>  
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('End Date')}
        </Text>
        <DatePicker
          onChange={handleRawValueChange('endReceivable')}
          selected={state.startReceivable}
          placeholderText="YYYY/MM/DD"
        />
        <DatePickerPortal/>
      </GreyedOutContainer>
    <GreyedOutContainer>
      <Box mb="24px">
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('End Time')}
        </Text>
          <TimePicker
            name="endTime"
            onChange={handleRawValueChange('endTime')}
            selected={state.endTime}
            placeholderText="00:00"
          />
        </Box>  
    </GreyedOutContainer>
    <GreyedOutContainer>
        <StyledItemRow>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
            {t('Use NFTicket')}
          </Text>
          <ButtonMenu scale="xs" variant='subtle' activeIndex={state.useNFTicket} onItemClick={handleRawValueChange('useNFTicket')}>
            <ButtonMenuItem >{t("No")}</ButtonMenuItem>
            <ButtonMenuItem >{t("Yes")}</ButtonMenuItem>
          </ButtonMenu> 
        </StyledItemRow>
    </GreyedOutContainer>
      <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Treasury Fee')}(%)
      </Text>
      <Input
        type="text"
        scale="sm"
        name='treasuryFee'
        value={state.treasuryFee}
        placeholder={t('input your treasury fee')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Referrer Fee')}(%)
      </Text>
      <Input
        type="text"
        scale="sm"
        name='referrerFee'
        value={state.referrerFee}
        placeholder={t('input your referrer fee')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Discount Divisor')}(%)
      </Text>
      <Input
        type="text"
        scale="sm"
        name='discountDivisor'
        value={state.discountDivisor}
        placeholder={t('input discount divisor')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Rewards Breakdown')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='rewardsBreakdown'
        value={state.rewardsBreakdown}
        placeholder='50,25,10,5,5,5,0'
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('The will start a new lottery with you as its admin. Please read the documentation for more information on each parameter')}
        </Text>
      </Box>
    </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
          // disabled={priceIsValid || adjustedPriceIsTheSame || priceIsOutOfRange}
        >
          {t('Start Lottery')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
