import styled from 'styled-components'
import { Box, Breadcrumbs, Card, Flex, Heading, SearchInput, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import Link from 'next/link'
import { useTranslation } from '@pancakeswap/localization'
import Container from 'components/Layout/Container'
import useSWR from 'swr'
import { ProposalState, ProposalType } from 'state/types'
import { FetchStatus } from 'config/constants/types'
import { useSessionStorage } from 'hooks/useSessionStorage'
import { getLitigationsSg } from 'state/stakemarketvoting/helpers'
import { filterProposalsByType } from '../../helpers'
import ProposalsLoading from './ProposalsLoading'
import TabMenu from './TabMenu'
import ProposalRow from './ProposalRow'
import LocationFilters from './LocationFilters'

interface State {
  proposalType: ProposalType
  filterState: ProposalState
}

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`
const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const Proposals = () => {
  const { t } = useTranslation()
  const [state, setState] = useSessionStorage<State>('proposals-filter', {
    proposalType: ProposalType.CORE,
    filterState: ProposalState.ACTIVE,
  })

  const { proposalType, filterState } = state

  // const { status, data } = useSWR(['proposals', filterState], async () => getProposals(1000, 0, filterState))
  const { status, data } = useSWR('litigations', async () => getLitigationsSg())
  console.log("getLitigationsSg==============>", data, status)

  const handleProposalTypeChange = (newProposalType: ProposalType) => {
    setState((prevState) => ({
      ...prevState,
      proposalType: newProposalType,
    }))
  }

  const filteredProposals = filterProposalsByType(data, proposalType)
  const { isMobile } = useMatchBreakpoints()

  return (
    <Container py="40px">
      <Box mb="48px">
      <FilterContainer>
        <Breadcrumbs>
          <Link href="/stakemarket">{t('Stake Market')}</Link>
          <Text>{t('Voting')}</Text>
        </Breadcrumbs>
        {isMobile && <LocationFilters style={{ paddingTop: 16, maxWidth: "100%", overflow: 'auto' }} />}
        <LabelWrapper style={{ marginLeft: 100 }}>
          {!isMobile && 
          <>
          <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
              {t('Filter by')}
            </Text>
          <LocationFilters />
          </>
          }
        </LabelWrapper>
        <LabelWrapper style={{ marginLeft: 16 }}>
          <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
            {t('Search')}
          </Text>
          <SearchInput onChange={()=>{ return null }} placeholder={t("Search litigations")} />
        </LabelWrapper>
        </FilterContainer>
      </Box>
      <Heading as="h2" scale="xl" mb="32px" id="voting-proposals">
        {t('Litigations')}
      </Heading>
      <Card>
        <TabMenu proposalType={proposalType} onTypeChange={handleProposalTypeChange} />
        {status !== FetchStatus.Fetched && <ProposalsLoading />}
        {status === FetchStatus.Fetched &&
          filteredProposals.length > 0 &&
          filteredProposals.map((proposal) => {
            return <ProposalRow key={proposal.id} proposal={proposal} />
          })}
        {status === FetchStatus.Fetched && filteredProposals.length === 0 && (
          <Flex alignItems="center" justifyContent="center" p="32px">
            <Heading as="h5">{t('No litigations found')}</Heading>
          </Flex>
        )}
      </Card>
    </Container>
  )
}

export default Proposals
