import { TagProps, Farm} from '@pancakeswap/uikit'

interface ProposalStateTagProps extends TagProps {
  votingPower: string
}

export const ProposalStateTag: React.FC<ProposalStateTagProps> = ({ votingPower, ...props }) => {
  const [BROWN, SILVER, GOLD] = [2000, 3000, 4000]
  const { VotingPowerTag } = Farm.Tags
  
  if (Number(votingPower) >= GOLD) {
    return <VotingPowerTag votingPower={votingPower} tagType={4} />
  }

  if (Number(votingPower) >= SILVER) {
    return <VotingPowerTag votingPower={votingPower} tagType={3} />
  }

  if (Number(votingPower) >= BROWN) {
    return <VotingPowerTag votingPower={votingPower} tagType={2} />
  }
  
  return <VotingPowerTag votingPower={votingPower} tagType={1}/>
}

interface ProposalTypeTagProps extends TagProps {
  isCoreProposal: boolean
}

export const ProposalTypeTag: React.FC<any> = ({ isCoreProposal, ...props }) => {
  const { CommunityTag, CoreTag } = Farm.Tags
  
  if (isCoreProposal) {
    return <CoreTag {...props} />
  }

  return <CommunityTag {...props} />
}
