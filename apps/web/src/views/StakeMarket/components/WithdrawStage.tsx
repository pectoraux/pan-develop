import { useEffect, useRef, useState } from 'react'
import { Flex, Grid, Box, Text, Button, ErrorIcon, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
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
  state,
  currency,
  totalLiquidity,
  handleRawValueChange,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const [lockedAmount, setLockedAmount] = useState('')
  const stakingTokenBalance = Number(totalLiquidity) ? new BigNumber(totalLiquidity): BIG_ZERO
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
        stakingAddress={currency?.address}
        stakingSymbol={currency?.symbol}
        stakingDecimals={currency?.decimals}
        lockedAmount={state.amountPayable}
        usedValueStaked={usdValueStaked}
        stakingMax={stakingTokenBalance}
        setLockedAmount={handleRawValueChange('amountPayable')}
        stakingTokenBalance={stakingTokenBalance}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingRight="5px" paddingTop="10px" bold>
        {t('Remove yourself as partner')}
      </Text>
      <StyledItemRow>
        <ButtonMenu
          scale="sm" 
          variant='subtle' 
          activeIndex={state.removePartner} 
          onItemClick={handleRawValueChange('removePartner')}
        >
          <ButtonMenuItem>{t('No')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
        </ButtonMenu>
      </StyledItemRow>
    </GreyedOutContainer>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('The will withdraw funds from this stake or pay your partner in the marketplace. Please read the documentation for more details.')}
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
          {t('Withdraw from stake')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
