import { useMatchBreakpoints, Box, Button, Card, CardBody, Flex, Skeleton, Text, useModal, ChevronLeftIcon, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

import { useRouter } from 'next/router'
import styled from 'styled-components'
import { useColor } from 'hooks/useColor'
import { NftToken } from 'state/cancan/types'
import { CurrencyLogo } from 'components/Logo'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useWorkspaceCurrency } from 'hooks/Tokens'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import Countdown from 'views/Lottery/components/Countdown'
import ConnectWalletButton from 'components/ConnectWalletButton'
import NFTMedia from 'views/CanCan/market/components/NFTMedia'
import RichTextEditor from 'components/RichText';
import MarketPageTitle from '../../../components/MarketPageTitle'
import StatBox, { StatBoxItem } from '../../../components/StatBox'
import BuyModal from '../../../components/BuySellModals/BuyModal'
import SellModal from '../../../components/BuySellModals/SellModal'
import { cancanBaseUrl } from '../../../constants'
import { Container } from '../shared/styles'
import OptionFilters from '../../../components/BuySellModals/BuyModal/OptionFilters'

interface MainNFTCardProps {
  nft: NftToken
  isOwnNft: boolean
  nftIsProfilePic: boolean
  onSuccess: () => void
}

const BackLink = styled(NextLinkFromReactRouter)`
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  display: inline-flex;
  font-weight: 600;
`

