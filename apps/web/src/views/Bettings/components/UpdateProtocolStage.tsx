import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
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
        {t('Betting Event ID')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='bettingId'
        value={state.bettingId}
        placeholder={t('input betting event id')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Number of Periods')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='numberOfPeriods'
        value={state.numberOfPeriods}
        placeholder={t('input 0 for infinite periods')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Identity Token Id')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='identityTokenId'
        value={state.identityTokenId}
        placeholder={t('input an identity token id')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Price Per Ticket')}
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
        {t('Bracket Duration')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='periodReceivable'
        value={state.periodReceivable}
        placeholder={t('input bracket duration')}
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
      <Box>
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
      <StyledItemRow>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
          {t('Alphabet Encoding')}
        </Text>
        <ButtonMenu scale="xs" variant='subtle' activeIndex={state.alphabetEncoding ? 1 : 0} onItemClick={handleRawValueChange('alphabetEncoding')}>
          <ButtonMenuItem >{t("No")}</ButtonMenuItem>
          <ButtonMenuItem >{t("Yes")}</ButtonMenuItem>
        </ButtonMenu> 
      </StyledItemRow>
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Description')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='description'
        value={state.description}
        placeholder={t('input rating description')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Link to Attached Media')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='media'
        value={state.media}
        placeholder={t('input link to attached media')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('List subjects')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='subjects'
        value={state.subjects}
        placeholder={t('input comma separated list of subjects')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Action')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='action'
        value={state.action}
        placeholder={t('input action')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Rewards Breakdown')}(%)
      </Text>
      <Input
        type="text"
        scale="sm"
        name='rewardsBreakdown'
        value={state.rewardsBreakdown}
        placeholder={t('input rewards breakdown')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Admin Share')}(%)
      </Text>
      <Input
        type="text"
        scale="sm"
        name='adminShare'
        value={state.adminShare}
        placeholder={t('input admin share')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Referrer Share')}(%)
      </Text>
      <Input
        type="text"
        scale="sm"
        name='referrerShare'
        value={state.referrerShare}
        placeholder={t('input referrer share')}
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
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('The will create a new account or update parameters of an old one. Please read the documentation for more information on each parameter')}
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
          {t('Create or Update Account')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
