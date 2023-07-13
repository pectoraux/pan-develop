import { useState } from 'react'
import { Box } from '@pancakeswap/uikit'
import { useCurrencyBalance } from 'state/wallet/hooks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'

import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import _toNumber from 'lodash/toNumber'
import BigNumber from 'bignumber.js'
import { GenericModalProps } from '../types'
import BribeField from '../Common/BribeField'
import LockedModalBody from '../Common/LockedModalBody'

const PresentBribeModal: React.FC<any> = ({
  pool,
  stakingToken,
  stakingTokenBalance,
  onDismiss,
}) => {
  const [lockedAmount, setLockedAmount] = useState('')
  const currentBalance = stakingTokenBalance
  const usdValueStaked = useBUSDCakeAmount(_toNumber(lockedAmount))
  
  return (
    <>
        <Box mb="16px">
          <BribeField
            stakingAddress={stakingToken?.address}
            stakingSymbol={stakingToken?.symbol ?? ''}
            stakingDecimals={stakingToken?.decimals}
            lockedAmount={lockedAmount}
            usedValueStaked={usdValueStaked}
            stakingMax={currentBalance}
            setLockedAmount={setLockedAmount}
            stakingTokenBalance={stakingTokenBalance}
          />
        </Box>
        <LockedModalBody
          pool={pool}
          checkedState
          currentBalance={currentBalance}
          stakingToken={stakingToken}
          onDismiss={onDismiss}
          lockedAmount={new BigNumber(lockedAmount)}
        />
    </>
  )
}

export default PresentBribeModal
