import { TagProps, Farm as FarmUI } from '@pancakeswap/uikit'

const { ClosedTag, OpenedTag, VoteNowTag } = FarmUI.Tags

interface ProposalTypeTagProps extends TagProps {
  isCoreProposal: boolean
}

export const ProposalStateTag: React.FC<any> = ({
  isCoreProposal,
  ...props
}) => {
  if (!isCoreProposal) {
    return <VoteNowTag {...props} />
  }
  return <></>
}

export const ProposalTypeTag: React.FC<any> = ({
  isCoreProposal,
  ...props
}) => {
  if (!isCoreProposal) {
    return <ClosedTag {...props} />
  }

  return <OpenedTag {...props} />
}

export const ColorTag: React.FC<any> = ({ votingPower }) => {
  const [BROWN, SILVER, GOLD] = [25, 50, 75]
  const { VotingPowerTag } = FarmUI.Tags
  
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
