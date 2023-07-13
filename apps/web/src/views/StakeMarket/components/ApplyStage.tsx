import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
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
const CreateBountyStage: React.FC<any> = ({
  state,
  handleChange,
  handleRawValueChange,
  continueToNextStage
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
          {t('Amount Payable')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='amountPayable'
          value={state.amountPayable}
          placeholder={t('input amount payable')}
        onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Amount Receivable')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='amountReceivable'
          value={state.amountReceivable}
          placeholder={t('input amount receivable')}
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
          {t('Period Receivable')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='periodReceivable'
          value={state.periodReceivable}
          placeholder={t('input period receivable')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Waiting Period')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='waitingPeriod'
          value={state.waitingPeriod}
          placeholder={t('input waiting period')}
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
          placeholder={t('input identity token id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Deadline')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='deadline'
          value={state.deadline}
          placeholder={t('input deadline')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Start Payable')}
      </Text>
      <DatePicker
        selected={state.startPayable}
        placeholderText="YYYY/MM/DD"
        onChange={handleRawValueChange('startPayable')}
      />
      <DatePickerPortal/>
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Start Receivable')}
      </Text>
      <DatePicker
        selected={state.startReceivable}
        placeholderText="YYYY/MM/DD"
        onChange={handleRawValueChange('startReceivable')}
      />
      <DatePickerPortal/>
    </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t('The will create an application to the current stake. Please read the documentation to learn more about the stake market.')}
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
          {t('Apply')}
        </Button>
      </Flex>
    </>
  )
}

export default CreateBountyStage
