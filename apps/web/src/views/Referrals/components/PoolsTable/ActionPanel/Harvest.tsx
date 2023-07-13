import { useTranslation } from '@pancakeswap/localization'
import { Flex, Pool, Text } from '@pancakeswap/uikit'
import NFTMedia from 'views/CanCan/market/components/NFTMedia'
import PreviewImage from 'views/Nft/market/components/CollectibleCard/PreviewImage'

const HarvestAction: React.FunctionComponent<any> = ({ pool }) => {
    return (
        <NFTMedia as={PreviewImage} nft={pool} height={200} width={200} ml="18px" borderRadius="8px" />
    )
}

export default HarvestAction
