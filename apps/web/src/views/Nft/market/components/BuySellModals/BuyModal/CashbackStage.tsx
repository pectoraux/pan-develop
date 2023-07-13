import { useState } from 'react'
import { Flex, Grid, Text, Button, Input, ErrorIcon, LinkExternal, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { NftToken } from 'state/cancan/types'
import { format } from 'date-fns'
import { Divider, RoundedImage } from '../shared/styles'
import { GreyedOutContainer } from '../SellModal/styles'

interface TransferStageProps {
  nftToBuy: NftToken
  continueToNextStage: () => void
}

const CashbackStage: React.FC<any> = ({
  nftToBuy,
  collectionId,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const [tokenId, setTokenId] = useState<any>(null)
  const [activeButtonIndex, setActiveButtonIndex] = useState<any>(0)
  const numbersElligibilityCriteria = nftToBuy?.marketData.priceReductor?.cashbackNumbers
  const costElligibilityCriteria = nftToBuy?.marketData.priceReductor?.cashbackCost
  const cashNotCredit = nftToBuy?.marketData.priceReductor?.cashNotCredit
  const numbersCashbackAvailable = Number(nftToBuy?.marketData.priceReductor?.discountStatus) === 1 && numbersElligibilityCriteria?.cursor
  const costCashbackAvailable = Number(nftToBuy?.marketData.priceReductor?.cashbackStatus) === 1 && costElligibilityCriteria?.cursor
  const chunks = nftToBuy?.images && nftToBuy?.images?.split(",")
  const thumbnail = chunks?.length > 0 && nftToBuy?.images?.split(",")[0]

  return (
    <>
      <Text fontSize="24px" bold px="16px" pt="16px">
        {t('Cashback Options')}
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
        <ButtonMenuItem>{t('Credit')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Cash')}</ButtonMenuItem>
      </ButtonMenu>
      {activeButtonIndex ? 
      <>
      {!cashNotCredit && <GreyedOutContainer>
        <Text small color="failure">
          {t("This product is not eligible for cash rewards")}
        </Text>
      </GreyedOutContainer>}
      </>:
      <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Product to apply credits towards')}
      </Text>
      <Input
        type="number"
        scale="sm"
        value={tokenId}
        placeholder={t('ID of the product')}
        onChange={(e) => {setTokenId(e.target.value)}}
      />
    </GreyedOutContainer>
    }

      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Text small color="textSubtle">
          {t('This action will either send funds to your wallet or reward you with credits to apply towards another product from this merchant.')}
          {(numbersCashbackAvailable || costCashbackAvailable) && t('Find eligibility criteria below:')}
        </Text>   
      </Grid>
      {numbersCashbackAvailable &&
      <Flex flexDirection="column" alignItems="center" justifyContent="space-between" mb="15px">
          <Text small bold color="secondary">From numbers criteria</Text>
          <Text small bold color="textSubtle">{`Period start: ${format(Number(numbersElligibilityCriteria?.cursor), 'MMM dd, yyyy HH:mm')}`}</Text>
          <Text small bold color="textSubtle">{`Period end: ${format(Number(numbersElligibilityCriteria?.size), 'MMM dd, yyyy HH:mm')}`}</Text>
          <Text small bold color="textSubtle">{`Lower threshold: ${numbersElligibilityCriteria?.lowerThreshold}`}</Text>
          <Text small bold color="textSubtle">{`Upper threshold: ${numbersElligibilityCriteria?.upperThreshold}`}</Text>
          <Text small bold color="textSubtle">{`Cashback percentage: ${numbersElligibilityCriteria?.perct}`}</Text>
          <Text small bold color="textSubtle">{`Limit: ${numbersElligibilityCriteria?.limit}`}</Text>
      </Flex> }
      {costCashbackAvailable &&
      <Flex flexDirection="column" alignItems="center" justifyContent="space-between" mb="15px">
          <Text small bold color="secondary">From cost criteria</Text>
          <Text small bold color="textSubtle">{`Period start: ${format(Number(costElligibilityCriteria?.cursor), 'MMM dd, yyyy HH:mm')}`}</Text>
          <Text small bold color="textSubtle">{`Period end: ${format(Number(costElligibilityCriteria?.size), 'MMM dd, yyyy HH:mm')}`}</Text>
          <Text small bold color="textSubtle">{`Lower threshold: ${costElligibilityCriteria?.lowerThreshold}`}</Text>
          <Text small bold color="textSubtle">{`Upper threshold: ${costElligibilityCriteria?.upperThreshold}`}</Text>
          <Text small bold color="textSubtle">{`Cashback percentage: ${costElligibilityCriteria?.perct}`}</Text>
          <Text small bold color="textSubtle">{`Limit: ${costElligibilityCriteria?.limit}`}</Text>
      </Flex>}
      <Flex flexDirection="column" alignItems="center" justifyContent="space-between" height="150px">
        <LinkExternal href=''>{t('Learn more about cashbacks')}</LinkExternal>
      </Flex>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
          disabled={!activeButtonIndex && (!tokenId || tokenId < 0) || (activeButtonIndex && !cashNotCredit)}
        >
          {t('Confirm')}
        </Button>
      </Flex>
    </>
  )
}

export default CashbackStage
