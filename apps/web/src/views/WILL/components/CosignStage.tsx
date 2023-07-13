import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, ButtonMenuItem, ButtonMenu, Input, ErrorIcon } from '@pancakeswap/uikit'
import CopyAddress from 'components/Menu/UserMenu/CopyAddress2'
import { Currency } from "@pancakeswap/sdk"
import { useTranslation } from '@pancakeswap/localization'

import truncateHash from '@pancakeswap/utils/truncateHash'
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
  symbol,
  activeButtonIndex, 
  setActiveButtonIndex,
  handleChange,
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
          <ButtonMenu scale="xs" variant='subtle' activeIndex={activeButtonIndex} onItemClick={setActiveButtonIndex}>
            <ButtonMenuItem >{t("Cosign")}</ButtonMenuItem>
            <ButtonMenuItem >{t("Request Cosign")}</ButtonMenuItem>
          </ButtonMenu> 
      </Flex>
    </GreyedOutContainer>
    {activeButtonIndex === 1 ?
    <GreyedOutContainer>
    <Input
        type="text"
        scale="sm"
        name='requestAmount'
        value={state.requestAmount}
        placeholder={t('input request amount')}
        onChange={handleChange}
      />
    </GreyedOutContainer>:
    <GreyedOutContainer>
    <Input
        type="text"
        scale="sm"
        name='requestAddress'
        value={state.requestAddress}
        placeholder={t('input cosignee address')}
        onChange={handleChange}
      />
    </GreyedOutContainer>}
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        {!activeButtonIndex && state.requests.map((request, index) => <CopyAddress title={t('%amount% %symbol% Requested by %sender%', { amount: state.amounts[index], symbol,sender: truncateHash(request)})} account={request} />)}
      <Divider />
        <Text small color="textSubtle">
          {t('The helps you cosign or request for cosigns on withdrawals of specific amounts from the Ramp. Please read the documentation for more information on each parameter')}
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
          {t('%action%', {action: !activeButtonIndex ? 'Cosign' : 'Request'})}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
