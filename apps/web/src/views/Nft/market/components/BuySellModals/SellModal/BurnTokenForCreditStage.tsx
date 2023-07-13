import { Flex, Grid, Text, Button, Input, ButtonMenu, ButtonMenuItem, ErrorIcon, LinkExternal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { NftToken } from 'state/cancan/types'
import { isAddress } from 'utils'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { Divider, RoundedImage } from '../shared/styles'
import { GreyedOutContainer } from './styles'


interface TransferStageProps {
  nftToSell?: any
  lowestPrice: number
  burnForCreditToken: string
  setBurnForCreditToken: React.Dispatch<React.SetStateAction<string>>
  discountNumber: string
  setDiscountNumber: React.Dispatch<React.SetStateAction<string>>
  continueToNextStage: () => void
}

const BurnTokenForCreditStage: React.FC<any> = ({
  nftToSell,
  collectionId,
  state,
  handleChange,
  handleRawValueChange,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const chunks = nftToSell?.images && nftToSell?.images?.split(",")
  const thumbnail = chunks?.length > 0 && nftToSell?.images?.split(",")[0]

  return (
    <>
      <Text fontSize="24px" bold px="16px" pt="16px">
        {t('Token to burn for credit')}
      </Text>
      <Flex p="16px">
        <RoundedImage src={thumbnail} height={68} width={68} mr="8px" />
        <Grid flex="1" gridTemplateColumns="1fr 1fr" alignItems="center">
          <Text bold>{nftToSell?.tokenId}</Text>
          <Text fontSize="12px" color="textSubtle" textAlign="right">
            {`Collection #${collectionId}`}
          </Text>
        </Grid>
      </Flex>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Address of token')}
        </Text>
        <Input
          scale="sm"
          placeholder={t('paste your token address')}
          name="token"
          value={state.token}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Discount number')}(%)
        </Text>
        <Input
          type="text"
          inputMode="decimal"
          pattern="^[0-9]+[.,]?[0-9]*$"
          scale="sm"
          name="discountNumber"
          value={state.discountNumber}
          placeholder={t('this number multiplies amount burn')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Checker')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="checker"
          value={state.checker}
          placeholder={t('this contract checks the validity of the tokens')}
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
          name="destination"
          value={state.destination}
          placeholder={t('this is where the tokens are sent')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Collection ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="collectionId"
          value={state.collectionId}
          placeholder={t('this is the channel to check against')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Product ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="productId"
          value={state.productId}
          placeholder={t('this is the product to check against')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
          {t('Clear')}
        </Text>
        <ButtonMenu scale="xs" variant='subtle' activeIndex={state.clear} onItemClick={handleRawValueChange('clear')}>
          <ButtonMenuItem >{t('No')}</ButtonMenuItem>
          <ButtonMenuItem >{t('Yes')}</ButtonMenuItem>
        </ButtonMenu>
      </StyledItemRow>
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Text small color="textSubtle">
          {t('This action will create discounts on this product for users who burn this token. Discount = discount number * number of token burned')}
        </Text>
      </Grid>
      <Flex flexDirection="column" alignItems="center" justifyContent="space-between" height="150px">
        <LinkExternal href=''>{t('Learn more about burns for credit')}</LinkExternal>
      </Flex>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
        >
          {t('Confirm')}
        </Button>
      </Flex>
    </>
  )
}

export default BurnTokenForCreditStage
