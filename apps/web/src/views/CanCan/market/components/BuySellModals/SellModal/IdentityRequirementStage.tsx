import { Flex, Grid, Text, Button, Input, ErrorIcon, LinkExternal, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { NftToken } from 'state/cancan/types'
import { Divider, RoundedImage } from '../shared/styles'
import { GreyedOutContainer } from './styles'

interface TransferStageProps {
  nftToSell?: any
  requiredIndentity: string
  handleChange: (any) => void
  handleRawValueChange?: any
  continueToNextStage: () => void
}

const IdentityRequirementStage: React.FC<any> = ({
  nftToSell,
  state,
  collectionId,
  handleChange,
  handleRawValueChange,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const isInvalidField1 = false
  const isInvalidField2 = false
  const chunks = nftToSell?.images && nftToSell?.images?.split(",")
  const thumbnail = chunks?.length > 0 && nftToSell?.images?.split(",")[0]
  return (
    <>
      <Text fontSize="24px" bold px="16px" pt="16px">
        {t('Identity Requirements')}
      </Text>
      <Flex p="16px">
        <RoundedImage src={thumbnail} height={68} width={68} mr="8px" />
        <Grid flex="1" gridTemplateColumns="1fr 1fr" alignItems="center">
          <Text bold>{nftToSell?.tokenId}</Text>
          <Text fontSize="12px" color="textSubtle" textAlign="right">
            {`Collection #${collectionId}`}
          </Text>
        </Grid>
      </Flex>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Required Identity')}
        </Text>
        <Input
          scale="sm"
          name='requiredIndentity'
          placeholder={t('gender')}
          value={state.requiredIndentity}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Value name')}
        </Text>
        <Input
          scale="sm"
          placeholder={t('testify_eq_male')}
          name='valueName'
          value={state.valueName}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Maximum Usage')}
        </Text>
        <Input
          scale="sm"
          placeholder={t('input user max usage')}
          name='maxUse'
          value={state.maxUse}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Minimum auditor color')}
        </Text>
        <ButtonMenu scale="sm" activeIndex={state.minIDBadgeColor} onItemClick={handleRawValueChange('minIDBadgeColor')}>
          <ButtonMenuItem >{t('Black')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Brown')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Silver')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Gold')}</ButtonMenuItem>
        </ButtonMenu>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Allow Only TrustWorthy Auditors ?')}
        </Text>
        <ButtonMenu scale="sm" activeIndex={state.onlyTrustWorthyAuditors} onItemClick={handleRawValueChange('onlyTrustWorthyAuditors')}>
          <ButtonMenuItem >{t('No')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
        </ButtonMenu>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Only Data Keepers ?')}
        </Text>
        <ButtonMenu scale="sm" activeIndex={state.dataKeeperOnly} onItemClick={handleRawValueChange('dataKeeperOnly')}>
          <ButtonMenuItem >{t('No')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
        </ButtonMenu>
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Text small color="textSubtle">
          {t('This action will restrict the purchase of this item/service to people with this identity proof. Make sure it’s the correct one')}
        </Text>
      </Grid>
      <Flex flexDirection="column" alignItems="center" justifyContent="space-between" height="150px">
        <LinkExternal href=''>{t('Learn more about identiy requirements')}</LinkExternal>
      </Flex>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
          disabled={isInvalidField1 || isInvalidField2 }
        >
          {t('Update')}
        </Button>
      </Flex>
    </>
  )
}

export default IdentityRequirementStage
