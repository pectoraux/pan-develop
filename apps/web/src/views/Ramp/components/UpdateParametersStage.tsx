import { useEffect, useRef, useState } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import { useTranslation } from '@pancakeswap/localization'

import { useWeb3React } from '@pancakeswap/wagmi'
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
  nftToSell,
  variant,
  currency,
  state,
  setState,
  handleChange,
  handleRawValueChange,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const [lockedAmount, setLockedAmount] = useState('')
  // const balance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  // const stakingTokenBalance = balance ? new BigNumber(balance.toFixed()) : BIG_ZERO
  const [activeButtonIndex, setActiveButtonIndex] = useState<any>(0)
  const [activeButtonIndex2, setActiveButtonIndex2] = useState(0)
  const [minLockAmount, setMinLockAmount] = useState('')
  

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Mint Fee')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='mintFee'
        value={state.mintFee}
        placeholder={t('input ramp minting fee')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Burn Fee')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='burnFee'
          value={state.burnFee}
          placeholder={t('input ramp burn fee')}
        onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Badge ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='badgeID'
          value={state.badgeID}
          placeholder={t('input badge id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Sale Price')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='salePrice'
          value={state.salePrice}
          placeholder={t('input sale price to sell ramp')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('The will update parameters of the ramp. Please read the documentation for more information on each parameter')}
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
          {t('Update Parameters')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
