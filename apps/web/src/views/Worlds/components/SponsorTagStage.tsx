import { useEffect, useRef, useState } from 'react'
import { Flex, Grid, Box, Text, Button, ErrorIcon, Input } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'
import BigNumber from 'bignumber.js'

import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { useCurrencyBalance } from 'state/wallet/hooks'
import BribeField from './LockedPool/Common/BribeField'
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
  account,
  currency,
  handleChange,
  handleRawValueChange,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const [lockedAmount, setLockedAmount] = useState('')
  const balance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const stakingTokenBalance = balance ? getDecimalAmount(new BigNumber(balance.toFixed()), currency?.decimals) : BIG_ZERO
  const usdValueStaked = useBUSDCakeAmount(_toNumber(lockedAmount))

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('World')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='world'
          value={state.world}
          placeholder={t('input world address')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Sponsor Address')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='sponsor'
          value={state.sponsor}
          placeholder={t('input sponsor address')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Tag Name')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='tag'
          value={state.tag}
          placeholder={t('input tag name')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Link to Media')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='message'
          value={state.message}
          placeholder={t('input link to sponsored content')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <BribeField
        add="pay"
        stakingAddress={currency?.address}
        stakingSymbol={currency?.symbol}
        stakingDecimals={currency?.decimals}
        lockedAmount={state.amountReceivable}
        usedValueStaked={usdValueStaked}
        stakingMax={stakingTokenBalance}
        setLockedAmount={handleRawValueChange('amountReceivable')}
        stakingTokenBalance={stakingTokenBalance}
      />
    </GreyedOutContainer>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t("The will display your media on NFTs from this contract. Please read the documentation for more details.")}
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
          {t('Sponsor')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
