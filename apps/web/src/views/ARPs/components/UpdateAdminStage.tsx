import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Input, Text, Button, ErrorIcon, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
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
        {t('Account Address')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='owner'
        value={state.owner}
        placeholder={t('input user address')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <StyledItemRow>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
          {t('Add ?')}
        </Text>
        <ButtonMenu scale="xs" variant='subtle' activeIndex={state.add ? 1 : 0} onItemClick={handleRawValueChange('add')}>
          <ButtonMenuItem >{t("No")}</ButtonMenuItem>
          <ButtonMenuItem >{t("Yes")}</ButtonMenuItem>
        </ButtonMenu> 
      </StyledItemRow>
    </GreyedOutContainer>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('The will add or remove the specified address as the contract admin. Please read the documentation for more information on this parameter')}
        </Text>
      </Box>
    </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
        >
          {t('Update Admin')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
