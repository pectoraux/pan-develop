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
import { usePoolsPageFetch, usePoolsWithFilterSelector } from 'state/worlds/hooks'
import Page from 'components/Layout/Page'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Token } from '@pancakeswap/sdk'
import { TokenPairImage } from 'components/TokenImage'

import CardActions from './components/PoolCard/CardActions'
import AprRow from './components/PoolCard/AprRow'
import CardFooter from './components/PoolCard/CardFooter'
import PoolsTable from './components/PoolsTable/PoolsTable'
import PoolControls from './components/PoolControls'
import CreateWorldModal from './components/CreateWorldModal'

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
  const { pools, userDataLoaded } = usePoolsWithFilterSelector()
  const [onPresentCreateGauge] = useModal(<CreateWorldModal />,)

  usePoolsPageFetch()

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Worlds')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Willing to own a part of the WORLD?')}
            </Heading>
            <Heading scale="md" color="text">
              {t('You can either implement it or invest in an existing implementation. Worlds are 3D implementations of places. Think of it this way: If this was Youtube, Worlds would be videos and World contracts would be creator channels.')}
            </Heading>
            <Flex>
              <Button p="0" variant="text">
                <Text color="primary" onClick={onPresentCreateGauge} bold fontSize="16px" mr="4px">
                  {t('Create a world')}{' '}
                </Text>
              </Button>
              <ArrowForwardIcon onClick={onPresentCreateGauge} color="primary" />
            </Flex>
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
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
