import { useRouter } from 'next/router'
import { Token } from '@pancakeswap/sdk'
import { Pool, Image, Flex, Loading, ScrollToTopButtonV2 } from '@pancakeswap/uikit'
import { useRef } from 'react'
import styled from 'styled-components'
import { usePoolsWithFilterSelector } from 'state/profile/hooks'
import { usePoolsPageFetch as useBountiesPageFetch, usePoolsWithFilterSelector as useBountiesWithFilterSelector} from 'state/trustbounties/hooks'
import  BountyRow from 'views/TrustBounties/components/PoolsTable/PoolRow'
import Page from 'components/Layout/Page'
import { createPortal } from 'react-dom'
import PoolRow from './PoolRow'
import PoolControls from '../PoolControls'

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

const PoolsTable: React.FC<any> = ({ account }) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { pools, userDataLoaded: userPitchesLoaded } = usePoolsWithFilterSelector()
  const { pools: bounties, userDataLoaded: bountiesLoaded } = useBountiesWithFilterSelector()
  const isBounties = router.asPath.includes('bounties')
  const userDataLoaded = isBounties ? bountiesLoaded : userPitchesLoaded
  
  useBountiesPageFetch()

  return (
    <>
    <Page>
        <PoolControls pools={isBounties ? bounties : pools} account={account}>
          {({ chosenPools, stakedOnly, normalizedUrlSearch }) => (
            <>
              {account && !userDataLoaded && stakedOnly && (
                <Flex justifyContent="center" mb="4px">
                  <Loading />
                </Flex>
              )} 
              <StyledTableBorder>
                <StyledTable id="pools-table" role="table" ref={tableWrapperEl}>
                  {chosenPools.map((pool) =>
                    !isBounties ?
                    <PoolRow
                      initialActivity={normalizedUrlSearch.toLowerCase() === pool?.earningToken?.symbol?.toLowerCase()}
                      key={pool.sousId}
                      sousId={pool.sousId}
                      account={account}
                    />:
                    <BountyRow
                      initialActivity={normalizedUrlSearch.toLowerCase() === pool?.earningToken?.symbol?.toLowerCase()}
                      key={pool.sousId}
                      sousId={pool.sousId}
                      account={account}
                    />
                  )}
                </StyledTable>
              </StyledTableBorder>
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

export default PoolsTable
