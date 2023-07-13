import { memo } from 'react'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool2 } from 'state/ramp/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'
import ActionPanel from './ActionPanel/ActionPanel'
import ExpandRow from './ExpandRow'

const PoolRow: React.FC<any> = ({
  account,
  rampAccount,
  rampAddress,
  initialActivity,
}) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl } = useMatchBreakpoints()
  const { pool } = usePool2(rampAddress)
  const { t } = useTranslation()
  
  return (
    <ExpandRow
      initialActivity={initialActivity}
      panel={
        <ActionPanel 
          expanded 
          pool={pool} 
          account={account} 
          rampAccount={rampAccount}
          breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }} />
      }
    >
      <NameCell pool={pool} rampAccount={rampAccount} />
      <TotalValueCell 
        pool={pool} 
        labelText={t("Mintable")} 
        value={rampAccount?.mintable} 
        symbol={rampAccount?.token?.symbol}
      />
      <TotalValueCell 
        pool={pool} 
        labelText={t("Minted Liquidity")} 
        value={rampAccount?.minted} 
        symbol={rampAccount?.token?.symbol}
      />
      <TotalValueCell 
        pool={pool} 
        labelText={t("Burnt Liquidity")} 
        value={rampAccount?.burnt} 
        symbol={rampAccount?.token?.symbol}
      />
    </ExpandRow>
  )
}

export default memo(PoolRow)
