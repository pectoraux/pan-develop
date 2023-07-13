import { Token } from '@pancakeswap/sdk'
import { Pool } from '@pancakeswap/uikit'
import { useRef, useMemo } from 'react'
import styled from 'styled-components'
import PoolRow from './PoolRow'

interface PoolsTableProps {
  pools: Pool.DeserializedPool<Token>[]
  account: string
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

const PoolsTable: React.FC<any> = ({ pools, account, urlSearch }) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const ogWill = useMemo(() => pools?.length && pools[0], [pools])

  return (
    <StyledTableBorder>
      <StyledTable id="pools-table" role="table" ref={tableWrapperEl}>
        {ogWill.accounts?.map((pool) =>
          <PoolRow
            initialActivity={urlSearch.toLowerCase() === pool?.earningToken?.symbol?.toLowerCase()}
            key={pool?.id}
            sousId={pool.sousId}
            id={ogWill?.sousId}
            account={account}
            currAccount={pool}
          />
        )}
      </StyledTable>
    </StyledTableBorder>
  )
}

export default PoolsTable
