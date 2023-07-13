import { useWeb3React } from '@pancakeswap/wagmi'
import { useState } from 'react'
import { Flex, Box, Text, Button, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Currency } from "@pancakeswap/sdk"
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import _toNumber from 'lodash/toNumber'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useCurrencyBalance } from 'state/wallet/hooks'
import BribeField from 'views/Ramps/components/LockedPool/Common/BribeField'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { MarketPlace } from './types'
import { GreyedOutContainer } from './styles'
import { Divider } from '../shared/styles'

interface RemoveStageProps {
  state: any
  currency: any
  handleRawValueChange?: any
  continueToNextStage: () => void
}

const ClaimPendingRevenue: React.FC<any> = ({ 
  state,
  currency,
  handleRawValueChange,
  continueToNextStage 
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [lockedAmount, setLockedAmount] = useState('')
  const usdValueStaked = useBUSDCakeAmount(_toNumber(lockedAmount))
  const balance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const stakingTokenBalance = balance ? getDecimalAmount(new BigNumber(balance.toFixed())) : BIG_ZERO

  return (
    <>
      <Box p="16px" maxWidth="360px">
        <Text fontSize="24px" bold>
          {t('Fund Pending Revenue')}
        </Text>
        <GreyedOutContainer style={{ paddingTop:"50px" }}>
          <StyledItemRow>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
              {t('Cashback Fund')}
            </Text>
            <ButtonMenu scale="xs" variant='subtle' activeIndex={state.cashbackFund} onItemClick={handleRawValueChange('cashbackFund')}>
              <ButtonMenuItem >{t('No')}</ButtonMenuItem>
              <ButtonMenuItem >{t('Yes')}</ButtonMenuItem>
            </ButtonMenu>
          </StyledItemRow>
        </GreyedOutContainer>
        <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Amount to fund')}
        </Text>
        <BribeField
            stakingAddress={currency?.address}
            stakingSymbol={currency?.symbol ?? ''}
            stakingDecimals={currency?.decimals}
            lockedAmount={state.amount}
            usedValueStaked={usdValueStaked}
            stakingMax={stakingTokenBalance}
            setLockedAmount={handleRawValueChange('amount')}
            stakingTokenBalance={stakingTokenBalance}
          />
        </GreyedOutContainer>
        <Text mt="16px" color="textSubtle">
          {t('Continue?')}
        </Text>
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Confirm')}
        </Button>
      </Flex>
    </>
  )
}

export default ClaimPendingRevenue
