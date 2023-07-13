import { useCallback } from 'react'
import { useToast } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { ToastDescriptionWithTx } from 'components/Toast'
import { MaxUint256 } from '@ethersproject/constants'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'

export const useApprovePottery = (refetch, tokenContract, gameFactoryAddress: string) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()

  const onApprove = useCallback(async () => {
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      return callWithGasPrice(tokenContract, 'approve', [gameFactoryAddress, MaxUint256])
      .then(() => refetch())
    })

    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Please progress to the next step.')}
        </ToastDescriptionWithTx>,
      )
    }
  }, [fetchWithCatchTxError, callWithGasPrice, tokenContract, gameFactoryAddress, refetch, toastSuccess, t])

  return { isPending, onApprove }
}
