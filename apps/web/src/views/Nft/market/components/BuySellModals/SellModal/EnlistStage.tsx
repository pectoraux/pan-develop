import { useEffect, useRef, useState, useCallback } from 'react'
import { Flex, Grid, Box, Text, Slider, Button, ButtonMenuItem, ButtonMenu, Input, ErrorIcon, useTooltip } from '@pancakeswap/uikit'
import RichTextEditor from 'components/RichText';
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
  updateValue,
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

  const [value, onChange] = useState('');
  const [activeButtonIndex, setActiveButtonIndex] = useState<any>(0)
  const handleImageUpload = useCallback(
    (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('image', file);
        fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            resolve(result.data.url)
            updateValue('img', result.data.url)
          })
          .catch(() => reject(new Error('Upload failed')));
      }),
    []
  );

  return (
    <>
      <Text fontSize="24px" bold p="16px">
        {t('Create Listing')}
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
          {t('Product name')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="tokenId"
          value={state.tokenId}
          placeholder={t('input product name')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingRight="5px" paddingTop="10px" bold>
          {t('Use Custom Minter')}
        </Text>
        <ButtonMenu 
          scale="sm" 
          variant='subtle' 
          activeIndex={state.customMinter} 
          onItemClick={handleRawValueChange('customMinter')}
        >
        <ButtonMenuItem>{t('No')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
      </ButtonMenu>
      </StyledItemRow>
      </GreyedOutContainer>
      {state.customMinter ? 
      <>
        <GreyedOutContainer>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Minter Address')}
          </Text>
          <Input
            type="text"
            scale="sm"
            name="minter"
            value={state.minter}
            placeholder={t('input minter address')}
            onChange={handleChange}
          />
        </GreyedOutContainer>
        <GreyedOutContainer>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Token Id (optional)')}
          </Text>
          <Input
            type="text"
            scale="sm"
            name="nftTokenId"
            value={state.nftTokenId}
            placeholder={t('input token id')}
            onChange={handleChange}
          />
        </GreyedOutContainer>
      </>:
      <>
      <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('eCollectible Name')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name="name"
        value={state.name}
        placeholder={t('input nft name')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('eCollectible Symbol')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name="symbol"
        value={state.symbol}
        placeholder={t('input nft symbol')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('eCollectible Image')}
        </Text>
        <StyledItemRow>
          <ButtonMenu scale="xs" variant='subtle' activeIndex={activeButtonIndex} onItemClick={setActiveButtonIndex}>
            <ButtonMenuItem >{t('Upload')}</ButtonMenuItem>
            <ButtonMenuItem >{t('Link')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
      {activeButtonIndex ?
      <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Link to eCollectible Image')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name="img"
        value={state.img}
        placeholder={t('input link to eCollectible img')}
        onChange={handleChange}
      />
    </GreyedOutContainer>:
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Upload eCollectible Image')}
        </Text>
        <RichTextEditor
          id="img"
          value={value}
          controls={[['image']]}
          onChange={onChange}
          onImageUpload={handleImageUpload}
        />
    </GreyedOutContainer>}</>}
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
        <Options name='options' choices={state.options} onChange={handleChoiceChange} />
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
          placeholder={t('input item price')}
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
            {t('This will list the collectible in the marketplace for users to buy.')}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
          disabled={!state.usetFIAT}
        >
          {t('Create Listing')}
        </Button>
      </Flex>
    </>
  )
}

export default EnlistStage
