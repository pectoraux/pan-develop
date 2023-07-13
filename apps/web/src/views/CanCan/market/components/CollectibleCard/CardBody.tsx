import { Box, CardBody, Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import PreviewImage from './PreviewImage'
import { CostLabel, MetaRow } from './styles'
import LocationTag from './LocationTag'
import { CollectibleCardProps } from './types'
import NFTMedia from '../NFTMedia'

const CollectibleCardBody: React.FC<any> = ({
  nft,
  nftLocation,
  currentAskPrice,
  isUserNft,
}) => {
  const { t } = useTranslation()
  const { tokenId: name } = nft
  const bnbBusdPrice = useBNBBusdPrice()

  return (
    <CardBody p="8px">
      <NFTMedia as={PreviewImage} nft={nft} height={320} width={320} mb="8px" borderRadius="8px" />
      <Flex alignItems="center" justifyContent="space-between">
        {nft?.tokenId && (
          <Text fontSize="12px" color="textSubtle" mb="8px">
            {nft?.tokenId}
          </Text>
        )}
        {nftLocation && <LocationTag nftLocation={nftLocation} />}
      </Flex>
      <Text as="h4" fontWeight="600" mb="8px">
        {name}
      </Text>
      <Box borderTop="1px solid" borderTopColor="cardBorder" pt="8px">
        {currentAskPrice && (
          <MetaRow title={isUserNft ? t('Your price') : t('Asking price')}>
            <CostLabel cost={currentAskPrice} bnbBusdPrice={bnbBusdPrice} />
          </MetaRow>
        )}
      </Box>
    </CardBody>
  )
}

export default CollectibleCardBody
