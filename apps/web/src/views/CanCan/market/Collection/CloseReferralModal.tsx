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
  ButtonMenu, 
  ButtonMenuItem,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Divider, GreyedOutContainer } from 'views/Auditors/components/styles'
import { ToastDescriptionWithTx } from 'components/Toast'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { useMarketHelper2Contract, usePaywallMarketHelper2Contract } from 'hooks/useContract'

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

const PartnerModal: React.FC<any> = ({
  registration,
  onDismiss,
}) => {
  const [state, setState] = useState<any>(() => ({
    bountyId: registration?.bountyId ?? '0', 
    productId: '', 
    identityProofId: registration?.identityProofId ?? '0',
    deactivate: 0,
    paywall: 0,
    partnerCollectionId: ''
  }))
  console.log("1PartnerModal=================>", registration)
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { signer: marketHelper2Contract } = useMarketHelper2Contract()
  const { signer: paywallMarketHelper2Contract } = usePaywallMarketHelper2Contract()
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
  const handleRawValueChange = (key: string) => (value: string ) => {
    updateValue(key, value)
  }

  const handleCreatePartnerShip = useCallback(async () => {
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const args = !state.paywall ? [
        registration?.collection?.owner,
        account,
        state.bountyId,
        state.productId,
        [state.productId],
        !!state.deactivate
      ] : [
        registration?.collection?.owner,
        account,
        state.deactivate ? 9 : 8,
        state.productId,
        "",
        ""
      ]
      console.log("partner====================>", args)
      const contract = !state.paywall ? marketHelper2Contract : paywallMarketHelper2Contract
      return callWithGasPrice(contract, "closeReferral", args)
      .catch((err) => {
        console.log("partner====================>", err)
      })
    })
    if (receipt?.status) {
        toastSuccess(
          t('Item Successfully Added'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Users of this channel will now have access to this item.')}
          </ToastDescriptionWithTx>,
        )
        setIsDone(true);
      }
  }, [
    state,
    t,
    account,
    registration,
    toastSuccess,
    callWithGasPrice,
    marketHelper2Contract,
    fetchWithCatchTxError,
  ])

  return (
    <Modal
    title={t('Remove Item from Wall')} 
    onDismiss={onDismiss}
    >
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Product ID')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='productId'
        value={state.productId}
        placeholder={t('input your product id')}
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
    <GreyedOutContainer>
        <StyledItemRow>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
          {t('Deactivate Wall')}
        </Text>
        <ButtonMenu scale="xs" variant='subtle' activeIndex={state.deactivate} onItemClick={handleRawValueChange('deactivate')}>
        <ButtonMenuItem >{t('No')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
      </ButtonMenu>
      </StyledItemRow>
    </GreyedOutContainer>
    <GreyedOutContainer>
        <StyledItemRow>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
          {t('Is this a Paywall?')}
        </Text>
        <ButtonMenu scale="xs" variant='subtle' activeIndex={state.paywall} onItemClick={handleRawValueChange('paywall')}>
          <ButtonMenuItem >{t('No')}</ButtonMenuItem>
          <ButtonMenuItem >{t('Yes')}</ButtonMenuItem>
        </ButtonMenu>
      </StyledItemRow>
      </GreyedOutContainer>
      <Box>
        <Text small color="textSubtle">
          {t('The will remove the specified item from your wall. Please read the documentation for more details.')}
        </Text>
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
      {account ?
        <Button
          mb="8px"
          variant='danger'
          disabled={isDone}
          onClick={handleCreatePartnerShip}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : undefined}
          >
          {t('Remove')}
        </Button> : <ConnectWalletButton />
      }
      </Flex>
    </Modal>
  )
}

export default PartnerModal
