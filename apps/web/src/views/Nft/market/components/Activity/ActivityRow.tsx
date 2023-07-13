import {
  Box,
  Flex,
  Text,
  Td,
  IconButton,
  Link,
  OpenNewIcon,
  TicketFillIcon,
  TokenImage,
  useModal,
  Skeleton,
  useMatchBreakpoints,
  NextLinkFromReactRouter,
} from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { Activity, NftToken } from 'state/nftMarket/types'
import { Price, Currency } from '@pancakeswap/sdk'
import { getBlockExploreLink } from 'utils'
import ProfileCell from 'views/Nft/market/components/ProfileCell'
import { useActiveChainId } from 'hooks/useActiveChainId'
import MobileModal from './MobileModal'
import ActivityPrice from './ActivityPrice'
import ActivityEventText from './ActivityEventText'
import { nftsBaseUrl } from '../../constants'
import WebPageModal from './WebPageModal'

interface ActivityRowProps {
  activity: Activity
  nft: NftToken
  bnbBusdPrice: Price<Currency, Currency>
  isUserActivity?: boolean
  isNftActivity?: boolean
}

const ActivityRow: React.FC<any> = ({
  nft,
  activity,
  bnbBusdPrice,
  collection,
  isUserActivity = false,
  isNftActivity = false,
}) => {
  const { chainId } = useActiveChainId()
  const { isXs, isSm } = useMatchBreakpoints()
  const priceAsFloat = parseFloat(activity.price)
  const timestampAsMs = parseFloat(activity.timestamp) * 1000
  const collectionId = useRouter().query.collectionAddress as string
  const localeTimestamp = new Date(timestampAsMs).toLocaleString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
  const [onPresentMobileModal] = useModal(
    <MobileModal
      nft={nft}
      activity={activity}
      localeTimestamp={localeTimestamp}
      bnbBusdPrice={bnbBusdPrice}
      isUserActivity={isUserActivity}
    />,
  )
  const currNft = nft?.transactionHistory?.find((tx) => tx.id?.toLowerCase() === activity.tx?.toLowerCase())
  const [onPresentNFTicket] = useModal(<WebPageModal  nft={currNft} />,)
  const tokenId = nft ? nft.tokenId : null
  const item = activity?.nft || activity?.paywall
  
  const onClickProp = nft
    ? {
        onClick: onPresentMobileModal,
      }
    : {}

  return (
    <tr {...((isXs || isSm) && onClickProp)} data-test="nft-activity-row">
      {!isNftActivity ? (
        <Td
          {...((isXs || isSm) && {
            onClick: (event) => {
              event.stopPropagation()
            },
          })}
        >
          <Flex justifyContent="flex-start" alignItems="center" flexDirection={['column', null, 'row']}>
            {!nft ? (
              <Skeleton height={[138, null, 64]} width={[80, null, 249]} />
            ) : (
              <>
                <Box width={64} height={64} mr={[0, null, '16px']} mb={['8px', null, 0]}>
                  <NextLinkFromReactRouter to={`${nftsBaseUrl}/collections/${collectionId}/${tokenId}`}>
                    <TokenImage mr="8px" width={64} height={64} src={collection?.avatar}/>
                  </NextLinkFromReactRouter>
                </Box>
                <Flex flexDirection="column">
                  <Text
                    as={NextLinkFromReactRouter}
                    to={`${nftsBaseUrl}/collections/${collectionId}/${tokenId}`}
                    textAlign={['center', null, 'left']}
                    bold
                  >
                    {nft.id}
                  </Text>
                </Flex>
                {currNft ?
                  <IconButton style={{ cursor: "pointer" }} as={Link} external onClick={onPresentNFTicket}>
                    <TicketFillIcon color="primary" width="18px" />
                  </IconButton>:null}
              </>
            )}
          </Flex>
        </Td>
      ) : null}
      <Td>
        <Flex alignItems="center" justifyContent="flex-end">
          <ActivityEventText marketEvent={["SELL", "BUY"].includes(activity.marketEvent) ? activity.marketEvent : item?.askHistory && item?.askHistory[0].orderType} />
        </Flex>
        {isXs || isSm ? <ActivityPrice price={priceAsFloat} bnbBusdPrice={bnbBusdPrice} /> : null}
      </Td>
      {isXs || isSm ? null : (
        <>
          <Td>
            <ActivityPrice price={priceAsFloat} bnbBusdPrice={bnbBusdPrice} />
          </Td>
          {isUserActivity ? (
            <Td>
              <Flex justifyContent="center" alignItems="center">
                {activity.otherParty ? <ProfileCell accountAddress={activity.otherParty} tokenId={tokenId} /> : '-'}
              </Flex>
            </Td>
          ) : (
            <>
              <Td>
                <Flex justifyContent="center" alignItems="center">
                  {activity.seller ? <ProfileCell accountAddress={activity.seller} tokenId={tokenId}  /> : '-'}
                </Flex>
              </Td>
              <Td>
                <Flex justifyContent="center" alignItems="center">
                  {activity.buyer ? <ProfileCell accountAddress={activity.buyer} tokenId={tokenId}  /> : '-'}
                </Flex>
              </Td>
            </>
          )}
        </>
      )}
      <Td>
        <Flex justifyContent="center">
          <Text textAlign="center" fontSize={isXs || isSm ? '12px' : '16px'}>
            {localeTimestamp}
          </Text>
        </Flex>
      </Td>
      {isXs || isSm ? null : (
        <Td>
          <IconButton as={Link} external href={getBlockExploreLink(activity.tx, 'transaction', chainId)}>
            <OpenNewIcon color="textSubtle" width="18px" />
          </IconButton>
          {currNft ?
          <IconButton style={{ cursor: "pointer" }} as={Link} external onClick={onPresentNFTicket}>
            <TicketFillIcon color="primary" width="18px" />
          </IconButton>:null}
        </Td>
      )}
    </tr>
  )
}

export default ActivityRow
