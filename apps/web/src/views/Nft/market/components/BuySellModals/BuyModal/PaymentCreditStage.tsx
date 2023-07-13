import { useState } from 'react'
import { 
  Flex, 
  Grid, 
  Text, 
  Button, 
  Input, 
  CopyAddress,
  ErrorIcon, 
  LinkExternal, 
  ButtonMenu, 
  ButtonMenuItem 
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { NftToken } from 'state/cancan/types'
import { isAddress } from 'utils'
import { Divider, RoundedImage } from '../shared/styles'
import { GreyedOutContainer } from '../SellModal/styles'

interface TransferStageProps {
  nftToBuy: NftToken
  continueToNextStage: () => void
}

const PaymentCreditStage: React.FC<any> = ({
  nftToBuy,
  collectionId,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const [amount, setAmount] = useState<any>(0)
  const [burnForCreditToken, setBurnForCreditToken] = useState<any>('')
  const [tokenId, setTokenId] = useState<any>(null)
  const [activeButtonIndex, setActiveButtonIndex] = useState<any>(0)
  const isInvalidField = burnForCreditToken && !isAddress(burnForCreditToken) || !burnForCreditToken
  const getErrorText = () => {
    if (isInvalidField) {
      return t('This address is invalid')
    }
    return null
  }
  const discountTokens = [
    '0x0bDabC785a5e1C71078d6242FB52e70181C1F316',
    '0x0bDabC785a5e1C71078d6242FB52e70181C1F316',
    '0x0bDabC785a5e1C71078d6242FB52e70181C1F316',
    '0x0bDabC785a5e1C71078d6242FB52e70181C1F316',
  ]
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
      <Flex flexDirection="column" alignItems="center" justifyContent="space-between" mb="15px">
          { 
            discountTokens.map((discountToken) => {
              return <CopyAddress account={discountToken} mb="24px" tooltipMessage='' />
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
