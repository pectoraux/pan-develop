import { useEffect, ChangeEvent, useRef, useState, useCallback } from 'react'
import { Flex, Grid, Box, Text, Modal, Button, AutoRenewIcon, Input, ErrorIcon, useToast, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import Select from 'components/Select/Select'
import { useAppDispatch } from 'state'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { DatePicker, DatePickerPortal } from 'views/Voting/components/DatePicker'
import { fetchBountiesAsync } from 'state/trustbounties'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { useRouter } from 'next/router'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useERC20, useTrustBountiesContract } from 'hooks/useContract'
import { DEFAULT_INPUT_CURRENCY } from 'config/constants/exchange'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useGetRequiresApproval } from 'state/trustbounties/hooks'
import { differenceInSeconds } from 'date-fns'
import { FetchStatus } from 'config/constants/types'
import Filters from 'views/CanCan/market/components/BuySellModals/SellModal/Filters'
import { getVeFromWorkspace } from 'utils/addressHelpers'
import { AddressZero } from '@ethersproject/constants'
import { useApprovePool } from '../hooks/useApprove'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  currency?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateStakeModal: React.FC<any> = ({
  currency,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const titleName = "Trust Bounties"
  const dispatch = useAppDispatch()
  const { signer: trustBountiesContract } = useTrustBountiesContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const currencyAddress = currency?.address ?? DEFAULT_INPUT_CURRENCY
  const { toastSuccess, toastError } = useToast()
  const [allowing, setAllowing] = useState(false)
  const stakingTokenContract = useERC20(currencyAddress || '')
  const [nftFilters, setNftFilters] = useState<any>({})
  const { handleApprove: handlePoolApprove, pendingTx: pendingPoolTx } = useApprovePool(
    stakingTokenContract,
    trustBountiesContract.address,
    currency?.symbol,
  )
  const router = useRouter()
  const fromAccelerator = router.pathname.includes('accelerator')
  const fromContributors = router.pathname.includes('contributors')
  const fromSponsors = router.pathname.includes('sponsors')
  const fromAuditors = router.pathname.includes('auditors')
  const fromBusinesses = router.pathname.includes('businesses')
  const fromRamps = router.pathname.includes('ramps')
  const fromTransfers = router.pathname.includes('transfers')
  const { status, needsApproval } = useGetRequiresApproval(stakingTokenContract, account, trustBountiesContract.address)
  
  const [state, setState] = useState<any>({
    ve: '',
    claimableBy: AddressZero,
    collectionId: '',
    avatar: '',
    parentBountyId: '',
    minToClaim: '',
    endTime: '',
    isNFT: 0,
    recurring: 0,
    bountySource: ''
  })
  const handleCreateGauge = useCallback(async () => {
      setPendingFb(true);
      const endTime = Math.max(differenceInSeconds(new Date(state.endTime || 0), new Date(), {
        roundingMethod: 'ceil',
      }),0)
      const bountySource = fromAccelerator 
      ? 'Accelerator' : fromAuditors
      ? 'Auditors' : fromContributors
      ? 'Contributors' : fromBusinesses
      ? 'Businesses' : fromRamps
      ? 'Ramps' : fromSponsors
      ? 'Sponsors' : fromTransfers
      ? 'Transfers' : state.bountySource
      // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const ve = getVeFromWorkspace(nftFilters?.workspace?.value?.toLowerCase())
      const args = [
        account,
        currencyAddress,
        ve, 
        state.claimableBy,
        state.parentBountyId, 
        state.collectionId, 
        endTime,
        state.isNFT,
        !!state.recurring,
        state.avatar,
        bountySource
      ]
      console.log("createbounty===============>", trustBountiesContract, args)
      return callWithGasPrice(trustBountiesContract, 'createBounty', args)
      .catch((err) => {
        setPendingFb(false);
        console.log("err0=================>", err)
        toastError(
          t('Issue creating bounty'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {err}
          </ToastDescriptionWithTx>,
        )
      })
    })
    if (receipt?.status) {
      setPendingFb(false);
      toastSuccess(
        t('Bounty successfully created'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start using it to create trust with you partners.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchBountiesAsync({
        fromAccelerator, 
        fromContributors,
        fromSponsors,
        fromAuditors,
        fromBusinesses,
        fromRamps,
        fromTransfers
      }))
    }
      onDismiss()
  }, [
    onDismiss,
    dispatch,
    nftFilters,
    state,
    account,
    trustBountiesContract,
    currencyAddress,
    t,
    toastError,
    toastSuccess,
    callWithGasPrice,
    fetchWithCatchTxError,
    fromAccelerator, 
    fromContributors,
    fromSponsors,
    fromAuditors,
    fromBusinesses,
    fromRamps,
    fromTransfers
  ])

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
  const handleRawValueChange = (key: string) => (value: string | Date) => {
    updateValue(key, value)
  }
  const handleTypeChange = (bountySource: string) => {
    updateValue('bountySource', bountySource)
  }
  
  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])
  
  return (
    <Modal 
    title={t('%titleName%', { titleName: needsApproval ? 'Enable' : 'Create Bounty' })}
    onDismiss={onDismiss}
    >
      {!needsApproval ? 
      <>
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
          {t('Claimable By')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='claimableBy'
          value={state.claimableBy}
          placeholder={t('input claimable by')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Collection ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='collectionId'
          value={state.collectionId}
          placeholder={t('input your collection id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Parent Bounty Id')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='parentBountyId'
          value={state.parentBountyId}
          placeholder={t('input parent bounty id')}
        onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Minimum To Claim')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='minToClaim'
          value={state.minToClaim}
          placeholder={t('input min amount to claim')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Link to Avatar')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='avatar'
          value={state.avatar}
          placeholder={t('input link to your avatar')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('End Time')}
      </Text>
      <DatePicker
        selected={state.endTime}
        placeholderText="YYYY/MM/DD"
        onChange={handleRawValueChange('endTime')}
      />
      <DatePickerPortal/>
    </GreyedOutContainer>
    <GreyedOutContainer style={{ paddingTop:"50px" }}>
        <StyledItemRow>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
          {t('Token Type')}
        </Text>
        <ButtonMenu scale="xs" variant='subtle' activeIndex={state.isNFT} onItemClick={handleRawValueChange('isNFT')}>
        <ButtonMenuItem >{t('Fungible')}</ButtonMenuItem>
        <ButtonMenuItem >{t('ERC721')}</ButtonMenuItem>
        <ButtonMenuItem>{t('ERC1155')}</ButtonMenuItem>
      </ButtonMenu>
      </StyledItemRow>
    </GreyedOutContainer>
    <GreyedOutContainer style={{ paddingTop:"50px" }}>
        <StyledItemRow>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
          {t('Recurring Bounty ?')}
        </Text>
        <ButtonMenu scale="xs" variant='subtle' activeIndex={state.recurring} onItemClick={handleRawValueChange('recurring')}>
        <ButtonMenuItem >{t('No')}</ButtonMenuItem>
        <ButtonMenuItem >{t('Yes')}</ButtonMenuItem>
      </ButtonMenu>
      </StyledItemRow>
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
        {t('Bounty Source')}
      </Text>
      <Select
        // name="bountySource"
        options={[
          {
            label: t('Accelerator'),
            value: 'Accelerator',
          },
          {
            label: t('Auditors'),
            value: 'Auditors',
          },
          {
            label: 'ARP',
            value: 'ARP',
          },
          {
            label: 'Businesses',
            value: 'Businesses',
          },
          {
            label: 'CBC',
            value: 'CBC',
          },
          {
            label: 'Contributors',
            value: 'Contributors',
          },
          {
            label: t('Market Place'),
            value: 'MarketPlace',
          },
          {
            label: t('Profile'),
            value: 'Profile',
          },
          {
            label: t('Ramps'),
            value: 'Ramps',
          },
          {
            label: t('Sponsors'),
            value: 'Sponsors',
          },
          {
            label: 'SSI',
            value: 'SSI',
          },
          {
            label: 'Transfers',
            value: 'Transfers',
          },
          {
            label: t('RP Worlds'),
            value: 'RPWorlds',
          },
          {
            label: t('BP Worlds'),
            value: 'BPWorlds',
          },
        ]}
        onOptionChange={(val)=> handleTypeChange(val.value)}
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
            ? t('The will enable the trust bounty to withdraw from your wallet')
            : t('The will create a new bounty for you. Please read the documentation to learn more about the trust bounty.')}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        {!account ? <ConnectWalletButton />: needsApproval ?
        <Button
          mb="8px"
          onClick={handlePoolApprove}
          endIcon={allowing || status === FetchStatus.Fetching ? <AutoRenewIcon spin color="currentColor" /> : null}
          isLoading={allowing}
          disabled={allowing || status === FetchStatus.Fetching}
        >
          {t('%text% %symbol%', { text: status === FetchStatus.Fetching ? 'Enabling for' : 'Enable for', symbol: currency.symbol, titleName })}
        </Button>: 
        <Button
          mb="8px"
          onClick={handleCreateGauge}
          endIcon={pendingTx || pendingFb ? <AutoRenewIcon spin color="currentColor" /> : null}
          isLoading={pendingTx || pendingFb}
        >
        {t('%text% %symbol%', { text: 'Create a bounty with', symbol: currency.symbol, titleName })}
      </Button>}
      </Flex>
    </Modal>
  )
}

export default CreateStakeModal
