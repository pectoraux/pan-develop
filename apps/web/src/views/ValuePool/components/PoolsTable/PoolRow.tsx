import { memo } from 'react'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool } from 'state/valuepools/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { useCurrency } from 'hooks/Tokens'

import ExpandRow from 'views/ValuePools/components/PoolsTable/ExpandRow'

import NameCell from './Cells/NameCell'
import VaSpecsCell from './Cells/VaSpecsCell'
import VaSpecs2Cell from './Cells/VaSpecs2Cell'
import TotalUsersCell from './Cells/TotalUsersCell'
import ActionPanel from './ActionPanel/ActionPanel'

const PoolRow: React.FC<any> = ({
  id,
  account,
  vpAccount,
  initialActivity,
}) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl } = useMatchBreakpoints()
  const { pool } = usePool(id)
  const { t } = useTranslation()
  const vpCurrencyInput = useCurrency(pool?.tokenAddress)

  console.log("valuepool====>", vpAccount, pool)
  return (
    <ExpandRow
      initialActivity={initialActivity}
      panel={
        <ActionPanel 
          account={account} 
          vpAccount={vpAccount}
          pool={pool} 
          expanded 
          breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }} />
      }
    >
      <NameCell pool={pool} vpCurrencyInput={vpCurrencyInput} vpAccount={vpAccount} />
      <TotalUsersCell pool={pool} vpAccount={vpAccount} labelText={t("Token Id")} />
      <VaSpecsCell
        pool={pool}
        nft={vpAccount}
        vpCurrencyInput={vpCurrencyInput}
      />
      <VaSpecs2Cell
        nft={vpAccount}
        vpCurrencyInput={vpCurrencyInput}
      />
    </ExpandRow>
  )
}

export default memo(PoolRow)
