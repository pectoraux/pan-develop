import { memo, useMemo } from 'react'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool, useCurrPool } from 'state/cards/hooks'
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
  const currAccount = useMemo(() => pool?.balances?.find((n) => n.id === currState[pool?.id]), [pool, currState]) 
  console.log("cardpool1====>", pool, currAccount, currState)
  return (
    <ExpandRow
      initialActivity={initialActivity}
      panel={
        <ActionPanel 
          account={account} 
          pool={pool}
          expanded 
          currAccount={currAccount}
          breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }} 
        />
      }
    >
      <NameCell pool={pool} />
      <TotalUsersCell pool={pool} account={account} labelText={t("Total Balances")} />
      <TotalValueCell labelText={t('Balance')} symbol={currAccount?.symbol ?? ''} decimals={currAccount?.decimals ?? 18} value={currAccount?.balance} />
      <TotalValueCell labelText={t('Token ID')} symbol={''} decimals={0} value={pool?.tokenId} />
    </ExpandRow>
  )
}

export default memo(PoolRow)
