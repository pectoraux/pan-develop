import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, ButtonMenuItem, ButtonMenu, Input, ErrorIcon } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import { useTranslation } from '@pancakeswap/localization'

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
        {t('Minimum Lock Value')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='minLockValue'
        value={state.minLockValue}
        placeholder={t('input minimum lock value')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
      <Divider />
        <Text small color="textSubtle">
          {t('This the minimum to lock to vote on proposals from the specified valuepool. Please read the documentation for more information on each parameter')}
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
