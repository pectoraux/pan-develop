import { useEffect, useRef, useState, useCallback, ChangeEvent } from 'react'
import { Flex, Grid, Box, Text, Input, Modal, Button, AutoRenewIcon, ErrorIcon, useToast, useModal } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import { useAppDispatch } from 'state'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { fetchFutureCollateralsAsync } from 'state/futureCollaterals'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useFutureCollateralContract } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Divider, GreyedOutContainer } from './styles'
import CreateGaugeModal from './CreateGaugeModal'

interface SetPriceStageProps {
  currency?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateFutureCollateralModal: React.FC<any> = ({ currency, onDismiss }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const futureCollateralContract = useFutureCollateralContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const [auditor, setAuditor] = useState('')
  const [stakeId, setStakeId] = useState('')
  const [userBountyId, setUserBountyId] = useState('')
  const [auditorBountyId, setAuditorBountyId] = useState('')
  const [channel, setChannel] = useState('')
  const [profileId, setProfileId] = useState('')
  const [stage, setStage] = useState('PICK_CHANNEL')
  const { toastSuccess, toastError } = useToast()
  const [state, setState] = useState<any>(() => ({
    auditor: '',
    stakeId: '',
    userBountyId: '',
    auditorBountyId: '',
    channel: '',
    profileId: '',

  }))

  const updateValue = (key: any, value: any) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    updateValue(inputName, value)
  }
  const [openPresentControlPanel] = useModal(
    <CreateGaugeModal variant="add" 
      state2={state} 
      currency={currency}
    />,)

  const handleCreateGauge = useCallback(async () => {
      setPendingFb(true);
      // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      console.log("receipt================>", futureCollateralContract, [state.profileId, state.channel])
      return callWithGasPrice(futureCollateralContract, 'addToChannel', [state.profileId, state.channel])
      .catch((err) => {
        console.log("err================>",err)
        setPendingFb(false);
        toastError(
          t('Issue minting future collateral'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {err}
          </ToastDescriptionWithTx>,
        )
      })
    })
    if (receipt?.status) {
      setPendingFb(false);
      toastSuccess(
        t('Future collateral successfully minted'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start processing loans with your collateral.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchFutureCollateralsAsync({ fromFutureCollateral: true }))
    }
      onDismiss()
  }, [
    t,
    state,
    account,
    dispatch,
    onDismiss,
    toastError,
    toastSuccess,
    callWithGasPrice,
    fetchWithCatchTxError,
    futureCollateralContract,
  ])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <Modal 
    title={t('Mint Future Collateral')}
    onDismiss={onDismiss}
    >
      <Button variant="secondary" mb="8px" disabled={stage === 'PICK_CHANNEL'} onClick={()=> setStage('PICK_CHANNEL') }>
        {t('1) PICK A CHANNEL')}
      </Button>
      <Button variant="secondary" mb="8px" disabled={stage === 'MINT_COLLATERAL'} onClick={()=> setStage('MINT_COLLATERAL') }>
        {t('2) MINT COLLATERAL')}
      </Button>

      {stage === 'PICK_CHANNEL' ?
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Profile ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='profileId'
          value={state.profileId}
          placeholder={t('input profile id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>: <>
        <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Auditor')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='auditor'
          value={state.auditor}
          placeholder={t('input auditor address')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Stake ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='stakeId'
          value={state.stakeId}
          placeholder={t('input stake id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('User Bounty ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='userBountyId'
          value={state.userBountyId}
          placeholder={t('input user bounty id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Auditor Bounty ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='auditorBountyId'
          value={state.auditorBountyId}
          placeholder={t('input auditor bounty id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      </>}
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Channel Number')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='channel'
          value={state.channel}
          placeholder={t('input channel number')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t('The will mint a new future collateral to your address. Please read the documentation to learn more about future collaterals.')}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        {account ? 
        <Button
          mb="8px"
          onClick={stage === 'PICK_CHANNEL' ? handleCreateGauge : openPresentControlPanel}
          endIcon={pendingTx || pendingFb ? <AutoRenewIcon spin color="currentColor" /> : null}
          isLoading={pendingTx || pendingFb}
          // disabled={firebaseDone}
        >
          {stage === 'PICK_CHANNEL' ? t('Pick Channel') : t('Mint Future Collateral')}
        </Button>: <ConnectWalletButton />}
      </Flex>
    </Modal>
  )
}

export default CreateFutureCollateralModal
