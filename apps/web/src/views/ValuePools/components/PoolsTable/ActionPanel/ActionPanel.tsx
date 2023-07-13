import { useState } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { Box, Flex, Text, useMatchBreakpoints, Pool } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { Token } from '@pancakeswap/sdk'
import Harvest from './Harvest'
import Stake from './Stake'
import PoolStatsInfo from '../../PoolStatsInfo'
import Purchases from './Purchases'
import Sponsors from './Sponsors'

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 1000px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 1000px;
  }
  to {
    max-height: 0px;
  }
`

const StyledActionPanel = styled.div<{ expanded: boolean }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.dropdown};
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  padding: 12px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    padding: 16px 32px;
  }
`

const ActionContainer = styled.div<{ isAutoVault?: boolean; hasBalance?: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  flex-wrap: wrap;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: ${({ isAutoVault }) => (isAutoVault ? 'row' : null)};
    align-items: ${({ isAutoVault, hasBalance }) => (isAutoVault ? (hasBalance ? 'flex-start' : 'stretch') : 'center')};
  }
`

type MediaBreakpoints = {
  isXs: boolean
  isSm: boolean
  isMd: boolean
  isLg: boolean
  isXl: boolean
  isXxl: boolean
}

interface ActionPanelProps {
  account: string
  pool?: any
  expanded: boolean
  breakpoints: MediaBreakpoints
}

const InfoSection = styled(Box)`
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;

  padding: 8px 8px;
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0;
    flex-basis: 230px;
    ${Text} {
      font-size: 14px;
    }
  }
`

const ActionPanel: React.FC<any> = ({ account, pool, expanded }) => {
  const { userData } = pool
  const { isMobile } = useMatchBreakpoints()

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO

  const poolStakingTokenBalance = stakedBalance.plus(stakingTokenBalance)

  const [showSponsors, setShowSponsors] = useState(false)
  const toggleSponsors = () => setShowSponsors(!showSponsors)

  const [showScheduledPurchases, setShowScheduledPurchases] = useState(false)
  const toggleScheduledPurchases = () => setShowScheduledPurchases(!showScheduledPurchases)
  
  return (
    <>
    <StyledActionPanel expanded={expanded}>
      <InfoSection>
        <Flex flexDirection="column" mb="8px">
          <PoolStatsInfo pool={pool} account={account} showTotalStaked={isMobile} alignLinksToRight={isMobile} />
        </Flex>
      </InfoSection>
      <ActionContainer>
        <Box width="100%">
          <ActionContainer hasBalance={poolStakingTokenBalance.gt(0)}>
            <Harvest pool={pool} />
            <Stake 
              sousId={pool.sousId} 
              id={pool.id}
              toggleSponsors={toggleSponsors}
              toggleScheduledPurchases={toggleScheduledPurchases} 
            />
          </ActionContainer>
        </Box>
      </ActionContainer>
    </StyledActionPanel>
    {showSponsors && <Sponsors sponsors={pool?.sponsors ?? []} />}
    {showScheduledPurchases && <Purchases queue={pool?.queue} valuepoolAddress={pool?.valuepoolAddress} />}
    </>
  )
}

export default ActionPanel
