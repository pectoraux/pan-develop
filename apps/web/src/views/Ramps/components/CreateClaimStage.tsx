import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, ButtonMenu, ButtonMenuItem, Input, ErrorIcon, useTooltip } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import _toNumber from 'lodash/toNumber'
import { NftToken } from 'state/cancan/types'
import { useTranslation } from '@pancakeswap/localization'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  nftToSell?: any
  variant?: 'set' | 'adjust'
  currency?: any
  currentPrice?: string
  lowestPrice?: number
  state: any,
  account?: any,
  handleChange?: (any) => void
  handleChoiceChange?: (any) => void
  handleRawValueChange?: any
  continueToNextStage?: () => void
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const SetPriceStage: React.FC<any> = ({
  state,
  handleChange,
  handleRawValueChange,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()

  const { tooltip, tooltipVisible, targetRef } = useTooltip(
    <>
      <Text>
        {t(
          'When selling NFTs from this collection, a portion of the BNB paid will be diverted before reaching the seller:',
        )}
      </Text>
      {/* {creatorFeeAsNumber > 0 && (
        <Text>{t('%percentage%% royalties to the collection owner', { percentage: creatorFee })}</Text>
      )}
      <Text>{t('%percentage%% trading fee will be used to buy & burn CAKE', { percentage: tradingFee })}</Text> */}
    </>,
    { placement: 'auto' },
  )

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Amount')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='amountPayable'
          value={state.amountPayable}
          placeholder={t('input amount to claim')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Title')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='title'
          value={state.title}
          placeholder={t('input claim title')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Content')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='content'
          value={state.content}
          placeholder={t('input claim content')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <StyledItemRow>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
          {t('Lock Bounty ?')}
        </Text>
        <ButtonMenu scale="xs" variant='subtle' activeIndex={state.add ? 1 : 0} onItemClick={handleRawValueChange('add')}>
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
          {t('The will create a claim for the bounty in the stake market. Please read the documentation for more details.')}
        </Text>
      </Box>
    </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
          // disabled={priceIsValid || adjustedPriceIsTheSame || priceIsOutOfRange}
        >
          {t('Create Claim')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
