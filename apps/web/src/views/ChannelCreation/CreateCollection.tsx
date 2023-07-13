import { useRouter } from 'next/router'
import { ChangeEvent, useState, useCallback } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Input as UIKitInput, Flex, Heading, Text, Button, AutoRenewIcon, useToast, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { MarketPlace, OptionType } from 'views/CanCan/market/components/BuySellModals/SellModal/types'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useMarketCollectionsContract } from 'hooks/useContract'
import BigNumber from 'bignumber.js'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import Filters from './Filters'
import NextStepButton from './NextStepButton'

const InputWrap = styled.div`
  position: relative;
  max-width: 240px;
  margin-bottom: 20px;
`

const Input = styled(UIKitInput)`
  padding-right: 40px;
`
const Team: React.FC = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { signer: marketCollectionsContract } = useMarketCollectionsContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [isDone, setIsDone] = useState(false)
  const [nftFilters, setNftFilters] = useState<any>({})
  const [state, setState] = useState<any>(() => ({
    collection: "", 
    referrerFee: "",
    name: "",
    badgeId: "",
    recurringBounty: "",
    identityTokenId: "",
    requestUserRegistration: 0,
    requestPartnerRegistration: 0,
    baseToken: "",
    auditors: [],
    addAuditors: 1,
    token: "",
    fromNote: 1,
    tokenId: "",
    amount: "",
    userAmount: "",
    cashbackFund: 1,
    start: "",
    end: "",
    avatar: "",
    ABMax: "",
    ABDeadline: "",
    description: "",
    large: "",
    small: "",
    contactChannels: "",
    contacts: "",
  }))
  const updateValue = (key: any, value: string | OptionType[] | boolean | number | Date) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    updateValue(inputName, value)
  }
  const handleRawValueChange = (key: string) => (value: boolean) => {
    updateValue(key, value)
  }

  const handleCreateCollection = useCallback(async () => {
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
        const minBounty = getDecimalAmount(new BigNumber(state.amount), 18)
        const userMinBounty = getDecimalAmount(new BigNumber(state.userAmount), 18)
        const args = [
          state.referrerFee,
          state.badgeId,
          minBounty.toString(),
          userMinBounty.toString(),
          state.recurringBounty,
          state.identityTokenId,
          state.baseToken,
          !!state.requestUserRegistration,
          !!state.requestPartnerRegistration
        ]
        const args2 = [
          state.name, 
          state.description,
          state.large,
          state.small,
          state.avatar,
          state.contactChannels,
          state.contacts,
          nftFilters?.workspace?.toString(),// reduce((accum, attr) => ([...accum, attr]),[],),
          nftFilters?.country?.toString(),// reduce((accum, attr) => ([...accum, attr]),[],),
          nftFilters?.city?.toString(),// reduce((accum, attr) => ([...accum, attr]),[],),
          nftFilters?.product?.toString(),// reduce((accum, attr) => ([...accum, attr]),[],),
        ]
        console.log("add==========>", marketCollectionsContract, args)
        console.log("update====================>", args2)
        return callWithGasPrice(marketCollectionsContract, 'addCollection', args)
        .then(() => {
          return callWithGasPrice(marketCollectionsContract, 'updateCollection', args2)
        })
        .catch((err) => {
          console.log("channel====================>", err)
        })
    })
    if (receipt?.status) {
        toastSuccess(
          t('Channel Created'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('You can now start listing your products either on CanCan or the NFT marketplace')}
          </ToastDescriptionWithTx>,
        )
        setIsDone(true);
      }
  }, [
    state,
    t,
    nftFilters,
    toastSuccess,
    callWithGasPrice,
    fetchWithCatchTxError,
    marketCollectionsContract
  ])

  return (
    <>
      <Heading as="h3" scale="xl" mb="24px">
        {t('Create a Channel')}
      </Heading>
      <Text as="p" mb="24px">
        {t('Your channel can be used to list products for sale in CanCan or in the NFT marketplace!')}
      </Text>
      <Card mb="24px">
        <CardBody>
        <Flex flexDirection='column' justifyContent='center' alignItems='center' >
        <Flex flexDirection='row' >
          <Flex flexDirection='column' mr="10px" >
            <InputWrap>
                <Input
                  name='name'
                  onChange={handleChange}
                  placeholder={t('input channel name')}
                  value={state.name}
                />
            </InputWrap>
            <InputWrap>
                <Input
                  onChange={handleChange}
                  name='description'
                  placeholder={t('input description')}
                  value={state.description}
                />
            </InputWrap>
            <InputWrap>
                <Input
                  onChange={handleChange}
                  name='contactChannels'
                  placeholder={t('input contact channels')}
                  value={state.contactChannels}
                />
            </InputWrap>
            <InputWrap>
                <Input
                  onChange={handleChange}
                  name='contacts'
                  placeholder={t('input contacts')}
                  value={state.contacts}
                />
            </InputWrap>
            <InputWrap>
                <Input
                  name='referrerFee'
                  onChange={handleChange}
                  placeholder={t('input referrer fee')}
                  value={state.referrerFee}
                />
            </InputWrap>
            <InputWrap>
                <Input
                  name='badgeId'
                  onChange={handleChange}
                  placeholder={t('badge ID')}
                  value={state.badgeId}
                />
            </InputWrap>
            <InputWrap>
                <Input
                  onChange={handleChange}
                  name='amount'
                  placeholder={t('partner minimum bounty')}
                  value={state.amount}
                />
            </InputWrap>
            <InputWrap>
                <Input
                  onChange={handleChange}
                  name='userAmount'
                  placeholder={t('input user minimum bounty')}
                  value={state.userAmount}
                />
            </InputWrap>
            </Flex>
        <Flex flexDirection='column'>
            <InputWrap>
                <Input
                  onChange={handleChange}
                  name='recurringBounty'
                  placeholder={t('recurring bounty percent')}
                  value={state.recurringBounty}
                />
            </InputWrap>
            <InputWrap>
                <Input
                  onChange={handleChange}
                  name='identityTokenId'
                  placeholder={t('input identity token id')}
                  value={state.identityTokenId}
                />
            </InputWrap>
            <InputWrap>
                <Input
                  onChange={handleChange}
                  name='baseToken'
                  placeholder={t('input base token address')}
                  value={state.baseToken}
                />
            </InputWrap>
            <InputWrap>
                <Input
                  onChange={handleChange}
                  name='large'
                  placeholder={t('large banner(1500x500)')}
                  value={state.large}
                />
            </InputWrap>
            <InputWrap>
                <Input
                  onChange={handleChange}
                  name='small'
                  placeholder={t('small banner(1500x500)')}
                  value={state.small}
                />
            </InputWrap>
            <InputWrap>
                <Input
                  onChange={handleChange}
                  name='avatar'
                  placeholder={t('avatar(700x700)')}
                  value={state.avatar}
                />
            </InputWrap>
            <StyledItemRow>
            <InputWrap>
                <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="13px" paddingRight="50px" bold>
                  {t('User Permission Required')}
                </Text>
                <ButtonMenu 
                  scale="sm" 
                  variant='subtle' 
                  activeIndex={state.requestUserRegistration} 
                  onItemClick={handleRawValueChange('requestUserRegistration')}
                  >
                <ButtonMenuItem>{t('No')}</ButtonMenuItem>
                <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
              </ButtonMenu>
            </InputWrap>
            <InputWrap>
                <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="13px" paddingRight="50px" bold>
                  {t('Partner Permission Required')}
                </Text>
                <ButtonMenu 
                  scale="sm" 
                  variant='subtle' 
                  activeIndex={state.requestPartnerRegistration} 
                  onItemClick={handleRawValueChange('requestPartnerRegistration')}
                  >
                <ButtonMenuItem>{t('No')}</ButtonMenuItem>
                <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
              </ButtonMenu>
            </InputWrap>
            </StyledItemRow>
            <Filters nftFilters={nftFilters} setNftFilters={setNftFilters} />
            </Flex>
            </Flex>
          <Button
            disabled={isDone}
            onClick={handleCreateCollection}
            endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : undefined}
            // id="approveStarterCollectible"
          >
            {t('Create Channel')}
          </Button>
          </Flex>
        </CardBody>
      </Card>
      <NextStepButton onClick={() => router.push('/cancan')} disabled={!isDone}>
        {t('Go to CanCan')}
      </NextStepButton>
    </>
  )
}

export default Team
