import { Flex, LinkExternal, Text, Tag, CheckmarkCircleIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Vote } from 'state/types'
import { useGetTokenData } from 'state/ramps/hooks'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { IPFS_GATEWAY } from '../../config'
import TextEllipsis from '../TextEllipsis'
import Row, { AddressColumn, ChoiceColumn, VotingPowerColumn } from './Row'

interface VoteRowProps {
  vote: Vote
  isVoter: boolean
}

const VoteRow: React.FC<any> = ({ vote, isVoter }) => {
  const { t } = useTranslation()
  const hasVotingPower = !!vote?.votingPower
  const tokenData = useGetTokenData(vote.ve) as any

  const votingPower = hasVotingPower
    ? getBalanceNumber(vote.votingPower ?? 0, tokenData?.decimals).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
      })
    : '--'

  return (
    <Row>
      <AddressColumn>
        <Flex alignItems="center">
          <LinkExternal href={`/profile/${vote.profileId}`}>{vote.profileId}</LinkExternal>
          {isVoter && (
            <Tag variant="success" outline ml="8px">
              <CheckmarkCircleIcon mr="4px" /> {t('Voted')}
            </Tag>
          )}
        </Flex>
      </AddressColumn>
        <Flex alignItems="center" justifyContent="flex-end">
      <ChoiceColumn>
        <TextEllipsis color={vote?.like ? "success" : "failure"}>
          { vote?.like ? "Aye" : "Nay"}
        </TextEllipsis>
      </ChoiceColumn>
      </Flex>
      <VotingPowerColumn>
        <Flex alignItems="center" justifyContent="end">
          <Text title={vote.votingPower}>{votingPower}</Text>
          {hasVotingPower && <LinkExternal href={`${IPFS_GATEWAY}/${vote.id}`} />}
        </Flex>
      </VotingPowerColumn>
    </Row>
  )
}

export default VoteRow
