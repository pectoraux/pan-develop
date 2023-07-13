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
  useToast,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { format } from 'date-fns'
import { Proposal } from 'state/types'
import { getBlockExploreLink } from 'utils'
import { useTranslation } from '@pancakeswap/localization'
import { IPFS_GATEWAY } from '../config'
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
  const startDate = new Date(proposal.creationTime * 1000)
  const endDate = new Date(proposal.endTime * 1000)
  const [presentUpdateTerms] = useModal(<CreateContentModal onSuccess={onSuccess} litigation={proposal} />,)

  return (
    <Card mb="16px">
      <CardHeader>
        <Heading as="h3" scale="md">
          {t('Details')}
        </Heading>
      </CardHeader>
      <CardBody>
        <Flex alignItems="center" mb="8px">
          <Text color="textSubtle">{t('Litigation ID')}</Text>
          <LinkExternal href={`${IPFS_GATEWAY}/${proposal.id}`} ml="8px">
            {proposal.id.slice(0, 8)}
          </LinkExternal>
        </Flex>
        <Flex alignItems="center" mb="8px">
          <Text color="textSubtle">{t('Attacker ID')}</Text>
          <LinkExternal href={getBlockExploreLink(proposal.attackerId, 'address')} ml="8px">
            {proposal.attackerId}
          </LinkExternal>
        </Flex>
        <Flex alignItems="center" mb="16px">
          <Text color="textSubtle">{t('Defender ID')}</Text>
          <LinkExternal href={getBlockExploreLink(proposal.defenderId, 'block')} ml="8px">
            {proposal.defenderId}
          </LinkExternal>
        </Flex>
        <DetailBox p="16px">
          <ProposalStateTag proposalState={proposal.active} mb="8px" style={{ marginRight: "10px" }}/>
          <ColorTag votingPower={proposal.percentile} />
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
        <Flex mt="8px" mb="8px" justifyContent='center' alignItems="center">
          <Button variant='secondary' onClick={presentUpdateTerms} scale='sm'>{t('Update Statement')}</Button>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default Details
