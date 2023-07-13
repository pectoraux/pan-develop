import { useEffect, useState } from 'react'
import { useAppDispatch } from 'state'
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  Box,
  Button,
  Flex,
  Table,
  Text,
  Th,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import Container from 'components/Layout/Container'
import TableLoader from 'components/TableLoader'
import { Activity, Collection } from 'state/cancan/types'
import { useTranslation } from '@pancakeswap/localization'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import useTheme from 'hooks/useTheme'
import { useLastUpdated } from '@pancakeswap/hooks'
import { useGetNftActivityFilters } from 'state/cancan/hooks'
import { Arrow, PageButtons } from '../components/PaginationButtons'
import NoNftsImage from '../components/Activity/NoNftsImage'
import RequestRow from '../components/Activity/RequestRow'

const MAX_PER_PAGE = 8

const MAX_PER_QUERY = 100

interface ActivityHistoryProps {
  collection?: Collection
}

const RequestHistory: React.FC<any> = ({ collection }) => {
  const dispatch = useAppDispatch()
  const { id: collectionAddress } = collection || { address: '' }
  const nftActivityFilters = useGetNftActivityFilters(collectionAddress)
  const { theme } = useTheme()
  const { t } = useTranslation()
  const [paginationData, setPaginationData] = useState<any>({
    activity: [],
    currentPage: 1,
    maxPage: 1,
  })
  const [activitiesSlice, setActivitiesSlice] = useState<any>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const [queryPage, setQueryPage] = useState(1)
  const { lastUpdated, setLastUpdated: refresh } = useLastUpdated()
  const bnbBusdPrice = useBNBBusdPrice()
  const { isMd } = useMatchBreakpoints()

  const nftActivityFiltersString = JSON.stringify(nftActivityFilters)
  console.log("collectioncollection===============>", collection)
  useEffect(() => {
    const fetchCollectionActivity = async () => {
      try {
        setIsLoading(true)
        const activity = [...collection.partnerRegistrations, ...collection.registrations].filter((registration) => !registration.active && !registration.unregister)
        setPaginationData({
          activity,
          currentPage: 1,
          maxPage: Math.ceil(activity.length / MAX_PER_PAGE) || 1,
        })
        setIsLoading(false)
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to fetch collection activity', error)
      }
    }

    fetchCollectionActivity()
  }, [dispatch, collection, collectionAddress, nftActivityFiltersString, lastUpdated])

  useEffect(() => {
    const slice = paginationData.activity.slice(
      MAX_PER_PAGE * (paginationData.currentPage - 1),
      MAX_PER_PAGE * paginationData.currentPage,
    )
    setActivitiesSlice(slice)
  }, [paginationData])

  const marketHistoryNotFound =
    paginationData.activity.length === 0 && activitiesSlice.length === 0 && !isLoading
  
  const pagination = marketHistoryNotFound ? null : (
    <Container>
      <Flex
        borderTop={`1px ${theme.colors.cardBorder} solid`}
        pt="24px"
        flexDirection="column"
        justifyContent="space-between"
        height="100%"
      >
        <PageButtons>
          <Arrow
            onClick={() => {
              if (paginationData.currentPage !== 1) {
                setPaginationData((prevState) => ({
                  ...prevState,
                  currentPage: prevState.currentPage - 1,
                }))
              }
            }}
          >
            <ArrowBackIcon color={paginationData.currentPage === 1 ? 'textDisabled' : 'primary'} />
          </Arrow>
          <Text>
            {t('Page %page% of %maxPage%', {
              page: paginationData.currentPage,
              maxPage: paginationData.maxPage,
            })}
          </Text>
          <Arrow
            onClick={async () => {
              if (paginationData.currentPage !== paginationData.maxPage) {
                setPaginationData((prevState) => ({
                  ...prevState,
                  currentPage: prevState.currentPage + 1,
                }))

                if (
                  paginationData.maxPage - paginationData.currentPage === 1 &&
                  paginationData.activity.length === MAX_PER_QUERY * queryPage
                ) {
                  try {
                    setIsLoading(true)
                    const activity = [...collection.partnerRegistrations, ...collection.registrations].filter((registration) => registration.active)
                    setPaginationData((prevState) => {
                      return {
                        ...prevState,
                        activity,
                        maxPage: Math.ceil(activity.length / MAX_PER_PAGE) || 1,
                      }
                    })
                    setIsLoading(false)
                    setQueryPage((prevState) => prevState + 1)
                  } catch (error) {
                    console.error('Failed to fetch collection activity', error)
                  }
                }
              }
            }}
          >
            <ArrowForwardIcon
              color={paginationData.currentPage === paginationData.maxPage ? 'textDisabled' : 'primary'}
            />
          </Arrow>
        </PageButtons>
      </Flex>
    </Container>
  )
  console.log("paginationData=============>", activitiesSlice, paginationData)
  return (
    <Box py="32px">
      <Container px={[0, null, '24px']}>
        <Flex
          style={{ gap: '16px', padding: '0 16px' }}
          alignItems={[null, null, 'center']}
          flexDirection={['column', 'column', 'row']}
          flexWrap={isMd ? 'wrap' : 'nowrap'}
        >
          {/* <ActivityFilters collection={collection} isMd={isMd} nftActivityFilters={nftActivityFilters} /> */}
          <Button
            scale="sm"
            disabled={isLoading}
            onClick={() => {
              refresh()
            }}
            {...(isMd && { width: '100%' })}
          >
            {t('Refresh')}
          </Button>
        </Flex>
      </Container>
      <Container style={{ overflowX: 'auto' }}>
        {marketHistoryNotFound ? (
          <Flex p="24px" flexDirection="column" alignItems="center">
            <NoNftsImage />
            <Text pt="8px" bold>
              {t('No request found')}
            </Text>
          </Flex>
        ) : (
          <>
            <Table>
              <thead>
                <tr>
                  <Th textAlign={['center', null, 'left']}> {t('Collection')}</Th>
                  <Th textAlign="center"> {t('Type')}</Th>
                  <Th textAlign="center"> {t('Date')}</Th>
                  <Th textAlign="center"> {t('Action')}</Th>
                </tr>
              </thead>

              <tbody>
                {!isInitialized ? (
                  <TableLoader />
                ) : (
                  activitiesSlice.filter((activity) => !!activity.id && activity.id !== "" && !activity.active)
                  .map((activity) => {
                    console.log("RequestRow=================>", activity)
                    return (
                      <RequestRow
                        key={`${activity.id}`}
                        activity={activity}
                        nft={activity.items?.length && activity.items[0]}
                        isPartnerRequest={activity.partnerCollection?.id > 0}
                        bnbBusdPrice={bnbBusdPrice}
                      />
                    )
                  })
                )}
              </tbody>
            </Table>
          </>
        )}
      </Container>
      {pagination}
    </Box>
  )
}

export default RequestHistory