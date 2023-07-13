import { memo, useMemo } from 'react'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool, useCurrPool } from 'state/games/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'
import TotalScoreCell from './Cells/TotalScoreCell'
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
  const currAccount = useMemo(() => pool?.accounts?.find((n) => n.id === currState[pool?.id]), [pool, currState])
  console.log("gamepool1====>", pool, currAccount)
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
      <TotalUsersCell pool={pool} account={account} labelText={t("Total Accounts")} />
      <TotalValueCell labelText={t('Total Earnings')} pool={pool} value={pool?.totalEarned} />
      <TotalScoreCell labelText={t('Total Score')} pool={pool} value={pool?.totalScore} />
      <TotalValueCell labelText={t('Price Per Minute')} pool={pool} value={pool?.pricePerMinutes} />
    </ExpandRow>
  )
}

export default memo(PoolRow)
