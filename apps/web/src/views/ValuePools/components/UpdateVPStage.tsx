import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, ButtonMenuItem, ButtonMenu, Input, ErrorIcon } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import { useTranslation } from '@pancakeswap/localization'
import { NftToken } from 'state/cancan/types'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  nftToSell?: any
  variant?: 'set' | 'adjust'
  currency?: any
  currentPrice?: string
  lowestPrice?: number
  state: any,
  account?: any,
  handleChange?: (any) => void
  handleChoiceChange?: (any) => void
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
          {t('Max Usage')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='maxUse'
          value={state.maxUse}
          placeholder={t('input maximum usage')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Queue Duration (seconds)')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='queueDuration'
          value={state.queueDuration}
          placeholder={t('input queue duration')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Treasury Share')}(%)
        </Text>
        <Input
          type="text"
          scale="sm"
          name='treasuryShare'
          value={state.treasuryShare}
          placeholder={t('input treasury share')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Max Treasury Share')}(%)
        </Text>
        <Input
          type="text"
          scale="sm"
          name='maxTreasuryShare'
          value={state.maxTreasuryShare}
          placeholder={t('input maximum treasury share')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Maximum Withdrawable')}(%)
        </Text>
        <Input
          type="text"
          scale="sm"
          name='maxWithdrawable'
          value={state.maxWithdrawable}
          placeholder={t('input maximum percent withdrawable')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Minimum Receivable')}(%)
        </Text>
        <Input
          type="text"
          scale="sm"
          name='minReceivable'
          value={state.minReceivable}
          placeholder={t('input minimum receivable')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Lender Factor')}(%)
        </Text>
        <Input
          type="text"
          scale="sm"
          name='lenderFactor'
          value={state.lenderFactor}
          placeholder={t('input lender factor')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Minimum Sponsor Percentile')}(%)
        </Text>
        <Input
          type="text"
          scale="sm"
          name='minimumSponsorPercentile'
          value={state.minimumSponsorPercentile}
          placeholder={t('input minimum sponsor percentile')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <StyledItemRow>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
            BNPL
          </Text>
          <ButtonMenu scale="xs" variant='subtle' activeIndex={state.BNPL ? 1 : 0} onItemClick={handleRawValueChange('BNPL')}>
            <ButtonMenuItem >{t("No")}</ButtonMenuItem>
            <ButtonMenuItem >{t("Yes")}</ButtonMenuItem>
          </ButtonMenu> 
        </StyledItemRow>
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Maximum Credit Per User')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='maxDueReceivable'
          value={state.maxDueReceivable}
          placeholder={t('input max credity per user')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('The will update parameters of your Valuepool. Please read the documentation for more information on each parameter')}
        </Text>
      </Box>
    </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
        >
          {t('Update Valuepool')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
