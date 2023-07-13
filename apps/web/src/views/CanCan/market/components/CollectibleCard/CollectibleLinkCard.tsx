import { useRouter } from 'next/router'
import { NextLinkFromReactRouter } from '@pancakeswap/uikit'
import { StyledCollectibleCard } from './styles'
import CardBody from './CardBody'
import { CollectibleCardProps } from './types'
import { cancanBaseUrl } from '../../constants'
import ProductDetailsSection from './ProductDetailsSection'

const CollectibleLinkCard: React.FC<any> = ({
  nft,
  referrer,
  nftLocation,
  currentAskPrice,
  isPaywall = false,
  ...props
}) => {
  const urlId = nft?.tokenId
  const collectionAddress = useRouter().query.collectionAddress as string
  const link = isPaywall 
  ? `${cancanBaseUrl}/collections/${collectionAddress}/paywall/${urlId}`
  : `${cancanBaseUrl}/collections/${collectionAddress}/${urlId}`

  return (
    <StyledCollectibleCard {...props}>
      <NextLinkFromReactRouter to={referrer ? `${link}?referrer=${referrer}` :`${link}`}>
        <CardBody nft={nft} nftLocation={nftLocation} currentAskPrice={currentAskPrice} />
      </NextLinkFromReactRouter>
      <ProductDetailsSection
        key={nft?.tokenId + nft?.collection?.id} 
        paywall={nft} 
      />
    </StyledCollectibleCard>
  )
}

export default CollectibleLinkCard
