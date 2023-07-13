import { useEffect, useRef, useState } from 'react'
import { Flex, Grid, Box, Text, Button, ButtonMenuItem, ButtonMenu, Input, ErrorIcon } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import { useTranslation } from '@pancakeswap/localization'
import { NftToken } from 'state/cancan/types'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import BribeField from 'views/Ramps/components/LockedPool/Common/BribeField'
import { useWeb3React } from '@pancakeswap/wagmi'
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
const CreateBountyStage: React.FC<any> = ({
  currency,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const [lockedAmount, setLockedAmount] = useState('')
  const balance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const stakingTokenBalance = balance ? new BigNumber(balance.toFixed()) : BIG_ZERO
  const [activeButtonIndex, setActiveButtonIndex] = useState<any>(0)
  const [minLockAmount, setMinLockAmount] = useState('')

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <>
      <Text fontSize="24px" bold p="16px">
        {t('Create a Bounty')}
      </Text>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Amount to stake')}
        </Text>
        <BribeField
            stakingAddress={currency.address}
            stakingSymbol={currency.symbol}
            stakingDecimals={currency.decimals}
            lockedAmount={lockedAmount}
            usedValueStaked={0}
            stakingMax={stakingTokenBalance}
            setLockedAmount={setLockedAmount}
            stakingTokenBalance={stakingTokenBalance}
          />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('StakeMarket Gas')}
        </Text>
        <BribeField
            stakingAddress={currency.address}
            stakingSymbol={currency.symbol}
            stakingDecimals={currency.decimals}
            lockedAmount={lockedAmount}
            usedValueStaked={0}
            stakingMax={stakingTokenBalance}
            setLockedAmount={setLockedAmount}
            stakingTokenBalance={stakingTokenBalance}
          />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
            {t('Direction')}
          </Text>
          <ButtonMenu scale="xs" variant='subtle' activeIndex={activeButtonIndex} onItemClick={setActiveButtonIndex}>
            <ButtonMenuItem >{"S->R"}</ButtonMenuItem>
            <ButtonMenuItem >{"S<-R"}</ButtonMenuItem>
            <ButtonMenuItem>{"S<->R"}</ButtonMenuItem>
          </ButtonMenu> 
        </StyledItemRow>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Minimum Application Amount')}
        </Text>
        <BribeField
            stakingAddress={currency.address}
            stakingSymbol={currency.symbol}
            stakingDecimals={currency.decimals}
            lockedAmount={minLockAmount}
            usedValueStaked={0}
            stakingMax={stakingTokenBalance}
            setLockedAmount={setMinLockAmount}
            stakingTokenBalance={stakingTokenBalance}
            showBalance={false}
            showWarning={false}
          />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Minimum Payment Receiver')}
        </Text>
        <BribeField
            stakingAddress={currency.address}
            stakingSymbol={currency.symbol}
            stakingDecimals={currency.decimals}
            lockedAmount={minLockAmount}
            usedValueStaked={0}
            stakingMax={stakingTokenBalance}
            setLockedAmount={setMinLockAmount}
            stakingTokenBalance={stakingTokenBalance}
            showBalance={false}
            showWarning={false}
          />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Add Note')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='addNote'
          // value={addNote}
          placeholder={t('add small description of your request')}
          // onChange={handleChange}
        />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t('The will create a trust bounty for your channel. Trust bounties are used to create trust from your users.')}
          </Text>
          <Text small color="textSubtle">
            {t('Please read the documentation to learn more about Trust Bounties.')}
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
          {t('Create')}
        </Button>
      </Flex>
    </>
  )
}

export default CreateBountyStage
