import { useEffect, useRef, useState, useCallback } from 'react'
import { Flex, Grid, Box, Text, Input, Modal, Button, AutoRenewIcon, ErrorIcon, useToast, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import { useAppDispatch } from 'state'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { fetchGamesAsync } from 'state/games'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useGameFactory } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { AddressZero } from '@ethersproject/constants'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import BigNumber from 'bignumber.js'
import { Divider, GreyedOutContainer } from './styles'

interface SetPriceStageProps {
  currency?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateGameModal: React.FC<any> = ({ currency, onDismiss }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const gameFactoryContract = useGameFactory()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const [gameContract, setGameContract] = useState<any>('')
  const [pricePerMinutes, setPricePerMinutes] = useState<any>('')
  const [creatorShare, setCreatorShare] = useState<any>(0)
  const [referrerFee, setReferrerFee] = useState<any>(0)
  const [claimable, setClaimable] = useState(0)
  const { toastSuccess, toastError } = useToast()

  const handleCreateGauge = useCallback(async () => {
      setPendingFb(true);
      const amount = getDecimalAmount(new BigNumber(pricePerMinutes), currency?.decimals ?? 18)
      // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
        const args = [
          currency.address, 
          gameContract || AddressZero,
          amount.toString(),
          creatorShare,
          referrerFee,
          !!claimable
        ]
      console.log("receipt================>", gameFactoryContract, args)
      return callWithGasPrice(gameFactoryContract, 'addProtocol', args)
      .catch((err) => {
        console.log("err================>",err)
        setPendingFb(false);
        toastError(
          t('Issue creating game'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {err}
          </ToastDescriptionWithTx>,
        )
      })
    })
    if (receipt?.status) {
      setPendingFb(false);
      toastSuccess(
        t('Game successfully created'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start processing transactions through your Game contract.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchGamesAsync({ fromGame: true }))
    }
      onDismiss()
  }, [
    t,
    currency,
    gameContract,
    pricePerMinutes,
    creatorShare,
    referrerFee,
    claimable,
    dispatch,
    onDismiss,
    toastError,
    toastSuccess,
    callWithGasPrice,
    fetchWithCatchTxError,
    gameFactoryContract,
  ])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <Modal 
    title={t('Create Game')}
    onDismiss={onDismiss}
    >
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Game Contract Address')}
        </Text>
        <Input
          type="text"
          scale="sm"
          value={gameContract}
          placeholder={t('input game contract address')}
          onChange={(e) => setGameContract(e.target.value)}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Price Per Minutes')}
        </Text>
        <Input
          type="text"
          scale="sm"
          value={pricePerMinutes}
          placeholder={t('input price per minutes')}
          onChange={(e) => setPricePerMinutes(e.target.value)}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Referrer Fee (%)')}
        </Text>
        <Input
          type="text"
          scale="sm"
          value={referrerFee}
          placeholder={t('input referrer fee')}
          onChange={(e) => setReferrerFee(e.target.value)}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Creator Share (%)')}
        </Text>
        <Input
          type="text"
          scale="sm"
          value={creatorShare}
          placeholder={t('input creator share')}
          onChange={(e) => setCreatorShare(e.target.value)}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
            {t('Make claimable ?')}
          </Text>
          <ButtonMenu scale="xs" variant='subtle' activeIndex={claimable ? 1 : 0} onItemClick={setClaimable}>
            <ButtonMenuItem >{t("No")}</ButtonMenuItem>
            <ButtonMenuItem >{t("Yes")}</ButtonMenuItem>
          </ButtonMenu> 
        </StyledItemRow>
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t('The will create a new Game contract with you as its Admin. Please read the documentation to learn more about Games.')}
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
          {t('Create Game')}
        </Button>: <ConnectWalletButton />}
      </Flex>
    </Modal>
  )
}

export default CreateGameModal