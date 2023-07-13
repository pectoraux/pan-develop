import {
  Box,
  Flex,
  Grid,
  Text,
  Button,
  OpenNewIcon,
  IconButton,
  Link,
  VerifiedIcon
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { getBscScanLinkForNft } from 'utils'
import { NftToken, Collection } from 'state/cancan/types'
// import { useGetCollectionBounties } from 'state/cancan/hooks'
import { useTranslation } from '@pancakeswap/localization'
import ExpandableCard from '../shared/ExpandableCard'
import { SmallRoundedImage, CollectibleRowContainer } from '../shared/styles'

interface CollectibleRowProps {
  badgeNft: NftToken
  variant: 'Product' | 'Channel' | 'Bounty'
}

const CollectibleRow: React.FC<any> = ({ variant, badgeNft }) => {
  const { t } = useTranslation()
  const superDiff = Number(badgeNft.superLikes) - Number(badgeNft.superDislikes)
  return (
    <CollectibleRowContainer
      gridTemplateColumns="96px 1fr"
      px="16px"
      pb="8px"
      my="16px"
      // onClick={nft.location === NftLocation.PROFILE ? onPresentProfileNftModal : onPresentModal}
    >
      <SmallRoundedImage src={badgeNft.image.thumbnail} width={64} height={64} mx="16px" />
      <Grid gridTemplateColumns="1fr 1fr">
        <Text bold>{badgeNft.name}</Text>
        {variant !== "Bounty" && <Text fontSize="12px" color={superDiff > 0 ? "primary":"failure"} textAlign="right">{t("SuperDiff")}: {superDiff}</Text>}
        {variant === "Bounty" && <Text fontSize="12px" color="primary" textAlign="right">{formatNumber(Number(badgeNft.value))}</Text>}
        <Text small color="textSubtle">
          {variant === "Bounty" && t("Started %date%", { date: (new Date(Number(badgeNft.updatedAt))).getTime() })}
          {variant !== "Bounty" && badgeNft.testimony}{" "}
        </Text>    
      </Grid>
    </CollectibleRowContainer>
  )
}

interface CollectibleByLocationProps {
  badgeNft: NftToken
  variant: 'Product' | 'Channel' | 'Bounty'
  title: boolean
  onSuccess: () => void
}

const CollectibleByLocation: React.FC<any> = ({ variant, badgeNft, title=true, onSuccess }) => {
  const { t } = useTranslation()
  return (
    <Flex flexDirection="column" justifyContent='center' alignItems='center' mb="8px" pt="8px">
        <IconButton as={Link} external href={variant !== "Bounty" ? getBscScanLinkForNft(badgeNft.collectionAddress, 'address') : ''} display="inline">
          {title && <Text bold color="primary">
            {variant !== "Bounty" ? t('%variant% Auditor', {variant}) : t("Associated Trust Bounties")}
          </Text>}
          <OpenNewIcon color="primary" width="24px" height="24px" />
        </IconButton>
      <CollectibleRow key={badgeNft.tokenId} badgeNft={badgeNft} variant={variant} onSuccess={onSuccess} />
      <Button height="25px" variant="danger">{t("Report %variant%", {variant})}</Button>
    </Flex>
  )
}

interface ManageNFTsCardProps {
  nft?: NftToken
  collection: Collection
  onSuccess: () => void
}

const StyledBox = styled(Box)`
overflow: auto;
max-height: 100vh;
::-webkit-scrollbar { display: none; };
`

const AuditNFTsCard: React.FC<any> = ({ collection, nft, onSuccess }) => {
  const { t } = useTranslation()
  // const bounties = useGetCollectionBounties(collection.address)
  const content = (
    <StyledBox>
  <Flex flexDirection="column" justifyContent='center' overflowY='hidden' alignItems='center' mb="8px">
      {!collection.badgeNft && (
        <Text px="16px" pb="16px" color="failure">
          {t('This channel has not been audited.')}
        </Text>
      )}
      {collection.badgeNft && <CollectibleByLocation badgeNft={collection.badgeNft} variant="Channel" onSuccess={onSuccess} />}
      {!nft.marketData?.badgeNft && (
        <Text px="16px" pb="16px" color="failure">
          {t('This product has not been audited.')}
        </Text>
      )}
      {nft.marketData?.badgeNft && <CollectibleByLocation badgeNft={nft.marketData.badgeNft} variant="Product" onSuccess={onSuccess} />}
      {/* {!bounties?.length && (
        <Text px="16px" pb="16px" color="failure">
          {t('This channel has no trust bounties.')}
        </Text>
      )}
      {bounties  && bounties.map((badgeNft, idx) => <CollectibleByLocation badgeNft={badgeNft} variant="Bounty" title={!idx} onSuccess={onSuccess} />)} */}
    </Flex>
    </StyledBox>
  )
  return <ExpandableCard title={t('Backings')} icon={<VerifiedIcon width="24px" height="24px" />} content={content} />
}

export default AuditNFTsCard
