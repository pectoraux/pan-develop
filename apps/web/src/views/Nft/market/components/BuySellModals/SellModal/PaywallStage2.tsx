import { useEffect, useRef, useState } from 'react'
import { Flex, Grid, Box, Text, Slider, Button, ButtonMenuItem, ButtonMenu, Input, ErrorIcon, useTooltip } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { DatePicker, DatePickerPortal } from 'views/Voting/components/DatePicker'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import Options from './Options'
import { EnlistFormState } from './types'
import { Divider } from '../shared/styles'
import { GreyedOutContainer } from './styles'
import Filters from './Filters'

interface SetPriceStageProps {
  state: EnlistFormState
  handleChange: (any) => void
  handleChoiceChange: () => void
  handleRawValueChange?: any
  continueToNextStage: () => void
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const EnlistStage: React.FC<any> = ({
  state,
  nftFilters, 
  setNftFilters,
  handleChange,
  handleChoiceChange,
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

  const [activeButtonIndex, setActiveButtonIndex] = useState<any>(0)

  return (
    <>
      <Text fontSize="24px" bold p="16px">
        {t('Create Paywall')}
      </Text>
        <Flex alignSelf='center'>
          <Filters 
            nftFilters={nftFilters} 
            setNftFilters={setNftFilters}
            showCountry={false}
            showCity={false}
            showProduct={false}
          />
        </Flex>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Paywall name')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="tokenId"
          value={state.tokenId}
          placeholder={t('input paywall name')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Pick drop-in date')}
        </Text>
        <DatePicker
          onChange={handleRawValueChange('dropinDate')}
          selected={state.dropinDate}
          placeholderText="YYYY/MM/DD"
        />
        <DatePickerPortal/>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Maximum Supply')}
        </Text>
        <Input
          type="number"
          scale="sm"
          name='maxSupply'
          value={state.maxSupply}
          placeholder={t('input maximum supply')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Bid Duration (in minutes)')}
        </Text>
        <Input
          type="number"
          scale="sm"
          name="bidDuration"
          value={state.bidDuration}
          placeholder={t('input bid duration')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Min Bid Increment Percentage')}
        </Text>
        <Slider
          min={0}
          max={100}
          value={!state.minBidIncrementPercentage? 0 : state.minBidIncrementPercentage}
          name="minBidIncrementPercentage"
          onValueChanged={handleRawValueChange('minBidIncrementPercentage')}
          valueLabel={`${state.minBidIncrementPercentage}%`}
          step={1}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Auditor Badge Id')}
        </Text>
        <Input
          type="number"
          scale="sm"
          name='rsrcTokenId'
          value={state.rsrcTokenId}
          placeholder={t('input auditor badge id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Add or remove options')}
        </Text>
        <Options name='options' addValue choices={state.options} onChange={handleChoiceChange} />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingRight="5px" paddingTop="10px" bold>
          {t('Make NFTickets Transferrable')}
        </Text>
        <ButtonMenu 
          scale="sm" 
          variant='subtle' 
          activeIndex={state.transferrable} 
          onItemClick={handleRawValueChange('transferrable')}
        >
        <ButtonMenuItem>{t('No')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
      </ButtonMenu>
      </StyledItemRow>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingRight="5px" paddingTop="10px" bold>
          {t('Require Upfront Payment')}
        </Text>
        <ButtonMenu 
          scale="sm" 
          variant='subtle'
          activeIndex={state.requireUpfrontPayment} 
          onItemClick={handleRawValueChange('requireUpfrontPayment')}
        >
        <ButtonMenuItem>{t('No')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
      </ButtonMenu>
      </StyledItemRow>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Asking Price')}
        </Text>
        <Input
          type="number"
          scale="sm"
          name='currentAskPrice'
          value={state.currentAskPrice}
          placeholder={t('input paywall base price')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
            {t('Did you pick a tFIAT token ?')}
          </Text>
          <ButtonMenu scale="xs" variant='subtle' activeIndex={state.usetFIAT} onItemClick={handleRawValueChange('usetFIAT')}>
            <ButtonMenuItem >{t("No")}</ButtonMenuItem>
            <ButtonMenuItem >{t("Yes")}</ButtonMenuItem>
          </ButtonMenu> 
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t('This will create a paywall behind which you can add products later. Read the documentation for more details.')}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
          disabled={false}
        >
          {t('Create Paywall')}
        </Button>
      </Flex>
    </>
  )
}

export default EnlistStage
