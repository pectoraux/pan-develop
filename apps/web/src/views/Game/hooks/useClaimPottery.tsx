import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useGameFactory } from 'hooks/useContract'
import { fetchGameAsync } from 'state/pottery'

export const useClaimPottery = ({ gameData, identityTokenId, tokenId }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { toastSuccess } = useToast()
  const contract = useGameFactory()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()

  const handleClaim = useCallback(async () => {
    console.log("handleClaim==============>", contract, [
      gameData?.owner,
      identityTokenId ?? '0',
      tokenId
    ])
    const receipt = await fetchWithCatchTxError(() => contract.claimGameTicket(
      gameData?.owner,
      identityTokenId ?? '0',
      tokenId
    )).catch((err) => console.log("1handleClaim===============>", err))

    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have successfully claimed your rewards.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchGameAsync(gameData?.id))
    }
  }, [contract, gameData?.owner, gameData?.id, identityTokenId, tokenId, fetchWithCatchTxError, toastSuccess, t, dispatch])

  return { isPending, handleClaim }
}
