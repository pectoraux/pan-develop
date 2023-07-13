import { Flex, Grid, Text, Button, Input, ErrorIcon, LinkExternal, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { NftToken } from 'state/cancan/types'
import { DatePicker, DatePickerPortal } from 'views/Voting/components/DatePicker'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { Divider, RoundedImage } from '../shared/styles'
import { GreyedOutContainer } from './styles'
import { OptionType } from './types'

interface TransferStageProps {
  nftToSell?: any
  lowestPrice: number
  state: any,
  handleRawValueChange?: any
  continueToNextStage: () => void
}

const DiscountsNCashbacks: React.FC<any> = ({
  nftToSell,
  state,
  collectionId,
  activeButtonIndex,
  setActiveButtonIndex,
  handleChange,
  handleRawValueChange,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const isInvalidField1 = false
  const isInvalidField2 = false
  const { discountStatus, discountStart, cashNotCredit, checkIdentityCode, cashbackStatus, cashbackStart, discountNumbers, discountCost, cashbackNumbers, cashbackCost, checkItemOnly } = state
  const chunks = nftToSell?.images && nftToSell?.images?.split(",")
  const thumbnail = chunks?.length > 0 && nftToSell?.images?.split(",")[0]

  const discountSection = 
      <>
      <GreyedOutContainer style={{ paddingTop:"50px" }}>
        <StyledItemRow>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
          {t('Status')}
        </Text>
        <ButtonMenu scale="xs" variant='subtle' activeIndex={discountStatus} onItemClick={handleRawValueChange('discountStatus')}>
          <ButtonMenuItem >{t('Pending')}</ButtonMenuItem>
          <ButtonMenuItem >{t('Open')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Close')}</ButtonMenuItem>
        </ButtonMenu>
      </StyledItemRow>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Start Date')}
        </Text>
        <DatePicker
          onChange={handleRawValueChange('discountStart')}
          selected={discountStart}
          placeholderText="YYYY/MM/DD"
        />
        <DatePickerPortal/>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Percent of discount for users based on their brackets (from numbers)')}
        </Text>
        <Input
          type="text"
          inputMode="decimal"
          pattern="^[0-9]+[.,]?[0-9]*$"
          scale="sm"
          name='discountNumbers'
          value={discountNumbers}
          placeholder='24642153,25642153,1000,20,100,1'
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Percent of discount for users based on their brackets (from cost)')}
      </Text>
      <Input
        type="text"
        inputMode="decimal"
        pattern="^[0-9]+[.,]?[0-9]*$"
        scale="sm"
        name='discountCost'
        value={discountCost}
        placeholder='24642153,25642153,1000,20,100,1'
        onChange={handleChange}
      />
    </GreyedOutContainer>
    </>
    

  const cashbackSection = <>
  <GreyedOutContainer style={{ paddingTop:"50px" }}>
    <StyledItemRow>
    <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
      {t('Status')}
    </Text>
    <ButtonMenu scale="xs" variant='subtle' activeIndex={cashbackStatus} onItemClick={handleRawValueChange('cashbackStatus')} >
    <ButtonMenuItem >{t('Pending')}</ButtonMenuItem>
    <ButtonMenuItem >{t('Open')}</ButtonMenuItem>
    <ButtonMenuItem>{t('Close')}</ButtonMenuItem>
  </ButtonMenu>
  </StyledItemRow>
  </GreyedOutContainer>
  <GreyedOutContainer>
    <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
      {t('Start Date')}
    </Text>
    <DatePicker
      name="cashbackStart"
      onChange={handleRawValueChange('cashbackStart')}
      selected={cashbackStart}
      placeholderText="YYYY/MM/DD"
    />
    <DatePickerPortal/>
  </GreyedOutContainer>
  <GreyedOutContainer>
    <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
      {t('Percent of cashback for users based on their brackets (from numbers)')}
    </Text>
    <Input
      type="text"
      inputMode="decimal"
      pattern="^[0-9]+[.,]?[0-9]*$"
      scale="sm"
      name='cashbackNumbers'
      value={cashbackNumbers}
      placeholder='24642153,25642153,1000,20,100,1'
      onChange={handleChange}
    />
  </GreyedOutContainer>
  <GreyedOutContainer>
  <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
    {t('Percent of cashback for users based on their brackets (from cost)')}
  </Text>
  <Input
    type="text"
    inputMode="decimal"
    pattern="^[0-9]+[.,]?[0-9]*$"
    scale="sm"
    name='cashbackCost'
    value={cashbackCost}
    placeholder='24642153,25642153,1000,20,100,1'
    onChange={handleChange}
  />
</GreyedOutContainer>
</>

  return (
    <>
      <Text fontSize="24px" bold px="16px" pt="16px">
        {t('Discounts & Cashbacks')}
      </Text>
      <Flex p="16px">
        <RoundedImage src={thumbnail} height={68} width={68} mr="8px" />
        <Grid flex="1" gridTemplateColumns="1fr 1fr" alignItems="center">
          <Text bold>{nftToSell?.tokenId}</Text>
          <Text fontSize="12px" color="textSubtle" textAlign="right">
            {`Collection #${collectionId}`}
          </Text>
        </Grid>
      </Flex>
      <ButtonMenu scale="sm" activeIndex={activeButtonIndex} onItemClick={setActiveButtonIndex}>
        <ButtonMenuItem >{t('Discounts')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Cashbacks')}</ButtonMenuItem>
      </ButtonMenu>
      {!activeButtonIndex ? discountSection : cashbackSection}
      <GreyedOutContainer>
      <Divider/>
        <StyledItemRow>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="13px" paddingRight="50px" bold>
          {t('Rewards in')}
        </Text>
        <ButtonMenu scale="sm" variant='subtle' activeIndex={cashNotCredit} onItemClick={handleRawValueChange('cashNotCredit')}>
        <ButtonMenuItem>{t('Credits')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Cash')}</ButtonMenuItem>
      </ButtonMenu>
      </StyledItemRow>
      </GreyedOutContainer>
      {!activeButtonIndex ?
      <GreyedOutContainer>
        <StyledItemRow>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="13px" paddingRight="50px" bold>
          {t('Check identity')}
        </Text>
        <ButtonMenu scale="sm" variant='subtle' activeIndex={checkIdentityCode} onItemClick={handleRawValueChange('checkIdentityCode')}>
        <ButtonMenuItem>{t('No')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
      </ButtonMenu>
      </StyledItemRow>
      </GreyedOutContainer>:null}
      <GreyedOutContainer>
        <StyledItemRow>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="13px" paddingRight="50px" bold>
          {t('Check Only Item')}
        </Text>
        <ButtonMenu scale="sm" variant='subtle' activeIndex={checkItemOnly} onItemClick={handleRawValueChange('checkItemOnly')}>
        <ButtonMenuItem>{t('No')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
      </ButtonMenu>
      </StyledItemRow>
      <Divider/>
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Text small color="textSubtle">
          {t('This action will create discounts on this product for users either based on number of purchases made or value of purchases starting from a specified date. Please read the documentation for more details.')}
        </Text>
      </Grid>
      <Flex flexDirection="column" alignItems="center" justifyContent="space-between" height="150px">
        <LinkExternal href=''>{t('Learn more about discounts & cashbacks')}</LinkExternal>
      </Flex>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
          disabled={isInvalidField1 || isInvalidField2 }
        >
          {t('Update')}
        </Button>
      </Flex>
    </>
  )
}

export default DiscountsNCashbacks
