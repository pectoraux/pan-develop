import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useGameHelper } from 'hooks/useContract'
import { fetchGameAsync } from 'state/pottery'
import { useRouter } from 'next/router'
import BigNumber from 'bignumber.js'

export const useMintObject = (objectName, tokenId, tokenIds) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { game } = useRouter().query
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()
  const contract = useGameHelper()

  const handleMintObject = useCallback(async () => {
    console.log("handleMintObject=============>", contract, [
      objectName,
      game,
      tokenId,
      tokenIds
    ])
    const receipt = await fetchWithCatchTxError(() => contract.mintObject(
      objectName,
      game?.toString(),
      tokenId,
      tokenIds
    )).catch((err) => console.log("1handleMintObject=============>", contract, err))

    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your have successfully minted this object!')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchGameAsync(game))
    }
  }, [contract, game, tokenIds, objectName, tokenId, t, dispatch, fetchWithCatchTxError, toastSuccess])

  return { isPending, handleMintObject }
}
