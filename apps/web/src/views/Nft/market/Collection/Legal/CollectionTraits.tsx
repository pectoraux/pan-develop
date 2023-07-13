import orderBy from 'lodash/orderBy'
import { useState, useCallback } from 'react'
import ReactMarkdown from 'components/ReactMarkdown'
import { ArrowDownIcon, Flex, AutoRenewIcon, ArrowUpIcon, Alert, Button, useModal, IconButton, Text, useToast, Skeleton, Table, Td, Th } from '@pancakeswap/uikit'
import CollapsibleCard from 'components/CollapsibleCard'
import { useTranslation } from '@pancakeswap/localization'
import { useGetCollection } from 'state/cancan/hooks'
import useCatchTxError from 'hooks/useCatchTxError'
import { useMarketEventsContract } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import AddAnnouncementModal from '../AddAnnouncementModal'

interface CollectionTraitsProps {
  collectionAddress: string
}

const CollectionTraits: React.FC<React.PropsWithChildren<CollectionTraitsProps>> = ({ collectionAddress }) => {
  const { collection, isFetching } = useGetCollection(collectionAddress)
  const { t } = useTranslation()
  const [desc, setDesc] = useState(false)
  const data = collection?.announcements?.filter((ann) => ann.active)
  const { callWithGasPrice } = useCallWithGasPrice()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { toastSuccess } = useToast()
  const { signer: marketEventsContract } = useMarketEventsContract()
  const [onPresentAdd] = useModal(<AddAnnouncementModal announcements={data} />)
  const [isDone, setIsDone] = useState(false)

  const handleRemove = useCallback(async (idx) => {
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      console.log("handleRemove====================>",idx, data[idx], [
        idx,
        false,
        data[idx]?.title ?? '',
        data[idx]?.body ?? ''
      ])
      return callWithGasPrice(marketEventsContract, 'emitUpdateAnnouncement', [
        idx,
        false,
        data[idx]?.title ?? '',
        data[idx]?.body ?? ''
      ])
      .catch((err) => {
        console.log("handleRemove====================>", err)
      })
    })
    if (receipt?.status) {
        toastSuccess(
          t('Announcement Deleted'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('You have successfully deleted this announcement.')}
          </ToastDescriptionWithTx>,
        )
        setIsDone(true);
      }
  }, [
    t,
    data,
    toastSuccess,
    callWithGasPrice,
    marketEventsContract,
    fetchWithCatchTxError,
  ])

  if (isFetching) {
    return (
      <CollapsibleCard title={t('Loading...')}>
        <Alert title="Info">
          <Skeleton width="100px" />
        </Alert>
      </CollapsibleCard>
    )
  }
  console.log("CollectionTraits================>", collection, collectionAddress)
  return (
    <>
      <IconButton onClick={() => setDesc(!desc)} variant="text">
          {desc ? <ArrowUpIcon color="secondary" />: <ArrowDownIcon color="secondary" />}
      </IconButton>
      <Button onClick={onPresentAdd} mb="18px" variant='secondary'>{t('Create/Update Announcement')}</Button>
      {orderBy(data, 'updatedAt', desc ? 'desc' : 'asc').map((announcement, index) => {
          const idx = announcement.id?.split('-')[1]
          return (
            <CollapsibleCard key={announcement.title} title={`#${idx}: ${announcement.title}`} initialOpenState={index === 0} mb="32px">
              <Alert title="Info">
                <Text as="p">
                <ReactMarkdown>{announcement.body}</ReactMarkdown>
                </Text>
                <Flex justifyContent='center' alignItems='center'>
                  <Button 
                    scale='sm' 
                    variant='danger' 
                    onClick={() => handleRemove(idx)}
                    disabled={isDone}
                    endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : undefined}
                  >
                    {t('Remove')}
                  </Button>
                </Flex>
              </Alert>
            </CollapsibleCard>
          )
        })}
    </>
  )
}

export default CollectionTraits
