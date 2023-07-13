import BigNumber from 'bignumber.js'
import { ChangeEvent, useState, useCallback } from 'react'
import {
  Flex,
  Text,
  Button,
  Modal,
  Input,
  useToast,
  AutoRenewIcon,
  Box,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Divider, GreyedOutContainer } from 'views/Auditors/components/styles'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useMarketHelper3Contract } from 'hooks/useContract'

interface DepositModalProps {
  max: BigNumber
  stakedBalance: BigNumber
  multiplier?: string
  lpPrice: BigNumber
  lpLabel?: string
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
  apr?: number
  displayApr?: string
  addLiquidityUrl?: string
  cakePrice?: BigNumber
}

interface FormState {
  tokenAddress: any, 
  poolAddress: any, 
  pricePerMinute: number, 
  creatorShare: number, 
  gameName: string,
}

const RegisterModal: React.FC<any> = ({
  collectionId,
  userBountyId,
  userCollectionId,
  onDismiss,
}) => {
  console.log("UnRegisterModal===================>", userCollectionId)
  const [state, setState] = useState<any>(() => ({
    bountyId: userBountyId ?? '0', 
    productId: '', 
    identityProofId: '0',
    userCollectionId: userCollectionId ?? '0'
  }))

  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { signer: marketHelper3Contract } = useMarketHelper3Contract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [isDone, setIsDone] = useState(false)
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const updateValue = (key: any, value: any ) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))

    // Keep track of what fields the user has attempted to edit
    setFieldsState((prevFieldsState) => ({
      ...prevFieldsState,
      [key]: true,
    }))
  }

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    updateValue(inputName, value)
  }

  const handleCreateMemberShip = useCallback(async () => {
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      console.log("emitUserRegistration====================>", [
        collectionId,
        state.userCollectionId,
        state.identityProofId,
        state.bountyId,
        false
      ])
      return callWithGasPrice(marketHelper3Contract, 'emitUserRegistration', [
        collectionId,
        state.userCollectionId,
        state.identityProofId,
        state.bountyId,
        false
      ])
      .catch((err) => {
        console.log("emitUserRegistration====================>", err)
      })
    })
    if (receipt?.status) {
        toastSuccess(
          t('User successfully unregistered'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('A membership shares your email with this channel and enables it to contact you via email.')}
          </ToastDescriptionWithTx>,
        )
        setIsDone(true);
      }
  }, [
    state,
    t,
    collectionId,
    toastSuccess,
    callWithGasPrice,
    marketHelper3Contract,
    fetchWithCatchTxError,
  ])

  return (
    <Modal
    title={t('Unregister from Channel')} 
    onDismiss={onDismiss}
    >
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Your Collection ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='userCollectionId'
          value={state.userCollectionId}
          placeholder={t('input your collection id')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Identity Proof ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='identityProofId'
          value={state.identityProofId}
          placeholder={t('input your identity proof id')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Bounty ID')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='bountyId'
        value={state.bountyId}
        placeholder={t('input your bounty id')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
      <Box>
        <Text small color="textSubtle">
          {t('The will remove you as a user of this channel. Please read the documentation for more details.')}
        </Text>
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
      {account ?
        <Button
          mb="8px"
          disabled={isDone}
          variant='danger'
          onClick={handleCreateMemberShip}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : undefined}
        >
          {t('Unregister')}
        </Button> : <ConnectWalletButton />
      }
      </Flex>
    </Modal>
  )
}

export default RegisterModal