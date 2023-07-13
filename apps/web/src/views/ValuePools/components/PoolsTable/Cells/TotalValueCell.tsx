import { useMemo } from 'react'
import { Flex, Box, Text, Balance, Pool, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { useCurrPool, usePool } from 'state/valuepools/hooks'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import BaseCell, { CellContent } from './BaseCell'

interface TotalStakedCellProps {
  pool?: any
  labelText: string
  value: string
  symbol: string
}

const StyledCell = styled(BaseCell)`
  flex: 2 0 100px;
`

const TotalValueCell: React.FC<any> = ({ id, vpCurrencyInput }) => {
  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()
  const { pool } = usePool(id) 
  
  return (
    <StyledCell role="cell">
      <CellContent>
          <Flex>
            <Box mr="8px" height="32px">
            <Balance
              bold={!isMobile}
              fontSize='14px'
              color={Number(pool?.totalLiquidity || 0) ? 'primary' : 'textDisabled'}
              decimals={5}
              unit={` ${vpCurrencyInput?.symbol ?? ''}`}
              value={pool?.totalLiquidity}
            />
            <Text fontSize="12px" color="textSubtle" textAlign="left">
              {t('Total Liquidity')}
            </Text>
            <Balance
              bold={!isMobile}
              fontSize='14px'
              color={Number(pool?.vaBalance || 0) ? 'primary' : 'textDisabled'}
              decimals={5}
              unit={` ${vpCurrencyInput?.symbol ?? ''}`}
              value={parseFloat(getBalanceAmount(pool?.vaBalance, pool?.vaDecimals)?.toString())}
            />
            <Text fontSize="12px" color="textSubtle" textAlign="left">
              {t('Total Locked')}
            </Text>
          </Box>
          </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default TotalValueCell