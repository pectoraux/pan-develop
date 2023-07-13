import { useState } from 'react'
import { Flex, Box, Text, Button, ButtonMenu, ButtonMenuItem, Input } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import { useTranslation } from '@pancakeswap/localization'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import _toNumber from 'lodash/toNumber'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BribeField from 'views/Ramps/components/LockedPool/Common/BribeField'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
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
  handleChange,
  handleRawValueChange,
  continueToNextStage 
}) => {
  const { t } = useTranslation()
  const [lockedAmount, setLockedAmount] = useState('')
  const stakingTokenBalance = BIG_ZERO
  const usdValueStaked = useBUSDCakeAmount(_toNumber(lockedAmount))

  return (
    <>
      <Box p="16px" maxWidth="360px">
        <Text fontSize="24px" bold>
          {t('Claim Pending Revenue')}
        </Text>
        <GreyedOutContainer style={{ paddingTop:"50px" }}>
          <StyledItemRow>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
            {t('Source')}
          </Text>
          <ButtonMenu scale="xs" variant='subtle' activeIndex={state.fromNote} onItemClick={handleRawValueChange('fromNote')}>
          <ButtonMenuItem >{t('Account')}</ButtonMenuItem>
          <ButtonMenuItem >{t('Note')}</ButtonMenuItem>
        </ButtonMenu>
        </StyledItemRow>
        </GreyedOutContainer>
        {state.fromNote ?
          <GreyedOutContainer>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('Note Token ID')}
            </Text>
            <Input
              type="text"
              inputMode="decimal"
              pattern="^[0-9]+[.,]?[0-9]*$"
              scale="sm"
              name='tokenId'
              value={state.tokenId}
              placeholder={t('input token id')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
        :null}
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Identity Token ID')}
        </Text>
        <Input
          type="text"
          inputMode="decimal"
          pattern="^[0-9]+[.,]?[0-9]*$"
          scale="sm"
          name='identityTokenId'
          value={state.identityTokenId}
          placeholder={t('input identity token id')}
          onChange={handleChange}
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
