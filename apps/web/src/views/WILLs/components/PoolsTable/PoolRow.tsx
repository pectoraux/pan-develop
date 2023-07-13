import { memo, useMemo } from 'react'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool, useCurrPool, useCurrBribe } from 'state/wills/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'
import TotalValueCell2 from './Cells/TotalValueCell2'
import VotesCell from './Cells/VotesCell'
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
  const currState2 = useCurrBribe()
  const currAccount = useMemo(() => pool?.accounts?.find((n) => n.id === currState[pool?.id]), [pool, currState]) 
  const currToken = useMemo(() => pool?.tokens?.find((n) => n.tokenAddress === currState2[pool?.id]), [pool, currState2]) 
  console.log("willpool1====>", pool, currAccount, currToken, currState, currState2, currState2[pool?.id])
  return (
    <ExpandRow
      initialActivity={initialActivity}
      panel={
        <ActionPanel 
          account={account} 
          pool={pool}
          expanded 
          currToken={currToken}
          currAccount={currAccount}
          breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }} 
        />
      }
    >
      <NameCell pool={pool} />
      <TotalUsersCell pool={pool} account={account} labelText={t("Total Accounts")} />
      <VotesCell pool={pool} value={pool?.likes} />
      <TotalValueCell2 labelText={t('Min. NFT Wthdrawable')} value={pool?.minNFTWithdrawableNow} />
      <TotalValueCell labelText={t('Min. FT Wthdrawable')} value={pool?.minWithdrawableNow} />
    </ExpandRow>
  )
}

export default memo(PoolRow)
