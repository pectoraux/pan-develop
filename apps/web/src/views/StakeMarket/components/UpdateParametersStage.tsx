import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import RichTextEditor from 'components/RichText';
import Filters from 'views/CanCan/market/components/BuySellModals/SellModal/Filters'
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
  nftFilters, 
  setNftFilters,
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
        {t('Profile ID')}
      </Text>
      <Input
        type="number"
        scale="sm"
        name='profileId'
        value={state.profileId}
        placeholder={t('input your profile id')}
        onChange={handleChange}
      />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Bounty ID')}
        </Text>
        <Input
          type="number"
          scale="sm"
          name='bountyId'
          value={state.bountyId}
          placeholder={t('input your bounty id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Stake Required')}
        </Text>
        <Input
          type="number"
          scale="sm"
          name='stakeRequired'
          value={state.stakeRequired}
          placeholder={t('minimum stake to apply')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Gas Percent')}
        </Text>
        <Input
          type="number"
          scale="sm"
          name='gasPercent'
          value={state.gasPercent}
          placeholder={t('percent to use for gas')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
    <GreyedOutContainer>
      <StyledItemRow>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingRight="5px" paddingTop="10px" bold>
          {t('Is Bounty Required')}
        </Text>
        <ButtonMenu
          scale="sm" 
          variant='subtle' 
          activeIndex={state.bountyRequired} 
          onItemClick={handleRawValueChange('bountyRequired')}
        >
          <ButtonMenuItem>{t('No')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
        </ButtonMenu>
      </StyledItemRow>
    </GreyedOutContainer>
    <GreyedOutContainer>
      <StyledItemRow>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingRight="5px" paddingTop="10px" bold>
          {t('Is Profile Required')}
        </Text>
        <ButtonMenu
          scale="sm" 
          variant='subtle' 
          activeIndex={state.profileRequired} 
          onItemClick={handleRawValueChange('profileRequired')}
        >
          <ButtonMenuItem>{t('No')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
        </ButtonMenu>
      </StyledItemRow>
    </GreyedOutContainer>
    <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingRight="5px" paddingTop="10px" bold>
        {t('Terms of your stake')}
      </Text>
      <RichTextEditor value={state.terms} onChange={handleRawValueChange('terms')} id="rte" />
    </GreyedOutContainer>
    <Flex justifyContent='center' alignSelf="center">
      <Filters showWorkspace={false} nftFilters={nftFilters} setNftFilters={setNftFilters} />
    </Flex>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('The will update requirements on this stake. Please read the documentation for more information on each parameter')}
        </Text>
      </Box>
    </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
        >
          {t('Update Requirements')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
