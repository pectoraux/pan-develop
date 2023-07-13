import { 
  Box, 
  Card, 
  useModal, 
  CardBody, 
  CardHeader, 
  Flex, 
  Heading, 
  LinkExternal, 
  Text, 
  Button, 
  Farm as FarmUI,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { format } from 'date-fns'
import { Proposal } from 'state/types'
import { getBlockExploreLink } from 'utils'
import { useTranslation } from '@pancakeswap/localization'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { useGetTokenData } from 'state/ramps/hooks'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { ColorTag, ProposalStateTag } from '../components/Proposals/tags'
import CreateContentModal from './CreateContentModal'

interface DetailsProps {
  proposal: Proposal
}

const DetailBox = styled(Box)`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
`

const Details: React.FC<any> = ({ proposal, onSuccess }) => {
  const { t } = useTranslation()
  const { VotesTag } = FarmUI.Tags
  const startDate = new Date(proposal?.created * 1000)
  const endDate = new Date(proposal?.endTime * 1000)
  const tokenData = useGetTokenData(proposal?.id?.split('-')[0]) as any
  const upVotes = getBalanceNumber(proposal?.upVotes ?? 0, tokenData?.decimals)
  const downVotes = getBalanceNumber(proposal?.downVotes ?? 0, tokenData?.decimals)

  return (
    <Card mb="16px">
      <CardHeader>
        <Heading as="h3" scale="md">
          {t('Details')}
        </Heading>
      </CardHeader>
      <CardBody>
        <Flex alignItems="center" mb="8px">
          <Text color="textSubtle">{t('Author')}</Text>
          <LinkExternal href={getBlockExploreLink(proposal?.owner, 'address')}  ml="8px">
            {truncateHash(proposal?.owner)}
          </LinkExternal>
        </Flex>
        <DetailBox p="16px">
          <ProposalStateTag proposalState={proposal?.active} mb="8px" style={{ marginRight: "10px" }}/>
          <Flex justifyContent="flex" mb="8px">
            <VotesTag votingPower={upVotes?.toString()} color="green" />
          </Flex>
          <Flex justifyContent="flex" mb="8px">
            <VotesTag votingPower={downVotes?.toString()} color="red" />
          </Flex>
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
          <Flex alignItems="center">
            <Text color="textSubtle" fontSize="14px">
              {t('Countries')}
            </Text>
            <Text ml="8px">{proposal?.countries}</Text>
          </Flex>
          <Flex alignItems="center">
            <Text color="textSubtle" fontSize="14px">
              {t('Cities')}
            </Text>
            <Text ml="8px">{proposal?.cities}</Text>
          </Flex>
          <Flex alignItems="center">
            <Text color="textSubtle" fontSize="14px">
              {t('Products')}
            </Text>
            <Text ml="8px">{proposal?.products}</Text>
          </Flex>
        </DetailBox>
      </CardBody>
    </Card>
  )
}

export default Details
