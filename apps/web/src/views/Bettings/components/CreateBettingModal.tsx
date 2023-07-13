import { useEffect, useRef, useState, useCallback } from 'react'
import { Flex, Grid, Box, Text, Input, Modal, Button, AutoRenewIcon, ErrorIcon, useToast, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import { Currency } from "@pancakeswap/sdk"
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { fetchBettingsAsync } from 'state/bettings'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useBettingFactory } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { AddressZero } from '@ethersproject/constants'
import { Divider, GreyedOutContainer } from './styles'

interface SetPriceStageProps {
  currency?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateBettingModal: React.FC<any> = ({ currency, onDismiss }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const bettingFactoryContract = useBettingFactory()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const [profileId, setProfileId] = useState('')
  const [oracle, setOracle] = useState('')
  const { toastSuccess, toastError } = useToast()

  const handleCreateGauge = useCallback(async () => {
      setPendingFb(true);
      // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
        const args = [profileId, account, oracle || AddressZero]
      console.log("receipt================>", bettingFactoryContract, args)
      return callWithGasPrice(bettingFactoryContract, 'createGauge', args)
      .catch((err) => {
        console.log("err================>",err)
        setPendingFb(false);
        toastError(
          t('Issue creating betting contract'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {err}
          </ToastDescriptionWithTx>,
        )
      })
    })
    if (receipt?.status) {
      setPendingFb(false);
      toastSuccess(
        t('Betting successfully created'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start processing transactions through your betting contract.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchBettingsAsync({ fromBetting: true }))
    }
      onDismiss()
  }, [
    t,
    profileId, 
    oracle,
    account,
    dispatch,
    onDismiss,
    toastError,
    toastSuccess,
    callWithGasPrice,
    fetchWithCatchTxError,
    bettingFactoryContract,
  ])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <Modal 
    title={t('Create Betting')}
    onDismiss={onDismiss}
    >
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Profile ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          value={profileId}
          placeholder={t('input profile id')}
          onChange={(e) => setProfileId(e.target.value)}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Oracle Address')}
        </Text>
        <Input
          type="text"
          scale="sm"
          value={oracle}
          placeholder={t('input oracle address')}
          onChange={(e) => setOracle(e.target.value)}
        />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t('The will create a new betting contract with you as its Admin. Please read the documentation to learn more about bettings.')}
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
          {t('Create Betting')}
        </Button>: <ConnectWalletButton />}
      </Flex>
    </Modal>
  )
}

export default CreateBettingModal