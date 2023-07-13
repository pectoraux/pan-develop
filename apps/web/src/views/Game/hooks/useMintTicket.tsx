import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useGameMinter } from 'hooks/useContract'
import { useWeb3React } from '@pancakeswap/wagmi'
import { fetchPotteryUserDataAsync } from 'state/pottery'

export const useMintTicket = (collectionId) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()
  const contract = useGameMinter()

  const handleMint = useCallback(async () => {
    // const amountDeposit = new BigNumber(amount).multipliedBy(DEFAULT_TOKEN_DECIMAL).toString()
    console.log("handleMint======================>", account, collectionId)
    const receipt = await fetchWithCatchTxError(() => contract.mint(account, collectionId))

    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your ticket has been successfully minted')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchPotteryUserDataAsync(account))
    }
  }, [account, contract, collectionId, t, dispatch, fetchWithCatchTxError, toastSuccess])

  return { isPending, handleMint }
}
