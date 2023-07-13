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

const ModifyCollectionModal: React.FC<any> = ({ 
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
          {t('Modify Collection')}
        </Text>
        <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Owner')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='collection'
          value={state.collection}
          placeholder={t('input channel owner')}
          onChange={handleChange}
        />
        </GreyedOutContainer>
        <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Referrer Fee')}
        </Text>
        <Input
          type="number"
          scale="sm"
          name='referrerFee'
          value={state.referrerFee}
          placeholder={t('percent fee to reward referrers')}
          onChange={handleChange}
        />
        </GreyedOutContainer>
        <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Badge Id')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='badgeId'
          value={state.badgeId}
          placeholder={t('input channel badge id')}
          onChange={handleChange}
        />
        </GreyedOutContainer>
        <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Recurring Bounty (%)')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='recurringBounty'
          value={state.recurringBounty}
          placeholder={t('input recurring bounty percentage')}
          onChange={handleChange}
        />
        </GreyedOutContainer>
        <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Partner Minimum Bounty')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='minBounty'
          value={state.minBounty}
          placeholder={t('partner minimum bounty')}
          onChange={handleChange}
        />
        </GreyedOutContainer>
        <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('User Minimum Bounty')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='userMinBounty'
          value={state.userMinBounty}
          placeholder={t('user minimum bounty')}
          onChange={handleChange}
        />
        </GreyedOutContainer>
        <GreyedOutContainer style={{ paddingTop:"50px" }}>
          <StyledItemRow>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
              {t('User Permission Required')}
            </Text>
            <ButtonMenu scale="xs" variant='subtle' activeIndex={state.requestUserRegistration} onItemClick={handleRawValueChange('requestUserRegistration')}>
              <ButtonMenuItem >{t('No')}</ButtonMenuItem>
              <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
            </ButtonMenu>
          </StyledItemRow>
        </GreyedOutContainer>
        <GreyedOutContainer>
          <StyledItemRow>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
              {t('Partner Permission Required')}
            </Text>
            <ButtonMenu scale="xs" variant='subtle' activeIndex={state.requestPartnerRegistration} onItemClick={handleRawValueChange('requestPartnerRegistration')}>
              <ButtonMenuItem >{t('No')}</ButtonMenuItem>
              <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
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

export default ModifyCollectionModal
