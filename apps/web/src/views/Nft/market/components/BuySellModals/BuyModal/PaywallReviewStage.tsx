import { useState, useMemo, useEffect } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import styled from 'styled-components'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Flex, Text, Button, Input, ButtonMenu, ButtonMenuItem, Message, CopyAddress, Link, useMatchBreakpoints, MinusIcon, IconButton } from '@pancakeswap/uikit'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { useTranslation } from '@pancakeswap/localization'
import { NftToken } from 'state/cancan/types'
import { formatEther } from '@ethersproject/units'
import { getBscScanLinkForNft, isAddress } from 'utils'
import { FetchStatus } from 'config/constants/types'
import { ethersToBigNumber } from '@pancakeswap/utils/bigNumber'
import { FaEquals } from 'react-icons/fa'
import useTokenBalance from 'hooks/useTokenBalance'
import { useGetNftFilters, useGetCollectionContracts } from 'state/cancan/hooks'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import AddressInputPanel from './AddressInputPanel'
import { Divider, RoundedImage } from '../shared/styles'
import { BorderedBox, BnbAmountCell, NumberCell } from './styles'
import { PaymentCurrency } from './types'
import { GreyedOutContainer } from '../SellModal/styles'
import CountdownCircle from './CountdownCircle'

interface ReviewStageProps {
  nftToBuy: NftToken
  paymentCurrency: PaymentCurrency
  setPaymentCurrency: (index: number) => void
  nftPrice: number
  notEnoughBnbForPurchase: boolean
  paymentCredits : number
  totalPayment : number
  userTokenId : number
  identityTokenId : number
  setUserTokenId : () => void
  setIdentityTokenId : () => void
  continueToNextStage: () => void
  continueToCashbackStage: () => void
  continueToPaymentCreditStage: () => void
}

const StyledBorderedBox = styled(BorderedBox)`
  width: 105%;
  ${({ theme }) => theme.mediaQueries.xs} {
    width: 100%;
  }
  
  ${({ theme }) => theme.mediaQueries.sm} {
      width: 100%;
  }
`
const Wrapper = styled.div`
  margin-bottom: 14px;
`

const ExpandingWrapper = styled.div`
  padding: 1px;
  padding-left: 14px;
  padding-right: 14px;
  border-top: 2px solid ${({ theme }) => theme.colors.cardBorder};
  overflow: scroll;
  max-height: 300px;
`

