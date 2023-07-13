import { useEffect, useRef, useState, useCallback } from 'react'
import { Flex, Grid, Box, Text, Input, Modal, Button, AutoRenewIcon, ErrorIcon, useToast, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import { useAppDispatch } from 'state'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { fetchArpsAsync } from 'state/arps'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useARPFactory } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { AddressZero } from '@ethersproject/constants'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { Divider, GreyedOutContainer } from './styles'

interface SetPriceStageProps {
  onDismiss?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateARPModal: React.FC<SetPriceStageProps> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const arpFactoryContract = useARPFactory()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const [profileId, setProfileId] = useState('')
  const [valuepool, setValuepool] = useState('')
  const [automatic, setAutomatic] = useState(0)
  const [percentages, setPercentages] = useState(0)
  const [immutableContract, setImmutableContract] = useState(0)
  const { toastSuccess, toastError } = useToast()

  const handleCreateGauge = useCallback(async () => {
      setPendingFb(true);
      // eslint-disable-next-line consistent-return
      const receipt = await fetchWithCatchTxError(async () => {
      console.log("receipt================>", arpFactoryContract, [
        profileId, 
        account,
        valuepool || AddressZero,
        !!automatic,
        !!percentages,
        !!immutableContract
      ])
      try {
          return callWithGasPrice(arpFactoryContract, 'createGauge', [
            profileId,
            account,
            valuepool || AddressZero,
            !!automatic,
            !!percentages,
            !!immutableContract
          ])
        } catch (err) {
          console.log("err================>", err)
          setPendingFb(false)
          // toastError(
          //   t('Issue creating arp'),
          //   <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          //     {err}
          //   </ToastDescriptionWithTx>)
        }
    })
    if (receipt?.status) {
      setPendingFb(false);
      toastSuccess(
        t('ARP successfully created'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start processing transactions through your ARP contract.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchArpsAsync({ fromArp: true }))
    }
      onDismiss()
  }, [t, account, profileId, valuepool, percentages, automatic, immutableContract, dispatch, onDismiss, toastSuccess, callWithGasPrice, fetchWithCatchTxError, arpFactoryContract])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <Modal 
    title={t('Create ARP')}
    onDismiss={onDismiss}
    >
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Profile Id')}
        </Text>
        <Input
          type="text"
          scale="sm"
          value={profileId}
          placeholder={t('input your profile id')}
          onChange={(e) => setProfileId(e.target.value)}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Valuepool Address')}
        </Text>
        <Input
          type="text"
          scale="sm"
          value={valuepool}
          placeholder={t('input valuepool address')}
          onChange={(e) => setValuepool(e.target.value)}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
            {t('Is Automatic ?')}
          </Text>
          <ButtonMenu scale="xs" variant='subtle' activeIndex={automatic ? 1 : 0} onItemClick={setAutomatic}>
            <ButtonMenuItem >{t("No")}</ButtonMenuItem>
            <ButtonMenuItem >{t("Yes")}</ButtonMenuItem>
          </ButtonMenu> 
        </StyledItemRow>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
            {t('Is Percentages ?')}
          </Text>
          <ButtonMenu scale="xs" variant='subtle' activeIndex={percentages ? 1 : 0} onItemClick={setPercentages}>
            <ButtonMenuItem >{t("No")}</ButtonMenuItem>
            <ButtonMenuItem >{t("Yes")}</ButtonMenuItem>
          </ButtonMenu> 
        </StyledItemRow>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
            {t('Is Immutable Contract ?')}
          </Text>
          <ButtonMenu scale="xs" variant='subtle' activeIndex={immutableContract ? 1 : 0} onItemClick={setImmutableContract}>
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
            {t('The will create a new ARP contract with you as its Admin. Please read the documentation to learn more about ARPs.')}
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
          {t('Create ARP')}
        </Button>: <ConnectWalletButton />}
      </Flex>
    </Modal>
  )
}

export default CreateARPModal
