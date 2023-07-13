import { memo } from 'react'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool } from 'state/valuepools/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { useCurrency } from 'hooks/Tokens'

import NameCell from './Cells/NameCell'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'
import VaSpecsCell from './Cells/VaSpecsCell'
import VaSpecs2Cell from './Cells/VaSpecs2Cell'
import ActionPanel from './ActionPanel/ActionPanel'
import ExpandRow from './ExpandRow'

const PoolRow: React.FC<any> = ({
  id,
  account,
  initialActivity,
}) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl } = useMatchBreakpoints()
  const { pool } = usePool(id)
  const { t } = useTranslation()
  const vpCurrencyInput = useCurrency(pool?.tokenAddress)
  
  return (
    <ExpandRow
      initialActivity={initialActivity}
      panel={
        <ActionPanel account={account} pool={pool} expanded breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }} />
      }
    >
      <NameCell pool={pool} vpCurrencyInput={vpCurrencyInput} />
      <TotalUsersCell pool={pool} labelText={t("Total Users")} />
      <TotalValueCell 
        id={id}
        vpCurrencyInput={vpCurrencyInput}
      />
      <VaSpecsCell 
        pool={pool}
        vpCurrencyInput={vpCurrencyInput}
      />
      <VaSpecs2Cell
        pool={pool}
        vpCurrencyInput={vpCurrencyInput}
      />
    </ExpandRow>
  )
}

export default memo(PoolRow)
