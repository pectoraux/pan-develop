import { memo, useState } from 'react'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool } from 'state/stakemarket/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { useCurrency } from 'hooks/Tokens'

import NameCell from './Cells/NameCell'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'
import DateInfoCell from './Cells/DateInfoCell'
import ActionPanel from './ActionPanel/ActionPanel'
import BountiesPanel from './BountiesPanel/ActionPanel'
import ExpandRow from './ExpandRow'

const PoolRow: React.FC<React.PropsWithChildren<{ 
  sousId: number; 
  account: string;
  variant: "trustbounties" | "stakemarket"; 
  initialActivity?: boolean }>> = ({
  sousId,
  account,
  variant,
  initialActivity,
}) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl } = useMatchBreakpoints()
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const token = useCurrency(pool.tokenAddress)
  const [currPool, setCurrPool] = useState(pool)
  
  return variant === "stakemarket" ? (
    <ExpandRow
      initialActivity={initialActivity}
      panel={
        <ActionPanel 
          account={account} 
          pool={pool} 
          currPool={currPool}
          setCurrPool={setCurrPool}
          expanded 
          breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }} />
      }
    >
      <NameCell pool={pool} symbol={token?.symbol} />
      <TotalUsersCell pool={pool} labelText={t("Total Users")} />
      <TotalValueCell pool={pool} labelText={t("Total Liquidity")} value={pool.totalLiquidity} symbol={token?.symbol} />
      <DateInfoCell sousId={sousId} labelText={parseFloat(currPool?.waitingDuration) ? t("Countdown to litigations") : t("Next Payable/Receivable")} pool={currPool} />
    </ExpandRow>
  ):(
    <ExpandRow
      panel={
        <BountiesPanel account={account} pool={pool} expanded breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }} />
      }
    >
    <NameCell pool={pool} />
    <TotalValueCell pool={pool} labelText={t("Total Liquidity")} value={pool.totalLiquidity} />
    </ExpandRow>
  )
}

export default memo(PoolRow)
