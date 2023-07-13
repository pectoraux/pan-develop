import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon, useTooltip } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import _toNumber from 'lodash/toNumber'

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

  const { tooltip, tooltipVisible, targetRef } = useTooltip(
    <>
      <Text>
        {t(
          'When selling NFTs from this collection, a portion of the BNB paid will be diverted before reaching the seller:',
        )}
      </Text>
      {/* {creatorFeeAsNumber > 0 && (
        <Text>{t('%percentage%% royalties to the collection owner', { percentage: creatorFee })}</Text>
      )}
      <Text>{t('%percentage%% trading fee will be used to buy & burn CAKE', { percentage: tradingFee })}</Text> */}
    </>,
    { placement: 'auto' },
  )

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Token ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='tokenId'
          value={state.tokenId}
          placeholder={t('input token id')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('The will withdraw revenues currently due to this token from sponsors\' fund. Please read the documentation for more details.')}
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
          {t('Claim Pending Revenue')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
