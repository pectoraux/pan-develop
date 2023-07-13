import {
  Box,
  Text,
  Flex,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Progress,
  Tag,
  CheckmarkCircleIcon,
} from '@pancakeswap/uikit'
import { Vote } from 'state/types'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import { FetchStatus } from 'config/constants/types'
import TextEllipsis from '../components/TextEllipsis'

interface ResultsProps {
  choices: string[]
  votes: Vote[]
  votesLoadingStatus: FetchStatus
}

const Results: React.FC<any> = ({ referral, accountVote, hasAccountVoted }) => {
  const { t } = useTranslation()
  const totalVotes = referral.votes.reduce((ac, v) => ac + parseInt(v.votingPower), 0)
  const progress = (accountVote?.votingPower * 100 / Math.max(totalVotes, 1)) || 0

  return (
    <Card>
      <CardHeader>
        <Heading as="h3" scale="md">
          {t('Current Results')}
        </Heading>
      </CardHeader>
      <CardBody>
        <Box key='voted' mt='24px'>
          <Flex alignItems="center" mb="8px">
            <TextEllipsis mb="4px" title={t("Votes")}>
              {t("Votes")}
            </TextEllipsis>
            {hasAccountVoted && (
              <Tag variant="success" outline ml="8px">
                <CheckmarkCircleIcon mr="4px" /> {t('Voted')}
              </Tag>
            )}
          </Flex>
          <Box mb="4px">
            <Progress primaryStep={progress} scale="sm" />
          </Box>
          <Flex alignItems="center" justifyContent="space-between">
            <Text color="textSubtle">{t('%total% Vote(s)', { total: formatNumber(referral.votes.length, 0, 2) })}</Text>
            <Text>
              {progress.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
            </Text>
          </Flex>
        </Box>
      </CardBody>
    </Card>
  )
}

export default Results
