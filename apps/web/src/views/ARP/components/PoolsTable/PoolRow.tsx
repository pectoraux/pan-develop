import { memo } from 'react'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool } from 'state/arps/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import TotalUsersCell from './Cells/TotalUsersCell'
import ActionPanel from './ActionPanel/ActionPanel'
import ExpandRow from './ExpandRow'
import EndsInCell from './Cells/EndsInCell'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<React.PropsWithChildren<{ id: any; currAccount: any; sousId: number; account: string; initialActivity?: boolean }>> = ({
  sousId,
  id,
  account,
  currAccount,
  initialActivity,
}) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl } = useMatchBreakpoints()
  const { pool } = usePool(id)
  const { t } = useTranslation()
  
  return (
    <ExpandRow
      initialActivity={initialActivity}
      panel={
        <ActionPanel 
          account={account} 
          pool={pool}
          expanded 
          currAccount={currAccount}
          breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }} />
      }
    >
      <NameCell pool={pool} currAccount={currAccount} />
      <TotalValueCell labelText={t('Liquidity')} symbol={currAccount?.token?.symbol ?? ''} value={currAccount?.totalLiquidity} decimals={currAccount?.token?.decimals} />
      <TotalValueCell labelText='Amount Due' symbol={currAccount?.token?.symbol ?? ''} value={currAccount?.amountReceivable} decimals={currAccount?.token?.decimals} />
      <EndsInCell currAccount={currAccount} />
    </ExpandRow>
  )
}

export default memo(PoolRow)
