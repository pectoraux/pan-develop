import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, ButtonMenu, ButtonMenuItem, Input, ErrorIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
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
        {t('Collection ID')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='collectionId'
        value={state.collectionId}
        placeholder={t('input your collection id')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Checker Address')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='checker'
        value={state.checker}
        placeholder={t('input token checker address')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Destination Address')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='destination'
        value={state.destination}
        placeholder={t('input destination address')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Item')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='item'
        value={state.item}
        placeholder={t('input item id')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Discount')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='discount'
        value={state.discount}
        placeholder={t('input discount amount')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <StyledItemRow>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="13px" paddingRight="50px" bold>
          {t('Clear')}
        </Text>
        <ButtonMenu scale="sm" variant='subtle' activeIndex={state.clear} onItemClick={handleRawValueChange('clear')}>
        <ButtonMenuItem>{t('No')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
      </ButtonMenu>
      </StyledItemRow>
      <Divider/>
    </GreyedOutContainer>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('The will update burn for credit options. Please read the documentation for more information.')}
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
          {t('Update Burn For Credit')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
