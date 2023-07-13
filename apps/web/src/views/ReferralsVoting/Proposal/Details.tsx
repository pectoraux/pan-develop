import { 
  Box, 
  Card, 
  CardBody, 
  CardHeader, 
  Flex, 
  Heading, 
  LinkExternal, 
  Text, 
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { format } from 'date-fns'
import { Proposal } from 'state/types'
import { getBlockExploreLink } from 'utils'
import { useTranslation } from '@pancakeswap/localization'
import { ColorTag } from 'views/StakeMarketVoting/components/Proposals/tags'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { IPFS_GATEWAY } from '../config'
import { ProposalStateTag } from '../components/Proposals/tags'

interface DetailsProps {
  proposal: Proposal
}

const DetailBox = styled(Box)`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
`
const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
`

const Details: React.FC<any> = ({ proposal }) => {
  const { t } = useTranslation()
  const startDate = new Date(proposal.creationTime * 1000)

  return (
    <Card mb="16px">
      <CardHeader>
        <Heading as="h3" scale="md">
          {t('Details')}
        </Heading>
      </CardHeader>
      <CardBody>
        <Flex alignItems="center" mb="8px">
          <Text color="textSubtle">{t('Collection ID')}</Text>
          <LinkExternal href={`${IPFS_GATEWAY}/${proposal.id}`} ml="8px">
            {proposal?.id}
          </LinkExternal>
        </Flex>
        <Flex alignItems="center" mb="8px">
          <Text color="textSubtle">{t('Owner Address')}</Text>
          <LinkExternal href={getBlockExploreLink(proposal.owner, 'address')} ml="8px">
            {truncateHash(proposal.owner, 10)}
          </LinkExternal>
        </Flex>
        <DetailBox p="16px">
          <ProposalStateTag proposalState={proposal.active} mb="8px" style={{ marginRight: "10px" }}/>
          <Flex alignItems="center">
            <Text color="textSubtle" fontSize="14px">
              {t('Start Date')}
            </Text>
            <Text ml="8px">{format(startDate, 'yyyy-MM-dd HH:mm')}</Text>
          </Flex>
        </DetailBox>
      </CardBody>
    </Card>
  )
}

export default Details
