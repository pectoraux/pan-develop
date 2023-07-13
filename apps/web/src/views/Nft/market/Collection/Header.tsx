import { useRouter } from 'next/router'
import { useCallback, useState, useMemo } from 'react'
import { 
  Text, 
  SvgProps, 
  Svg, 
  Row, 
  Button, 
  useModal, 
  Flex, 
  FlexGap,
  IconButton,
  TwitterIcon, 
  TelegramIcon, 
  LanguageIcon,
  Link,
  LinkExternal,
} from '@pancakeswap/uikit'
import { useCurrency } from 'hooks/Tokens'
import { useWeb3React } from '@pancakeswap/wagmi'
import { Collection } from 'state/cancan/types'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import Container from 'components/Layout/Container'
import { DEFAULT_TFIAT } from 'config/constants/exchange'
import MarketPageHeader from '../components/MarketPageHeader'
import MarketPageTitle from '../components/MarketPageTitle'
import StatBox, { StatBoxItem } from '../components/StatBox'
import BannerHeader from '../components/BannerHeader'
import AvatarImage from '../components/BannerHeader/AvatarImage'
import BaseSubMenu from '../components/BaseSubMenu'
import { nftsBaseUrl } from '../constants'
import SettingStage from '../components/BuySellModals/SellModal/SettingStage'
import ShipStage from '../components/BuySellModals/SellModal/ShipStage'
import PartnerModal from './PartnerModal'
import RegisterModal from './RegisterModal'
import TopBar from './TopBar'
import LowestPriceStatBoxItem from './LowestPriceStatBoxItem'
import { ActionContainer, ActionContent, ActionTitles } from './styles'

interface HeaderProps {
  collection: Collection
}

