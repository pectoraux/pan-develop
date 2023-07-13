import { Token } from '@pancakeswap/sdk'
import { Pool } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import styled from 'styled-components'
import BountyRow from 'views/TrustBounties/components/PoolsTable/PoolRow'
import ValuepoolsRow from 'views/ValuePools/components/PoolsTable/PoolRow'
import PoolRow from './PoolRow'

interface PoolsTableProps {
  pools: Pool.DeserializedPool<Token>[]
  account: string
  variant: "trustbounties" | "stakemarket"
  urlSearch?: string
}

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  scroll-margin-top: 64px;

  background-color: ${({ theme }) => theme.card.background};
  > div:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
  }
`

const StyledTableBorder = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  background-color: ${({ theme }) => theme.colors.cardBorder};
  padding: 1px 1px 3px 1px;
  background-size: 400% 400%;
`

const PoolsTable: React.FC<any> = ({ pools, account, variant, urlSearch }) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const isFromContracts = router.asPath.includes('#stakemarket')
  || router.asPath.includes('#trustbounties')
  || router.asPath.includes('#valuepools')
  const indexFromContracts = router.asPath.includes('#stakemarket')
  ? 0 
  : router.asPath.includes('#trustbounties')
  ? 1 
  : router.asPath.includes('#valuepools')
  ? 2
  : 3
  const isExact = router.pathname.includes('stakemarket')
  const isBounty = router.pathname.includes('trustbounties')
  const isVP = router.pathname.includes('valuepools')
  const indexFromRoot = isExact ? 0 : isBounty ? 1 : isVP ? 2 : 3
  const activeIndex = isFromContracts ? indexFromContracts : indexFromRoot
  console.log("PoolsTable====================>", pools)

  return (
    <StyledTableBorder>
      <StyledTable id="pools-table" role="table" ref={tableWrapperEl}>
        {pools
        .filter((pool) => !pool?.appliedTo)
        .map((pool) =>
          !activeIndex ?
          <PoolRow
            initialActivity={urlSearch.toLowerCase() === pool?.earningToken?.symbol?.toLowerCase()}
            key={pool.sousId}
            variant={variant}
            sousId={pool.sousId}
            account={account}
          />
          : activeIndex === 1 ?
          <BountyRow
            initialActivity={urlSearch.toLowerCase() === pool?.earningToken?.symbol?.toLowerCase()}
            key={pool.sousId}
            variant={variant}
            sousId={pool.sousId}
            account={account}
          />:
          <ValuepoolsRow
            initialActivity={urlSearch.toLowerCase() === pool?.earningToken?.symbol?.toLowerCase()}
            key={pool.sousId}
            variant={variant}
            sousId={pool.sousId}
            account={account}
          />
        )}
      </StyledTable>
    </StyledTableBorder>
  )
}

export default PoolsTable
