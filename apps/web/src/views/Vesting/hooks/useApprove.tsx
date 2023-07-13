import { useCallback } from 'react'
import { Contract } from '@ethersproject/contracts'
import { MaxUint256 } from '@ethersproject/constants'
import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'

export const useApprovePool = (lpContract: Contract, valuepoolAddress, earningTokenSymbol, onSuccess) => {
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { t } = useTranslation()

  const handleApprove = useCallback(async () => {
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      console.log("callWithGasPrice1============>", lpContract, [valuepoolAddress, MaxUint256])
      return callWithGasPrice(lpContract, 'approve', [valuepoolAddress, MaxUint256])
      .catch((err) => console.log("callWithGasPrice==============>", err))
    })
    if (receipt?.status) {
      toastSuccess(
        t('Contract Enabled'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have successfully enabled the contract to spend your %symbol%', { symbol: earningTokenSymbol })}
        </ToastDescriptionWithTx>,
      )
      onSuccess?.()
    }
  }, [
    lpContract,
    onSuccess,
    valuepoolAddress,
    earningTokenSymbol,
    t,
    toastSuccess,
    callWithGasPrice,
    fetchWithCatchTxError,
  ])

  return { handleApprove, pendingTx }
}