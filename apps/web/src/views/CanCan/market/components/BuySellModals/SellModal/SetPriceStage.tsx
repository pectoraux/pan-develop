import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Slider, Button, ButtonMenuItem, ButtonMenu, Input, ErrorIcon, Skeleton } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import multiplyPriceByAmount from '@pancakeswap/utils/multiplyPriceByAmount'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { useTranslation } from '@pancakeswap/localization'
import { NftToken } from 'state/cancan/types'
import { CurrencyLogo } from 'components/Logo'
import { DatePicker, DatePickerPortal } from 'views/Voting/components/DatePicker'
import { StyledItemRow } from 'views/CanCan/market/components/Filters/ListFilter/styles'
import { OptionType } from './types'
import { Divider, RoundedImage } from '../shared/styles'
import { GreyedOutContainer, RightAlignedInput, FeeAmountCell } from './styles'

interface SetPriceStageProps {
  nftToSell?: any
  variant?: 'set' | 'adjust'
  currency?: any
  currentPrice?: string
  state: any,
  handleChange: (any) => void
  handleChoiceChange: () => void
  handleRawValueChange?: any
  continueToNextStage: () => void
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const SetPriceStage: React.FC<any> = ({
  nftToSell,
  variant,
  currency,
  collectionId,
  currentPrice,
  state,
  handleChange,
  handleChoiceChange,
  handleRawValueChange,
  continueToNextStage,
}) => {
  console.log("SetPriceStage====================>", nftToSell)
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { 
    price, 
    bidDuration, 
    minBidIncrementPercentage, 
    transferrable, 
    requireUpfrontPayment,
    rsrcTokenId, 
    maxSupply, 
    dropinTimer,
    options
  } = state
  const adjustedPriceIsTheSame = variant === 'adjust' && parseFloat(currentPrice) === parseFloat(price)
  const priceAsFloat = parseFloat(price)
  const priceIsValid = !price || Number.isNaN(priceAsFloat) || priceAsFloat <= 0
  const tradingFee =  (priceAsFloat / 100)?.toString()
  const tradingFeeAsNumber = parseFloat(tradingFee)
  const bnbPrice = useBNBBusdPrice()
  const priceInUsd = multiplyPriceByAmount(bnbPrice, priceAsFloat)
  const chunks = nftToSell?.images && nftToSell?.images?.split(",")
  const thumbnail = chunks?.length > 0 && nftToSell?.images?.split(",")[0]

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const getButtonText = () => {
    if (variant === 'adjust') {
      if (adjustedPriceIsTheSame || priceIsValid) {
        return t('Input New Sale Price')
      }
      return t('Adjust')
    }
    return t('Enable Listing')
  }

  return (
    <>
      <Text fontSize="24px" bold p="16px">
        {t('Adjust Sale Price')}
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
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Adjust Price')}
        </Text>
        <Flex>
          <Flex flex="1" alignItems="center">
            <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
            <Text bold>{currency?.symbol}</Text>
          </Flex>
          <Flex flex="2">
            <RightAlignedInput
              scale="sm"
              type="number"
              inputMode="decimal"
              id="price" 
              name="price"
              value={price}
              ref={inputRef}
              onChange={handleChange}
            />
          </Flex>
        </Flex>
        <Flex alignItems="center" height="21px" justifyContent="flex-end">
          {!Number.isNaN(priceInUsd) && (
            <Text fontSize="12px" color="textSubtle">
              {`$${priceInUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </Text>
          )}
        </Flex>
        <Flex mt="8px">
          {Number.isFinite(tradingFeeAsNumber) ? (
            <Text small color="textSubtle" mr="8px">
              {t('Seller pays %percentage%% platform fee on sale', {
                percentage: tradingFeeAsNumber,
              })}
            </Text>
          ) : (
            <Skeleton width="70%" />
          )}
        </Flex>
        <Flex justifyContent="space-between" alignItems="center" mt="16px">
          <Text small color="textSubtle">
            {t('Platform fee if sold')}
          </Text>
          {Number.isFinite(tradingFeeAsNumber) ? (
            <FeeAmountCell bnbAmount={tradingFeeAsNumber} currency={currency} tradingFee={1} />
          ) : (
            <Skeleton width={40} />
          )}
        </Flex>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Bid Duration (in minutes)')}
        </Text>
        <Input
          type="number"
          scale="sm"
          id="bidDuration"
          name="bidDuration"
          value={bidDuration || 0}
          placeholder='25'
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
          value={minBidIncrementPercentage ?? 0}
          id="minBidIncrementPercentage"
          name="minBidIncrementPercentage"
          onValueChanged={handleRawValueChange('minBidIncrementPercentage')}
          valueLabel={`${minBidIncrementPercentage ?? 0}%`}
          step={1}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingRight="5px" bold>
          {t('Make NFTickets Transferrable')}
        </Text>
        <ButtonMenu 
          scale="sm" 
          variant='subtle' 
          activeIndex={transferrable ? 1 : 0} 
          onItemClick={handleRawValueChange('transferrable')}
        >
        <ButtonMenuItem>{t('No')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
      </ButtonMenu>
      </StyledItemRow>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingRight="5px" bold>
          {t('Require Upfront Payment For Staking')}
        </Text>
        <ButtonMenu 
          scale="sm" 
          variant='subtle' 
          activeIndex={requireUpfrontPayment ? 1 : 0} 
          onItemClick={handleRawValueChange('requireUpfrontPayment')}
        >
        <ButtonMenuItem>{t('No')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
      </ButtonMenu>
      </StyledItemRow>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Auditor Badge Id')}
        </Text>
        <Input
          type="number"
          scale="sm"
          id='rsrcTokenId'
          name='rsrcTokenId'
          value={rsrcTokenId ?? 0}
          placeholder={t('input badge id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Pick drop-in date')}
        </Text>
        <DatePicker
          onChange={handleRawValueChange('dropinTimer')}
          selected={dropinTimer ?? 0}
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
          id='maxSupply'
          name='maxSupply'
          value={maxSupply}
          placeholder={t('input max supply')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      {/* <GreyedOutContainer>
      {Object.keys(state.behindPaywall).map((pAddr) => 
        <Input
        type="text"
        scale="sm"
        name='paywalls'
        value={pAddr}
        // onChange={handleChange}
      />
      )}
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Paywall addresses')}
        </Text>
        <Input
        type="text"
        scale="sm"
        name='paywall_list'
        // value={blacklist_accounts}
        placeholder={t('comma seperated paywall addresses')}
        // onChange={handleRawValueChange('blacklist_accounts')}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
            {t('Action on listed paywalls')}
          </Text>
          <ButtonMenu scale="xs" variant='subtle' activeIndex={activeButtonIndex} onItemClick={setActiveButtonIndex}>
            <ButtonMenuItem >{t("Add")}</ButtonMenuItem>
            <ButtonMenuItem >{t("Remove")}</ButtonMenuItem>
          </ButtonMenu> 
    </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Add Paywall')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='addPaywall'
          value={addPaywall}
          placeholder={t('address of paywall to add')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Remove Paywall')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='removePaywall'
          value={removePaywall}
          placeholder={t('address of paywall to remove')}
          onChange={handleChange}
        />
      </GreyedOutContainer> */}
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t('This will update the price of the item along with other parameters.')}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
        >
          {getButtonText()}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
