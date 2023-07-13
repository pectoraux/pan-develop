import { isAddress } from 'utils'
import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
import { NftToken } from 'state/nftMarket/types'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { useWeb3React } from '@pancakeswap/wagmi'
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
  currency,
  handleChange,
  handleRawValueChange,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const balance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const stakingTokenBalance = balance ? getDecimalAmount(new BigNumber(balance.toFixed()), currency?.decimals) : BIG_ZERO
  const usdValueStaked = useBUSDCakeAmount(_toNumber(state.amountPayable))

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('ARP Address')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='cbcAddress'
          value={state.cbcAddress}
          placeholder={t('input your ARP address')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
    <GreyedOutContainer>
      <BribeField
        stakingAddress={currency.address}
        stakingSymbol={currency.symbol}
        stakingDecimals={currency.decimals}
        lockedAmount={state.amountPayable}
        usedValueStaked={usdValueStaked}
        stakingMax={stakingTokenBalance}
        setLockedAmount={handleRawValueChange('amountPayable')}
        stakingTokenBalance={stakingTokenBalance}
      />
    </GreyedOutContainer>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('Use this to apply for an amount from the valuepool. Please read the documentation for more details.')}
        </Text>
      </Box>
    </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
          // disabled={!isAddress(state.cbcAddress) || !state.amountPayable}
        >
          {t('Apply')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
