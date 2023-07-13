import { useEffect, useRef, useMemo } from 'react'
import { Flex, Grid, Box, Text, Button, ErrorIcon } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'
import { NftToken } from 'state/cancan/types'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { useCurrBribe, useCurrPool } from 'state/businesses/hooks'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BribeField from './LockedPool/Common/BribeField'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  pool: NftToken
  variant?: 'set' | 'adjust'
  currency?: any
  currentPrice?: string
  state: any,
  handleChange?: (any) => void
  handleChoiceChange?: (any) => void
  handleRawValueChange?: any
  continueToNextStage?: () => void
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const SetPriceStage: React.FC<any> = ({
  pool,
  currency,
  lockedAmount,
  setLockedAmount,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const usdValueStaked = useBUSDCakeAmount(_toNumber(lockedAmount))

  const currState = useCurrBribe()
  const tokenAddress = currency.address || ''
  const currBribe = useMemo(() => {
    if (!pool.poolBribes) return {}
    const b = pool.poolBribes?.find((bribe) => tokenAddress ? bribe.tokenAddress ===  currState[tokenAddress] : false)
    return b ?? pool.poolBribes[0]
  }, [currState, pool, tokenAddress])

  const currTokenState = useCurrPool()
  const earnings = useMemo(() => {
    const reward = currBribe?.rewards?.find((rw) => currTokenState[currState[tokenAddress]] === rw.tokenId)
    const rewardAmount = reward ? reward.reward : currBribe?.rewardAmount
    return currBribe ? new BigNumber(rewardAmount) : BIG_ZERO
  },[currBribe, currState, currTokenState, tokenAddress]) 
  const earningTokenBalance = getBalanceNumber(earnings, currBribe?.decimals)

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <>
    <GreyedOutContainer>
      <BribeField
        add="withdraw"
        stakingAddress={currency.address}
        stakingSymbol={currency.symbol}
        stakingDecimals={currency.decimals}
        lockedAmount={earningTokenBalance}
        usedValueStaked={usdValueStaked}
        stakingMax={earnings}
        setLockedAmount={setLockedAmount}
        stakingTokenBalance={earnings}
      />
    </GreyedOutContainer>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('The will withdraw funds from your Gauge. Please read the documentation for more details.')}
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
          {t('Withdraw from Gauge')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
