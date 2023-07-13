import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { DatePicker, DatePickerPortal, TimePicker } from 'views/Voting/components/DatePicker'
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
  console.log("state.startPayable======================>", state.startPayable)
  return (
    <>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Account owner')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='owner'
        value={state.owner}
        placeholder={t('input account owner address')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Identity Token Id')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='identityTokenId'
        value={state.identityTokenId}
        placeholder={t('input an identity token id')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Amount Payable')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='amountPayable'
        value={state.amountPayable}
        placeholder={t('input an amount payable')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Period Payable')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='periodPayable'
        value={state.periodPayable}
        placeholder={t('input period payable')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Start Date')}
        </Text>
        <DatePicker
          onChange={handleRawValueChange('startPayable')}
          selected={state.startPayable}
          placeholderText="YYYY/MM/DD"
        />
        <DatePickerPortal/>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Start Time')}
        </Text>
        <TimePicker
          name="startTime"
          onChange={handleRawValueChange('startTime')}
          selected={state.startTime}
          placeholderText="00:00"
        />
      </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Description')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='description'
        value={state.description}
        placeholder={t('input account description')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Link to Attached Media')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='media'
        value={state.media}
        placeholder={t('input link to attached media')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('The will create a new account or update parameters of an old one. Please read the documentation for more information on each parameter')}
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
          {t('Create Account')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
