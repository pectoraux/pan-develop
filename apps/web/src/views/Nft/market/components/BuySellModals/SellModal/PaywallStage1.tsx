import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { EnlistFormState } from './types'
import { Divider } from '../shared/styles'
import { GreyedOutContainer } from './styles'

interface SetPriceStageProps {
  state: EnlistFormState
  handleChange: (any) => void
  continueToNextStage: () => void
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const PaywallStage: React.FC<SetPriceStageProps> = ({
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
      <Text fontSize="24px" bold p="16px">
        {t('Create Paywall')}
      </Text>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Paywall ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="tokenId"
          value={state.tokenId}
          placeholder={t('input paywall id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t('This will create a Paywall with the specified ID behind which you can post content only available to subscribers.')}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
          disabled={false}
        >
          {t('Create Subscription ARP')}
        </Button>
      </Flex>
    </>
  )
}

export default PaywallStage
