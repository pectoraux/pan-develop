import { useCallback } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { Pool, useToast } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useAppDispatch } from 'state'
import { updateUserBalance, updateUserPendingReward, updateUserStakedBalance } from 'state/pools'
import useHarvestPool from '../../hooks/useHarvestPool'

export const CollectModalContainer = ({
  earningTokenSymbol,
  sousId,
  isBnbPool,
  onDismiss,
  ...rest
}: React.PropsWithChildren<Pool.CollectModalProps>) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { onReward } = useHarvestPool(sousId, isBnbPool)

  const handleHarvestConfirm = useCallback(async () => {
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      return onReward()
    })
    if (receipt?.status) {
      toastSuccess(
        `${t('Harvested')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your %symbol% earnings have been sent to your wallet!', { symbol: earningTokenSymbol })}
        </ToastDescriptionWithTx>,
      )
      // dispatch(updateUserStakedBalance({ sousId, account }))
      // dispatch(updateUserPendingReward({ sousId, account }))
      // dispatch(updateUserBalance({ sousId, account }))
      onDismiss?.()
    }
  }, [account, dispatch, earningTokenSymbol, fetchWithCatchTxError, onDismiss, onReward, sousId, t, toastSuccess])

  return (
    <Pool.CollectModal
      earningTokenSymbol={earningTokenSymbol}
      onDismiss={onDismiss}
      handleHarvestConfirm={handleHarvestConfirm}
      pendingTx={pendingTx}
      {...rest}
    />
  )
}

export default CollectModalContainer
