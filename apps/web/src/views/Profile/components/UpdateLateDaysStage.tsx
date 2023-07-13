import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Filters from 'views/CanCan/market/components/BuySellModals/SellModal/Filters'
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
  nftFilters,
  setNftFilters,
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
    <Flex alignSelf='center' mt={20}>
      <Filters
        nftFilters={nftFilters} 
        setNftFilters={setNftFilters}
        showCountry={false}
        showCity={false}
        showProduct={false}
      />
    </Flex>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Helper Address')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='helper'
        value={state.helper}
        placeholder={t('input helper contract address')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('ARP Address')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='arp'
          value={state.arp}
          placeholder={t('input arp contract address')}
        onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Protocol Owner')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='owner'
          value={state.owner}
          placeholder={t('input profile address in arp')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('veNFT Token ID')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='tokenId'
        value={state.tokenId}
        placeholder={t('input veNFT token id')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Your Profile ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='profileId'
          value={state.profileId}
          placeholder={t('input your profile id')}
        onChange={handleChange}
        />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('The will update the late days of this profile. Please read the documentation for more information on each parameter')}
        </Text>
      </Box>
    </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
        >
          {t('Update Late Days')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
