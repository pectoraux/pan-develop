import { memo, useMemo } from 'react'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool, useCurrPool } from 'state/ramps/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'
import ActionPanel from './ActionPanel/ActionPanel'
import ExpandRow from './ExpandRow'

const PoolRow: React.FC<any> = ({
  sousId,
  account,
  initialActivity,
}) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl } = useMatchBreakpoints()
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const currState = useCurrPool()
  const rampAccount = useMemo(() => pool.accounts?.find((acct) => acct.token.address === currState[pool.rampAddress]),[pool, currState])
  console.log("ramppool=================>", pool)
  return (
    <ExpandRow
      initialActivity={initialActivity}
      panel={
        <ActionPanel 
          account={account} 
          rampAccount={rampAccount}
          pool={pool} 
          expanded 
          breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }} />
      }
    >
      <NameCell pool={pool} rampAccount={rampAccount} />
      <TotalUsersCell pool={pool} labelText={t("Total Accounts")} />
      <TotalValueCell 
        pool={pool} 
        labelText={t("Minted Liquidity")} 
        value={rampAccount?.minted} 
        symbol={rampAccount?.token?.symbol ?? ''}
      />
      <TotalValueCell 
        pool={pool} 
        labelText={t("Burnt Liquidity")} 
        value={rampAccount?.burnt} 
        symbol={rampAccount?.token?.symbol ?? ''}
      />
    </ExpandRow>
  )
}

export default memo(PoolRow)
