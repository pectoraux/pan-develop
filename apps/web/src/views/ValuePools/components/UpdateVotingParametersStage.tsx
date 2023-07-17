import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, ButtonMenuItem, ButtonMenu, Text, Button, Input, ErrorIcon } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import { useTranslation } from '@pancakeswap/localization'

import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  nftToSell?: any
  variant?: 'set' | 'adjust'
  currency?: any
  currentPrice?: string
  lowestPrice?: number
  state: any,
  account?: any,
  handleChange?: (any) => void
  handleChoiceChange?: (any) => void
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
        {t('Valuepool Address')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='vava'
        value={state.vava}
        placeholder={t('input valuepool address')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Period')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='period'
        value={state.period}
        placeholder={t('input period')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Product Id')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='item'
        value={state.item}
        placeholder={t('input product id')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Minimum Difference')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='minDifference'
        value={state.minDifference}
        placeholder={t('input minimum difference')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Collection ID')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='userTokenId'
        value={state.userTokenId}
        placeholder={t('input collection id of valuepool')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Minimum Lock Value')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='minimumLockValue'
        value={state.minimumLockValue}
        placeholder={t('input min. lock value')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Minimum Period')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='minPeriod'
        value={state.minPeriod}
        placeholder={t('input min. period')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Minimum Bounty Required')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='minBountyRequired'
        value={state.minBountyRequired}
        placeholder={t('input min. bounty required')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <StyledItemRow>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
            {t('Voting Option')}
          </Text>
          <ButtonMenu scale="xs" variant='subtle' activeIndex={state.votingPower} onItemClick={handleRawValueChange('votingPower')}>
            <ButtonMenuItem >{t("Percentile")}</ButtonMenuItem>
            <ButtonMenuItem >{t("Voting Power")}</ButtonMenuItem>
            <ButtonMenuItem >{t("Unique")}</ButtonMenuItem>
          </ButtonMenu> 
        </StyledItemRow>
      </GreyedOutContainer>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
      <Divider />
        <Text small color="textSubtle">
          {t('This update the voting parameters of the specified valuepool. Please read the documentation for more information on each parameter')}
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
          {t('Update')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
