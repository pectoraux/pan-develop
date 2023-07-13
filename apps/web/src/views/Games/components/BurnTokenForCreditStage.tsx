import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, ButtonMenu, ButtonMenuItem, Button, Input, ErrorIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  state: any,
  handleChange?: (any) => void
  handleRawValueChange?: any
  continueToNextStage?: () => void
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const BurnForCreditStage: React.FC<SetPriceStageProps> = ({
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
        {t('Collection Address')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='owner'
        value={state.owner}
        placeholder={t('input your collection address')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Credit Index')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='position'
        value={state.position}
        placeholder={t('input credit index')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <StyledItemRow>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
            {t('Is Credit token fungible ?')}
          </Text>
          <ButtonMenu scale="xs" variant='subtle' activeIndex={state.nftype} onItemClick={handleRawValueChange('nftype')}>
            <ButtonMenuItem >{t("No")}</ButtonMenuItem>
            <ButtonMenuItem >{t("Yes")}</ButtonMenuItem>
          </ButtonMenu> 
        </StyledItemRow>
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {!state.nftype ? t('Token ID') : t('Amount Receivable')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='amountReceivable'
        value={state.amountReceivable}
        placeholder={t('input %val%', { val: !state.nftype ? "token id" : "amount receivable" })}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('The burns your tokens for payment credits in your game. Please read the documentation for more information.')}
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
          {t('Burn for credit')}
        </Button>
      </Flex>
    </>
  )
}

export default BurnForCreditStage