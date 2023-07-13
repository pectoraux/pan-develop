import { ArrowBackIcon, Box, Button, Flex, Heading, Text, IconButton } from '@pancakeswap/uikit'
import { PageMeta } from 'components/Layout/Page'
import { getAllVotes, getProposal } from 'state/voting/helpers'
import { useWeb3React } from '@pancakeswap/wagmi'
import useSWRImmutable from 'swr/immutable'
import { ProposalState } from 'state/types'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from '@pancakeswap/localization'
import Container from 'components/Layout/Container'
import ReactMarkdown from 'components/ReactMarkdown'
import NotFound from 'views/NotFound'
import PageLoader from 'components/Loader/PageLoader'
import { FetchStatus } from 'config/constants/types'
import { getLitigationSg } from 'state/stakemarketvoting/helpers'
import { Divider } from 'views/ARPs/components/styles'
import { isCoreProposal } from '../helpers'
import { ProposalStateTag, ProposalTypeTag } from '../components/Proposals/tags'
import Layout from '../components/Layout'
import Details from './Details'
import Results from './Results'
import Vote from './Vote'
import Votes from './Votes'

const Overview = () => {
  const { query, isFallback } = useRouter()
  const id = query.id as string
  const { t } = useTranslation()
  const { account } = useWeb3React()
  
  const {
    status: litigationLoadingStatus,
    data: litigation,
    error,
    mutate: refetch,
  } = useSWRImmutable(id ? ['stake-litigation', id] : null, () => getLitigationSg(id))

  const hasAccountVoted = account && !!litigation?.votes?.find((vote) => vote.voter?.toLowerCase() === account.toLowerCase())
  const hasVotedForAttacker = account && !!litigation?.votes?.find((vote) => vote.voter?.toLowerCase() === account.toLowerCase() && vote.choice?.toLowerCase() === "attacker")
  console.log("getLitigationsSg==============>", litigation, hasAccountVoted)
  const isPageLoading = litigationLoadingStatus === FetchStatus.Fetching

  if (!litigation && error) {
    return <NotFound />
  }

  if (isFallback || !litigation) {
    return <PageLoader />
  }

  return (
    <Container py="40px">
      <PageMeta />
      <Box mb="40px">
        <Link href="/stakemarket/voting" passHref>
          <Button as="a" variant="text" startIcon={<ArrowBackIcon color="primary" width="24px" />} px="0">
            {t('Back to Vote Overview')}
          </Button>
        </Link>
      </Box>
      <Layout>
        <Box>
          <Box mb="32px">
            <Flex alignItems="center" mb="8px">
              <ProposalStateTag isCoreProposal={isCoreProposal(litigation)} />
              <ProposalTypeTag isCoreProposal={isCoreProposal(litigation)} ml="8px" />
            </Flex>
            <Heading as="h1" scale="xl" mb="16px">
              {litigation.title}
            </Heading>
            <Box>
              <Flex justifyContent='center' alignItems='center'>
                <Text color='failure' fontSize="24px" bold textTransform="uppercase">
                  {t('Attacker Statement')}
                </Text>
              </Flex>
              <Divider />
              <ReactMarkdown>{litigation.attackerContent}</ReactMarkdown>
              {litigation.defenderContent ? 
              <>
              <Flex justifyContent='center' alignItems='center'>
                <Text color='failure' fontSize="24px" bold textTransform="uppercase">
                  {t('Defender Statement')}
                </Text>
              </Flex>
              <Divider />
              <ReactMarkdown>{litigation.defenderContent}</ReactMarkdown>
              </>:null}
            </Box>
            <Divider />
          </Box>
          {!isPageLoading && (
            <Vote proposal={litigation} onSuccess={refetch} mb="16px" />
          )}
          <Votes votes={litigation?.votes} totalVotes={litigation?.votes?.length} />
        </Box>
        <Box position="sticky" top="60px">
          <Details proposal={litigation} onSuccess={refetch} />
          <Results 
            choices={[t("Attacker"), t("Defender")]} 
            litigation={litigation} 
            hasAccountVoted={hasAccountVoted}
            hasVotedForAttacker={hasVotedForAttacker}
          />
        </Box>
      </Layout>
    </Container>
  )
}

export default Overview
