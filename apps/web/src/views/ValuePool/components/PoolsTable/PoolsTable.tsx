import { Token } from '@pancakeswap/sdk'
import { Pool } from '@pancakeswap/uikit'
import { useRef } from 'react'
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

const PoolsTable: React.FC<any> = ({ ogValuepool, pools, account, urlSearch }) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  
  return (
    <StyledTableBorder>
      <StyledTable id="pools-table" role="table" ref={tableWrapperEl}>
        {pools?.length ? 
          pools.map((vpAccount) =>
            <PoolRow 
              initialActivity={urlSearch.toLowerCase() === vpAccount.id?.toLowerCase()}
              key={vpAccount?.id?.toLowerCase()} 
              id={ogValuepool?.id?.toLowerCase()} 
              vpAccount={vpAccount} 
              account={account} 
            />
        ):null}
      </StyledTable>
    </StyledTableBorder>
  )
}

export default PoolsTable
