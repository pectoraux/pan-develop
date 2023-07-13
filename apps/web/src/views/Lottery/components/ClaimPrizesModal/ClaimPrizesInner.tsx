import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Button, Flex, PresentWonIcon, Text, useToast, Balance } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import { LotteryTicket, LotteryTicketClaimData } from 'config/constants/types'
import useCatchTxError from 'hooks/useCatchTxError'
import { useLotteryV2Contract } from 'hooks/useContract'
import { useState, useMemo } from 'react'
import { useAppDispatch } from 'state'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { fetchUserLotteries } from 'state/lottery'
import { useLottery } from 'state/lottery/hooks'
import { useGasPrice } from 'state/user/hooks'
import { callWithEstimateGas } from 'utils/calls'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'

interface ClaimInnerProps {
  roundsToClaim: LotteryTicketClaimData[]
  onSuccess?: () => void
}

const ClaimInnerContainer: React.FC<any> = ({ currentTokenId, onSuccess, roundsToClaim }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { lotteryData: { id: currentLotteryId, tokenData }} = useLottery()
  const gasPrice = useGasPrice()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [activeClaimIndex, setActiveClaimIndex] = useState(0)
  const currTokenData = useMemo(() => tokenData?.length ? tokenData[parseInt(currentTokenId)] : {}, [tokenData, currentTokenId])
  console.log("currTokenData============>", currTokenData, currentTokenId, tokenData)
  const [pendingBatchClaims, setPendingBatchClaims] = useState(roundsToClaim?.length ? roundsToClaim[0] : 0)
  //   1
  //   Math.ceil(
  //     roundsToClaim[0].ticketsWithUnclaimedRewards.length / maxNumberTicketsPerBuyOrClaim.toNumber(),
  //   ),
  // )
  // const lotteryContract = useLotteryV2Contract()
  // const activeClaimData = roundsToClaim[activeClaimIndex]

  // const parseUnclaimedTicketDataForClaimCall = (ticketsWithUnclaimedRewards: LotteryTicket[], lotteryId: string) => {
  //   const ticketIds = ticketsWithUnclaimedRewards.map((ticket) => {
  //     return ticket.id
  //   })
  //   const brackets = ticketsWithUnclaimedRewards.map((ticket) => {
  //     return ticket.rewardBracket
  //   })
  //   return { lotteryId, ticketIds, brackets }
  // }

  // const claimTicketsCallData = parseUnclaimedTicketDataForClaimCall(
  //   activeClaimData.ticketsWithUnclaimedRewards,
  //   activeClaimData.roundId,
  // )


  const handleProgressToNextClaim = () => {
    if (roundsToClaim.length > activeClaimIndex + 1) {
      // If there are still rounds to claim, move onto the next claim
      setActiveClaimIndex(activeClaimIndex + 1)
      dispatch(fetchUserLotteries({ account, currentLotteryId }))
    } else {
      onSuccess()
    }
  }

  // const getTicketBatches = (ticketIds: string[], brackets: number[]): { ticketIds: string[]; brackets: number[] }[] => {
  //   const requests = []
  //   const maxAsNumber = maxNumberTicketsPerBuyOrClaim.toNumber()

  //   for (let i = 0; i < ticketIds.length; i += maxAsNumber) {
  //     const ticketIdsSlice = ticketIds.slice(i, maxAsNumber + i)
  //     const bracketsSlice = brackets.slice(i, maxAsNumber + i)
  //     requests.push({ ticketIds: ticketIdsSlice, brackets: bracketsSlice })
  //   }

  //   return requests
  // }

  // const handleClaim = async () => {
  //   const { lotteryId, ticketIds, brackets } = claimTicketsCallData
  //   // eslint-disable-next-line consistent-return
  //   const receipt = await fetchWithCatchTxError(async () => {
  //     return callWithEstimateGas(lotteryContract, 'claimTickets', [lotteryId, ticketIds, brackets], {
  //       gasPrice,
  //     })
  //   })
  //   if (receipt?.status) {
  //     toastSuccess(
  //       t('Prizes Collected!'),
  //       <ToastDescriptionWithTx txHash={receipt.transactionHash}>
  //         {t('Your CAKE prizes for round %lotteryId% have been sent to your wallet', { lotteryId })}
  //       </ToastDescriptionWithTx>,
  //     )
  //     handleProgressToNextClaim()
  //   }
  // }

  // const handleBatchClaim = async () => {
  //   const { lotteryId, ticketIds, brackets } = claimTicketsCallData
  //   const ticketBatches = getTicketBatches(ticketIds, brackets)
  //   const transactionsToFire = ticketBatches.length
  //   const receipts = []
  //   // eslint-disable-next-line no-restricted-syntax
  //   for (const ticketBatch of ticketBatches) {
  //     /* eslint-disable no-await-in-loop */
  //     // eslint-disable-next-line consistent-return
  //   // const receipt = await fetchWithCatchTxError(async () => {
  //   //     return callWithEstimateGas(
  //   //       lotteryContract,
  //   //       'claimTickets',
  //   //       [lotteryId, ticketBatch.ticketIds, ticketBatch.brackets],
  //   //       { gasPrice },
  //   //     )
  //   //   })
  //     // if (receipt?.status) {
  //     //   // One transaction within batch has succeeded
  //     //   receipts.push(receipt)
  //     //   setPendingBatchClaims(transactionsToFire - receipts.length)

  //     //   // More transactions are to be done within the batch. Issue toast to give user feedback.
  //     //   if (receipts.length !== transactionsToFire) {
  //     //     toastSuccess(
  //     //       t('Prizes Collected!'),
  //     //       <ToastDescriptionWithTx txHash={receipt.transactionHash}>
  //     //         {t(
  //     //           'Claim %claimNum% of %claimTotal% for round %lotteryId% was successful. Please confirm the next transaction',
  //     //           {
  //     //             claimNum: receipts.length,
  //     //             claimTotal: transactionsToFire,
  //     //             lotteryId,
  //     //           },
  //     //         )}
  //     //       </ToastDescriptionWithTx>,
  //     //     )
  //     //   }
  //     // } else {
  //     //   break
  //     // }
  //   }

  //   // Batch is finished
  //   if (receipts.length === transactionsToFire) {
  //     toastSuccess(
  //       t('Prizes Collected!'),
  //       t('Your CAKE prizes for round %lotteryId% have been sent to your wallet', { lotteryId }),
  //     )
  //     handleProgressToNextClaim()
  //   }
  // }

  return (
    <>
      <Flex flexDirection="column">
        <Text mb="4px" textAlign={['center', null, 'left']}>
          {t('You won')}
        </Text>
        <Flex
          alignItems={['flex-start', null, 'center']}
          justifyContent={['flex-start', null, 'space-between']}
          flexDirection={['column', null, 'row']}
        >
          <Balance
            textAlign={['center', null, 'left']}
            lineHeight="1.1"
            value={0}
            fontSize="44px"
            bold
            color="secondary"
            unit={` ${currTokenData?.token?.symbol?.toUpperCase() ?? ''}`}
          />
          <PresentWonIcon ml={['0', null, '12px']} width="64px" />
        </Flex>
        {/* <Balance
          mt={['12px', null, '0']}
          textAlign={['center', null, 'left']}
          value={dollarRewardAsBalance}
          fontSize="12px"
          color="textSubtle"
          unit=" USD"
          prefix="~"
        /> */}
      </Flex>

      <Flex alignItems="center" justifyContent="center">
        <Button
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          mt="20px"
          width="100%"
          // onClick={() => (shouldBatchRequest ? handleBatchClaim() : handleClaim())}
        >
          {pendingTx ? t('Claiming') : t('Claim')} {Number(pendingBatchClaims) > 0 ? `(${pendingBatchClaims})` : ''}
        </Button>
      </Flex>
    </>
  )
}

export default ClaimInnerContainer
