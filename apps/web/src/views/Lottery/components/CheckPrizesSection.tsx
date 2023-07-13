import { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import { Button, Heading, Text, Flex, useModal, AutoRenewIcon, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { FetchStatus, LotteryStatus } from 'config/constants/types'
import { useTranslation } from '@pancakeswap/localization'
import { useGetPendingReward, useGetUserLotteriesGraphData, useLottery } from 'state/lottery/hooks'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { GreyedOutContainer } from 'views/TrustBounties/components/styles'
import ClaimPrizesModal from './ClaimPrizesModal'
import useGetUnclaimedRewards from '../hooks/useGetUnclaimedRewards'

const TicketImage = styled.img`
  height: 60px;
  ${({ theme }) => theme.mediaQueries.sm} {
    height: 100px;
  }
`

const TornTicketImage = styled.img`
  height: 54px;
  ${({ theme }) => theme.mediaQueries.sm} {
    height: 84px;
  }
`

const CheckPrizesSection = ({ currentTokenId }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const {
    lotteryData: { status },
  } = useLottery()
  // const currTokenData = useMemo(() => tokenData?.length ? tokenData[parseInt(currentTokenId)] : {}, [tokenData, currentTokenId])
  const [hasCheckedForRewards, setHasCheckedForRewards] = useState(false)
  const [hasRewardsToClaim, setHasRewardsToClaim] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  // const pendingReward = useGetPendingReward(account, currentLotteryId, currTokenData?.token?.address)
  const { fetchAllRewards, unclaimedRewards, fetchStatus } = useGetUnclaimedRewards({currentTokenId, activeIndex})
  const [onPresentClaimModal] = useModal(<ClaimPrizesModal currentTokenId={currentTokenId} roundsToClaim={unclaimedRewards} />, false)
  const isFetchingRewards = fetchStatus === FetchStatus.Fetching
  const lotteryIsNotClaimable = status === LotteryStatus.CLOSE
  const isCheckNowDisabled = lotteryIsNotClaimable

  useEffect(() => {
    if (fetchStatus === FetchStatus.Fetched) {
      // Manage showing unclaimed rewards modal once per page load / once per lottery state change
      if (unclaimedRewards.length > 0 && !hasCheckedForRewards) {
        setHasRewardsToClaim(unclaimedRewards[0] > 0)
        setHasCheckedForRewards(true)
        if (unclaimedRewards[0] > 0) onPresentClaimModal()
      }

      if (unclaimedRewards.length > 0 && !hasCheckedForRewards) {
        setHasRewardsToClaim(unclaimedRewards[0] > 0)
        setHasCheckedForRewards(true)
      }
    }
  }, [unclaimedRewards, hasCheckedForRewards, fetchStatus, onPresentClaimModal])

  useEffect(() => {
    // Clear local state on account change, or when lottery isTransitioning state changes
    setHasRewardsToClaim(false)
    setHasCheckedForRewards(false)
  }, [account])

  const getBody = () => {
    if (!account) {
      return (
        <Flex alignItems="center" justifyContent="center">
          <TicketImage src="/images/lottery/ticket-l.png" alt="lottery ticket" />
          <Flex mx={['4px', null, '16px']} flexDirection="column" alignItems="center">
            <Heading textAlign="center" color="#F4EEFF">
              {t('Connect your wallet')}
            </Heading>
            <Heading textAlign="center" color="#F4EEFF" mb="24px">
              {t("to check if you've won!")}
            </Heading>
            <ConnectWalletButton width="190px" />
          </Flex>
          <TicketImage src="/images/lottery/ticket-r.png" alt="lottery ticket" />
        </Flex>
      )
    }
    if (hasCheckedForRewards && !hasRewardsToClaim) {
      return (
        <Flex alignItems="center" justifyContent="center">
          <TornTicketImage src="/images/lottery/torn-ticket-l.png" alt="torn lottery ticket" />
          <Flex mx={['4px', null, '16px']} flexDirection="column">
            <Heading textAlign="center" color="#F4EEFF">
              {t('No prizes to collect')}...
            </Heading>
            <Heading textAlign="center" color="#F4EEFF">
              {t('Better luck next time!')}
            </Heading>
          </Flex>
          <TornTicketImage src="/images/lottery/torn-ticket-r.png" alt="torn lottery ticket" />
        </Flex>
      )
    }
    if (hasCheckedForRewards && hasRewardsToClaim) {
      return (
        <Flex alignItems="center" justifyContent="center">
          <TicketImage src="/images/lottery/ticket-l.png" alt="lottery ticket" />
          <Flex mx={['4px', null, '16px']} flexDirection="column">
            <Heading textAlign="center" color="#F4EEFF">
              {t('Congratulations!')}
            </Heading>
            <Heading textAlign="center" color="#F4EEFF">
              {t('Why not play again')}
            </Heading>
          </Flex>
          <TicketImage src="/images/lottery/ticket-r.png" alt="lottery ticket" />
        </Flex>
      )
    }
    const checkNowText = () => {
      if (lotteryIsNotClaimable) {
        return `${t('Calculating rewards')}...`
      }
      if (isFetchingRewards) {
        return t('Checking')
      }
      return t('Check Winnings')
    }
    return (
      <Flex alignItems="center" justifyContent="center">
        <TicketImage src="/images/lottery/ticket-l.png" alt="lottery ticket" />
        <Flex mx={['4px', null, '16px']} flexDirection="column">
          <Heading textAlign="center" color="#F4EEFF" mb="24px">
            {t('Are you a referrer?')}
          </Heading>
          <Flex justifyContent='center' alignItems='center'>
            <StyledItemRow>
              <ButtonMenu scale="xs" mb="10px" variant='subtle' activeIndex={activeIndex} onItemClick={setActiveIndex}>
                <ButtonMenuItem >{t('No')}</ButtonMenuItem>
                <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
              </ButtonMenu>
            </StyledItemRow>
          </Flex>
          <Button
            disabled={isCheckNowDisabled}
            onClick={fetchAllRewards}
            isLoading={isFetchingRewards}
            endIcon={isFetchingRewards ? <AutoRenewIcon color="currentColor" spin /> : null}
          >
            {checkNowText()}
          </Button>
        </Flex>
        <TicketImage src="/images/lottery/ticket-r.png" alt="lottery ticket" />
      </Flex>
    )
  }

  return <Flex>{getBody()}</Flex>
}

export default CheckPrizesSection
