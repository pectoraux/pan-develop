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

const Results: React.FC<any> = ({ pitch, accountVote, hasAccountVoted }) => {
  const { t } = useTranslation()
  const totalVotes = pitch.votes.reduce((ac, v) => ac + parseInt(v.votingPower), 0)
  const total1Votes = pitch.votes.filter((v) => v.like)
  .reduce((ac, v) => ac + parseInt(v.votingPower), 0)
  const total2Votes = pitch.votes.filter((v) => !v.like)
  .reduce((ac, v) => ac + parseInt(v.votingPower), 0)
  const count1 = pitch.votes.filter((v) => v.like)?.length
  const count2 = pitch.votes.filter((v) => !v.like)?.length
  const progress1 = total1Votes * 100 / Math.max(totalVotes, 1)
  const progress2 = total2Votes * 100 / Math.max(totalVotes, 1)

  return (
    <Card>
      <CardHeader>
        <Heading as="h3" scale="md">
          {t('Current Results')}
        </Heading>
      </CardHeader>
      <CardBody>
        <Box key='like' mt='24px'>
          <Flex alignItems="center" mb="8px">
            <TextEllipsis mb="4px" title={t("Like")}>
              {t("Like")}
            </TextEllipsis>
            {hasAccountVoted && accountVote?.like && (
              <Tag variant="success" outline ml="8px">
                <CheckmarkCircleIcon mr="4px" /> {t('Voted')}
              </Tag>
            )}
          </Flex>
          <Box mb="4px">
            <Progress primaryStep={progress1} scale="sm" />
          </Box>
          <Flex alignItems="center" justifyContent="space-between">
            <Text color="textSubtle">{t('%total% Vote(s)', { total: formatNumber(count1, 0, 2) })}</Text>
            <Text>
              {progress1.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
            </Text>
          </Flex>
        </Box>
        <Box key='dislike' mt='24px'>
          <Flex alignItems="center" mb="8px">
            <TextEllipsis mb="4px" title={t("Dislike")}>
              {t("Dislike")}
            </TextEllipsis>
            {hasAccountVoted && !accountVote?.like && (
              <Tag variant="success" outline ml="8px">
                <CheckmarkCircleIcon mr="4px" /> {t('Voted')}
              </Tag>
            )}
          </Flex>
          <Box mb="4px">
            <Progress primaryStep={progress2} scale="sm" />
          </Box>
          <Flex alignItems="center" justifyContent="space-between">
            <Text color="textSubtle">{t('%total% Vote(s)', { total: formatNumber(count2, 0, 2) })}</Text>
            <Text>
              {progress2.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
            </Text>
          </Flex>
        </Box>
      </CardBody>
    </Card>
  )
}

export default Results
