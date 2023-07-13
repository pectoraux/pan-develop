import NodeRSA from 'encrypt-rsa'
import { ArrowForwardIcon, Box, IconButton, Flex, Text, UnlockIcon, LockIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { Entry } from 'state/types'
import { convertTimeToSeconds } from 'utils/timeHelper'
import {  useState, useCallback, useRef, useEffect  } from 'react'
import ReactMarkdown from 'components/ReactMarkdown'
import { useSignMessage } from '@pancakeswap/wagmi'
import { getEntryState } from '../../helpers'
import TimeFrame from './TimeFrame'
import { ProposalStateTag, ProposalTypeTag } from './tags'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CryptoJS = require('crypto-js')

interface ProposalRowProps {
  entry: Entry
}

const StyledProposalRow = styled(Flex)`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  display: flex;
  padding: 16px 24px;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.dropdown};
  }
`
export const ScrollableRow = styled.div`
  width: 100%;
  overflow-x: auto;
  padding: 16px 0;
  white-space: nowrap;
  ::-webkit-scrollbar {
    display: none;
  }
`
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

const ProposalRow: React.FC<any> = ({ account, entry }) => {
  const [answer, setAnswer] = useState(entry.answer)
  const [locked, setLocked] = useState(!entry.searchable)
  const { signMessageAsync } = useSignMessage()
  const increaseRef = useRef<HTMLDivElement>(null)
  const moveLeftRef = useRef<boolean>(true)
  const router = useRouter()
  
  const handleDecrypt = useCallback(async () => {
    let privateKey;
    let publicKey;
    if (entry.dataType === 'shared') {
      privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY
      publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY
    } else {
      const signature = await signMessageAsync({ message: account })
      const privateKeyData = decryptWithAES(entry?.ownerProfileId?.encyptedPrivateKey, signature)
      privateKey = `-----BEGIN RSA PRIVATE KEY-----${privateKeyData?.replace(/\s/g,'')}-----END RSA PRIVATE KEY-----`
      publicKey = entry?.ownerProfileId?.publicKey
    }
    const nodeRSA = new NodeRSA(
      publicKey,
      privateKey,
    )
    const ans = nodeRSA.decryptStringWithRsaPrivateKey({ 
      text: entry.answer, 
      privateKey
    });
    setAnswer(ans)
    setLocked(false)
  },[
    entry,
    account,
    setAnswer,
    signMessageAsync
  ])

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (increaseRef.current) {
        if (increaseRef.current.scrollLeft === increaseRef.current.scrollWidth - increaseRef.current.clientWidth) {
          moveLeftRef.current = false
        } else if (increaseRef.current.scrollLeft === 0) {
          moveLeftRef.current = true
        }
        increaseRef.current.scrollTo(
          moveLeftRef.current ? increaseRef.current.scrollLeft + 1 : increaseRef.current.scrollLeft - 1,
          0,
        )
      }
    }, 30)

    return () => {
      clearInterval(scrollInterval)
    }
  }, [])

  return (
    <>
    <StyledProposalRow>
      <Box as="span" style={{ flex: 1 }}>
        <Text bold mb="8px">
          {entry.question}
        </Text>
        <Flex alignItems="center" mb="8px">
          <TimeFrame startDate={entry.startTime} endDate={entry.endTime} entryState={getEntryState(entry)} />
        </Flex>
        <Flex alignItems="center">
          <ProposalStateTag entryState={getEntryState(entry)} />
          <ProposalTypeTag entryType={entry.dataType} ml="8px" />
        </Flex>
      </Box>
      <IconButton variant="text">
        {locked ? <LockIcon width="54px" color='red' onClick={handleDecrypt} />: <UnlockIcon width="54px" color='green' />}
      </IconButton>
      {convertTimeToSeconds(entry.startTime) > Date.now() ? null:
      <IconButton variant="text">
        <ArrowForwardIcon width="24px" onClick={() => router.push(`/ssi/proposal/${entry.id}`)} />
      </IconButton>}
    </StyledProposalRow>
    <ScrollableRow ref={increaseRef} style={{ backgroundColor: '#F6F6F6' }}>
      <Flex justifyContent='center' alignSelf='center'>
        <ReactMarkdown>{answer}</ReactMarkdown>
      </Flex>
    </ScrollableRow>
    </>
  )
}

export default ProposalRow