const MainNFTCard: React.FC<any> = ({
  nft,
  isOwnNft,
  nftIsProfilePic,
  onSuccess,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const isAuction = Number(nft?.bidDuration) > 0
  const dropInDatePassed = Number(nft?.dropinTimer) < Date.now()
  const collectionId = useRouter().query.collectionAddress as string
  const isPaywall = useRouter().pathname.includes('[collectionAddress]/paywall')
  // const currentAskPriceAsNumber = nft?.currentAskPrice ? parseFloat(nft?.currentAskPrice) : 0
  const {
    mainCurrency,
    secondaryCurrency,
    currentAskPriceAsNumber,
    mainToSecondaryCurrencyFactor,
    priceInSecondaryCurrency
  } = useWorkspaceCurrency(
    nft?.ve?.toLowerCase(), 
    nft?.tFIAT, 
    nft?.usetFIAT, 
    nft?.currentAskPrice
  )
  const { isMobile } = useMatchBreakpoints()
  const chunks = nft?.images && nft?.images?.split(",")
  const mp4 = chunks?.length > 1 && nft?.images?.split(",").slice(1).join(",")
  const original = mp4?.length > 400 ? mp4 : ''
  const { itemColor, textColor } = useColor(nft?.superLikes ?? '0', nft?.superDisLikes ?? '0')
  const [onPresentBuyModal] = useModal(<BuyModal variant={isPaywall ? 'paywall' : 'item'} nftToBuy={nft} />)
  const [onPresentSellModal] = useModal(
    <SellModal variant={isPaywall ? 'paywall' : 'item'} nftToSell={nft} onSuccessSale={onSuccess} />,
  )
  const ownerButtons = (
    <Flex flexDirection={['column', 'column', 'row']}>
      <Button
        disabled={nftIsProfilePic}
        minWidth="168px"
        mr="16px"
        width={['100%', null, 'max-content']}
        mt="24px"
        onClick={onPresentSellModal}
      >
        {nft?.isTradable ? t('Adjust settings') : t('List for sale')}
      </Button>
    </Flex>
  )
  const options = nft?.options?.map((option, index) => { 
    return {
      id: index, 
      ...option 
    }
  })

  return (
    <Card mb="40px">
      <CardBody>
        <Container flexDirection={['column-reverse', null, 'row']}>
          <Flex flex="2">
            <Box>
              <BackLink to={`${cancanBaseUrl}/collections/${collectionId}`}>
                <ChevronLeftIcon color="primary" width="24px" />
                {t('All Items')}
              </BackLink>
              <Text fontSize="40px" bold mt="12px">
                {nft.tokenId}
              </Text>
              {original ?
              <Flex flex="2" justifyContent={['center', null, 'flex-end']} alignItems="center">
                <RichTextEditor value={original} readOnly style={{ width: "120%" }} id="rte" />
              </Flex>:null}
              {nft.description && <Text mt={['16px', '16px', '48px']}>{t(nft.description)}</Text>}
              {!account ? <ConnectWalletButton mt={['16px', '16px', '48px']} />: nft?.options?.length ?
              <Text textTransform="uppercase" mt={['16px', '16px', '48px']} textAlign="center" color="textSubtle" fontSize="12px" bold>
                {t('Customize your order')}
              </Text>: null}
              <Flex justifyContent='center' alignItems='center'>
                {account && <OptionFilters address={account} options={options} />}
              </Flex>
              {nft?.isTradable ? (
                <>
                <Text color="textSubtle" mt={['16px', '16px', '48px']}>
                  {t('Price')}
                </Text>
                <Flex alignItems="center" mt="8px">
                  <CurrencyLogo currency={mainCurrency} size="24px" style={{ marginRight: '8px' }} />
                  <Text fontSize="24px" bold mr="4px">
                    {formatNumber(currentAskPriceAsNumber, 0, 18)}
                  </Text>
                  {mainToSecondaryCurrencyFactor && secondaryCurrency ? (
                    <Text color="textSubtle">{`(~${priceInSecondaryCurrency.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} ${secondaryCurrency?.symbol})`}</Text>
                  ) : (
                    <Skeleton width="64px" />
                  )}
                </Flex>
                </>
              ) : null}
              
              {isOwnNft && ownerButtons}
              {isOwnNft && nft?.isTradable && (
              // {!isOwnNft && nft?.isTradable && (
                <Flex flexDirection="row" mt="24px">
                <Button
                  minWidth="168px"
                  disabled={!dropInDatePassed || !account}
                  mr="16px"
                  width={['100%', null, 'max-content']}
                  onClick={onPresentBuyModal}
                >
                  {isAuction ? t('Bid') : !dropInDatePassed ? t('Drop Pending') : t('Buy')}
                </Button>
                {isAuction && <Countdown nextEventTime={Number(nft?.firstBidTime) + Number(nft?.bidDuration)} />}
                {!dropInDatePassed && <Countdown nextEventTime={Number(nft?.dropinTimer)} />}
                {/* <Button
                  minWidth="168px"
                  mr="16px"
                  width={['100%', null, 'max-content']}
                  onClick={onPresentBuyModal}
                >
                  {t('Register')}
                </Button> */}
                </Flex>
              )}
            </Box>
          </Flex>
          {!original ? 
            <Flex flex="2" justifyContent={['center', null, 'flex-end']} alignItems="center" maxWidth={440}>
              <NFTMedia key={nft.tokenId} nft={nft} width={440} height={440} />
            </Flex>
          :null}
        </Container>
        <MarketPageTitle>
            <StatBox style={{ backgroundColor: itemColor }}>
              <StatBoxItem
                variant={textColor}
                statType="super"
                title={t('SuperLikes')}
                stat={nft?.superLikes ? formatNumber(Number(nft?.superLikes), 0, 0) : '0'}
              />
              <StatBoxItem
                variant={textColor}
                statType="super"
                title={t('SuperDislikes')}
                stat={nft?.superDislikes ? formatNumber(Number(nft?.superDislikes), 0, 0) : '0'}
              />
              {!isMobile &&
              <StatBoxItem
                variant={textColor}
                title={t('Likes')}
                stat={nft?.likes ? formatNumber(Number(nft?.likes), 0, 0) : '0'}
              />}
              {!isMobile &&
              <StatBoxItem
                variant={textColor}
                title={t('Dislikes')}
                stat={nft?.dislikes ? formatNumber(Number(nft?.dislikes), 0, 0) : '0'}
              />}
              {/* <StatBoxItem
                variant={textColor}
                title={t('View Count')}
                statType="viewCount"
                stat={nft?.viewCount ? formatNumber(Number(nft?.viewCount), 0, 0) : '0'}
              /> */}
            </StatBox>
          </MarketPageTitle>
      </CardBody>
    </Card>
  )
}

export default MainNFTCard
