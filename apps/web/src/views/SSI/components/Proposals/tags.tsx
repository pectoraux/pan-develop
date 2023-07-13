import { TagProps, Farm as FarmUI } from '@pancakeswap/uikit'
import { EntryState, EntryType } from 'state/types'

const { ActiveTag, CommunityTag, ExpiredTag, PendingTag, TypeTag } = FarmUI.Tags

interface ProposalStateTagProps extends TagProps {
  entryState: EntryState
}

export const ProposalStateTag: React.FC<React.PropsWithChildren<ProposalStateTagProps>> = ({
  entryState,
  ...props
}) => {
  if (entryState === EntryState.ACTIVE) {
    return <ActiveTag {...props} />
  }

  if (entryState === EntryState.EXPIRED) {
    return <ExpiredTag {...props} />
  }

  return <PendingTag {...props} />
}

interface ProposalTypeTagProps extends TagProps {
  entryType: EntryType 
}

export const ProposalTypeTag: React.FC<any> = ({ entryType, ...props }) => {
  return <TypeTag entryType={entryType.toString()} {...props} />
}
