import { useEffect, useRef, useState } from 'react'
import { Flex, Grid, Box, Text, Input, Button, ErrorIcon } from '@pancakeswap/uikit'
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
        {t('Lottery Owner')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='owner'
        value={state.owner}
        placeholder={t('input owner address')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('NFTicket ID')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='nfticketId'
        value={state.nfticketId}
        placeholder={t('input nfticket id')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Identity Token ID')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='identityTokenId'
        value={state.identityTokenId}
        placeholder={t('input identity token id')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Ticket Numbers')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='ticketNumbers'
        value={state.ticketNumbers}
        placeholder={t('comma separated ticket numbers')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t("The will buy tickets in the specified lottery. Please read the documentation for more details.")}
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
          {t('Buy Tickets')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
