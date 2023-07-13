import { useRouter } from 'next/router'
import {
  BscScanIcon,
  Flex,
  IconButton,
  Link,
  Button,
  useModal,
  Grid,
  Box,
  Heading,
  VisibilityOff,
  VisibilityOn,
  Text,
  ArrowForwardIcon,
  NextLinkFromReactRouter as ReactRouterLink,
} from '@pancakeswap/uikit'
import { useCurrency } from 'hooks/Tokens'
import { DEFAULT_TFIAT } from 'config/constants/exchange'
import { useTranslation } from '@pancakeswap/localization'
import { getBlockExploreLink, isAddress } from 'utils'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { Profile } from 'state/types'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useMemo, useState, useCallback } from 'react'
import { useGetSharedEmail } from 'state/profile/hooks'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import CreateBountyModal from 'views/TrustBounties/components/CreateBountyModal'
import EditProfileAvatar from './EditProfileAvatar'
import BannerHeader from '../../Nft/market/components/BannerHeader'
import StatBox, { StatBoxItem } from '../../Nft/market/components/StatBox'
import CreateGaugeModal from './CreateGaugeModal'
import AvatarImage from '../../Nft/market/components/BannerHeader/AvatarImage'

interface HeaderProps {
  accountPath: string
  profile: Profile
  nftCollected: number
  isValidating: boolean
  isProfileLoading: boolean
  onSuccess?: () => void
}

