import { memo, useMemo } from 'react'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { useCurrPool, usePool } from 'state/pools/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import TotalUsersCell from './Cells/TotalUsersCell'
import VotesCell from './Cells/VotesCell'
import TotalValueCell from './Cells/TotalValueCell'
import ActionPanel from './ActionPanel/ActionPanel'
import ExpandRow from './ExpandRow'
import EndsInCell from './Cells/EndsInCell'

const PoolRow: React.FC<any> = ({
  sousId,
  account,
  initialActivity,
}) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl } = useMatchBreakpoints()
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const currState = useCurrPool()
  const currAccount = useMemo(() => pool?.userData?.accounts?.find((bal) => bal.id ===  currState[pool?.id]), [currState])

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
      <NameCell pool={pool} />
      <TotalValueCell symbol={pool?.symbol} decimals={pool?.decimals} value={pool?.totalLiquidity} labelText={t("Total Liquidity")} />
      <TotalValueCell symbol={pool?.symbol} decimals={pool?.decimals} value={pool?.toDistribute} labelText={t("To Distribute")} />
      <TotalValueCell symbol={pool?.symbol} decimals={pool?.decimals} value={currAccount?.earned} labelText={t("Earned")} />
      <EndsInCell pool={pool} />
    </ExpandRow>
  )
}

export default memo(PoolRow)
