import { ArrowBackIcon, Box, Button, Flex, Heading } from '@pancakeswap/uikit'
import { PageMeta } from 'components/Layout/Page'
import { useWeb3React } from '@pancakeswap/wagmi'
import useSWRImmutable from 'swr/immutable'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from '@pancakeswap/localization'
import Container from 'components/Layout/Container'
import ReactMarkdown from 'components/ReactMarkdown'
import NotFound from 'views/NotFound'
import PageLoader from 'components/Loader/PageLoader'
import { FetchStatus } from 'config/constants/types'
import { getProposalSg } from 'state/valuepoolvoting/helpers'
import { Divider } from 'views/ARPs/components/styles'
import { isCoreProposal } from '../helpers'
import { ProposalStateTag, ProposalTypeTag } from '../components/Proposals/tags'
import Layout from '../components/Layout'
import Details from './Details'
import Vote from './Vote'
import Votes from './Votes'

const Overview = () => {
  const { query, isFallback } = useRouter()
  const id = query.id as string
  const { t } = useTranslation()
  const { account } = useWeb3React()
  
  const {
    status: proposalLoadingStatus,
    data: proposal,
    error,
    mutate: refetch,
  } = useSWRImmutable(id ? ['stake-proposal2', id] : null, () => getProposalSg(id))

  const hasAccountVoted = account && !!proposal?.votes?.find((vote) => vote.voter?.toLowerCase() === account.toLowerCase())

  console.log("getProposalSg==============>", proposal, hasAccountVoted)
  const isPageLoading = proposalLoadingStatus === FetchStatus.Fetching

  if (!proposal && error) {
    return <NotFound />
  }

  if (isFallback || !proposal) {
    return <PageLoader />
  }

  return (
    <Container py="40px">
      <PageMeta />
      <Box mb="40px">
        <Link href="/valuepools/voting" passHref>
          <Button as="a" variant="text" startIcon={<ArrowBackIcon color="primary" width="24px" />} px="0">
            {t('Back to Vote Overview')}
          </Button>
        </Link>
      </Box>
      <Layout>
        <Box>
          <Box mb="32px">
            <Flex alignItems="center" mb="8px">
              <ProposalStateTag isCoreProposal={isCoreProposal(proposal)} />
              <ProposalTypeTag isCoreProposal={isCoreProposal(proposal)} ml="8px" />
            </Flex>
            <Heading as="h1" scale="xl" mb="16px">
              {proposal.title}
            </Heading>
            <Box>
              <ReactMarkdown>{proposal.description}</ReactMarkdown>
            </Box>
            <Divider />
          </Box>
          {!isPageLoading && (
            <Vote proposal={proposal} onSuccess={refetch} mb="16px" />
          )}
          <Votes votes={proposal?.votes} totalVotes={proposal?.votes?.length} />
        </Box>
        <Box position="sticky" top="60px">
          <Details proposal={proposal} onSuccess={refetch} />
          {/* <Results choices={[t("Attacker"), t("Defender")]} proposal={proposal} hasAccountVoted={hasAccountVoted} /> */}
        </Box>
      </Layout>
    </Container>
  )
}

export default Overview
