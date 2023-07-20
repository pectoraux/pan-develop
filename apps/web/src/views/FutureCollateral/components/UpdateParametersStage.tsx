import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
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
        {t('Treasury Fee')}(%)
      </Text>
      <Input
        type="text"
        scale="sm"
        name='treasuryFee'
        value={state.treasuryFee}
        placeholder={t('input treasury fee')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Buffer Time')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='bufferTime'
        value={state.bufferTime}
        placeholder={t('input user buffer time')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Minimum to Blacklist')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='minToBlacklist'
        value={state.minToBlacklist}
        placeholder={t('input min to blacklist')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Minimum Bounty Percentage')}(%)
      </Text>
      <Input
        type="text"
        scale="sm"
        name='minBountyPercent'
        value={state.minBountyPercent}
        placeholder={t('input min bounty percentage')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
      <GreyedOutContainer>
      <StyledItemRow>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
            {t('Update Color')}
          </Text>
          <ButtonMenu scale="xs" variant='subtle' activeIndex={state.updateColor} onItemClick={handleRawValueChange('updateColor')}>
          <ButtonMenuItem >{t("Black")}</ButtonMenuItem>
            <ButtonMenuItem >{t("Brown")}</ButtonMenuItem>
            <ButtonMenuItem >{t("Silver")}</ButtonMenuItem>
            <ButtonMenuItem >{t("Gold")}</ButtonMenuItem>
          </ButtonMenu> 
        </StyledItemRow>
      </GreyedOutContainer>
      <GreyedOutContainer>
      <StyledItemRow>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
            {t('Minimum Color')}
          </Text>
          <ButtonMenu scale="xs" variant='subtle' activeIndex={state.minColor} onItemClick={handleRawValueChange('minColor')}>
            <ButtonMenuItem >{t("Black")}</ButtonMenuItem>
            <ButtonMenuItem >{t("Brown")}</ButtonMenuItem>
            <ButtonMenuItem >{t("Silver")}</ButtonMenuItem>
            <ButtonMenuItem >{t("Gold")}</ButtonMenuItem>
          </ButtonMenu> 
        </StyledItemRow>
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('The will update the parameters of the future collateral contract. Please read the documentation for more information on each parameter')}
        </Text>
      </Box>
    </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
        >
          {t('Update')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
