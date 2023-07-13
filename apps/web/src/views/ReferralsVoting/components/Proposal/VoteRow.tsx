import { Flex, LinkExternal, Text, Tag, CheckmarkCircleIcon } from '@pancakeswap/uikit'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { getBlockExploreLink } from 'utils'
import { useTranslation } from '@pancakeswap/localization'
import { Vote } from 'state/types'
import { IPFS_GATEWAY } from '../../config'
import TextEllipsis from '../TextEllipsis'
import Row, { AddressColumn, ChoiceColumn, VotingPowerColumn } from './Row'

interface VoteRowProps {
  vote: Vote
  isVoter: boolean
}

const VoteRow: React.FC<any> = ({ vote, isVoter }) => {
  const { t } = useTranslation()
  const hasVotingPower = !!vote.votingPower

  const votingPower = hasVotingPower
    ? parseFloat(vote.votingPower).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
      })
    : '--'

  return (
    <Row>
      <AddressColumn>
        <Flex alignItems="center">
          <LinkExternal href={getBlockExploreLink(vote.voter, 'address')}>{truncateHash(vote.voter)}</LinkExternal>
          {isVoter && (
            <Tag variant="success" outline ml="8px">
              <CheckmarkCircleIcon mr="4px" /> {t('Voted')}
            </Tag>
          )}
        </Flex>
      </AddressColumn>
      <ChoiceColumn>
        <TextEllipsis title={t("Upvoted")}>
          {t("Upvoted")}
        </TextEllipsis>
      </ChoiceColumn>
      <VotingPowerColumn>
        <Flex alignItems="center" justifyContent="end">
          <Text title={t('Voting Power')}>{votingPower}</Text>
          {hasVotingPower && <LinkExternal href={`${IPFS_GATEWAY}/${vote.id}`} />}
        </Flex>
      </VotingPowerColumn>
    </Row>
  )
}

export default VoteRow
