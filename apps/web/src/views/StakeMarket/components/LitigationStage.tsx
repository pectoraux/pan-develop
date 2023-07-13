import { differenceInSeconds } from 'date-fns'
import { convertTimeToSeconds } from 'utils/timeHelper'
import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon } from '@pancakeswap/uikit'
import Link from 'next/link'
import { Currency } from "@pancakeswap/sdk"
import { useTranslation } from '@pancakeswap/localization'
import { NftToken } from 'state/cancan/types'
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
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const waitingPeriod = differenceInSeconds(new Date(convertTimeToSeconds(state.waitingDuration)), new Date(), {
    roundingMethod: 'ceil',
  })
  const waitingPeriodExpired = waitingPeriod <= 0 && parseInt(state.waitingDuration)

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <>
    {!waitingPeriodExpired ?
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Stake Id')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='stakeId'
          value={state.stakeId}
          placeholder={t('input your stake Id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>:null}
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {waitingPeriodExpired ?
          t('Click below to create your litigation'):
          t('The will start a timer at the end of which you can create a litigation. Please read the documentation for more information on each parameter')}
        </Text>
      </Box>
    </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
      {waitingPeriodExpired ?
      <Link href={`/stakemarket/voting/create?stakeId=${state.stakeId}`} passHref prefetch={false}>
        <Button
        mb="8px"
        // disabled={priceIsValid || adjustedPriceIsTheSame || priceIsOutOfRange}
      >
        {t('Create Litigation')}
      </Button>
      </Link>
        :<Button
          mb="8px"
          onClick={continueToNextStage}
          // disabled={priceIsValid || adjustedPriceIsTheSame || priceIsOutOfRange}
        >
          {t('Start Litigation')}
        </Button>}
      </Flex>
    </>
  )
}

export default SetPriceStage
