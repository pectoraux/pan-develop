import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, ErrorIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'
import { DatePicker, DatePickerPortal } from 'views/Voting/components/DatePicker'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  handleChange?: (any) => void
  handleChoiceChange?: (any) => void
  handleRawValueChange?: any
  continueToNextStage?: () => void
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const SetPriceStage: React.FC<any> = ({
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
    {/* <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Start Date')}
      </Text>
      <DatePicker
        onChange={handleRawValueChange('discountStart')}
        selected={discountStart}
        placeholderText="YYYY/MM/DD"
      />
      <DatePickerPortal/>
    </GreyedOutContainer> */}
    {/* <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('End Date')}
      </Text>
      <DatePicker
        onChange={handleRawValueChange('discountStart')}
        selected={discountStart}
        placeholderText="YYYY/MM/DD"
      />
      <DatePickerPortal/> */}
    {/* </GreyedOutContainer> */}
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('The will mint a transfer note on your future payments. Anyone in possession of the note will be able to access the payments from the specified date. Please read the documentation for more details.')}
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
          {t('Mint')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
