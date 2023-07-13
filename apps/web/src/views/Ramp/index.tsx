import { useAppDispatch } from 'state'
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import { useWeb3React } from '@pancakeswap/wagmi'
import {
  Heading,
  Flex,
  Image,
  Text,
  Link,
  FlexLayout,
  PageHeader,
  Loading,
  ScrollToTopButtonV2,
  Pool,
  Box,
  Breadcrumbs,
  ViewMode,
  useModal,
  Button, 
  ArrowForwardIcon,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { fetchPoolsDataWithFarms, usePoolsPageFetch, usePoolsWithFilterSelector } from 'state/ramp/hooks'
import { usePoolsPageFetch as useBountiesPageFetch, usePoolsWithFilterSelector as useBountiesWithFilterSelector} from 'state/trustbounties/hooks'
import Page from 'components/Layout/Page'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Token } from '@pancakeswap/sdk'
import { useCurrency } from 'hooks/Tokens'
import { TokenPairImage } from 'components/TokenImage'
import CreateBountyModal from 'views/TrustBounties/components/CreateBountyModal'

import CreateGaugeModal from './components/CreateGaugeModal'
import CardActions from './components/PoolCard/CardActions'
import AprRow from './components/PoolCard/AprRow'
import CardFooter from './components/PoolCard/CardFooter'
import PoolsTable from './components/PoolsTable/PoolsTable'
import PoolControls from './components/PoolControls'

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`

const FinishedTextButton = styled(Button)`
  font-weight: 400;
  white-space: nowrap;
  text-decoration: underline;
  cursor: pointer;
`

const Pools: React.FC<any> = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { pools, userDataLoaded: rampLoaded } = usePoolsWithFilterSelector()
  const { pools: bounties, userDataLoaded: bountiesLoaded } = useBountiesWithFilterSelector()
  const isBounties = router.pathname.includes("bounties")
  const userDataLoaded = isBounties ? bountiesLoaded : rampLoaded
  const { ramp, session_id: sessionId, state: status, userCurrency } = router.query
  const ogRamp = useMemo(() => pools?.length && pools[0], [pools])
  const isOwner = ogRamp?.devaddr_ === account
  const dispatch = useAppDispatch()
  const [openedAlready, setOpenedAlready] = useState(false)
  const currency = useCurrency((userCurrency ?? undefined)?.toString())
  const [onPresentCreateGauge] = useModal(<CreateGaugeModal variant='buy' pool={ogRamp} currency={currency ?? userCurrency} />,)
  const [onPresentAdminSettings] = useModal(<CreateGaugeModal variant="admin" currency={currency ?? userCurrency} location="header" pool={ogRamp} />,)
  const [onPresentDeleteARP] = useModal(<CreateGaugeModal variant="delete" currency={currency ?? userCurrency} />,)
  const [onPresentTrustBounties] = useModal(<CreateBountyModal currency={currency ?? userCurrency} />,)
  const [openPresentControlPanel] = useModal(
    <CreateGaugeModal 
      location="arps" 
      pool={pools?.length && pools[0]} 
      currency={currency ?? userCurrency}
      status={status}
      sessionId={sessionId}
    />,)
    
  useEffect(() => {
    if (sessionId && status === 'success' && !openedAlready) {
      openPresentControlPanel()
      setOpenedAlready(true)
    } 
  }, [
    status,
    sessionId,
    router.query, 
    openedAlready,
    openPresentControlPanel
  ])

  usePoolsPageFetch()
  useBountiesPageFetch()
  
  useEffect(() => {
    fetchPoolsDataWithFarms(router.query.ramp, dispatch)
  }, [router.query, dispatch])
  
  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {isBounties ? t('Trust Bounties') : t('Decentralized Ramp')}
            </Heading>
            <Heading scale="md" color="textDisabled">
              {t('%ramp%', { ramp: (ramp ?? '')?.toString() })}
            </Heading>
            <Heading scale="md" color="text">
              {isBounties ? t('Create a trust bounty so your customers can start minting from your ramp') : t(ogRamp?.description ?? '')}
            </Heading>
            {isOwner ? 
            <Flex pt="17px">
              <Button p="0" onClick={isBounties ? onPresentTrustBounties : onPresentAdminSettings} variant="text">
                <Text color="primary" bold fontSize="16px" mr="4px">
                  {t('Admin Settings')}
                </Text>
                <ArrowForwardIcon color="primary" />
              </Button>
            </Flex>:
            <Flex>
              <Button p="0" onClick={onPresentCreateGauge} variant="text">
                <Text color="primary" bold fontSize="16px" mr="4px">
                  {t('Buy Ramp')}
                </Text>
                <ArrowForwardIcon color="primary" />
              </Button>
          </Flex>}
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <Box mb="48px">
          <Breadcrumbs>
            <Link href="/ramps">{t('Ramps')}</Link>
            <Text>{ramp}</Text>
          </Breadcrumbs>
        </Box>
        <PoolControls pools={isBounties ? bounties : pools}>
          {({ chosenPools, viewMode, stakedOnly, normalizedUrlSearch }) => (
            <>
              {account && !userDataLoaded && stakedOnly && (
                <Flex justifyContent="center" mb="4px">
                  <Loading />
                </Flex>
              )}
              {isOwner ? 
              <FinishedTextButton as={Link} onClick={onPresentDeleteARP} fontSize={['16px', null, '20px']} color="failure" pl={17}>
                {t('Delete Ramp!')}
              </FinishedTextButton>:null}
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
                <PoolsTable urlSearch={normalizedUrlSearch} rampAddress={ramp} pools={chosenPools} account={account} />
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
