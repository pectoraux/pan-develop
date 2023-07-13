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
import { usePoolsPageFetch, usePoolsWithFilterSelector } from 'state/contributors/hooks'
import { usePoolsPageFetch as useBountiesPageFetch, usePoolsWithFilterSelector as useBountiesWithFilterSelector} from 'state/trustbounties/hooks'
import Page from 'components/Layout/Page'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Token } from '@pancakeswap/sdk'
import { useCurrency } from 'hooks/Tokens'
import { TokenPairImage } from 'components/TokenImage'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import CreateBountyModal from 'views/TrustBounties/components/CreateBountyModal'

import CardActions from './components/PoolCard/CardActions'
import AprRow from './components/PoolCard/AprRow'
import CardFooter from './components/PoolCard/CardFooter'
import PoolsTable from './components/PoolsTable/PoolsTable'
import PoolControls from './components/PoolControls'
import CreateContributorsModal from './components/CreateContributorsModal'

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`

const Pools: React.FC<any> = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { pools, userDataLoaded: userPitchesLoaded } = usePoolsWithFilterSelector()
  const { pools: bounties, userDataLoaded: bountiesLoaded } = useBountiesWithFilterSelector()
  const isBounties = router.pathname.includes("bounties")
  const userDataLoaded = isBounties ? bountiesLoaded : userPitchesLoaded
  const inputCurency = useCurrency(DEFAULT_TFIAT)
  const [currency, setCurrency] = useState(inputCurency)
  const handleInputSelect = useCallback((currencyInput) => setCurrency(currencyInput),[],)
  const [onPresentCreate] = useModal(<CreateContributorsModal currency={currency} />)
  const [onPresentTrustBounties] = useModal(<CreateBountyModal currency={currency ?? inputCurency} />,)

  usePoolsPageFetch()
  useBountiesPageFetch()

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {isBounties ? t('Trust Bounties') : t('Contributor Teams')}
            </Heading>
            <Heading scale="md" color="text">
              {isBounties ? t('Are you a Contributor ?') : t('Browse through all contributors and vote for those working on your favorite projects.')}
            </Heading>
            <Heading scale="md" color="text">
              {isBounties ? t('Create a trust bounty to grow trust with your customers') : t('Your votes serve to distribute rewards to your favorite contributors.')}
            </Heading>
            <Flex>
              <Button p="0" variant="text">
                <Text color="primary" onClick={isBounties ? onPresentTrustBounties : onPresentCreate} bold fontSize="16px" mr="4px">
                  {isBounties ? t('Create an Bounty in ') : t('Create a gauge in ')}{' '}
                </Text>
                <CurrencyInputPanel
                  showInput={false}
                  currency={currency ?? inputCurency}
                  onCurrencySelect={handleInputSelect}
                  otherCurrency={currency ?? inputCurency}
                  id='contributors-currency'
                />
              </Button>
              <ArrowForwardIcon onClick={isBounties ? onPresentTrustBounties : onPresentCreate} color="primary" />
            </Flex>
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <PoolControls pools={isBounties ? bounties : pools}>
          {({ chosenPools, viewMode, stakedOnly, normalizedUrlSearch }) => (
            <>
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
