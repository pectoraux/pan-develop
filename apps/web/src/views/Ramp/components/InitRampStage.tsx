import { useEffect, useRef, useState } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import { useTranslation } from '@pancakeswap/localization'

import { useWeb3React } from '@pancakeswap/wagmi'
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
        {t('Profile ID')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='profileId'
        value={state.profileId}
        placeholder={t('input profile id')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Application Link')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='applicationLink'
        value={state.applicationLink}
        placeholder={t('input application link')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Channels')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='channels'
          value={state.channels}
          placeholder={t('input comma separated channel names')}
        onChange={handleChange}
        />
      </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Publishable Keys')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='publishableKeys'
          value={state.publishableKeys}
          placeholder={t('input comma separated publishable keys')}
        onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Secret Keys')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='secretKeys'
          value={state.secretKeys}
          placeholder={t('input comma separated secret keys')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Client IDs')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='clientId'
          value={state.clientIds}
          placeholder={t('input comma separated client ids')}
          onChange={handleChange}
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
          placeholder={t('input ramp description')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Avatar')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='avatar'
          value={state.avatar}
          placeholder={t('input link to avatar')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('The will update parameters of the ramp. Please read the documentation for more information on each parameter')}
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
          {t('Update Info')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage