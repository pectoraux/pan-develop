import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, ErrorIcon, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
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
const UpdateStake: React.FC<SetPriceStageProps> = ({
  state,
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
      <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingRight="5px" paddingTop="10px" bold>
        {t('Choose Your Level of Agreement')}
      </Text>
      <StyledItemRow>
        <ButtonMenu
          scale="sm" 
          variant='subtle' 
          activeIndex={state.agreement} 
          onItemClick={handleRawValueChange('agreement')}
        >
          <ButtonMenuItem>{t('Good')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Not Good')}</ButtonMenuItem>
        </ButtonMenu>
      </StyledItemRow>
    </GreyedOutContainer>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('The will update your level of agreement with your partners on this stake. Please read the documentation for more information on each parameter')}
        </Text>
      </Box>
    </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
        >
          {t('Update Stake')}
        </Button>
      </Flex>
    </>
  )
}

export default UpdateStake
