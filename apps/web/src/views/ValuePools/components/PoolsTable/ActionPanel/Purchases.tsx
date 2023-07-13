import { useRef, useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { Text, Flex, Box, Card, LinkExternal, Button, useToast, AutoRenewIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { CollectibleLinkCard } from 'views/CanCan/market/components/CollectibleCard';
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useValuepoolContract } from 'hooks/useContract';

const CardWrapper = styled(Box)`
  display: inline-block;
  min-width: 190px;
  margin-left: 16px;
  :hover {
    cursor: pointer;
    opacity: 0.6;
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

const DataCard = ({ t, nft, schedulePurchase }) => {
  const currentAskPriceAsNumber = nft && parseFloat(nft?.currentAskPrice)
  
  return (
    <CardWrapper style={{ whiteSpace: 'break-spaces' }}>
      <Flex mb="2px" justifyContent='center' alignSelf='center'>
        <LinkExternal href={schedulePurchase?.owner} bold={false} small>
          {t('See Owner Channel')}
        </LinkExternal>
      </Flex>
      <Flex flexDirection='column' justifyContent='center' alignSelf='center'> 
        <CollectibleLinkCard
          key={nft.tokenId}
          nft={nft}
          referrer={nft?.owner?.toLowerCase() !== nft?.currentSeller?.toLowerCase() &&  nft?.currentSeller}
          currentAskPrice={currentAskPriceAsNumber > 0 ? currentAskPriceAsNumber : undefined}
        />
      </Flex>
    </CardWrapper>
  )
}

const Cart: React.FC<any> = ({ queue, valuepoolAddress }) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const valuepoolContract = useValuepoolContract(valuepoolAddress)
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [isDone, setIsDone] = useState(false)

  const increaseRef = useRef<HTMLDivElement>(null)
  const moveLeftRef = useRef<boolean>(true)

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

  const handleExecuteNextPurchase = useCallback(async () => {
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
        return callWithGasPrice(valuepoolContract, 'executeNextPurchase', [])
        .catch((err) => console.log("executeNextPurchase====================>", err))
    })
    if (receipt?.status) {
        toastSuccess(
          t('Next Purchase Executed Successfully'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('You can now take possession of your item')}
          </ToastDescriptionWithTx>,
        )
        setIsDone(true);
      }
  }, [
    t,
    toastSuccess,
    callWithGasPrice,
    valuepoolContract,
    fetchWithCatchTxError,
  ])

  return (
    <Card my="6px" style={{ width: "100%" }}> 
      <Flex flexDirection="column" px="16px" pt="16px">
        <Button
          mb="8px"
          scale='sm'
          width='20%'
          onClick={handleExecuteNextPurchase}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : undefined}
        >
          {t('Execute Next Purchase')}
        </Button>
      </Flex>
      {queue.length ? 
      <Text ml="16px" mt="8px" color='primary'>
        {t("Scheduled Purchases")}
      </Text>:null}
      <ScrollableRow ref={increaseRef}>
        {queue.map((entry) =>
          <DataCard t={t} nft={entry[0]} schedulePurchase={entry[0]} />
        )}
      </ScrollableRow>
    </Card>
  )
}

export default Cart
