import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, ButtonMenuItem, ButtonMenu, Input, ErrorIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
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
      <Flex alignSelf="center" justifyContent="center">
          <Text fontSize="12px" mr="10px" color="secondary" textTransform="uppercase" bold>
            {t('Account State')}
          </Text>
          <ButtonMenu scale="xs" variant='subtle' activeIndex={state.close ? 1 : 0} onItemClick={handleRawValueChange('close')}>
            <ButtonMenuItem >{t("Open")}</ButtonMenuItem>
            <ButtonMenuItem >{t("Close")}</ButtonMenuItem>
          </ButtonMenu> 
      </Flex>
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
        placeholder={t('input a price if you want to sell account')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Fee Cap')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='cap'
        value={state.cap}
        placeholder={t('input fee cap')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Maximum Number of Partners')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name='maxPartners'
        value={state.maxPartners}
        placeholder={t('input max number of partners')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('The will update parameters of the account. Please read the documentation for more information on each parameter')}
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
          {t('Update Account')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