const ReviewStage: React.FC<any> = ({
  status,
  nftToBuy,
  paymentCurrency,
  setPaymentCurrency,
  nftPrice,
  paymentCredits,
  totalPayment,
  discounted,
  userTokenId,
  identityTokenId,
  recipient, 
  setRecipient,
  tokenId, 
  setTokenId,
  mainCurrency,
  secondaryCurrency,
  mainToSecondaryCurrencyFactor,
  requireUpfrontPayment,
  setRequireUpfrontPayment,
  setCheckRank,
  merchantIdentityTokenId,
  setMerchantIdentityTokenId,
  setUserTokenId,
  setIdentityTokenId,
  continueToNextStage,
  continueToCashbackStage,
  continueToPaymentCreditStage,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [discountIndex, setDiscountIndex] = useState(0)
  const { isMobile } = useMatchBreakpoints()
  const showCredits = paymentCredits
  const showSecondMenu = discounted && showCredits
  const nftFilters = useGetNftFilters(account)
  const { balance: bnbBalance, fetchStatus: bnbFetchStatus } = useTokenBalance(mainCurrency?.address ?? '')
  const notEnoughBnbForPurchase = bnbBalance.lt(ethersToBigNumber(totalPayment))
  const walletBalance = parseFloat(formatEther(bnbBalance.toString()))
  console.log("secondaryCurrency=======================>", mainCurrency, notEnoughBnbForPurchase, bnbBalance, totalPayment)
  const slicedContract = isMobile ? `${t('Contract').slice(0,2)}...` : t('Contract')
  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const channelContracts = useGetCollectionContracts(nftToBuy.collectionAddress)
  const currencies = useMemo(() => {
    if (paymentCurrency === 2) {
      const currentContract = channelContracts && channelContracts[recipient]
      if (currentContract) {
        return [mainCurrency, mainCurrency, currentContract.currencyId === 0 ? mainCurrency : secondaryCurrency]
      }
    }
    return [mainCurrency, mainCurrency]
   },[recipient, channelContracts, mainCurrency, secondaryCurrency, paymentCurrency])

   const getSecondaryCurrency = (curr: any) => {
    if (curr?.symbol === secondaryCurrency?.symbol) return mainCurrency
    return secondaryCurrency
   }
   const chunks = nftToBuy?.images && nftToBuy?.images?.split(",")
   const thumbnail = chunks?.length > 0 && nftToBuy?.images?.split(",")[0]
   

  return (
    <>
      <Flex px="24px" pt="24px" flexDirection="column">
        <Flex>
          <RoundedImage src={thumbnail} height={68} width={68} mr="16px" />
          <Flex flexDirection="column" justifyContent="space-evenly">
            <Text color="textSubtle" fontSize="12px">
              {nftToBuy?.currentSeller}
            </Text>
            <Flex alignItems="center">
              <Text fontSize="12px" color="textSubtle" p="0px" height="16px" mr="4px">
                {t('Token ID:')}
              </Text>
              <Button
                as={Link}
                scale="xs"
                px="0px"
                pt="2px"
                external
                variant="text"
                href={getBscScanLinkForNft(nftToBuy.collectionAddress, nftToBuy.tokenId)}
              >
                {nftToBuy.tokenId}
              </Button>
            </Flex>
          </Flex>
        </Flex>
        <StyledBorderedBox>
          <Text small color="textSubtle">
            {t('Pay with')}
          </Text>
          <ButtonMenu
            activeIndex={paymentCurrency}
            onItemClick={(index) => setPaymentCurrency(index)}
            scale="sm"
            variant="subtle"
          >
            <ButtonMenuItem>{mainCurrency?.symbol}</ButtonMenuItem>
            <ButtonMenuItem>{t('Stake Market')}</ButtonMenuItem>
            <ButtonMenuItem>{isMobile || paymentCurrency === 2 ? slicedContract : t('Contract').slice(0,8)}</ButtonMenuItem>
          </ButtonMenu>
        </StyledBorderedBox>
        <StyledBorderedBox>
          <Text small color="textSubtle">
            {t('Base price')}
          </Text>
          <BnbAmountCell 
            bnbAmount={nftPrice} 
            currency={currencies[paymentCurrency]}
            secondaryCurrency={getSecondaryCurrency(currencies[paymentCurrency])}
          />
          {Object.keys(nftFilters).map((optionKey) => {
            return Object.keys(nftFilters[optionKey])
            .filter((valueKey) => !!nftFilters[optionKey][valueKey].count)
            .map((valueKey) => {
              const index = nftToBuy?.option_values?.findIndex((val) => parseFloat(val) === parseFloat(valueKey))
              return <>
              <Text small color="textSubtle">
                {t('%value% (%key%)', {value: nftToBuy?.option_elements[index], key: optionKey})}
              </Text> 
              <NumberCell 
                bnbAmount={nftFilters[optionKey][valueKey].count} 
                price={nftFilters[optionKey][valueKey].price} 
                currency={nftFilters[optionKey][valueKey].currency}
                currentCurrency={currencies[paymentCurrency]} 
                mainToSecondaryCurrencyFactor={mainToSecondaryCurrencyFactor}
                secondaryCurrency={getSecondaryCurrency(currencies[paymentCurrency])}
                />
              </>
          })
          })}
        </StyledBorderedBox>
        {paymentCredits > 0 || discounted ? <>
          <IconButton style={{ position: 'relative', left: '47%'}} mb="8px">
          <MinusIcon color='white' />
        </IconButton>
        {showSecondMenu ?
          <ButtonMenu
            activeIndex={discountIndex}
            onItemClick={(index) => setDiscountIndex(index)}
            scale="sm"
            variant="subtle"
          >
            <ButtonMenuItem>{t('Credits')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Discounts')}</ButtonMenuItem>
          </ButtonMenu>
          : null}
        <StyledBorderedBox>
          {!showSecondMenu && showCredits || (showSecondMenu && !discountIndex) ? 
          <>
          {paymentCredits > 0 ? 
          <>
          <Text small color="textSubtle">
            {t('Payment credits')}
          </Text>
          <BnbAmountCell 
            bnbAmount={nftPrice} 
            currency={currencies[paymentCurrency]}
            secondaryCurrency={getSecondaryCurrency(currencies[paymentCurrency])}
          />
          </>: null}
          </>: discounted ?
          <>
          <Text small color="textSubtle">
            {t('Discounts')}
          </Text>
          <BnbAmountCell 
            bnbAmount={nftPrice} 
            currency={currencies[paymentCurrency]}
            secondaryCurrency={getSecondaryCurrency(currencies[paymentCurrency])}
          />
          </>: null
        }
        </StyledBorderedBox>
        </>: null}
        {paymentCredits > 0 || discounted ? <IconButton style={{ position: 'relative', left: '47%'}}>
        <FaEquals />
        </IconButton>: null}
        <StyledBorderedBox>
          <Text small color="textSubtle">
            {t('Total payment')}
          </Text>
          <BnbAmountCell 
            isLoading={status !== FetchStatus.Fetched}
            bnbAmount={getBalanceNumber(totalPayment)} 
            currency={currencies[paymentCurrency]}
            secondaryCurrency={getSecondaryCurrency(currencies[paymentCurrency])}
          />
          {paymentCurrency !== 2 &&
          <Text small color="textSubtle">
            {t('%symbol% in wallet', { symbol: currencies[0]?.symbol || '' })}
          </Text>}
          {!account ? (
            <Flex justifySelf="flex-end">
              <ConnectWalletButton scale="sm" />
            </Flex>
          ) : (
            paymentCurrency !== 2 &&
            <BnbAmountCell 
              bnbAmount={walletBalance} 
              currency={currencies[0]}
              secondaryCurrency={getSecondaryCurrency(currencies[0])}
              isLoading={bnbFetchStatus !== FetchStatus.Fetched}
              isInsufficient={bnbFetchStatus === FetchStatus.Fetched && notEnoughBnbForPurchase}
            />
          )}
          {paymentCurrency !== 2 &&<>
          <Text small color="textSubtle">
            {t('%symbol% will be taken from your wallet', { symbol: currencies[0]?.symbol || '' })}
          </Text>
          </>}
        </StyledBorderedBox>
        {paymentCurrency === 2 ?
          <>
          <ExpandingWrapper>
          <ExpandableSectionButton
            key='contract-addresses'
            onClick={() => setShowExpandableSection(!showExpandableSection)}
            title="Show Contract"
            expanded={showExpandableSection}
          />
              {showExpandableSection && (
            <Wrapper>
              <Flex flexDirection="column" alignItems="center" justifyContent="space-between" mb="15px">
                {Object.keys(channelContracts || []).map((channelAddress) => {
                    return <CopyAddress account={channelContracts[channelAddress]?.address} title={channelContracts[channelAddress]?.name} mb="24px" tooltipMessage='' />
                })}
              </Flex>  
            </Wrapper>
            )}
            </ExpandingWrapper>
          <AddressInputPanel 
            id="recipient" 
            value={recipient} 
            onChange={setRecipient} 
            />
          </>
        :
        bnbFetchStatus === FetchStatus.Fetched && notEnoughBnbForPurchase && (
          <Message p="8px" variant="danger">
            <Text>
              {t('Not enough %symbol% to purchase this NFT', {
                symbol: currencies[0]?.symbol,
              })}
            </Text>
          </Message>
        )}
        <Flex flexDirection='column' justifyContent='center' alignItems="center">
          <StyledBorderedBox>
            {paymentCurrency === 2 ?
            <GreyedOutContainer>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('veNFT ID')}
              </Text>
              <Input
                type="number"
                scale="sm"
                value={tokenId}
                placeholder={t('input veNFT id')}
                onChange={(e) => setTokenId(e.target.value)}
              />
            </GreyedOutContainer>:
            <GreyedOutContainer>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('Product veNFT ID')}
            </Text>
            <Input
              type="number"
              scale="sm"
              value={userTokenId}
              placeholder={t('input veNFT id of product')}
              onChange={(e) => setUserTokenId(e.target.value)}
            />
          </GreyedOutContainer>}
            <GreyedOutContainer>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Identity Token ID')}
              </Text>
              <Input
                type="number"
                scale="sm"
                value={identityTokenId}
                placeholder={t('input identity token id')}
                onChange={(e) => setIdentityTokenId(e.target.value)}
              />
            </GreyedOutContainer>
            {paymentCurrency === 1 ?
            <GreyedOutContainer style={{ paddingTop:"50px" }}>
              <StyledItemRow>
                <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
                  {t('Require Upfront Payment')}
                </Text>
                <ButtonMenu scale="xs" variant='subtle' activeIndex={requireUpfrontPayment} onItemClick={setRequireUpfrontPayment}>
                  <ButtonMenuItem >{t('No')}</ButtonMenuItem>
                  <ButtonMenuItem >{t('Yes')}</ButtonMenuItem>
                </ButtonMenu>
              </StyledItemRow>
            </GreyedOutContainer>
            :null}
            {paymentCurrency === 2 ?
            <GreyedOutContainer>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Merchant Identity ID (For Check Rank)')}
              </Text>
              <Input
                type="number"
                scale="sm"
                value={merchantIdentityTokenId}
                placeholder={t('input merchant identity id')}
                onChange={(e) => setMerchantIdentityTokenId(e.target.value)}
              />
            </GreyedOutContainer>
          :null}
          </StyledBorderedBox>
        </Flex>
        <Flex alignItems="center">
          <Text my="16px" mr="4px">
            {t('Convert between %symb1% and %symb2%', {symb1: mainCurrency?.symbol || '', symb2: secondaryCurrency?.symbol  || ''})}:
          </Text>
          <Button
            as={Link}
            p="0px"
            height="16px"
            external
            variant="text"
            href="/swap?inputCurrency=BNB&outputCurrency=0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
          >
            {t('Convert')}
          </Button>
        </Flex>
        <Flex alignItems="center">
          <Text my="16px" mr="4px">
            {t('Buy with credit card')}:
          </Text>
          <Button
            as={Link}
            p="0px"
            height="16px"
            external
            variant="text"
            href="/ramps?inputCurrency=BNB&outputCurrency=0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
          >
            {t('Get tFIATs')}
          </Button>
        </Flex>
      </Flex>
      <Divider />
      <Flex px="24px" pb="24px" flexDirection="column">
        <Button
          onClick={continueToNextStage}
          disabled={bnbFetchStatus !== FetchStatus.Fetched || notEnoughBnbForPurchase || (!isAddress(recipient) && paymentCurrency === 2)}
          mb="8px"
        >
          {paymentCurrency === PaymentCurrency.WBNB ? t('Stake') : paymentCurrency === 0 ? t('Checkout') : t('Pick Rank')}
        </Button>
        {paymentCurrency === 2 && 
        <Button
          onClick={() => {
            setCheckRank(true);
            continueToNextStage();
          }}
          disabled={bnbFetchStatus !== FetchStatus.Fetched || notEnoughBnbForPurchase || (!isAddress(recipient) && paymentCurrency === 2)}
          mb="8px"
        >
          {t('Check Rank')}
          <CountdownCircle secondsRemaining={30} isUpdating={false} />
        </Button>}
        <Button onClick={continueToPaymentCreditStage} external style={{ width: '100%' }} variant="secondary" mb="8px">
          {t('Get Payment Credits')}
        </Button>
        <Button onClick={continueToCashbackStage} external style={{ width: '100%' }} variant="secondary" mb="8px">
          {t('Explore Cashback Options')}
        </Button>
      </Flex>
    </>
  )
}

export default ReviewStage
