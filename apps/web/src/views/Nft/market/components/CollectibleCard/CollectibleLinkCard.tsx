import { useRouter } from 'next/router'
import { NextLinkFromReactRouter } from '@pancakeswap/uikit'
import { StyledCollectibleCard } from './styles'
import CardBody from './CardBody'
import { CollectibleCardProps } from './types'
import { nftsBaseUrl } from '../../constants'
import ProductDetailsSection from './ProductDetailsSection'

const CollectibleLinkCard: React.FC<any> = ({
  nft,
  referrer,
  nftLocation,
  currentAskPrice,
  ...props
}) => {
  const urlId = nft?.tokenId
  const collectionAddress = useRouter().query.collectionAddress as string
  return (
    <StyledCollectibleCard {...props}>
      <NextLinkFromReactRouter to={referrer ?
      `/${nftsBaseUrl}/collections/${collectionAddress}/${urlId}?referrer=${referrer}`
      :`/${nftsBaseUrl}/collections/${collectionAddress}/${urlId}`}>
        <CardBody nft={nft} nftLocation={nftLocation} currentAskPrice={currentAskPrice} />
      </NextLinkFromReactRouter>
      <ProductDetailsSection key={nft?.tokenId + nft?.collection?.id} paywall={nft}  />
    </StyledCollectibleCard>
  )
}

export default CollectibleLinkCard
