import { useRouter } from 'next/router'
import { useMemo } from 'react'
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
  Box,
  Breadcrumbs,
  Link,
  ArrowForwardIcon,
} from '@pancakeswap/uikit'
import { DEFAULT_TFIAT } from 'config/constants/exchange'
import { useTranslation } from '@pancakeswap/localization'
import { usePoolsPageFetch, usePoolsWithFilterSelector } from 'state/worlds/hooks'
import Page from 'components/Layout/Page'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Token } from '@pancakeswap/sdk'
import { TokenPairImage } from 'components/TokenImage'
import { useCurrency } from 'hooks/Tokens'
import CreateGaugeModal from 'views/Worlds/components/CreateGaugeModal'

import CardActions from './components/PoolCard/CardActions'
import AprRow from './components/PoolCard/AprRow'
import CardFooter from './components/PoolCard/CardFooter'
import PoolsTable from './components/PoolsTable/PoolsTable'
import PoolControls from './components/PoolControls'

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
  const router = useRouter()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const world = router.query.world as string
  const { pools, userDataLoaded } = usePoolsWithFilterSelector()
  const ogWorld = useMemo(() => pools?.length && pools[0], [pools])
  const currency = useCurrency(DEFAULT_TFIAT ?? undefined)
  const [onPresentAdminSettings] = useModal(<CreateGaugeModal variant='admin' location='fromWorld' currency={currency} pool={ogWorld} />,)

  usePoolsPageFetch()

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('World')}
            </Heading>
            <Heading scale="md" color="textDisabled">
              {t('%a%', { a: world ?? '' })}
            </Heading>
            <Heading scale="md" color="text">
              {t(ogWorld?.collection?.description ?? '')}
            </Heading>
          {ogWorld.devaddr_ === account ? 
            <Flex>
              <Button p="0" variant="text">
                <Text color="primary" onClick={onPresentAdminSettings} bold fontSize="16px" mr="4px">
                  {t('Admin Settings')}{' '}
                </Text>
              </Button>
              <ArrowForwardIcon onClick={onPresentAdminSettings} color="primary" />
            </Flex>
            :null}
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
      <Box mb="48px">
          <Breadcrumbs>
            <Link href="/worlds">{t('Worlds')}</Link>
            <Text>{world}</Text>
          </Breadcrumbs>
        </Box>
        <PoolControls pools={pools}>
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
                <PoolsTable urlSearch={normalizedUrlSearch} pools={chosenPools} account={account} />
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
