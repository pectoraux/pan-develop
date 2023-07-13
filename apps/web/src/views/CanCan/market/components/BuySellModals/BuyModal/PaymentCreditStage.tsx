import styled from "styled-components";
import { useState } from 'react'
import { 
  Box,
  Flex, 
  Grid, 
  Text, 
  Button, 
  Input, 
  CopyAddress,
  ErrorIcon, 
  LinkExternal, 
  ButtonMenu, 
  ButtonMenuItem,
  HelpIcon,
  useTooltip,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { NftToken } from 'state/cancan/types'
import { useGetTokenForCredit } from 'state/cancan/hooks'
import { isAddress } from 'utils'
import { Divider, RoundedImage } from '../shared/styles'
import { GreyedOutContainer } from '../SellModal/styles'

interface TransferStageProps {
  nftToBuy: NftToken
  continueToNextStage: () => void
}

const Wrapper = styled(Flex)`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-radius: 16px;
  position: relative;
`;
const Address = styled.div`
  flex: 1;
  position: relative;
  padding-left: 16px;

  & > input {
    background: transparent;
    border: 0;
    color: ${({ theme }) => theme.colors.text};
    display: block;
    font-weight: 600;
    font-size: 16px;
    padding: 0;
    width: 100%;

    &:focus {
      outline: 0;
    }
  }

  &:after {
    background: linear-gradient(
      to right,
      ${({ theme }) => theme.colors.background}00,
      ${({ theme }) => theme.colors.background}E6
    );
    content: "";
    height: 100%;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    width: 40px;
  }
`;

const PaymentCreditStage: React.FC<any> = ({
  nftToBuy,
  isPaywall,
  collectionId,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const [amount, setAmount] = useState<any>(0)
  const [burnForCreditToken, setBurnForCreditToken] = useState<any>('')
  const [tokenId, setTokenId] = useState<any>(null)
  const [activeButtonIndex, setActiveButtonIndex] = useState<any>(0)
  const isInvalidField = burnForCreditToken && !isAddress(burnForCreditToken) || !burnForCreditToken
  const discountTokens = useGetTokenForCredit(collectionId, isPaywall)
  // const discountTokens = [
  //   {
  //     discount: 1000,
  //     collectionId: "1",
  //     item: "Uber",
  //     checker: '0x0bDabC785a5e1C71078d6242FB52e70181C1F316',
  //     destination: '0x0bDabC785a5e1C71078d6242FB52e70181C1F316',
  //     token: { 
  //       name: "Payswap",
  //       symbol: "PSWP",
  //       address: '0x0bDabC785a5e1C71078d6242FB52e70181C1F316' 
  //     },
  //   },
  //   {
  //     discount: 1000,
  //     collectionId: "1",
  //     item: "Uber",
  //     checker: '0x0bDabC785a5e1C71078d6242FB52e70181C1F316',
  //     token: { 
  //       name: "Payswap",
  //       symbol: "PSWP",
  //       address: '0x0bDabC785a5e1C71078d6242FB52e70181C1F316' 
  //     },
  //     destination: '0x0bDabC785a5e1C71078d6242FB52e70181C1F316',
  //   },
  //   {
  //     discount: 1000,
  //     collectionId: "1",
  //     item: "Uber",
  //     checker: '0x0bDabC785a5e1C71078d6242FB52e70181C1F316',
  //     token: { 
  //       name: "Payswap",
  //       symbol: "PSWP",
  //       address: '0x0bDabC785a5e1C71078d6242FB52e70181C1F316' 
  //     },
  //     destination: '0x0bDabC785a5e1C71078d6242FB52e70181C1F316',
  //   }
  // ]
  console.log("discountTokens===========>", discountTokens)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Flex overflow="auto" maxHeight="400px" mb="240px">
    <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
    {discountTokens?.map((data) => {
      return (      
        <Flex flexDirection="column" justifyContent="center" alignItems="center">
          <Address title={t("Token Name")}>
            {data.token?.name}
          </Address>
          <Address title={t("Token Symbol")}>
            {data.token?.symbol}
          </Address>
          <Address title={t("Discount")}>
            {Number(data.discount) / 100}%
          </Address>
          <Address title={t("Collection ID")}>
            {data.collectionId}
          </Address>
          <Address title={t("Item")}>
            {data.item}
          </Address>
          <CopyAddress account={data.checker} mb="2px" tooltipMessage={t('Copied Checker Address')} />
          <CopyAddress account={data.token?.address} mb="2px" tooltipMessage={t('Copied Token Address')} />
          <CopyAddress account={data.destination} mb="2px" tooltipMessage={t('Copied Destination Address')} />
        <Divider/>
        </Flex>
      )
    })}
    </Text>
    </Flex>,
    {
      placement: 'bottom',
    },
  )
  const getErrorText = () => {
    if (isInvalidField) {
      return t('This address is invalid')
    }
    return null
  }
  // const discountTokens = [
  //   '0x0bDabC785a5e1C71078d6242FB52e70181C1F316',
  //   '0x0bDabC785a5e1C71078d6242FB52e70181C1F316',
  //   '0x0bDabC785a5e1C71078d6242FB52e70181C1F316',
  //   '0x0bDabC785a5e1C71078d6242FB52e70181C1F316',
  // ]
  const chunks = nftToBuy?.images && nftToBuy?.images?.split(",")
  const thumbnail = chunks?.length > 0 && nftToBuy?.images?.split(",")[0]
  return (
    <>
      <Text fontSize="24px" bold px="16px" pt="16px">
        {t('Burn token for credit')}
      </Text>
      <Flex p="16px">
        <RoundedImage src={thumbnail} height={68} width={68} mr="8px" />
        <Grid flex="1" gridTemplateColumns="1fr 1fr" alignItems="center">
          <Text bold>{nftToBuy.tokenId}</Text>
          <Text fontSize="12px" color="textSubtle" textAlign="right">
            {`Collection #${collectionId}`}
          </Text>
        </Grid>
      </Flex>
      <ButtonMenu scale="sm" activeIndex={activeButtonIndex} onItemClick={setActiveButtonIndex}>
        <ButtonMenuItem >{t('Fungibles')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Non Fungibles')}</ButtonMenuItem>
        <ButtonMenuItem >NFTickets</ButtonMenuItem>
      </ButtonMenu>
      {activeButtonIndex!==2 &&
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Address of token to burn')}
        </Text>
        <Input
          scale="sm"
          placeholder={t('paste your token address')}
          value={burnForCreditToken}
          onChange={(e) => setBurnForCreditToken(e.target.value)}
        />
        {isInvalidField && (
            <Text fontSize="12px" color="failure" mt="4px">
              {getErrorText()}
            </Text>
        )}
      </GreyedOutContainer>}
      {!activeButtonIndex ?
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Amount of token to burn')}
        </Text>
        <Input
        type="number"
        inputMode="decimal"
        pattern="^[0-9]+[.,]?[0-9]*$"
        scale="sm"
        value={amount}
        placeholder={t('amount of token you are willing to burn')}
        onChange={(e) => {setAmount(e.target.value)}}
      />
      </GreyedOutContainer>:
      <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('ID of token to burn')}
      </Text>
      <Input
      type="number"
      scale="sm"
      value={tokenId}
      placeholder={t('ID of token to burn')}
      onChange={(e) => {setTokenId(e.target.value)}}
    />
    </GreyedOutContainer>
    }

      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Text small color="textSubtle">
          {t('This action will create discounts on this product. Eligible tokens are listed below:')}
        </Text>   
      </Grid>
      {discountTokens?.length ?
      <Flex justifyContent="center" alignItems="center" mb="10px">
        <Text fontSize="12px" color="textSubtle">
          {t('View Burn For Credit Options')}
        </Text>
        <Flex ref={targetRef}>
          {tooltipVisible && tooltip}
          <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
        </Flex>
      </Flex>:null}
      <Flex flexDirection="column" alignItems="center" justifyContent="space-between" mb="15px">
          { 
            discountTokens?.map((discountToken: any) => {
              return <CopyAddress account={discountToken.token?.address} mb="24px" tooltipMessage={t('Copied')} />
          })
        }
        </Flex>  
         
      <Flex flexDirection="column" alignItems="center" justifyContent="space-between" height="150px">
        <LinkExternal href=''>{t('Learn more about burns for credit')}</LinkExternal>
      </Flex>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
          disabled={isInvalidField || (!activeButtonIndex && amount <= 0) || (activeButtonIndex && (!tokenId || tokenId < 0))}
        >
          {t('Confirm')}
        </Button>
      </Flex>
    </>
  )
}

export default PaymentCreditStage
