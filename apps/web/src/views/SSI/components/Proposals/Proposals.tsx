import { Box, Breadcrumbs, Card, Flex, Heading, Text } from '@pancakeswap/uikit'
import Link from 'next/link'
import { useTranslation } from '@pancakeswap/localization'
import Container from 'components/Layout/Container'
import useSWR from 'swr'
import { EntryState, EntryType } from 'state/types'
import { getSSIData } from 'state/ssi/helpers'
import { FetchStatus } from 'config/constants/types'
import { useSessionStorage } from 'hooks/useSessionStorage'
import { useWeb3React } from '@pancakeswap/wagmi'
import { AddressZero } from '@ethersproject/constants'
import { filterProposalsByState, filterProposalsByType } from '../../helpers'
import ProposalsLoading from './ProposalsLoading'
import TabMenu from './TabMenu'
import ProposalRow from './ProposalRow'
import Filters from './Filters'

interface State {
  proposalType: EntryType
  filterState: EntryState
}

const Proposals = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const [state, setState] = useSessionStorage<State>('proposals-filter', {
    proposalType: EntryType.SHARED,
    filterState: EntryState.ACTIVE,
  })

  const { proposalType, filterState } = state
  const { status, data } = useSWR(['data9', filterState], async () => getSSIData(1000, 0, account?.toLowerCase() ?? ''))
  console.log("getSSIData================>", data)
  const handleProposalTypeChange = (newProposalType: EntryType) => {
    setState((prevState) => ({
      ...prevState,
      proposalType: newProposalType,
    }))
  }

  const handleFilterChange = (newFilterState: EntryState) => {
    setState((prevState) => ({
      ...prevState,
      filterState: newFilterState,
    }))
  }
  const filteredProposals = filterProposalsByState(filterProposalsByType(data, proposalType), filterState)
  return (
    <Container py="40px">
      <Box mb="48px">
        <Breadcrumbs>
          <Link href="/">{t('Home')}</Link>
          <Text>{t('SSI')}</Text>
        </Breadcrumbs>
      </Box>
      <Heading as="h2" scale="xl" mb="32px" id="ssi-proposals">
        {t('Entries')}
      </Heading>
      <Card>
        <TabMenu proposalType={proposalType} onTypeChange={handleProposalTypeChange} />
        <Filters
          filterState={filterState}
          onFilterChange={handleFilterChange}
          isLoading={status !== FetchStatus.Fetched}
        />
        {status !== FetchStatus.Fetched && <ProposalsLoading />}
        {status === FetchStatus.Fetched &&
          filteredProposals?.length > 0 &&
          filteredProposals?.map((proposal) => {
            return <ProposalRow 
                    key={proposal.id}
                    account={account} 
                    entry={proposal} 
                    />
          })}
        {status === FetchStatus.Fetched && filteredProposals?.length === 0 && (
          <Flex alignItems="center" justifyContent="center" p="32px">
            <Heading as="h5">{t('No entry found')}</Heading>
          </Flex>
        )}
      </Card>
    </Container>
  )
}

export default Proposals
