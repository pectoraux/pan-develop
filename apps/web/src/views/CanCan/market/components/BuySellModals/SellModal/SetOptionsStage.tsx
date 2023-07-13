import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button,ErrorIcon } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import { useTranslation } from '@pancakeswap/localization'
import { NftToken } from 'state/cancan/types'
import Options from './Options'
import { OptionType } from './types'
import { Divider, RoundedImage } from '../shared/styles'
import { GreyedOutContainer } from './styles'

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
  state,
  addValue,
  collectionId,
  handleChoiceChange,
  continueToNextStage,
}) => {
  console.log("SetPriceStage====================>", nftToSell)
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { options } = state
  const chunks = nftToSell?.images && nftToSell?.images?.split(",")
  const thumbnail = chunks?.length > 0 && nftToSell?.images?.split(",")[0]

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

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
          {t('Add or remove options')}
        </Text>
        <Options id='options' addValue={addValue} name='options' choices={options || []} onChange={handleChoiceChange} />
      </GreyedOutContainer>
           <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t('This will update options associated with this item. Please read the documentation for more details')}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
        >
          {t('Update Options')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
