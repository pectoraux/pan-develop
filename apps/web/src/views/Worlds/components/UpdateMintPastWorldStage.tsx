import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { DatePicker, DatePickerPortal } from 'views/Voting/components/DatePicker'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  state: any,
  handleChange?: (any) => void
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
        {t('World Address')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='world'
        value={state.world}
        placeholder={t('input world address')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Destination')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='toAddress'
        value={state.toAddress}
        placeholder={t('input destination')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Planet ID')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='planet'
        value={state.planet}
        placeholder={t('input planet id')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Start Date')}
        </Text>
        <DatePicker
          onChange={handleRawValueChange('startReceivable')}
          selected={state.startReceivable}
          placeholderText="YYYY/MM/DD"
        />
        <DatePickerPortal/>
      </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('First 4 Plus Codes')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='first4'
        value={state.first4}
        placeholder={t('input first 4 codes')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Last 4 Plus Codes')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='last4'
        value={state.last4}
        placeholder={t('input last 4 codes')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Plus Codes Extension')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='nfts'
        value={state.nfts}
        placeholder={t('input code extension')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('The will mint a past world for the specified contract. Please read the documentation for more information.')}
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
          {t('Mint Past World')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
