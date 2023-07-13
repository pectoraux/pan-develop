import { Token } from '@pancakeswap/sdk'
import { Pool } from '@pancakeswap/uikit'
import { useRef, useMemo } from 'react'
import styled from 'styled-components'
import PoolRow from './PoolRow'

interface PoolsTableProps {
  pools: any
  account: string
  urlSearch?: string
  ogArp?: any
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

const PoolsTable: React.FC<any> = ({ pools, account, urlSearch }) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const ogArp = useMemo(() => pools?.length && pools[0], [pools]) as any

  return (
    <StyledTableBorder>
      <StyledTable id="pools-table" role="table" ref={tableWrapperEl}>
        {ogArp.accounts?.map((pool) =>
          <PoolRow
            initialActivity={urlSearch.toLowerCase() === pool?.earningToken?.symbol?.toLowerCase()}
            key={pool.sousId}
            sousId={pool.sousId}
            id={ogArp?.sousId}
            account={account}
            currAccount={pool}
          />
        )}
      </StyledTable>
    </StyledTableBorder>
  )
}

export default PoolsTable
