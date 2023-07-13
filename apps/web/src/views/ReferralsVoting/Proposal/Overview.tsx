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
import { getCollectionSg } from 'state/referralsvoting/helpers'
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
    data: referral,
    error,
    mutate: refetch,
  } = useSWRImmutable(id ? ['referral-gauge', id] : null, () => getCollectionSg(id))

  const accountVote = referral?.votes?.find((vote) => vote.voter?.toLowerCase() === account?.toLowerCase())
  const hasAccountVoted = account && !!accountVote

  console.log("getCollectionSg==============>", referral, hasAccountVoted)

  if (!referral && error) {
    return <NotFound />
  }

  if (isFallback || !referral) {
    return <PageLoader />
  }

  return (
    <Container py="40px">
      <PageMeta />
      <Box mb="40px">
        <Link href="/businesses" passHref>
          <Button as="a" variant="text" startIcon={<ArrowBackIcon color="primary" width="24px" />} px="0">
            {t('Back to Referral')}
          </Button>
        </Link>
      </Box>
      <Layout>
        <Box>
          <Box mb="32px">
            <Flex alignItems="center" mb="8px">
              {/* <ProposalStateTag isCoreProposal={isCoreProposal(business)} /> */}
              <ProposalTypeTag isCoreProposal ml="8px" />
            </Flex>
            <Heading as="h1" scale="xl" mb="16px">
              {referral?.name}
            </Heading>
            <Box>
              <ReactMarkdown>{referral?.description}</ReactMarkdown>
            </Box>
            <Divider />
          </Box>
          <Votes votes={referral?.votes} totalVotes={referral?.votes?.length} />
        </Box>
        <Box position="sticky" top="60px">
          <Details proposal={referral} onSuccess={refetch} />
          <Results referral={referral} accountVote={accountVote} hasAccountVoted={hasAccountVoted} />
        </Box>
      </Layout>
    </Container>
  )
}

export default Overview
