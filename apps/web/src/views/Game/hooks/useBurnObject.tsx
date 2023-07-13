import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useGameHelper } from 'hooks/useContract'
import { useWeb3React } from '@pancakeswap/wagmi'
import { fetchGameAsync } from 'state/pottery'
import { useRouter } from 'next/router'
import BigNumber from 'bignumber.js'

export const useBurnObject = (objectName: string, tokenId) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { game } = useRouter().query
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()
  const contract = useGameHelper()

  const handleBurnObject = useCallback(async () => {
    console.log("handleBurnObject=============>", contract, [
      objectName,
      game,
      tokenId,
      account
    ])
    const receipt = await fetchWithCatchTxError(() => contract.burnObject(
      objectName,
      game?.toString(),
      tokenId,
      account
    )).catch((err) => console.log("1handleBurnObject=============>", contract, err))

    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your have successfully burnt your object for its resources')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchGameAsync(game))
    }
  }, [game, contract, account, objectName, tokenId, t, dispatch, fetchWithCatchTxError, toastSuccess])

  return { isPending, handleBurnObject }
}
