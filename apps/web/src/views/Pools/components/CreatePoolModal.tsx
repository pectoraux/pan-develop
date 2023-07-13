import BigNumber from 'bignumber.js'
import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { Flex, Grid, Box, Text, Input, Modal, Button, AutoRenewIcon, ErrorIcon, useToast } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import { useAppDispatch } from 'state'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { fetchAuditorsAsync } from 'state/auditors'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useERC20, usePoolGaugeContract } from 'hooks/useContract'
import { useGetRequiresApproval } from 'state/pools/hooks'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { getBep20Contract } from 'utils/contractHelpers'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { Divider, GreyedOutContainer } from './styles'
import BribeField from './LockedPool/Common/BribeField'
import { useApprovePool } from '../hooks/useApprove'

interface SetPriceStageProps {
  currency?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateAuditorModal: React.FC<any> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const poolGaugeContract = usePoolGaugeContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const [_ve, setVe] = useState('')
  const [pairAddress, setPairAddress] = useState('')
  const [allowing, setAllowing] = useState(false)
  const [tokenId, setTokenId] = useState('')
  const [amount, setAmount] = useState('')
  const { toastSuccess, toastError } = useToast()
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )
  const pair = liquidityTokens.find((p) => p.address?.toLowerCase() === pairAddress?.toLowerCase())
  const balance = useCurrencyBalance(account ?? undefined, pair ?? undefined)
  const stakingTokenBalance = balance ? getDecimalAmount(new BigNumber(balance?.toExact()), pair?.decimals) : BIG_ZERO
  const stakingTokenContract = useERC20(pairAddress || '')
  
  const { handleApprove, pendingTx: pendingPoolTx } = useApprovePool(
    stakingTokenContract,
    poolGaugeContract.address,
    pair?.symbol,
  )

  const { needsApproval, refetch } = useGetRequiresApproval(stakingTokenContract, account, poolGaugeContract.address)
  useEffect(()=> {
    if (pendingPoolTx) {
      setAllowing(true) 
    } else {
      refetch()
      // onDismiss()
    }
  }
  ,[
    pendingPoolTx,
    pairAddress,
    setPairAddress,
    refetch
  ])

  const handleCreateGauge = useCallback(async () => {
      setPendingFb(true);
      const tokenContract = getBep20Contract(pairAddress)
      const decimals = await tokenContract.decimals()
      // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
        const amountDecimals = getDecimalAmount(new BigNumber(amount), decimals)
        console.log("receipt================>", poolGaugeContract, [pairAddress, _ve, tokenId, amountDecimals.toString()])
        return callWithGasPrice(poolGaugeContract, 'deposit', [pairAddress, _ve, tokenId, amountDecimals.toString()])
        .catch((err) => {
          setPendingFb(false);
          console.log("rerr==================>", err)
          toastError(
            t('Issue depositing LPs'),
            <ToastDescriptionWithTx txHash={receipt.transactionHash}>
              {err}
            </ToastDescriptionWithTx>,
          )
        })
    })
    if (receipt?.status) {
      setPendingFb(false);
      toastSuccess(
        t('LP successfully deposited'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start earning trading fees from the liquidity pool.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchAuditorsAsync({ fromAuditor: true }))
    }
      onDismiss()
  }, [
    t,
    _ve,
    amount,
    tokenId,
    dispatch,
    onDismiss,
    toastError,
    pairAddress,
    toastSuccess,
    callWithGasPrice,
    poolGaugeContract,
    fetchWithCatchTxError,
  ])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <Modal 
    title={t('Deposit LP')}
    onDismiss={onDismiss}
    >
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Address of Pair')}
        </Text>
        <Input
          type="text"
          scale="sm"
          value={pairAddress}
          placeholder={t('input your pair address')}
          onChange={(e) => setPairAddress(e.target.value)}
        />
      </GreyedOutContainer>
      {!needsApproval ?
      <>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Address of veNFT Token')}
        </Text>
        <Input
          type="text"
          scale="sm"
          value={_ve}
          placeholder={t('input veNFT address')}
          onChange={(e) => setVe(e.target.value)}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('veNFT Token ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          value={tokenId}
          placeholder={t('input veNFT token id')}
          onChange={(e) => setTokenId(e.target.value)}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <BribeField
          stakingAddress={pair?.address}
          stakingSymbol={pair?.symbol??'Pair'}
          stakingDecimals={pair?.decimals}
          lockedAmount={amount}
          stakingMax={stakingTokenBalance}
          setLockedAmount={setAmount}
          stakingTokenBalance={stakingTokenBalance}
        />
      </GreyedOutContainer>
    </>:null}
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
          {needsApproval 
            ? t('The will enable the pool contract to withdraw from your wallet')
            : t('The will deposit LPs and make you elligible to earn trading fees from the liquidity pool. Please read the documentation to learn more about Pools.')
            }
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
      {!account ? <ConnectWalletButton />: needsApproval ?
        <Button
          mb="8px"
          onClick={() => {
            setAllowing(true)
            handleApprove()
          }}
          endIcon={allowing || (pairAddress && !pair)? <AutoRenewIcon spin color="currentColor" /> : null}
          isLoading={allowing}
          disabled={allowing || !pair}
        >
          {t('%text% %symbol%', { text: pair ? "Enable" : "Input pair address", symbol: pair?.symbol ?? "" })}
        </Button>:
        <Button
          mb="8px"
          onClick={handleCreateGauge}
          endIcon={pendingTx || pendingFb ? <AutoRenewIcon spin color="currentColor" /> : null}
          isLoading={pendingTx || pendingFb}
        >
          {t('Deposit LP')}
        </Button>}
      </Flex>
    </Modal>
  )
}

export default CreateAuditorModal
