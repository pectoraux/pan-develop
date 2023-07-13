import { Box, Card, CardBody, CardHeader, Flex, Heading, LinkExternal, Text, Button, useModal } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { format } from 'date-fns'
import { Entry, EntryState } from 'state/types'
import { getBlockExploreLink } from 'utils'
import { convertTimeToSeconds } from 'utils/timeHelper'
import { useTranslation } from '@pancakeswap/localization'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { IPFS_GATEWAY } from '../config'
import { ProposalStateTag } from '../components/Proposals/tags'
import CreateContentModal from './CreateContentModal'

interface DetailsProps {
  entry: Entry
  answer: string
}

const DetailBox = styled(Box)`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
`

const Details: React.FC<any> = ({ entry, answer }) => {
  const { t } = useTranslation()
  const startDate = new Date(entry.startTime * 1000)
  const endDate = new Date(entry.endTime * 1000)
  const [presentOptions] = useModal(<CreateContentModal entry={entry} unencrypted={answer} />,)

  return (
    <Card mb="16px">
      <CardHeader>
        <Heading as="h3" scale="md">
          {t('Details')}
        </Heading>
      </CardHeader>
      <CardBody>
        <Flex alignItems="center" mb="8px">
          <Text color="textSubtle">{t('Identifier')}</Text>
          <LinkExternal href={`${IPFS_GATEWAY}/${entry.id}`} ml="8px">
            {entry.id.slice(0, 8)}
          </LinkExternal>
        </Flex>
        <Flex alignItems="center" mb="8px">
          <Text color="textSubtle">{t('Owner')}</Text>
          <LinkExternal href={getBlockExploreLink(entry.owner, 'address')} ml="8px">
            {truncateHash(entry.owner)}
          </LinkExternal>
        </Flex>
        <Flex alignItems="center" mb="16px">
          <Text color="textSubtle">{t('Auditor')}</Text>
          <LinkExternal href={getBlockExploreLink(entry.auditor, 'block')} ml="8px">
            {entry.auditorProfileId?.id}
          </LinkExternal>
        </Flex>
        <DetailBox p="16px">
          <ProposalStateTag entryState={entry.state} mb="8px" />
          <Flex alignItems="center">
            <Text color="textSubtle" fontSize="14px">
              {t('Start Date')}
            </Text>
            <Text ml="8px">{format(startDate, 'yyyy-MM-dd HH:mm')}</Text>
          </Flex>
          <Flex alignItems="center">
            <Text color="textSubtle" fontSize="14px">
              {t('End Date')}
            </Text>
            <Text ml="8px">{format(endDate, 'yyyy-MM-dd HH:mm')}</Text>
          </Flex>
        </DetailBox>
        {entry.state === EntryState.EXPIRED || entry?.deadline && convertTimeToSeconds(entry?.deadline) < Date.now() ? null :
        <Flex mt="8px" mb="8px" justifyContent='center' alignItems="center">
          <Button variant='secondary' 
            onClick={presentOptions} scale='sm'>
            {t('Generate Data')}
          </Button>
        </Flex>}
      </CardBody>
    </Card>
  )
}

export default Details
