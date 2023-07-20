import axios from 'axios'
import { firestore } from 'utils/firebase'
import { loadStripe } from "@stripe/stripe-js"
import { useEffect, useRef, useState } from 'react'
import { Flex, Grid, Box, Text, Button, AutoRenewIcon, Input, ErrorIcon } from '@pancakeswap/uikit'
import { Currency } from "@pancakeswap/sdk"
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'
import { useWeb3React } from '@pancakeswap/wagmi'

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
  pool,
  currency,
  rampAddress,
  handleChange,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const [isLoading, setIsLoading] = useState(false)

  const processCharge = async () => {
    setIsLoading(true)
    const { data } = await axios.post('/api/charge', {account, price: state.amountPayable, currency, rampAddress })
    if (data.error) {
      console.log("data.error=====================>", data.error)
    }
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
    await firestore.collection("onramp").doc(data.id).set({
      amount: state.amountPayable,
      currency: currency?.address,
      session_id: data.id,
      state: 'pending',
      account,
      hash: ''
    })
    await stripe.redirectToCheckout({ sessionId: data?.id })
    setIsLoading(false)
  }  

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Auditor')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='auditor'
          value={state.auditor}
          placeholder={t('input auditor address')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Recipient Address')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='owner'
          value={state.owner}
          placeholder={t('input recipient address')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Stake ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='stakeId'
          value={state.stakeId}
          placeholder={t('input your stake id')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('User Bounty ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='userBountyId'
          value={state.userBountyId}
          placeholder={t('input your bounty id')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Auditor Bounty ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='auditorBountyId'
          value={state.auditorBountyId}
          placeholder={t('input the bounty id of your lender')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Channel Number')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='channel'
          value={state.channel}
          placeholder={t('input channel number')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('The will mint a future collateral for the recipient. Please read the documentation for more details.')}
        </Text>
      </Box>
    </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
            endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
          // disabled={priceIsValid || adjustedPriceIsTheSame || priceIsOutOfRange}
        >
          {t('Mint')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
