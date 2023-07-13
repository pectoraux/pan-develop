import { useEffect, useRef, useState } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { GreyedOutContainer, Divider } from './styles'
import Filters from './Filters'

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
  nftFilters, 
  setNewFilters,
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
        {t('WILL Description')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='willDescription'
        value={state.willDescription}
        placeholder={t('input will description')}
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
          {t('Avatar')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='avatar'
          value={state.avatar}
          placeholder={t('input avatar')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Contact Channels')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='contactChannels'
          value={state.contactChannels}
          placeholder={t('input comma seperated contact channels')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Contacts')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='contacts'
          value={state.contacts}
          placeholder={t('input comma seperated contacts')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <Filters nftFilters={nftFilters} setNewFilters={setNewFilters} country city product/>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('The will update information on your pool.')}
        </Text>
      </Box>
    </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
        >
          {t('Update Info')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
