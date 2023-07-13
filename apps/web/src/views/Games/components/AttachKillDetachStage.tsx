import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, ButtonMenu, ButtonMenuItem, Button, Input, ErrorIcon } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'

import { DatePicker, DatePickerPortal } from 'views/Voting/components/DatePicker'
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
        <StyledItemRow>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="13px" paddingRight="50px" bold>
          {t('Action')}
        </Text>
        <ButtonMenu scale="sm" variant='subtle' activeIndex={state.action} onItemClick={handleRawValueChange('action')}>
        <ButtonMenuItem>{t('Attach')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Kill Timer')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Detach')}</ButtonMenuItem>
      </ButtonMenu>
      </StyledItemRow>
      <Divider/>
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Token ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='tokenId'
          value={state.tokenId}
          placeholder={t('input gaming ticket id')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    {!state.action ? 
    <>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('End Date')}
      </Text>
      <DatePicker
        onChange={handleRawValueChange('period')}
        selected={state.period}
        placeholderText="YYYY/MM/DD"
      />
      <DatePickerPortal/>
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Attach To')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='toAddress'
        value={state.toAddress}
        placeholder={t('input recipient of attachment')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
      </>:null}
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="500px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('The will attach, kill the timer or detach the specified token id. Please read the documentation for more details.')}
        </Text>
      </Box>
    </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
        >
          {t('%val%', { val: !state.action ? 'Attach' : state.action === 1 ? 'Kill Timer' : 'Detach' })}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
