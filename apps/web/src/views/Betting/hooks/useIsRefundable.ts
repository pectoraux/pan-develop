import { useEffect, useState } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import { getBettingContract } from 'utils/contractHelpers'
import { useConfig } from '../context/ConfigProvider'

const useIsRefundable = (epoch: number) => {
  const [isRefundable, setIsRefundable] = useState(false)
  const { account } = useWeb3React()
  const { address } = useConfig()

  // useEffect(() => {
  //   const fetchRefundableStatus = async () => {
  //     const bettingsContract = getBettingContract(address)
  //     const refundable = await bettingsContract.refundable(epoch, account)

  //     if (refundable) {
  //       // Double check they have not already claimed
  //       const ledger = await bettingsContract.ledger(epoch, account)
  //       setIsRefundable(ledger.claimed === false)
  //     } else {
  //       setIsRefundable(false)
  //     }
  //   }

  //   if (account) {
  //     fetchRefundableStatus()
  //   }
  // }, [account, epoch, setIsRefundable, address])

  return { isRefundable, setIsRefundable }
}

export default useIsRefundable
