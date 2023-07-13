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
import { AddressZero } from '@ethersproject/constants'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Divider, GreyedOutContainer } from 'views/Auditors/components/styles'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useMarketOrdersContract, useMarketEventsContract } from 'hooks/useContract'

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
  collection,
  onConfirm,
  onDismiss,
}) => {
  const [state, setState] = useState<any>(() => ({
    bountyId: '', 
    productId: '', 
    referrerFee: '',
    identityProofId: '',
    partnerCollectionId: ''
  }))
  console.log("PartnerModal=================>", collection)
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { signer: marketEventsContract } = useMarketEventsContract()
  const { signer: marketOrdersContract } = useMarketOrdersContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [isDone, setIsDone] = useState(false)
  const check = collection?.requestPartnerRegistration
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

  const handleCreatePartnerShip = useCallback(async () => {
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const contract = check ? marketEventsContract : marketOrdersContract
      const method = check ? "emitPartnerRegistrationRequest" : "addReferral"
      const args = check ? [collection?.id, state.identityProofId] : [
        collection.owner,
        account,
        "",
        [state.referrerFee, state.bountyId, state.identityProofId]
      ]
      console.log("partner====================>", contract, method, args)
      return callWithGasPrice(contract, method, args)
      .catch((err) => {
        console.log("partner====================>", err)
      })
    })
    if (receipt?.status) {
        toastSuccess(
          t('Partnership %txt% Created', { txt: check ? 'Request': ''}),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('A partnership enables you to list your product on this channel.')}
          </ToastDescriptionWithTx>,
        )
        setIsDone(true);
      }
  }, [
    state,
    t,
    check,
    account,
    collection,
    toastSuccess,
    callWithGasPrice,
    marketEventsContract,
    marketOrdersContract,
    fetchWithCatchTxError,
  ])

  return (
    <Modal
    title={t('Partner with channel')} 
    onDismiss={onDismiss}
    >
      {!check ? 
      <>
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
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Referrer Fee')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='referrerFee'
          value={state.referrerFee}
          placeholder={t('input your referrer fee')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    </>:null}
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
      <Box>
        <Text small color="textSubtle">
          {t('The will add you as a partner of this channel. Please read the documentation for more details.')}
        </Text>
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
      {account ?
        <Button
          mb="8px"
          disabled={isDone}
          onClick={handleCreatePartnerShip}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : undefined}
          >
          {t('Add Partner')}
        </Button> : <ConnectWalletButton />
      }
      </Flex>
    </Modal>
  )
}

export default PartnerModal
