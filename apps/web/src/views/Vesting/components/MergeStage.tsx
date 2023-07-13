import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, ErrorIcon } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'
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
  pool,
  handleChange,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const balances = pool?.userData?.nfts || []

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <>
    <GreyedOutContainer>
      <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
        {t('Pick first token to merge')}
      </Text>
      <Flex flexWrap="wrap" justifyContent="center" alignItems="center">
        {balances?.filter((balance) => balance.id !== state.tokenId2)
        .map((balance) => (
          <Button
            key={balance.id}
            name='tokenId'
            value={balance.id}
            onClick={handleChange}
            mt="4px"
            mr={['2px', '2px', '4px', '4px']}
            scale="sm"
            variant={state.tokenId === balance.id ? 'subtle' : 'tertiary'}
          >
            {balance.id}
          </Button>
          ))}
      </Flex>
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
        {t('Pick second token to merge')}
      </Text>
      <Flex flexWrap="wrap" justifyContent="center" alignItems="center">
        {balances?.filter((balance) => balance.id !== state.tokenId)
        .map((balance) => (
          <Button
            key={balance.id}
            name='tokenId2'
            value={balance.id}
            onClick={handleChange}
            mt="4px"
            mr={['2px', '2px', '4px', '4px']}
            scale="sm"
            variant={state.tokenId2 === balance.id ? 'subtle' : 'tertiary'}
          >
            {balance.id}
          </Button>
          ))}
      </Flex>
    </GreyedOutContainer>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('The will merge 2 of your vaNFT tokens into a single one. Please read the documentation for more details.')}
        </Text>
      </Box>
    </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
        >
          {t('Merge')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
