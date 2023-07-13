import { useState, useMemo } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import styled from 'styled-components'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Flex, Text, Button, ButtonMenu, ButtonMenuItem, CopyAddress, Message, Link, useMatchBreakpoints, MinusIcon, IconButton } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import { useWorkspaceCurrency } from 'hooks/Tokens'
import { useTranslation } from '@pancakeswap/localization'
import { NftToken } from 'state/cancan/types'
import { getBscScanLinkForNft } from 'utils'
import { FetchStatus } from 'config/constants/types'
import { FaEquals } from 'react-icons/fa'
import { useGetNftFilters, useGetCollectionContracts } from 'state/cancan/hooks'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import BribeField from 'views/Ramps/components/LockedPool/Common/BribeField'
import AddressInputPanel from './AddressInputPanel'
import { Divider, RoundedImage } from '../shared/styles'
import { BorderedBox, BnbAmountCell, NumberCell } from './styles'
import { GreyedOutContainer } from '../SellModal/styles'
import { PaymentCurrency } from './types'

interface ReviewStageProps {
  nftToBuy: NftToken
  paymentCurrency: PaymentCurrency
  setPaymentCurrency: (index: number) => void
  nftPrice: number
  walletBalance: number
  walletFetchStatus: FetchStatus
  notEnoughBnbForPurchase: boolean
  paymentCredits : number
  merchantCredits : number
  discounts : number
  totalPayment : number
  optionsPrice : number
  continueToNextStage: () => void
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
  nftToBuy,
  paymentCurrency,
  setPaymentCurrency,
  nftPrice,
  walletBalance,
  walletFetchStatus,
  notEnoughBnbForPurchase,
  paymentCredits,
  merchantCredits,
  discounts,
  totalPayment,
  optionsPrice,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const workspaceId = nftToBuy.attributes.find((attribute) => attribute.traitType === 'workspace')?.value?.toString()
  const {
    mainCurrency,
    secondaryCurrency,
    mainToSecondaryCurrencyFactor,
   } = useWorkspaceCurrency(workspaceId, nftToBuy.tFIAT, nftToBuy.usetFIAT, nftToBuy?.marketData?.currentAskPrice)
   const [recipient, setRecipient] = useState<string>('')
   const [discountIndex, setDiscountIndex] = useState(0)
   const { isMobile } = useMatchBreakpoints()
   const showCredits = paymentCredits || merchantCredits
   const showSecondMenu = discounts && showCredits
   const nftFilters = useGetNftFilters(account)
   const [direction] = nftToBuy.marketData.direction
   const slicedContract = isMobile ? `${t('Contract').slice(0,2)}...` : t('Contract')
   const [showExpandableSection, setShowExpandableSection] = useState(false)
   const [lockedAmount, setLockedAmount] = useState('')
   const balances = [
    useCurrencyBalance(account ?? undefined, mainCurrency ?? undefined),
    useCurrencyBalance(account ?? undefined, secondaryCurrency ?? undefined)
  ]
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stakingTokenBalances = [
    balances[0] ? new BigNumber(balances[0].toFixed()) : BIG_ZERO,
    balances[1] ? new BigNumber(balances[0].toFixed()) : BIG_ZERO
  ]
   const channelContracts = useGetCollectionContracts(nftToBuy.collectionAddress)
   const mcurrencies = useMemo(() => {
    if (paymentCurrency === 2) {
      const currentContract = channelContracts.find((channelContract) => channelContract.address === recipient)
      if (currentContract) {
        return [mainCurrency, secondaryCurrency, currentContract.currencyId === 0 ? mainCurrency : secondaryCurrency]
      }
    }
    return [mainCurrency, secondaryCurrency]
   },[recipient, channelContracts, mainCurrency, secondaryCurrency, paymentCurrency])

   const allStakingTokenBalances = useMemo(() => {
    if (paymentCurrency === 2) {
      const currentContract = channelContracts.find((channelContract) => channelContract.address === recipient)
      if (currentContract) {
        return [stakingTokenBalances[0], stakingTokenBalances[1], currentContract.currencyId === 0 ? stakingTokenBalances[0] : stakingTokenBalances[1]]
      }
    }
    return [stakingTokenBalances[0], stakingTokenBalances[1]]
   },[paymentCurrency, stakingTokenBalances, channelContracts, recipient])

   const currencies = mcurrencies as any

   const getSecondaryCurrency = (curr: any) => {
    if (curr?.symbol === secondaryCurrency?.symbol) return mainCurrency
    return secondaryCurrency
   }

