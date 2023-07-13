import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, ButtonMenuItem, ButtonMenu, Input, ErrorIcon } from '@pancakeswap/uikit'
import CopyAddress from 'components/Menu/UserMenu/CopyAddress2'
import { Currency } from "@pancakeswap/sdk"
import { useTranslation } from '@pancakeswap/localization'

import truncateHash from '@pancakeswap/utils/truncateHash'
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

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])
  
  return (
    <>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Min Badge Color')}
      </Text>
      <Flex alignSelf="center" justifyContent="center">
        <ButtonMenu scale="xs" variant='subtle' activeIndex={state.badgeColor} onItemClick={handleRawValueChange('badgeColor')}>
          <ButtonMenuItem >{t("Black")}</ButtonMenuItem>
          <ButtonMenuItem >{t("Brown")}</ButtonMenuItem>
          <ButtonMenuItem >{t("Silver")}</ButtonMenuItem>
          <ButtonMenuItem >{t("Gold")}</ButtonMenuItem>
        </ButtonMenu> 
      </Flex>
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Value Name')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='valueName'
        value={state.valueName}
        placeholder={t('input value name')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Required Value')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='value'
        value={state.value}
        placeholder={t('input required value')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Only Unique Accounts')}
      </Text>
      <Flex alignSelf="center" justifyContent="center">
        <ButtonMenu scale="xs" variant='subtle' activeIndex={state.uniqueAccounts} onItemClick={handleRawValueChange('uniqueAccounts')}>
          <ButtonMenuItem >{t("No")}</ButtonMenuItem>
          <ButtonMenuItem >{t("Yes")}</ButtonMenuItem>
        </ButtonMenu> 
      </Flex>
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Only Data Keepers')}
      </Text>
      <Flex alignSelf="center" justifyContent="center">
        <ButtonMenu scale="xs" variant='subtle' activeIndex={state.dataKeeperOnly} onItemClick={handleRawValueChange('dataKeeperOnly')}>
          <ButtonMenuItem >{t("No")}</ButtonMenuItem>
          <ButtonMenuItem >{t("Yes")}</ButtonMenuItem>
        </ButtonMenu> 
      </Flex>
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Only Trustworthy Users')}
      </Text>
      <Flex alignSelf="center" justifyContent="center">
        <ButtonMenu scale="xs" variant='subtle' activeIndex={state.OnlyTrustworthyMerchants} onItemClick={handleRawValueChange('OnlyTrustworthyMerchants')}>
          <ButtonMenuItem >{t("No")}</ButtonMenuItem>
          <ButtonMenuItem >{t("Yes")}</ButtonMenuItem>
        </ButtonMenu> 
      </Flex>
    </GreyedOutContainer>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
      <Divider />
        <Text small color="textSubtle">
          {t('This helps you configure identity proof requirements for users. Please read the documentation for more information on each parameter')}
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
          {t('Update')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