// Account and profile passed down as the profile could be used to render _other_ users' profiles.
const ProfileHeader: React.FC<any> = ({
  accountPath,
  profile,
  nftCollected,
  isValidating,
  isProfileLoading,
  onSuccess,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [showUsername, setShowUsername] = useState(false)
  const { sharedEmail } = useGetSharedEmail(account)
  const inputCurency = useCurrency(DEFAULT_TFIAT)
  const [currency, setCurrency] = useState(inputCurency)
  const handleInputSelect = useCallback((currencyInput) => setCurrency(currencyInput),[],)
  const [openPresentCreateProfile] = useModal(<CreateGaugeModal variant="create" profile={profile} onSuccess={onSuccess} />,)
  const [openPresentAddAccount] = useModal(<CreateGaugeModal variant="add" profile={profile} onSuccess={onSuccess} />,)
  
  const isConnectedAccount = isAddress(account) === isAddress(accountPath)
  const numNftCollected = profile ? (nftCollected ? formatNumber(nftCollected, 0, 0) : '-') : '-'
  const numFollowers = profile ? (profile.followers?.length ? formatNumber(profile.followers?.length, 0, 0) : '-') : '-'
  const numFollowees = profile ? (profile.followees?.length ? formatNumber(profile.followees?.length, 0, 0) : '-') : '-'

  const avatarImage = profile?.nft?.image?.thumbnail || '/images/nfts/no-profile-md.png'
  const profileTeamId = profile?.teamId
  const hasProfile = !!profile
  const toggleUsername = () => setShowUsername(!showUsername)
  const profileUsername = showUsername ? profile?.name : null

  const Icon = !showUsername ? VisibilityOff : VisibilityOn
  const isBounties = useRouter().asPath.includes('bounties')
  const [onPresentTrustBounties] = useModal(
    <CreateBountyModal
      currency={currency ?? inputCurency} 
    />,
  )
  
  const bannerImage = useMemo(() => {
    const imagePath = '/images/teams'
    switch (profileTeamId) {
      case 1:
        return `${imagePath}/storm-banner.png`
      case 2:
        return `${imagePath}/flippers-banner.png`
      case 3:
        return `${imagePath}/cakers-banner.png`
      default:
        break
    }
    return `${imagePath}/no-team-banner.png`
  }, [profileTeamId])

  const avatar = useMemo(() => {
    const getIconButtons = () => {
      return (
        // TODO: Share functionality once user profiles routed by ID
        <Flex display="inline-flex">
          {accountPath && (
            <IconButton
              as="a"
              target="_blank"
              style={{
                width: 'fit-content',
              }}
              href={getBlockExploreLink(accountPath, 'address') || ''}
              // @ts-ignore
              alt={t('View BscScan for user address')}
            >
              <BscScanIcon width="20px" color="primary" />
            </IconButton>
          )}
        </Flex>
      )
    }

    const getImage = () => {
      return (
        <>
          {hasProfile && accountPath && isConnectedAccount ? (
            <EditProfileAvatar
              src={avatarImage}
              alt={t('User profile picture')}
              onSuccess={() => {
                onSuccess?.()
              }}
            />
          ) : (
            <AvatarImage src={avatarImage} alt={t('User profile picture')} />
          )}
        </>
      )
    }
    return (
      <>
        {getImage()}
        {getIconButtons()}
      </>
    )
  }, [accountPath, avatarImage, isConnectedAccount, onSuccess, hasProfile, t])

  const title = useMemo(() => {
    if (profileUsername) {
      return `@${profileUsername}`
    }

    if (accountPath) {
      return truncateHash(accountPath, 5, 3)
    }

    return null
  }, [profileUsername, accountPath])

  const description = useMemo(() => {
    // eslint-disable-next-line consistent-return
    const getActivateButton = () => {
      if (!sharedEmail) {
        return (
          <ReactRouterLink to="/ssi/createAutomaticData">
            <Button mt="16px">{t('Verify Your Email')}</Button>
          </ReactRouterLink>
        )
      }
      if (!profile) {
        return (
          <Button width="fit-content" mt="16px" onClick={openPresentCreateProfile}>
            {t('Create Profile')}
          </Button>
        )
      }
      if (profile && !profile?.accounts?.length) {
        return (
          <Button width="fit-content" mt="16px" onClick={openPresentAddAccount}>
            {t('Add Account')}
          </Button>
        )
      }
      if (isBounties) {
        return (
          // <Button width="fit-content" mt="16px" onClick={openPresentAddAccount}>
          //   {t('Create Bounty')}
          // </Button>
          <Flex>
          <Button p="0" variant="text">
            <Text color="primary" onClick={onPresentTrustBounties} bold fontSize="16px" mr="4px">
                {t('Create an Bounty in ')}{' '}
            </Text>
            <CurrencyInputPanel
              showInput={false}
              currency={currency ?? inputCurency}
              onCurrencySelect={handleInputSelect}
              otherCurrency={currency ?? inputCurency}
              id='bounties-currency'
            />
          </Button>
          <ArrowForwardIcon onClick={onPresentTrustBounties} color="primary" />
        </Flex>
        )
      }
    }

    return (
      <Flex flexDirection="column" mb={[16, null, 0]} mr={[0, null, 16]}>
        {accountPath && profile?.username && (
          <Link href={getBlockExploreLink(accountPath, 'address')} external bold color="primary">
            {truncateHash(accountPath)}
          </Link>
        )}
        {accountPath && isConnectedAccount && (!profile || !profile?.nft) && getActivateButton()}
      </Flex>
    )
  }, [accountPath, isConnectedAccount, sharedEmail, openPresentCreateProfile, openPresentAddAccount, profile, t])

  return (
    <>
      <BannerHeader bannerImage={bannerImage} bannerAlt={t('User team banner')} avatar={avatar} />
      <Grid
        pb="48px"
        gridGap="16px"
        alignItems="center"
        gridTemplateColumns={['1fr', null, null, null, 'repeat(2, 1fr)']}
      >
        <Box>
          <Heading as="h1" scale="xl" color="secondary" mb="16px">
            {title}
            {isConnectedAccount && profile?.name ? (
              <Icon ml="4px" onClick={toggleUsername} cursor="pointer" />
            ):null}
          </Heading>
          {!isProfileLoading && !isValidating ? description : null}
        </Box>
        <Box>
          <StatBox>
            <StatBoxItem title={t('NFT Collected')} stat={numNftCollected} />
            <StatBoxItem title={t('Followers')} stat={numFollowers} />
            <StatBoxItem title={t('Following')} stat={numFollowees} />
          </StatBox>
        </Box>
      </Grid>
    </>
  )
}

export default ProfileHeader
