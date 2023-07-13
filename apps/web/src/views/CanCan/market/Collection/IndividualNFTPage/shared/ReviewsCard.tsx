import { useState, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { 
  Box, 
  Flex, 
  Text, 
  NftIcon, 
  IconButton, 
  AutoRenewIcon,
  ArrowForwardIcon, 
  ButtonMenu, 
  ButtonMenuItem, 
  Card,
  CardBody,
  CardHeader,
  Heading,
  Button,
  Farm,
  useToast,
  useMatchBreakpoints,
  Input,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import useCatchTxError from 'hooks/useCatchTxError'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { toDate, format } from 'date-fns'
import ReactMarkdown from 'components/ReactMarkdown'
import { useTranslation } from '@pancakeswap/localization'

import { Label } from 'views/Voting/CreateProposal/styles'
import { NextLinkFromReactRouter } from '@pancakeswap/uikit/src/components/NextLink'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useMarketCollectionsContract } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ProposalStateTag } from './tags'
import ExpandableCard from './ExpandableCard'

interface ReviewsCardProps {
  reviews: any
  collectionId: string
  tokenId: string
}

const StyledProposalRow = styled(NextLinkFromReactRouter)`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  display: flex;
  padding: 16px 24px;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.dropdown};
  }
`
const StyledBox = styled(Box)`
overflow: auto;
max-height: 100vh;
::-webkit-scrollbar { display: none; };
`
const getFormattedDate = (timestamp: number) => {
  const date = toDate(timestamp * 1000)
  return format(date, 'MMM do, yyyy HH:mm')
}

const NormalReview: React.FC<any> = ({ body, reviewer, reviewTime = 0 }) => {
  const { t } = useTranslation()
  const { NormalReviewTag } = Farm.Tags
  return (
    <StyledProposalRow to={`/info/token/${reviewer}`}>
      <Box as="span" style={{ flex: 1 }}>
        <Text bold mb="8px">{truncateHash(reviewer ?? '')}</Text>
        <CardBody p="0" px="24px" color="textSubtle">
          <ReactMarkdown>{body}</ReactMarkdown>
        </CardBody>
        {reviewTime ?
        <Flex alignItems="center" mb="8px">
          <Text>{t('Posted on %date%', { date: getFormattedDate(Number(reviewTime)) })}</Text>
        </Flex>:null}
        <NormalReviewTag rating='0' /> 
      </Box>
      <IconButton variant="text">
        <ArrowForwardIcon width="24px" />
      </IconButton>
    </StyledProposalRow>
  )
}

const SuperReview: React.FC<any> = ({ review }) => {
  const { t } = useTranslation()

  return (
    <StyledProposalRow to={`/info/token/${review?.reviewer}`}>
      <Box as="span" style={{ flex: 1 }}>
        <Text bold mb="8px">{truncateHash(review?.reviewer ?? '')}</Text>
        <CardBody p="0" px="24px" color="textSubtle">
          <ReactMarkdown>{review.body}</ReactMarkdown>
        </CardBody>
        {review?.reviewTime ?
        <Flex alignItems="center" mb="8px">
          <Text>{t('Posted on %date%', { date: getFormattedDate(Number(review?.reviewTime)) })}</Text>
        </Flex>:null}
        <Flex alignItems="center">
          <ProposalStateTag votingPower={review?.power} />
        </Flex>
      </Box>
      <IconButton variant="text">
        <ArrowForwardIcon width="24px" />
      </IconButton>
    </StyledProposalRow>
  )
}

const EasyMde = dynamic(() => import('components/EasyMde'), {
  ssr: false,
})