   return (
    <>
      <Flex px="24px" pt="24px" flexDirection="column">
        <Flex>
          <RoundedImage src={nftToBuy.image.thumbnail} height={68} width={68} mr="16px" />
          <Flex flexDirection="column" justifyContent="space-evenly">
            <Text color="textSubtle" fontSize="12px">
              {nftToBuy?.collectionName}
            </Text>
            <Text bold>{nftToBuy.name}</Text>
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
            <ButtonMenuItem>{secondaryCurrency?.symbol}</ButtonMenuItem>
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
          {Object.keys(nftFilters).map((optionKey, idx) => {
            return Object.keys(nftFilters[optionKey]).map((valueKey) => {
              return <>
              <Text small color="textSubtle">
                {t('%value% (%key%)', {value: valueKey, key: optionKey})}
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
        {paymentCredits > 0 || merchantCredits > 0 || discounts ? <>
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
            <ButtonMenuItem>Credits</ButtonMenuItem>
            <ButtonMenuItem>Discounts</ButtonMenuItem>
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
            bnbAmount={paymentCredits} 
            currency={currencies[paymentCurrency]}
            secondaryCurrency={getSecondaryCurrency(currencies[paymentCurrency])}
          />
          </>: null}
          {merchantCredits > 0 ?
            <>
            <Text small color="textSubtle">
              {t('Merchant credits')}
            </Text>
            <BnbAmountCell 
              bnbAmount={merchantCredits} 
              currency={currencies[paymentCurrency]}
              secondaryCurrency={getSecondaryCurrency(currencies[paymentCurrency])}
            />
            </> : null}
            </>: discounts ?
            <>
            <Text small color="textSubtle">
              {t('Discounts')}
            </Text>
            <BnbAmountCell 
              bnbAmount={discounts} 
              currency={currencies[paymentCurrency]}
              secondaryCurrency={getSecondaryCurrency(currencies[paymentCurrency])}
            />
            </>: null
        }
        </StyledBorderedBox>
        </>: null}
        {paymentCredits > 0 || merchantCredits > 0 || discounts ? <IconButton style={{ position: 'relative', left: '47%'}}>
        <FaEquals />
        </IconButton>: null}
        <StyledBorderedBox>
          <Text small color="textSubtle">
            {t('Total payment')}
          </Text>
          <BnbAmountCell 
            bnbAmount={totalPayment} 
            currency={currencies[paymentCurrency]}
            secondaryCurrency={getSecondaryCurrency(currencies[paymentCurrency])}
          />
          {paymentCurrency !== 2 &&
          <Text small color="textSubtle">
            {t('%symbol% in wallet', { symbol: currencies[paymentCurrency]?.symbol || '' })}
          </Text>}
          {!account ? (
            <Flex justifySelf="flex-end">
              <ConnectWalletButton scale="sm" />
            </Flex>
          ) : (
            paymentCurrency !== 2 &&
            <BnbAmountCell 
              bnbAmount={walletBalance} 
              currency={currencies[paymentCurrency]}
              secondaryCurrency={getSecondaryCurrency(currencies[paymentCurrency])}
              isLoading={walletFetchStatus !== FetchStatus.Fetched}
              isInsufficient={walletFetchStatus === FetchStatus.Fetched && notEnoughBnbForPurchase}
            />
          )}
          {paymentCurrency !== 2 &&<>
          <Text small color="textSubtle">
            {t('%symbol% will be %direction% your wallet', { symbol: currencies[paymentCurrency]?.symbol || '', direction: direction === "0" ? 'taken from' : 'sent into'})}
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
                {channelContracts.map((channelContract) => {
                    return <CopyAddress account={channelContract.address} title={channelContract.name} mb="24px" tooltipMessage='' />
                })}
              </Flex>  
            </Wrapper>
            )}
            </ExpandingWrapper>
          <AddressInputPanel id="recipient" value={recipient} onChange={setRecipient} />
          </>
        :
        walletFetchStatus === FetchStatus.Fetched && notEnoughBnbForPurchase && (
          <Message p="8px" variant="danger">
            <Text>
              {t('Not enough %symbol% to purchase this NFT', {
                symbol: currencies[paymentCurrency]?.symbol || '',
              })}
            </Text>
          </Message>
        )}
        {currencies.length === 3 &&
        <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('StakeMarket Gas')}
        </Text>
          <BribeField
            stakingAddress={currencies[paymentCurrency]?.address}
            stakingSymbol={currencies[paymentCurrency]?.symbol}
            stakingDecimals={currencies[paymentCurrency]?.decimals}
            lockedAmount={lockedAmount}
            usedValueStaked={0}
            stakingMax={allStakingTokenBalances[paymentCurrency]}
            setLockedAmount={setLockedAmount}
            stakingTokenBalance={allStakingTokenBalances[paymentCurrency]}
          />
        </GreyedOutContainer>}
        <Flex alignItems="center">
          <Text my="16px" mr="4px">
            {t('Convert between %symb1% and %symb2%', {symb1: mainCurrency?.symbol || '', symb2: secondaryCurrency?.symbol || '' })}:
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
        <Button onClick={continueToNextStage} mb="8px">
          {t('Confirm')}
        </Button>
      </Flex>
    </>
  )
}

export default ReviewStage
