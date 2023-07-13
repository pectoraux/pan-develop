import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

import { useWeb3React } from '@pancakeswap/wagmi'
import {
  Heading,
  Flex,
  Image,
  Text,
  FlexLayout,
  PageHeader,
  Loading,
  ScrollToTopButtonV2,
  Pool,
  ViewMode,
  Button, 
  useModal,
  ArrowForwardIcon,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { DEFAULT_TFIAT } from 'config/constants/exchange'
import { usePoolsPageFetch, usePoolsWithFilterSelector } from 'state/stakemarket/hooks'
import { usePoolsPageFetch as useBountiesPageFetch, usePoolsWithFilterSelector as useBountiesWithFilterSelector } from 'state/trustbounties/hooks'
import { usePoolsPageFetch as useValuepoolsPageFetch, usePoolsWithFilterSelector as useValuepoolsWithFilterSelector } from 'state/valuepools/hooks'
import Page from 'components/Layout/Page'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Token } from '@pancakeswap/sdk'
import { useCurrency } from 'hooks/Tokens'
import { TokenPairImage } from 'components/TokenImage'
import CurrencyInputPanel from 'components/CurrencyInputPanel'

import CardActions from './components/PoolCard/CardActions'
import AprRow from './components/PoolCard/AprRow'
import CardFooter from './components/PoolCard/CardFooter'
import PoolsTable from './components/PoolsTable/PoolsTable'
import PoolControls from './components/PoolControls'
import CreateStakeModal from './components/CreateStakeModal'

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`

const FinishedTextContainer = styled(Flex)`
  padding-bottom: 32px;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const Pools: React.FC<any> = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { pools, userDataLoaded: stakesLoaded } = usePoolsWithFilterSelector()
  const { pools: bounties, userDataLoaded: bountiesLoaded } = useBountiesWithFilterSelector()
  const { pools: valuepools, userDataLoaded: vpsLoaded } = useValuepoolsWithFilterSelector()
  const inputCurency = useCurrency(DEFAULT_TFIAT)
  const [currency, setCurrency] = useState(inputCurency)
  const handleInputSelect = useCallback((currencyInput) => setCurrency(currencyInput),[],)
  const [onPresentStakeMarket] = useModal(<CreateStakeModal currency={currency ?? inputCurency} />,)
  const router = useRouter()
  const isFromContracts = router.asPath.includes('#stakemarket')
  || router.asPath.includes('#trustbounties')
  || router.asPath.includes('#valuepools')
  const indexFromContracts = router.asPath.includes('#stakemarket')
  ? 0 
  : router.asPath.includes('#trustbounties')
  ? 1 
  : router.asPath.includes('#valuepools')
  ? 2
  : 3
  const isExact = router.pathname.includes('stakemarket')
  const isBounty = router.pathname.includes('trustbounties')
  const isVP = router.pathname.includes('valuepools')
  const indexFromRoot = isExact ? 0 : isBounty ? 1 : isVP ? 2 : 3
  const activeIndex = isFromContracts ? indexFromContracts : indexFromRoot
  const userDataLoaded = activeIndex === 0 
  ? stakesLoaded 
  : activeIndex === 1 
  ? bountiesLoaded 
  : vpsLoaded
  console.log("isExact787===============>", activeIndex, pools)
  usePoolsPageFetch()
  useBountiesPageFetch()
  useValuepoolsPageFetch()

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Stake Market')}
            </Heading>
            <Heading scale="md" color="text">
              {t("Browse this channel's StakeMarket, Valuepools, ARPs, Trustbounties, Lotteries, Catalogs, Bettings...")}
            </Heading>
            <Heading scale="md" color="text">
              {t("Buy products and services from eCommerce stores, Delivery/Telehealth... channels")}
            </Heading>
            <Flex>
              <Button p="0" variant="text">
                <Text color="primary" onClick={onPresentStakeMarket} bold fontSize="16px" mr="4px">
                    {t('Create an Stake in ')}{' '}
                </Text>
                <CurrencyInputPanel
                  showInput={false}
                  currency={currency ?? inputCurency}
                  onCurrencySelect={handleInputSelect}
                  otherCurrency={currency ?? inputCurency}
                  id='stakes-currency'
                />
              </Button>
              <ArrowForwardIcon onClick={onPresentStakeMarket} color="primary" />
            </Flex>
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <PoolControls pools={activeIndex === 0 
          ? pools 
          : activeIndex === 1
          ? bounties
          : valuepools
          }>
          {({ chosenPools, viewMode, stakedOnly, normalizedUrlSearch, showFinishedPools }) => (
            <>
              {showFinishedPools && (
                <FinishedTextContainer>
                  <Text fontSize={['16px', null, '20px']} color="failure" pr="4px">
                    {t('Looking to partner with a ramp?')}
                  </Text>
                  <Text fontSize={['16px', null, '20px']} color="failure" pr="4px">
                    {t('Explore under-collateralized ramps and pick your partner.')}.
                  </Text>
                </FinishedTextContainer>
              )}
              {account && !userDataLoaded && stakedOnly && (
                <Flex justifyContent="center" mb="4px">
                  <Loading />
                </Flex>
              )}
              {viewMode === ViewMode.CARD ? (
                <CardLayout>
                  {chosenPools.map((pool) =>
                      <Pool.PoolCard<Token>
                        key={pool.sousId}
                        pool={pool}
                        isStaked={Boolean(pool?.userData?.stakedBalance?.gt(0))}
                        cardContent={
                          account ? (
                            <CardActions pool={pool} stakedBalance={pool?.userData?.stakedBalance} />
                          ) : (
                            <>
                              <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                                {t('Start earning')}
                              </Text>
                              <ConnectWalletButton />
                            </>
                          )
                        }
                        tokenPairImage={
                          <TokenPairImage
                            primaryToken={pool.earningToken}
                            secondaryToken={pool.stakingToken}
                            width={64}
                            height={64}
                          />
                        }
                        cardFooter={<CardFooter pool={pool} account={account} />}
                        aprRow={<AprRow pool={pool} stakedBalance={pool?.userData?.stakedBalance} />}
                      />
                  )}
                </CardLayout>
              ) : ( 
                <PoolsTable
                variant={showFinishedPools ? "trustbounties" : "stakemarket"} 
                urlSearch={normalizedUrlSearch} pools={chosenPools} account={account} />
              )}
              <Image
                mx="auto"
                mt="12px"
                src="/images/decorations/3d-syrup-bunnies.png"
                alt="Pancake illustration"
                width={192}
                height={184.5}
              />
            </>
          )}
        </PoolControls>
      </Page>
      {createPortal(<ScrollToTopButtonV2 />, document.body)}
    </>
  )
}

export default Pools