const Header: React.FC<any> = ({ collection }) => {
  const router = useRouter()
  const collectionAddress = router.query.collectionAddress as string
  const { numberNftsListed, numberPartnerNftsListed, totalVolumeBNB, large, avatar, owner } = collection
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const isOwner = account?.toLocaleLowerCase() === owner?.toLocaleLowerCase()
  
  const volume = totalVolumeBNB
    ? parseFloat(totalVolumeBNB ?? 0).toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })
    : '0'
  const defaultCurrency = useCurrency(DEFAULT_TFIAT)
  const [currency, setCurrency] = useState(defaultCurrency)
  const handleInputSelect = useCallback((currencyInput) => {setCurrency(currencyInput)},[],)

  const [onPresentSettings] = useModal(<SettingStage collection={collection} />)
  const [onPresentPartner] = useModal(<PartnerModal collection={collection} />,)
  const [onPresentRegister] = useModal(<RegisterModal collection={collection} />,)
  const [onPresentShip] = useModal(<ShipStage variant='product' collection={collection} currency={currency} />)
  const [onPresentPaywall] = useModal(<ShipStage variant='paywall' collection={collection} currency={currency} />)

  const itemsConfig = [
    {
      label: t('Items'),
      href: `${nftsBaseUrl}/collections/${collectionAddress}`,
    },
    {
      label: t('Activity'),
      href: `${nftsBaseUrl}/collections/${collectionAddress}#activity`,
    },
    {
      label: t('Requests'),
      href: `${nftsBaseUrl}/collections/${collectionAddress}#requests`,
    },
    {
      label: t('Contracts'), // groups together: stakemarket, trust bounties, badges, arps, lotteries, bettings, mines
      href: `${nftsBaseUrl}/collections/${collectionAddress}#stakemarket`,
    },
    {
      label: t('Legal & Info'),
      href: `${nftsBaseUrl}/collections/${collectionAddress}#legal`,
    },
    {
      label: t('Stats'),
      href: `${nftsBaseUrl}/collections/${collectionAddress}#traits`,
    },
  ]

  const SmartContractIcon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
    return (
      <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 -15 122.000000 122.000000" {...props}>
        <g transform="translate(0.000000,122.000000) scale(0.100000,-0.100000)" stroke="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M465 1200 c-102 -27 -142 -46 -221 -105 -153 -115 -244 -293 -244
  -480 0 -136 62 -311 119 -334 30 -13 96 -6 119 12 9 7 12 57 12 188 0 211 -1
  209 95 209 95 0 95 1 95 -201 0 -180 2 -186 48 -153 22 15 22 19 22 234 0 257
  -3 250 95 250 97 0 95 4 95 -226 0 -107 4 -194 9 -194 4 0 20 9 35 21 l26 20
  0 244 c0 281 -6 265 98 265 43 0 63 -5 73 -17 10 -12 15 -65 19 -205 l5 -189
  67 56 c86 71 148 148 148 185 0 82 -113 249 -218 322 -152 106 -334 142 -497
  98z"
          />
        </g>
      </Svg>
    )
  }
  
  const ProposalIcon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
    return (
      <Svg viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M10.037 6a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5zM9.287 9.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM10.037 12a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5z" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.287 4a2 2 0 012-2h13a2 2 0 012 2v15c0 1.66-1.34 3-3 3h-14c-1.66 0-3-1.34-3-3v-2c0-.55.45-1 1-1h2V4zm0 16h11v-2h-12v1c0 .55.45 1 1 1zm14 0c.55 0 1-.45 1-1V4h-13v12h10c.55 0 1 .45 1 1v2c0 .55.45 1 1 1z"
        />
      </Svg>
    )
  }

  const getActiveItem = useMemo(() => {
    const hash = router.asPath.match(/#([a-z0-9]+)/gi)?.[0]
    if (hash === '#valuepools' || hash === '#trustbounties') {
      return `${nftsBaseUrl}/collections/${collectionAddress}#stakemarket` 
    }
    return router.asPath.replace('?chainId=97','')
  }, [router, collectionAddress])

  return (
    <>
      <MarketPageHeader>
        <TopBar />
        <BannerHeader bannerImage={large ?? ''} avatar={<AvatarImage src={avatar ?? ''} />} />
        <MarketPageTitle
          address={collection?.address}
          title={collection?.name ?? ''}
          description={collection?.description ? <Text color="textSubtle">{t(collection.description)}</Text> : null}
        >
          <StatBox>
            <StatBoxItem title={t('Items')} stat={formatNumber(Number(numberNftsListed ?? 0), 0, 0) ?? '-'} />
            <StatBoxItem
              title={t('Partner Items')}
              stat={numberNftsListed ? formatNumber(Number(numberPartnerNftsListed), 0, 0) : '0'}
            />
            <LowestPriceStatBoxItem collectionAddress={collection?.id} />
            <StatBoxItem title={t('Vol. (%symbol%)', { symbol: 'BNB' })} stat={(volume ?? 0)?.toString()} />
          </StatBox>
          <Flex justifyContent='center' alignItems='center'>
            <CurrencyInputPanel
              showInput={false}
              currency={currency ?? defaultCurrency}
              onCurrencySelect={handleInputSelect}
              otherCurrency={currency ?? defaultCurrency}
              id={collectionAddress}
            />
          </Flex>
          <Row>
            {isOwner && 
            <ActionContainer>
            <ActionTitles>
                <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
                  {t('Channel Settings')}
                </Text>
              </ActionTitles>
              <ActionContent>
                <Button
                  width="100%"
                  onClick={onPresentSettings}
                  variant="secondary"
                >
                  {t('Settings')}
                </Button>
              </ActionContent>
            </ActionContainer>}
            <ActionContainer>
            <ActionTitles>
                <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
                  {isOwner ? t('Paid content') : t('Willing to do business with us?')}
                </Text>
              </ActionTitles>
              <ActionContent>
                <Button
                  width="100%"
                  onClick={isOwner ? onPresentPaywall : onPresentPartner}
                  variant="secondary"
                >
                  {isOwner ? t('Paywall') : t('Partner')}
                </Button>
              </ActionContent>
            </ActionContainer>
            <ActionContainer>
              <ActionTitles>
                <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
                  {isOwner ? t('Ship faster') : t('Become a user')}
                </Text>
              </ActionTitles>
              <ActionContent>
                <Button
                  width="100%"
                  onClick={isOwner ? onPresentShip : onPresentRegister}
                  variant="secondary"
                >
                  {isOwner ? t('Poduct') : t('Register')}
                </Button>
              </ActionContent>
            </ActionContainer>
            </Row>
        </MarketPageTitle>
        <Flex>
          <FlexGap gap="16px" pt="24px" pl="4px">
            <IconButton as={Link} style={{ cursor: "pointer" }} 
            // onClick={onPresentProject}
            >
              <LanguageIcon color="textSubtle" />
            </IconButton>
            <IconButton as={Link} style={{ cursor: "pointer" }} 
            // onClick={onPresentArticle}
            >
              <ProposalIcon color="textSubtle" />
            </IconButton>
            <IconButton as={Link} style={{ cursor: "pointer" }} 
            // onClick={onPresentPayChat}
            >
              <SmartContractIcon color="textSubtle" />
            </IconButton>
            {collection?.twitterUrl && (
              <IconButton as={Link} style={{ cursor: "pointer" }} 
              // onClick={onPresentTwitter}
              >
                <TwitterIcon color="textSubtle" />
              </IconButton>
            )}
            {collection?.telegramUrl && (
              <IconButton as={Link} style={{ cursor: "pointer" }} 
              // onClick={onPresentTelegram}
              >
                <TelegramIcon color="textSubtle" />
              </IconButton>
            )}
            <LinkExternal href='/info/token/' bold={false}>
              {t('See Lottery')}
            </LinkExternal>
          </FlexGap>
        </Flex>
      </MarketPageHeader> 
      <Container>
        <BaseSubMenu items={itemsConfig} activeItem={getActiveItem} mt="24px" mb="8px" />
      </Container>
    </>
  )
}

export default Header
