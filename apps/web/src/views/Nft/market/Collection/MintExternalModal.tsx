import BigNumber from 'bignumber.js'
import { ChangeEvent, useState, useEffect, useCallback, useMemo } from 'react'
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
import { useGetItem, useGetNftFilters } from 'state/cancan/hooks'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Divider, GreyedOutContainer } from 'views/Auditors/components/styles'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useMarketHelperContract } from 'hooks/useContract'
import { AddressZero } from '@ethersproject/constants'
import OptionFilters from '../components/BuySellModals/BuyModal/OptionFilters'

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
    productId: '', 
    referrer: '',
    user: '',
  }))
  console.log("1PartnerModal=================>", collection)
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { signer: marketHelperContract } = useMarketHelperContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [isDone, setIsDone] = useState(false)
  const [userOptions, setOptions] = useState([])
  const nftFilters = useGetNftFilters(account)
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const item = useMemo(() => {
    const it = collection?.items?.find((it) => it.tokenId?.toLowerCase() === state.productId?.toLowerCase())
    return it?.option_categories?.map((cat, index) => {
      return {
        "id": `${index}`,
        "category": `${cat}`,
        "element": `${it?.option_elements && it?.option_elements[index]}`,
        "traitType": `${it?.option_traitTypes && it?.option_traitTypes[index]}`,
        "value": `${it?.option_values && it?.option_values[index]}`,
        "min": `${it?.option_mins && it?.option_mins[index]}`,
        "max": `${it?.option_maxs && it?.option_maxs[index]}`,
        "unitPrice": `${it?.option_unitPrices && it?.option_unitPrices[index]}`,
        "currency": `${it?.option_currencies && it?.option_currencies[index]}`,
      }
    }) || []
  },[
    collection,
    state
  ])
  
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

  const handleMintExternal = useCallback(async () => {
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      console.log("handleMintExternal====================>", [
        state.user,
        state.referrer || AddressZero,
        state.productId,
        userOptions
      ])
      return callWithGasPrice(marketHelperContract, "mintNFTicket", [
        state.user,
        state.referrer || AddressZero,
        state.productId,
        userOptions
      ])
      .catch((err) => {
        console.log("handleMintExternal====================>", err)
      })
    })
    if (receipt?.status) {
        toastSuccess(
          t('Sale successfully recorded'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('NFTickets enable for easy bookkeeping for your business.')}
          </ToastDescriptionWithTx>,
        )
        setIsDone(true);
      }
  }, [
    t,
    state,
    userOptions,
    toastSuccess,
    callWithGasPrice,
    marketHelperContract,
    fetchWithCatchTxError,
  ])

  useEffect(() => { 
    let opt = []
    if (item) {
      Object.values(nftFilters)?.map((vals) => {
        return Object.keys(vals).map((elt) => {
          const id = item?.findIndex((o) => o?.element?.toLowerCase() === elt.toLowerCase())
          const count = vals[elt]?.count
          opt = [...opt, ...Array(count).fill(id)]
          return opt
        })
      })
      setOptions(opt)
    }
   },[item, nftFilters])

   return (
    <>
      {item ?
    <Flex justifyContent='center' alignItems='center'>
      <OptionFilters address={account} options={item} />
    </Flex>:null}
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
          {t('Client Address')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='user'
          value={state.user}
          placeholder={t('input client address')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Referrer Address')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='referrer'
          value={state.referrer}
          placeholder={t('input referrer address')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
      <Box>
        <Text small color="textSubtle">
          {t('The will mint an nfticket for the external sale entered for bookkeeping purposes. Please read the documentation for more details.')}
        </Text>
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
      {account ?
        <Button
          mb="8px"
          disabled={isDone}
          onClick={handleMintExternal}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : undefined}
          >
          {t('Mint')}
        </Button> : <ConnectWalletButton />
      }
      </Flex>
    </>
  )
}

export default PartnerModal
