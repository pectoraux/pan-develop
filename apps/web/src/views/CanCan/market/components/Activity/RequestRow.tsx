import {
  Flex,
  Text,
  Td,
  Button,
  useModal,
  Grid,
  LinkExternal,
  useMatchBreakpoints,
  useToast,
  AutoRenewIcon,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { Activity, NftToken } from 'state/nftMarket/types'
import { Price, Currency } from '@pancakeswap/sdk'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useTranslation } from '@pancakeswap/localization'
import { useCallback, useState } from 'react'
import useCatchTxError from 'hooks/useCatchTxError'
import { useMarketEventsContract, useMarketOrdersContract, useMarketHelper2Contract } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import ConnectWalletButton from 'components/ConnectWalletButton'
import MobileModal from './MobileModal'
import { cancanBaseUrl } from '../../constants'
import { CollectionCard } from '../CollectibleCard'
import { BNBAmountLabel } from '../CollectibleCard/styles'

interface ActivityRowProps {
  activity: Activity
  nft: NftToken
  bnbBusdPrice: Price<Currency, Currency>
  isUserActivity?: boolean
  isNftActivity?: boolean
}

const RequestRow: React.FC<any> = ({
  activity,
  bnbBusdPrice,
  nft,
  isUserActivity = false,
  isPartnerRequest = false,
}) => {
  console.log("isPartnerRequest=============>", activity)
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { isXs, isSm } = useMatchBreakpoints()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { signer: marketEventsContract } = useMarketEventsContract()
  const { signer: marketOrdersContract } = useMarketOrdersContract()
  const { signer: marketHelper2Contract } = useMarketHelper2Contract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { fetchWithCatchTxError: fetchWithCatchTxError2, loading: pendingTx2 } = useCatchTxError()
  const [isDone, setIsDone] = useState(false)
  const [referrerFee, setReferrerFee] = useState<any>()
  const timestampAsMs = parseFloat(activity.timestamp) * 1000
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
  const onClickProp = nft
    ? {
        onClick: onPresentMobileModal,
      }
    : {}


    const handleAccept = useCallback(async () => {
      // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
        console.log("1RequestRow====================>", activity)
        const contract = isPartnerRequest ? marketOrdersContract : marketEventsContract
        const method = isPartnerRequest ? "addReferral" : "emitUserRegistration"
        const args = isPartnerRequest
        ? [
          account,
          activity?.partnerCollection?.owner,
          "",
          [referrerFee ?? 0, activity?.bountyId ?? 0, activity?.identityProofId]
        ] : [
          activity?.collection?.id, 
          activity?.userCollection?.id, 
          '0', 
          '0', 
          true
        ]
        console.log("handleAccept====================>", contract, method, args)
        return callWithGasPrice(contract, method, args)
        .catch((err) => {
          console.log("handleAccept====================>", err)
        })
      })
      if (receipt?.status) {
          toastSuccess(
            t('Request Accepted'),
            <ToastDescriptionWithTx txHash={receipt.transactionHash}>
              {t('You have successfully accepted this registration request.')}
            </ToastDescriptionWithTx>,
          )
          setIsDone(true);
        }
    }, [fetchWithCatchTxError, activity, isPartnerRequest, marketOrdersContract, marketEventsContract, account, referrerFee, callWithGasPrice, toastSuccess, t])

    const handleRemove = useCallback(async () => {
      const receipt = await fetchWithCatchTxError2(() => {
        console.log("1RequestRow====================>", activity)
        const contract = isPartnerRequest ? marketHelper2Contract : marketEventsContract
        const method = isPartnerRequest ? "closeReferral" : "emitUserRegistration"
        const args = isPartnerRequest
        ? [ activity?.collection?.owner,
          account,
          activity?.bountyId ?? 0,
          "",
          true] 
        : [
          activity?.collection?.id, 
          activity?.userCollection?.id, 
          '0', 
          '0', 
          false
        ]
        console.log("handleRemove====================>", contract, method, args)
        return callWithGasPrice(contract, method, args)
        .catch((err) => {
          console.log("handleRemove====================>", err)
        })
      })
      if (receipt?.status) {
          toastSuccess(
            t('Request Rejected'),
            <ToastDescriptionWithTx txHash={receipt.transactionHash}>
              {t('You have successfully rejected this registration request.')}
            </ToastDescriptionWithTx>,
          )
          setIsDone(true);
        }
    }, [
      t,
      activity,
      account,
      isPartnerRequest,
      toastSuccess,
      callWithGasPrice,
      marketEventsContract,
      marketHelper2Contract,
      fetchWithCatchTxError2,
    ])

  return (
    <tr {...((isXs || isSm) && onClickProp)} data-test="nft-activity-row">
      <Td
        {...((isXs || isSm) && {
          onClick: (event) => {
            event.stopPropagation()
          },
        })}
      >
        <Grid
            gridTemplateColumns={['1fr', null, 'repeat(3, 1fr)', null]}
            alignItems="start"
          >
          <CollectionCard
            key={isPartnerRequest ? activity?.partnerCollection?.id : activity?.userCollection?.id}
            bgSrc={isPartnerRequest ? activity?.partnerCollection?.small : activity?.userCollection?.small}
            avatarSrc={isPartnerRequest ? activity?.partnerCollection?.avatar : activity?.userCollection?.avatar}
            collectionName={isPartnerRequest ? activity?.partnerCollection?.name : activity?.userCollection?.name}
          >
            <Flex alignItems="center">
              <Text fontSize="12px" color="textSubtle">
                {t('Volume')}
              </Text>
              <BNBAmountLabel
                amount={isPartnerRequest && activity?.partnerCollection?.totalVolumeBNB 
                ? parseFloat(activity.partnerCollection.totalVolumeBNB) 
                : activity?.userCollection?.totalVolumeBNB 
                ? parseFloat(activity.userCollection.totalVolumeBNB) : 0}
              />
            </Flex>
            <Flex mb="2px" justifyContent='flex-end'>
              <LinkExternal href={`${cancanBaseUrl}/collections/${
                isPartnerRequest
                ? activity?.partnerCollection?.id
                : activity?.userCollection?.id
              }`} bold={false} small>
                {t('See Channel')}
              </LinkExternal>
            </Flex>
          </CollectionCard>
        </Grid>
      </Td>
      <Td>
      <Text textAlign="center" fontSize={isXs || isSm ? '12px' : '16px'}>
        {t('%requestType% Request', { requestType: isPartnerRequest ? "Partner" : "User" })}
      </Text>
      </Td>
      <Td>
      <Text textAlign="center" fontSize={isXs || isSm ? '12px' : '16px'}>
        {localeTimestamp}
      </Text>
      </Td>
    <Td>
      {account ?
      <Flex flexDirection="column">
      <Button
        onClick={handleAccept}
        scale="sm"
        mb="5px"
        disabled={isDone}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : undefined}
      >
        {t('Accept')}
      </Button>
      <Button
        onClick={handleRemove}
        scale="sm"
        variant='danger'
        disabled={isDone}
        endIcon={pendingTx2 ? <AutoRenewIcon spin color="currentColor" /> : undefined}
      >
        {t('Reject')}
      </Button>
      </Flex>
      : <ConnectWalletButton />}
    </Td>
  </tr>
  )
}

export default RequestRow
