import { useEffect, useRef, useState, useCallback } from 'react'
import { Flex, Grid, Box, Text, Input, Modal, Button, AutoRenewIcon, ErrorIcon, useToast } from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { fetchAcceleratorGaugesAsync } from 'state/accelerator'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useAcceleratorContract } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Filters from 'views/CanCan/market/components/BuySellModals/SellModal/Filters'
import { getVeFromWorkspace } from 'utils/addressHelpers'
import { Divider, GreyedOutContainer } from './styles'

interface SetPriceStageProps {
  onDismiss?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateAuditorModal: React.FC<any> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const acceleratorContract = useAcceleratorContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const [thumbnail, setThumbnail] = useState('')
  const [original, setOriginal] = useState('')
  const { toastSuccess, toastError } = useToast()
  const [nftFilters, setNftFilters] = useState({} as any)

  const handleCreateGauge = useCallback(async () => {
      setPendingFb(true);
      const ve = getVeFromWorkspace(nftFilters?.workspace?.value?.toLowerCase())
      // eslint-disable-next-line consistent-return
      const receipt = await fetchWithCatchTxError(async () => {
      try {
          await callWithGasPrice(acceleratorContract, 'createGauge', [ve])
          return callWithGasPrice(acceleratorContract, 'updateContent', [
            ["", "", "", original, thumbnail], "", ""
          ])
        } catch (err) {
          console.log("rerr=====================>", err, [ve])
          setPendingFb(false)
          // toastError(
          //   t('Issue creating accelerator pitch'),
          //   <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          //     {err}
          //   </ToastDescriptionWithTx>)
        }
    })
    if (receipt?.status) {
      setPendingFb(false);
      toastSuccess(
        t('Accelerator pitch successfully created'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start receiving funding through your accelerator pitch.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchAcceleratorGaugesAsync())
    }
      onDismiss()
  }, [t, nftFilters, dispatch, onDismiss, original, thumbnail, toastSuccess, callWithGasPrice, fetchWithCatchTxError, acceleratorContract])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <Modal 
    title={t('Create Accelerator Pitch')}
    onDismiss={onDismiss}
    >
      <Flex alignSelf='center' mt={20}>
        <Filters
          nftFilters={nftFilters} 
          setNftFilters={setNftFilters}
          showCountry={false}
          showCity={false}
          showProduct={false}
        />
      </Flex>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Media Link')}
        </Text>
        <Input
          type="text"
          scale="sm"
          value={original}
          placeholder={t('input your media link')}
          onChange={(e) => setOriginal(e.target.value)}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Thumbnail')}
        </Text>
        <Input
          type="text"
          scale="sm"
          value={thumbnail}
          placeholder={t('input link to thumbnail')}
          onChange={(e) => setThumbnail(e.target.value)}
        />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t('The will create a new pitch in the voter and enable you to raise funds. Please read the documentation to learn more about the Accelerator.')}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        {account ? 
        <Button
          mb="8px"
          onClick={handleCreateGauge}
          endIcon={pendingTx || pendingFb ? <AutoRenewIcon spin color="currentColor" /> : null}
          isLoading={pendingTx || pendingFb}
        >
          {t('Create Pitch')}
        </Button>: <ConnectWalletButton />}
      </Flex>
    </Modal>
  )
}

export default CreateAuditorModal
