import { Flex, Grid, Text, Button, Link, LinkExternal } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import { useTranslation } from '@pancakeswap/localization'
import { cancanBaseUrl } from 'views/CanCan/market/constants'
import { CurrencyLogo } from 'components/Logo'
import { NftToken } from 'state/cancan/types'
import { getBscScanLinkForNft } from 'utils'
import { useCurrency } from 'hooks/Tokens'
import { Divider, HorizontalDivider, RoundedImage } from '../shared/styles'

interface EditStageProps {
  nftToSell?: any
  lowestPrice: number
  currency?: any
  continueToAdjustPriceStage: () => void
  continueToUpdateIdentityStage: () => void
  continueToRemoveFromMarketStage: () => void
  continueToUpdateBurnForCreditStage: () => void          
  continueToAddUsersPaymentCreditStage:() => void
  continueToUpdateDiscountsAndCashbackStage: () => void
  continueToReinitializeIdentityLimitsStage: () => void
  continueToReinitializeDiscountLimitsStage: () => void
  continueToReinitializeCashbackLimitsStage: () => void
}

// Initial stage when user wants to edit already listed NFT (i.e. adjust price or remove from sale)
const EditStage: React.FC<any> = ({
  nftToSell,
  currency,
  collectionId,
  continueToAdjustOptions,
  continueToAdjustPriceStage,
  continueToLocationStage,
  continueToUpdateIdentityStage,
  continueToRemoveFromMarketStage,
  continueToUpdateBurnForCreditStage,   
  continueToAddUsersPaymentCreditStage,       
  continueToUpdateDiscountsAndCashbackStage,
  continueToReinitializeIdentityLimitsStage,
  continueToReinitializeDiscountLimitsStage,
  continueToReinitializeCashbackLimitsStage,
}) => {
  const { t } = useTranslation()
  const chunks = nftToSell?.images && nftToSell?.images?.split(",")
  const thumbnail = chunks?.length > 0 && nftToSell?.images?.split(",")[0]
  const inputCurrency = nftToSell?.usetFIAT 
  ? nftToSell?.tFIAT.toLowerCase()
  : nftToSell?.ve?.toLowerCase()
  const itemCurrency = useCurrency(inputCurrency)

  return (
    <>
      <Flex p="16px">
        <RoundedImage src={thumbnail} height={68} width={68} mr="8px" />
        <Grid flex="1" gridTemplateColumns="1fr 1fr" alignItems="center">
          <Text bold>{nftToSell?.tokenId}</Text>
          <Text fontSize="12px" color="textSubtle" textAlign="right">
            {`Collection #${collectionId}`}
          </Text>
          <Text small color="textSubtle">
            {t('Your price')}
          </Text>
          <Flex alignItems="center" justifyContent="flex-end">
            <CurrencyLogo currency={itemCurrency} size="24px" style={{ marginRight: '8px' }} />
            <Text small>{nftToSell?.currentAskPrice}</Text>
          </Flex>
        </Grid>
      </Flex>
      <Flex justifyContent="space-between" px="16px" mt="8px">
        <Flex flex="2">
          <Text small color="textSubtle">
            {t('Token ID: %id%', { id: nftToSell?.tokenId })}
          </Text>
        </Flex>
        <Flex justifyContent="space-between" flex="3">
          <Button
            as={Link}
            p="0px"
            height="16px"
            external
            variant="text"
            href={`${cancanBaseUrl}/collections/${collectionId}/${nftToSell?.tokenId}`}
          >
            {t('View Item')}
          </Button>
          <HorizontalDivider />
          <LinkExternal
            p="0px"
            height="16px"
            href={getBscScanLinkForNft(collectionId, nftToSell?.tokenId)}
          >
            BscScan
          </LinkExternal>
        </Flex>
      </Flex>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToAdjustPriceStage}>
          {t('Adjust Sale Price')}
        </Button>
        <Button mb="8px" onClick={continueToAdjustOptions}>
          {t('Adjust Sale Options')}
        </Button>
        <Button variant="secondary" mb="8px" onClick={continueToLocationStage}>
          {t('Adjust Location Data')}
        </Button>
        <Button variant="secondary" mb="8px" onClick={continueToUpdateIdentityStage}>
          {t('Update Identity Requirements')}
        </Button>
        <Button variant="success" mb="8px" onClick={continueToUpdateBurnForCreditStage}>
          {t('Update Burn For Credit tokens')}
        </Button>
        <Button variant="success" mb="8px" onClick={continueToUpdateDiscountsAndCashbackStage}>
          {t('Update Discounts & Cashbacks')}
        </Button>
        <Button variant="success" mb="8px" onClick={continueToAddUsersPaymentCreditStage}>
          {t('Add Payment Credits to Users')}
        </Button>
        <Button variant="light" mb="8px" onClick={continueToReinitializeIdentityLimitsStage}>
          {t('Reset Identity Limits')}
        </Button>
        <Button variant="light" mb="8px" onClick={continueToReinitializeDiscountLimitsStage}>
          {t('Reset Discount Limits')}
        </Button>
        <Button variant="light" mb="8px" onClick={continueToReinitializeCashbackLimitsStage}>
          {t('Reset Cashback Limits')}
        </Button>
        <Button variant="danger" onClick={continueToRemoveFromMarketStage}>
          {t('Remove from Market')}
        </Button>
      </Flex>
    </>
  )
}

export default EditStage
