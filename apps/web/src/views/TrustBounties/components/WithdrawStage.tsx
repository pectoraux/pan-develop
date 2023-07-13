import { useEffect, useRef, useState } from 'react'
import { Flex, Grid, Box, Text, Button, ErrorIcon } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@pancakeswap/wagmi'
import BribeField from './LockedPool/Common/BribeField'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  currency?: any
  handleChange?: (any) => void
  handleChoiceChange?: (any) => void
  handleRawValueChange?: any
  continueToNextStage?: () => void
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const SetPriceStage: React.FC<any> = ({
  currency,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const [lockedAmount, setLockedAmount] = useState('')
  const balance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const stakingTokenBalance = balance ? new BigNumber(balance.toFixed()) : BIG_ZERO
  const usdValueStaked = useBUSDCakeAmount(_toNumber(lockedAmount))

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <>
    <GreyedOutContainer>
      <BribeField
        stakingAddress={currency.address}
        stakingSymbol={currency.symbol}
        stakingDecimals={currency.decimals}
        lockedAmount={lockedAmount}
        usedValueStaked={usdValueStaked}
        stakingMax={stakingTokenBalance}
        setLockedAmount={setLockedAmount}
        stakingTokenBalance={stakingTokenBalance}
      />
    </GreyedOutContainer>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('The will withdraw funds from your account in the valuepool. Please read the documentation for more details.')}
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
          {t('Withdraw from account')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
