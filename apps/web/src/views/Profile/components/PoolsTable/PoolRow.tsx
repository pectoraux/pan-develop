import { memo } from 'react'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool, useCurrPool } from 'state/profile/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import TotalValueCell from './Cells/TotalValueCell'
import TotalUsersCell from './Cells/TotalUsersCell'
import ActionPanel from './ActionPanel/ActionPanel'
import ExpandRow from './ExpandRow'

const PoolRow: React.FC<any> = ({ sousId, account }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl } = useMatchBreakpoints()
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const currState = useCurrPool()
  const token = pool?.tokens?.find((tk) => tk.tokenAddress?.toLowerCase() === currState[pool?.id]?.toLowerCase())

  return (
    <ExpandRow
      panel={
        <ActionPanel account={account} pool={pool} expanded breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }} />
      }
    >
      <NameCell pool={pool} />
      <TotalUsersCell labelText={t('Followers')} numCount={pool?.followers?.length} />
      <TotalUsersCell labelText={t('Following')} numCount={pool?.followees?.length} />
      <TotalValueCell labelText={t('Total Liquidity')} value={token?.amount} symbol={token?.symbol} decimals={token?.decimals} />
      <TotalValueCell labelText={t('Total Bounty')} value={token?.bountyBalance} symbol={token?.symbol} decimals={token?.decimals} />
    </ExpandRow>
  )
}

export default memo(PoolRow)
