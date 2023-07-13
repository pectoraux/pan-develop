import NodeRSA from 'encrypt-rsa'
import { useState, useCallback } from 'react'
import { ArrowBackIcon, Flex, Box, Button, IconButton, LockIcon, UnlockIcon, Heading } from '@pancakeswap/uikit'
import { PageMeta } from 'components/Layout/Page'
import { getUserData } from 'state/ssi/helpers'
import { useWeb3React, useSignMessage } from '@pancakeswap/wagmi'
import useSWRImmutable from 'swr/immutable'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from '@pancakeswap/localization'
import Container from 'components/Layout/Container'
import ReactMarkdown from 'components/ReactMarkdown'
import NotFound from 'views/NotFound'
import PageLoader from 'components/Loader/PageLoader'
import { getEntryState } from '../helpers'
import { ProposalStateTag, ProposalTypeTag } from '../components/Proposals/tags'
import Layout from '../components/Layout'
import Details from './Details'

const CryptoJS = require('crypto-js')

const decryptWithAES = (ciphertext, pk) => {
  try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, pk);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      return originalText;
  } catch(err) {
    console.log("decryptWithAES======>", err)
    return '';
  }
}

const Overview = () => {
  const { query, isFallback } = useRouter()
  const id = query.id as string
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { signMessageAsync } = useSignMessage()

  const {
    data: proposal,
    error,
  } = useSWRImmutable(id ? ['entry3', id] : null, () => getUserData(id))

  console.log("1proposal================>", proposal)
  const [answer, setAnswer] = useState(proposal?.searchable ? proposal.answer : proposal?.answer?.slice(0,100))
  const [locked, setLocked] = useState(!proposal?.searchable)

  const handleDecrypt = useCallback(async () => {
    let privateKey;
    let publicKey;
    if (proposal.dataType === 'shared') {
      privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY
      publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY
    } else {
      const signature = await signMessageAsync({ message: account })
      const privateKeyData = decryptWithAES(proposal?.ownerProfileId?.encyptedPrivateKey, signature)
      privateKey = `-----BEGIN RSA PRIVATE KEY-----${privateKeyData?.replace(/\s/g,'')}-----END RSA PRIVATE KEY-----`
      publicKey = proposal?.ownerProfileId?.publicKey
    }
    const nodeRSA = new NodeRSA(
      publicKey,
      privateKey,
    )
    const ans = nodeRSA.decryptStringWithRsaPrivateKey({ 
      text: proposal?.answer, 
      privateKey
    });
    setAnswer(ans)
    setLocked(false)
  },[
    proposal,
    account,
    setAnswer,
    signMessageAsync
  ])

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
        <Link href="/ssi" passHref>
          <Button as="a" variant="text" startIcon={<ArrowBackIcon color="primary" width="24px" />} px="0">
            {t('Back to SSI Home')}
          </Button>
        </Link>
      </Box>
      <Layout>
        <Box>
          <Box mb="32px">
            <Flex alignItems="center" mb="8px">
              <ProposalStateTag entryState={getEntryState(proposal)} />
              <ProposalTypeTag entryType={proposal.type} ml="8px" />
            </Flex>
            <Heading as="h1" scale="xl" mb="16px">
              {proposal.question}
              <IconButton variant="text">
                {locked ? <LockIcon width="54px" color='red' onClick={handleDecrypt} />: <UnlockIcon width="54px" color='green' />}
              </IconButton>
            </Heading>
            <Box><ReactMarkdown>{answer}</ReactMarkdown></Box>
          </Box>
        </Box>
        <Box position="sticky" top="60px">
          {!locked && <Details entry={proposal} answer={answer} />}
        </Box>
      </Layout>
    </Container>
  )
}

export default Overview
