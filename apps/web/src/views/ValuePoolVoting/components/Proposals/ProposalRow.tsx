import { ArrowForwardIcon, Box, IconButton, Flex, Text, NextLinkFromReactRouter, Farm as FarmUI } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Proposal } from 'state/types'
import { useGetTokenData } from 'state/ramps/hooks'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { isCoreProposal } from '../../helpers'
import TimeFrame from './TimeFrame'
import { ProposalStateTag, ProposalTypeTag } from './tags'

interface ProposalRowProps {
  proposal: Proposal
}

const StyledProposalRow = styled(NextLinkFromReactRouter)`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  display: flex;
  padding: 16px 24px;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.dropdown};
  }
`

const ProposalRow: React.FC<any> = ({ proposal }) => {
  const votingLink = `/valuepools/voting/${proposal.id}`
  const { VotesTag } = FarmUI.Tags
  const tokenData = useGetTokenData(proposal?.id?.split('-')[0]) as any
  const upVotes = getBalanceNumber(proposal?.upVotes ?? 0, tokenData?.decimals)
  const downVotes = getBalanceNumber(proposal?.downVotes ?? 0, tokenData?.decimals)
  console.log("votingLink===========>", proposal)
  return (
    <StyledProposalRow to={votingLink}>
      <Box as="span" style={{ flex: 1 }}>
        <Text bold mb="8px">
          {proposal.title}
        </Text>
        <Flex justifyContent="flex" mb="8px">
          <VotesTag votingPower={upVotes?.toString()} color="green" />
        </Flex>
        <Flex justifyContent="flex" mb="8px">
          <VotesTag votingPower={downVotes?.toString()} color="red" />
        </Flex>
        <Flex alignItems="center" mb="8px">
          <TimeFrame startDate={proposal.created} endDate={proposal.endTime} proposalState={proposal.active} />
        </Flex>
        <Flex alignItems="center">
          <ProposalStateTag proposalState={proposal.active} />
          <ProposalTypeTag isCoreProposal={isCoreProposal(proposal)} ml="8px" />
        </Flex>
      </Box>
      <IconButton variant="text">
        <ArrowForwardIcon width="24px" />
      </IconButton>
    </StyledProposalRow>
  )
}

export default ProposalRow