const ReviewsCard: React.FC<any> = ({ nft }) => {
  const { t } = useTranslation()
  const [activeButtonIndex, setActiveButtonIndex] = useState<any>(0)
  const [isPaywall, setIsPaywall] = useState(0)
  const [superLike, setSuperLike] = useState(0)
  const [body, setBody] = useState('')
  const { isMobile } = useMatchBreakpoints()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { signer: marketCollectionsContract } = useMarketCollectionsContract()
  const [userTId, setUserTId] = useState<any>(false)
  const [isDone, setIsDone] = useState(false)
  const collectionId = useRouter().query.collectionAddress as string

  const handleCreateReview = useCallback(async () => {
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const args = [
        collectionId,
        nft?.tokenId, 
        userTId,
        isPaywall,
        !!superLike,
        body
      ]
      console.log("emitReview====================>", args)
      return callWithGasPrice(marketCollectionsContract, 'emitReview', args)
      .catch((err) => {
        console.log("emitReview====================>", err)
      })
    })
    if (receipt?.status) {
      toastSuccess(
        t('Channel Created'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your review has been successfully posted.')}
        </ToastDescriptionWithTx>,
      )
      setIsDone(true);
    }
}, [
  t,
  body,
  nft,
  userTId,
  superLike,
  isPaywall,
  collectionId, 
  toastSuccess,
  callWithGasPrice,
  fetchWithCatchTxError,
  marketCollectionsContract
])

  const icon = (
    <>
      {t('Reviews')}
      <ButtonMenu scale="sm" marginLeft={isMobile ? "0%" : "20%"} variant='subtle' activeIndex={activeButtonIndex} onItemClick={setActiveButtonIndex}>
        <ButtonMenuItem>{t('Add')}</ButtonMenuItem>
        <ButtonMenuItem >{t('Super')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Normal')}</ButtonMenuItem>
      </ButtonMenu>
    </>
  )
  const options = useMemo(() => {
    return {
      hideIcons:['guide', 'fullscreen', 'preview', 'side-by-side', 'image'],
    }
  }, [])
  const content = (
    <>
    <StyledBox p="24px">
      {activeButtonIndex > 0 ?
      <Box style={{ overflow: 'hidden' }}>
      {activeButtonIndex === 1 ? nft?.superReviews?.map((review) => (
        <SuperReview
          key={review?.id}
          review={review}
        />
      )):nft?.reviews?.map((review, idx) => (
        <NormalReview
          key='normal-review'
          body={review}
          reviewer={nft?.reviewers[idx]}
          reviewerTime={nft?.reviewerTimes[idx]}
        />
      ))}
      </Box>
      :
      <>
      {body && (
        <Box mb="24px">
          <Card>
            <CardHeader>
              <Flex flexDirection="row" mb="8px">
              <Flex justifyContent='center' alignItems="center" width="30%">
              <Input
                type="number"
                scale="sm"
                name='userTId'
                value={userTId}
                placeholder={t('input id of veNFT')}
                onChange={(e) => setUserTId(e.target.value)}
              />
              </Flex>
              <Flex justifyContent='center' alignItems="center" mt="8px" >
              <ButtonMenu scale="sm" marginLeft={isMobile ? "0%" : "20%"} variant='subtle' activeIndex={isPaywall} onItemClick={setIsPaywall}>
                <ButtonMenuItem>{t('Is Not Paywall')}</ButtonMenuItem>
                <ButtonMenuItem >{t('Is Paywall')}</ButtonMenuItem>
              </ButtonMenu>
              </Flex>
              <Flex justifyContent='center' alignItems="center" mt="8px" >
              <ButtonMenu scale="sm" marginLeft={isMobile ? "0%" : "20%"} variant='subtle' activeIndex={superLike} onItemClick={setSuperLike}>
                <ButtonMenuItem>{t('Super Dislike')}</ButtonMenuItem>
                <ButtonMenuItem >{t('Super Like')}</ButtonMenuItem>
              </ButtonMenu>
              </Flex>
              </Flex>
              <Heading as="h3" scale="md">
                {t('Preview')}
              </Heading>
              <Flex justifyContent='flex-end'>
              <Button 
                disabled={isDone || !userTId}
                onClick={handleCreateReview}
                endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : undefined}
              >
                {t('Post')}
              </Button>
              </Flex>
            </CardHeader>
            <CardBody p="0" px="24px">
              <ReactMarkdown>{body}</ReactMarkdown>
            </CardBody>
          </Card>
        </Box>
      )}
      <Box mb="24px">
        <Label htmlFor="body">{t('Content')}</Label>
        <Text color="textSubtle" mb="8px">
          {t('Tip: write in Markdown!')}
        </Text>
        <EasyMde
          id="body"
          name="body"
          onTextChange={(e)=> setBody(e)}
          value={body}
          options={options}
          required
        />
      </Box>
      </>
      }
    </StyledBox>
    </>
  )
  return <ExpandableCard title={icon} icon={<NftIcon width="24px" height="24px" />} content={content} />
}

export default ReviewsCard
