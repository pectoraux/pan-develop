import { useEffect, useRef, useState, useCallback } from 'react'
import { Flex, Grid, Box, Text, Input, Modal, Button, AutoRenewIcon, ErrorIcon, useToast, useModal } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import BigNumber from 'bignumber.js'
import { useAppDispatch } from 'state'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { fetchCardsAsync } from 'state/cards'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useCardContract } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { Divider, GreyedOutContainer } from './styles'
import CreateGaugeModal from './CreateGaugeModal'

interface SetPriceStageProps {
  currency?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateCardModal: React.FC<any> = ({ currency, onDismiss }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const cardContract = useCardContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const [stage, setStage] = useState('ATTACH')
  const [tokenId, setTokenId] = useState('')
  const [amountReceivable, setAmountReceivable] = useState('')
  const { toastSuccess, toastError } = useToast()

  const [openPresentControlPanel] = useModal(
    <CreateGaugeModal variant="add" amountReceivable={amountReceivable} currency={currency} />,)

  const handleCreateGauge = useCallback(async () => {
      setPendingFb(true);
      // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      console.log("handleCreateGauge================>", cardContract, [tokenId])
      return callWithGasPrice(cardContract, 'updateTokenId', [tokenId])
      .catch((err) => {
        console.log("err================>",err)
        setPendingFb(false);
        toastError(
          t('Issue creating PayCard'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {err}
          </ToastDescriptionWithTx>,
        )
      })
    })
    if (receipt?.status) {
      setPendingFb(false);
      toastSuccess(
        t('PayCard successfully created'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start processing transactions through your PayCard.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchCardsAsync({ fromCard: true }))
    }
      onDismiss()
  }, [
    t,
    account,
    tokenId,
    currency,
    amountReceivable,
    dispatch,
    onDismiss,
    toastError,
    toastSuccess,
    callWithGasPrice,
    fetchWithCatchTxError,
    cardContract,
  ])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <Modal 
    title={t('Create PayCard')}
    onDismiss={onDismiss}
    >
      <Button variant="secondary" mb="8px" disabled={stage === 'ATTACH'} onClick={()=> setStage('ATTACH') }>
        {t('1) ATTACH VENFT')}
      </Button>
      <Button variant="secondary" mb="8px" disabled={stage === 'CREATE'} onClick={()=> setStage('CREATE') }>
        {t('2) CREATE CARD')}
      </Button>
      {stage === 'ATTACH' ?
        <GreyedOutContainer>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Token ID')}
          </Text>
          <Input
            type="text"
            scale="sm"
            value={tokenId}
            placeholder={t('input your veNFT token id')}
            onChange={(e) => setTokenId(e.target.value)}
          />
        </GreyedOutContainer>
       :<GreyedOutContainer>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Amount')}
          </Text>
          <Input
            type="text"
            scale="sm"
            value={amountReceivable}
            placeholder={t('input amount to send to your card')}
            onChange={(e) => setAmountReceivable(e.target.value)}
          />
        </GreyedOutContainer>}
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t('The will create a new PayCard with you as its owner. Please read the documentation to learn more about PayCards.')}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        {account ? 
        <Button
          mb="8px"
          onClick={stage === 'ATTACH' ? handleCreateGauge : openPresentControlPanel}
          endIcon={pendingTx || pendingFb ? <AutoRenewIcon spin color="currentColor" /> : null}
          isLoading={pendingTx || pendingFb}
          // disabled={firebaseDone}
        >
          {stage === 'ATTACH' ? t('Attach VeNFT') : t('Create PayCard')}
        </Button>: <ConnectWalletButton />}
      </Flex>
    </Modal>
  )
}

export default CreateCardModal
