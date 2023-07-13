import { memo, useMemo } from 'react'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool, useCurrPool } from 'state/sponsors/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'
import VotesCell from './Cells/VotesCell'
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
  const currAccount = useMemo(() => pool?.accounts?.find((n) => n.id === currState[pool?.id]), [pool, currState]) 
  console.log("sponsorpool====>", pool, currAccount)
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
      <TotalUsersCell pool={pool} account={account} labelText={t("Total Accounts")} />
      <TotalValueCell value={currAccount?.duePayable} labelText={t("Due Now")} symbol={currAccount?.token?.symbol?.toUpperCase() ?? ''} />
      <VotesCell pool={pool} value={pool?.likes} />
      <EndsInCell currAccount={currAccount} />
    </ExpandRow>
  )
}

export default memo(PoolRow)
