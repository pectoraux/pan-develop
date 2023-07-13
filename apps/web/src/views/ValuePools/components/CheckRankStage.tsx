import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, ButtonMenuItem, ButtonMenu, Input, ErrorIcon } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import { useTranslation } from '@pancakeswap/localization'

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
        {t('Valuepool Address')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='vava'
        value={state.vava}
        placeholder={t('input valuepool address')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Collection Address')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='collectionAddress'
        value={state.collectionAddress}
        placeholder={t('input collection address')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Product Id')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='item'
        value={state.item}
        placeholder={t('input product id')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Options')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='options'
        value={state.options}
        placeholder={t('comma seperated token ids')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('User Token ID')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='userTokenId'
        value={state.userTokenId}
        placeholder={t('input user token id')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Identity Token ID')}
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
        {t('Merchant Identity Token ID')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='merchantIdentityTokenId'
        value={state.merchantIdentityTokenId}
        placeholder={t('input identity token id of merchant')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Ve NFT Token ID')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='tokenId'
        value={state.tokenId}
        placeholder={t('input ve nft token id')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Amount receivable')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='amountReceivable'
        value={state.amountReceivable}
        placeholder={t('input price of product')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
      <Divider />
        <Text small color="textSubtle">
          {t('This checks your rank of withdrawal from the valuepool. Please read the documentation for more information on each parameter')}
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
          {t('Check Rank')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
