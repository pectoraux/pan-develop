import { Flex, Box, Text, Button, Input, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { MarketPlace } from './types'
import { GreyedOutContainer } from './styles'
import { Divider } from '../shared/styles'

interface RemoveStageProps {
  state: any
  handleChange: (any) => void
  handleRawValueChange?: any
  continueToNextStage: () => void
}

const UpdateAuditorsStage: React.FC<RemoveStageProps> = ({ 
  state,
  handleChange, 
  handleRawValueChange,
  continueToNextStage 
}) => {
  const { t } = useTranslation()

  return (
    <>
      <Box p="16px" maxWidth="360px">
        <Text fontSize="24px" bold>
          {t('Update Auditors')}
        </Text>
        <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Addresses of Auditors')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='auditors'
          value={state.auditors}
          placeholder={t('comma seperated addresses')}
          onChange={handleChange}
        />
        </GreyedOutContainer>
        <GreyedOutContainer>
          <StyledItemRow>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
            {t('Action')}
          </Text>
          <ButtonMenu scale="xs" variant='subtle' activeIndex={state.addAuditors} onItemClick={handleRawValueChange('addAuditors')}>
          <ButtonMenuItem >Remove</ButtonMenuItem>
          <ButtonMenuItem >Add</ButtonMenuItem>
        </ButtonMenu>
        </StyledItemRow>
        </GreyedOutContainer>
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

export default UpdateAuditorsStage
