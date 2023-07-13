import { useState, useMemo, useCallback, Dispatch, SetStateAction } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { useAppDispatch } from 'state'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import BigNumber from 'bignumber.js'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { useToast, Pool } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { Token } from '@pancakeswap/sdk'
import { ONE_WEEK_DEFAULT, MAX_TIME, vaultPoolConfig } from 'config/constants/pools'
import { VaultKey } from 'state/types'
import { fetchValuepoolsUserDataAsync } from 'state/valuepools'
import { useCurrPool } from 'state/valuepools/hooks'
import { useVaContract } from 'hooks/useContract'

import { ToastDescriptionWithTx } from 'components/Toast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { PrepConfirmArg } from '../types'

interface HookArgs {
  pool?: any
  lockedAmount: BigNumber
  stakingToken: Token
  onDismiss: () => void
  prepConfirmArg: PrepConfirmArg
}

interface HookReturn {
  usdValueStaked: number
  duration: number
  setDuration: Dispatch<SetStateAction<number>>
  pendingTx: boolean
  handleConfirmClick: () => Promise<void>
}

export default function useLockedPool(hookArgs: any): any {
  const { pool, lockedAmount, stakingToken, onDismiss, prepConfirmArg } = hookArgs

  const dispatch = useAppDispatch()
  const currState = useCurrPool()
  
  const { account } = useWeb3React()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const vaContract = useVaContract(pool?.ve ?? '')
  const { callWithGasPrice } = useCallWithGasPrice()
  const methodName  = typeof prepConfirmArg === 'function' ? prepConfirmArg().methodName : "create_lock_for"
  const checkedState  = typeof prepConfirmArg === 'function' ? prepConfirmArg().checkedState : true
  const tokenId = currState[pool?.valuepoolAddress]
  const nft = useMemo(() => pool?.userData?.nfts?.find((n) => n.id === currState[pool?.valuepoolAddress]), [pool, currState])
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const [duration, setDuration] = useState(ONE_WEEK_DEFAULT)
  const usdValueStaked = useBUSDCakeAmount(lockedAmount.toNumber())

  const handleDeposit = useCallback(
    async (convertedStakeAmount: BigNumber, lockDuration: number) => {
      const callOptions = {
        gasLimit: vaultPoolConfig[VaultKey.CakeVault].gasLimit,
      }
      // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
        // .toString() being called to fix a BigNumber error in prod
        // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
        const methodArgs = methodName === "create_lock_for" 
        ? [convertedStakeAmount.toString(), lockDuration, account]
        : methodName === "increase_amount" 
        ? [tokenId, convertedStakeAmount.toString()]
        : [tokenId]
        return callWithGasPrice(vaContract, methodName, methodArgs, callOptions)
        .then(() => {
          if (methodName === "increase_amount") {
            callWithGasPrice(vaContract, 'increase_unlock_time', [
              tokenId, 
              Math.min(lockDuration + parseInt(nft.lockEnds), MAX_TIME)
            ], 
            callOptions)
          }
        })
        .catch((err) => console.log("useLockedPool==============>", methodName, methodArgs, err))
      })

      if (receipt?.status) {
        toastSuccess(
          t('Lock successfully created!'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your funds have been staked in the pool')}
          </ToastDescriptionWithTx>,
        )
        dispatch(fetchValuepoolsUserDataAsync(account))
        onDismiss?.()
      }
    },
    [
      nft,
      fetchWithCatchTxError, 
      toastSuccess, 
      dispatch, 
      onDismiss, 
      account, 
      vaContract, 
      t, 
      callWithGasPrice,
      methodName,
      tokenId,
    ],
  )

  const handleConfirmClick = useCallback(async () => {
    const { finalLockedAmount = lockedAmount, finalDuration = checkedState ? duration : 0 } = {}
      // typeof prepConfirmArg === 'function' ? prepConfirmArg({ duration }) : {}

    const convertedStakeAmount: BigNumber = getDecimalAmount(new BigNumber(finalLockedAmount), stakingToken.decimals)

    handleDeposit(convertedStakeAmount, finalDuration)
  }, [checkedState, stakingToken, handleDeposit, duration, lockedAmount])

  return { usdValueStaked, duration, setDuration, pendingTx, handleConfirmClick }
}
