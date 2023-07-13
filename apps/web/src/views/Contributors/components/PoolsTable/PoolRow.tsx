import { memo } from 'react'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool } from 'state/contributors/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import TotalVotesCell from './Cells/TotalVotesCell'
import TotalValueCell from './Cells/TotalValueCell'
import BribesCell from './Cells/BribesCell'
import ActionPanel from './ActionPanel/ActionPanel'
import ExpandRow from './ExpandRow'

const PoolRow: React.FC<any> = ({ sousId, account }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl } = useMatchBreakpoints()
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  
  return (
    <ExpandRow
      panel={
        <ActionPanel account={account} pool={pool} expanded breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }} />
      }
    >
      <NameCell pool={pool} />
      <BribesCell pool={pool} account={account} />
      <TotalValueCell labelText={t('To Distribute')} value={pool?.claimable} symbol={pool?.vestingTokenSymbol || ''} />
      <TotalValueCell labelText={t('Rewards Claimed')} value={pool?.gaugeEarned} symbol={pool?.vestingTokenSymbol || ''} />
      <TotalVotesCell pool={pool} account={account} />
    </ExpandRow>
  )
}

export default memo(PoolRow)
