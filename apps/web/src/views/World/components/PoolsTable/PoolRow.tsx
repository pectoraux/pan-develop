import { memo } from 'react'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool } from 'state/worlds/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import TotalUsersCell from './Cells/TotalUsersCell'
import ActionPanel from './ActionPanel/ActionPanel'
import ExpandRow from './ExpandRow'
import EndsInCell from './Cells/EndsInCell'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({
  id,
  sousId,
  account,
  currAccount,
  initialActivity,
}) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl } = useMatchBreakpoints()
  const { pool } = usePool(id)
  const { t } = useTranslation()
  console.log("ramp====>", pool, currAccount)
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
      <TotalUsersCell value={currAccount?.rating} labelText={t("Rating")} />
      <TotalValueCell labelText={t('Amount Due')} decimals={currAccount?.token?.decimals} symbol={currAccount?.token?.symbol ?? ''} value={currAccount?.amountReceivable} />
      <EndsInCell currAccount={currAccount} />
    </ExpandRow>
  )
}

export default memo(PoolRow)
