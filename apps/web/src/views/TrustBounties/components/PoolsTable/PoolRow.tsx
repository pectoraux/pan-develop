import { memo } from 'react'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool } from 'state/trustbounties/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { useCurrency } from 'hooks/Tokens'

import NameCell from './Cells/NameCell'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'
import DateInfoCell from './Cells/DateInfoCell'
import ActionPanel from './ActionPanel/ActionPanel'
import ExpandRow from './ExpandRow'

const PoolRow: React.FC<React.PropsWithChildren<{ 
  sousId?: number; 
  account?: string;
  variant?: "trustbounties" | "stakemarket"; 
  initialActivity?: boolean }>> = ({
  sousId,
  account,
  initialActivity,
}) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl } = useMatchBreakpoints()
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const token = useCurrency(pool?.tokenAddress)
  
  return (
    <ExpandRow
      initialActivity={initialActivity}
      panel={
        <ActionPanel 
          account={account} 
          pool={pool} 
          expanded 
          breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }} />
      }
    >
      <NameCell pool={pool} symbol={token?.symbol} />
      <TotalUsersCell pool={pool} labelText={t("Total Users")} />
      <TotalValueCell pool={pool} labelText={t("Total Liquidity")} value={pool?.totalLiquidity} symbol={token?.symbol} />
      <DateInfoCell labelText={t("Next Payable/Receivable")} pool={pool} />
    </ExpandRow>
  )
}

export default memo(PoolRow)
