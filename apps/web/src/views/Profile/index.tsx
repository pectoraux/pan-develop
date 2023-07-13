import { FC, useCallback } from 'react'
import { useRouter } from 'next/router'
import { isAddress } from 'utils'
import { useProfileForAddress, usePoolsPageFetch } from 'state/profile/hooks'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import MarketPageHeader from '../Nft/market/components/MarketPageHeader'
import ProfileHeader from './components/ProfileHeader'
import NoNftsImage from '../Nft/market/components/Activity/NoNftsImage'
import TabMenu from './components/TabMenu'

const TabMenuWrapper = styled(Box)`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0%);

  ${({ theme }) => theme.mediaQueries.sm} {
    left: auto;
    transform: none;
  }
`

const NftProfile: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const accountAddress = useRouter().query.accountAddress as string
  const { t } = useTranslation()
  usePoolsPageFetch()
  const invalidAddress = !accountAddress || isAddress(accountAddress) === false

  const {
    profile,
    isValidating: isProfileValidating,
    isFetching: isProfileFetching,
    refresh: refreshProfile,
  } = useProfileForAddress(accountAddress, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  })

  // const {
  //   nfts: userNfts,
  //   isLoading: isNftLoading,
  //   refresh: refreshUserNfts,
  // } = useNftsForAddress(accountAddress, profile, isProfileValidating)

  const onSuccess = useCallback(async () => {
    await refreshProfile()
    // refreshUserNfts()
  }, [
    refreshProfile, 
    // refreshUserNfts
  ])

  if (invalidAddress) {
    return (
      <>
        <MarketPageHeader position="relative">
          <ProfileHeader
            accountPath={accountAddress}
            profile={null}
            nftCollected={null}
            isValidating={false}
            isProfileLoading={false}
          />
        </MarketPageHeader>
        <Page style={{ minHeight: 'auto' }}>
          <Flex p="24px" flexDirection="column" alignItems="center">
            <NoNftsImage />
            <Text textAlign="center" maxWidth="420px" pt="8px" bold>
              {t('Please enter a valid address, or connect your wallet to view your profile')}
            </Text>
          </Flex>
        </Page>
      </>
    )
  }

  return (
    <>
      <MarketPageHeader position="relative">
        <ProfileHeader
          accountPath={accountAddress}
          profile={profile}
          nftCollected={0}
          isProfileLoading={isProfileFetching}
          isValidating={isProfileValidating}
          onSuccess={onSuccess}
        />
        <TabMenuWrapper>
          <TabMenu id={profile?.id} />
        </TabMenuWrapper>
      </MarketPageHeader>
      <Page style={{ minHeight: 'auto' }}>{children}</Page>
    </>
  )
}

export const NftProfileLayout: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  return <NftProfile>{children}</NftProfile>
}

export default NftProfile
