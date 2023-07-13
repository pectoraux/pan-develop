import { useState } from 'react'
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
  AutoRenewIcon,
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
import { useCurrency } from 'hooks/Tokens'
import { useTranslation } from '@pancakeswap/localization'
import { usePoolsPageFetch, usePoolsWithFilterSelector } from 'state/valuepools/hooks'
import Page from 'components/Layout/Page'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Token } from '@pancakeswap/sdk'
import { TokenPairImage } from 'components/TokenImage'
import CreateGaugeModal from 'views/ValuePools/components/CreateGaugeModal'

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
  const { pools, userDataLoaded } = usePoolsWithFilterSelector()
  const valuepool = router.query.valuepool as string
  const ogValuepool = pools.find((pool) => pool?.id?.toLowerCase() === valuepool?.toLowerCase())
  const isOwner = ogValuepool?.devaddr_ === account
  const currency = useCurrency(ogValuepool?.tokenAddress)
  const [onPresentAdminSettings] = useModal(<CreateGaugeModal variant="admin" currency={currency} location="header" pool={ogValuepool} />,)
  const [onPresentUserSettings] = useModal(<CreateGaugeModal variant="user" currency={currency} location="header" pool={ogValuepool} />,)
  const [onPresentDeleteARP] = useModal(<CreateGaugeModal variant="delete" currency={currency} />,)
  console.log("ogValuepool======================>", ogValuepool, pools, currency)
  usePoolsPageFetch()
  
  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {ogValuepool?.name}
            </Heading>
            <Heading scale="md" color="textDisabled">
              {t('%vp%', { vp: valuepool ?? '' })}
            </Heading>
            <Heading scale="md" color="text">
              {ogValuepool?.description}
            </Heading> 
            <Flex pt="17px">
              <Button p="0" 
                onClick={isOwner && currency ? onPresentAdminSettings : currency ? onPresentUserSettings : undefined} 
                variant="text">
                <Text color="primary" bold fontSize="16px" mr="4px">
                  {isOwner ? t('Admin Settings') : t("Settings")}
                </Text>
                {currency ?
                <ArrowForwardIcon color="primary" 
                  onClick={isOwner ? onPresentAdminSettings : onPresentUserSettings} />
                : <AutoRenewIcon spin color="currentColor" />}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <Box mb="48px">
          <Breadcrumbs>
            <Link href="/valuepools">{t('Valuepools')}</Link>
            <Text>{valuepool}</Text>
          </Breadcrumbs>
        </Box>
        <PoolControls pool={ogValuepool}>
          {({ chosenPools, viewMode, stakedOnly, normalizedUrlSearch }) => (
            <>
              {account && !userDataLoaded && stakedOnly && (
                <Flex justifyContent="center" mb="4px">
                  <Loading />
                </Flex>
              )}
              {isOwner ? 
              <FinishedTextButton as={Link} 
              onClick={onPresentDeleteARP} 
              fontSize={['16px', null, '20px']} color="failure" pl={17}>
                {t('Delete Valuepool!')}
              </FinishedTextButton>:null}
              {viewMode === ViewMode.CARD ? (
                <CardLayout>
                  {chosenPools.map((pool) =>
                      <Pool.PoolCard<Token>
                        key={pool.id}
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
                <PoolsTable urlSearch={normalizedUrlSearch} ogValuepool={ogValuepool} pools={chosenPools} account={account} />
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
