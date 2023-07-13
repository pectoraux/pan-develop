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
          {t('Bounty Required')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='bountyRequired'
          value={state.bountyRequired}
          placeholder={t('input bounty required')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Collection ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='collectionId'
          value={state.collectionId}
          placeholder={t('input collection id')}
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
          placeholder={t('input buffer time')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Max Notes Per Protocol')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='maxNotesPerProtocol'
          value={state.maxNotesPerProtocol}
          placeholder={t('input max notes per protocol')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Admin Bounty Required')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='adminBountyRequired'
          value={state.adminBountyRequired}
          placeholder={t('input admin bounty required')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Period')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='period'
          value={state.period}
          placeholder={t('input period duration')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Admin Credit Share')}(%)
        </Text>
        <Input
          type="text"
          scale="sm"
          name='adminCreditShare'
          value={state.adminCreditShare}
          placeholder={t('input admin credit share')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Admin Debit Share')}(%)
        </Text>
        <Input
          type="text"
          scale="sm"
          name='adminDebitShare'
          value={state.adminDebitShare}
          placeholder={t('input admin debit share')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
      <StyledItemRow>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
            {t('Profile Required')}
          </Text>
          <ButtonMenu scale="xs" variant='subtle' activeIndex={state.profileRequired ? 1 : 0} onItemClick={handleRawValueChange('profileRequired')}>
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
          {t('The will update parameters of the contract. Please read the documentation for more information on each parameter')}
        </Text>
      </Box>
    </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
        >
          {t('Update Parameters')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
