import { useState } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { Box, Flex, Text, useMatchBreakpoints, Pool } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { Token } from '@pancakeswap/sdk'
import Stake from 'views/Ramps/components/PoolsTable/ActionPanel/Stake'
import Harvest from 'views/Ramps/components/PoolsTable/ActionPanel/Harvest'
import PoolStatsInfo from '../../PoolStatsInfo'
import Sessions from './Sessions'

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

const ActionPanel: React.FC<any> = ({ account, pool, rampAccount, expanded }) => {
  const { userData } = pool
  const { isMobile } = useMatchBreakpoints()

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO

  const poolStakingTokenBalance = stakedBalance.plus(stakingTokenBalance)

  const [showSessions, setShowSessions] = useState(false)
  const toggleSessions = () => setShowSessions(!showSessions)

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
            <Harvest pool={pool} rampAccount={rampAccount} />
            <Stake pool={pool} rampAccount={rampAccount} toggleSessions={toggleSessions} />
          </ActionContainer>
        </Box>
      </ActionContainer>
    </StyledActionPanel>
    {showSessions && <Sessions pool={pool} />}
  </>
  )
}

export default ActionPanel
