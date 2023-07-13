import { Flex, Box, Text, Button, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { GreyedOutContainer, Divider } from './styles'

interface RemoveStageProps {
  continueToNextStage: () => void
}

const RemoveStage: React.FC<any> = ({ 
  state,
  continueToNextStage,
  handleRawValueChange, 
}) => {
  const { t } = useTranslation()
  return (
    <>
      <Box p="16px" maxWidth="360px">
        <Text mt="24px" color="textSubtle">
          {t('Use this to delete this profile.')}
        </Text>
        <GreyedOutContainer>
          <StyledItemRow>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
                {t('Detach SSID')}
              </Text>
              <ButtonMenu scale="xs" variant='subtle' activeIndex={state.detach ? 1 : 0} onItemClick={handleRawValueChange('detach')}>
                <ButtonMenuItem >{t("No")}</ButtonMenuItem>
                <ButtonMenuItem >{t("Yes")}</ButtonMenuItem>
              </ButtonMenu> 
            </StyledItemRow>
          </GreyedOutContainer>
        <Text mt="16px" color="textSubtle">
          {t('Continue?')}
        </Text>
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button variant="danger" mb="8px" onClick={continueToNextStage}>
          {t('Delete')}
        </Button>
      </Flex>
    </>
  )
}

export default RemoveStage
