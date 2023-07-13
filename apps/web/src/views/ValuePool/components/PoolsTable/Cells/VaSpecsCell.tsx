import { useMemo } from 'react'
import { Flex, Box, Text, Balance, Pool, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { useCurrPool } from 'state/valuepools/hooks'
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

const TotalValueCell: React.FC<any> = ({ pool, nft, vpCurrencyInput }) => {
  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()
  
  return (
    <StyledCell role="cell">
      <CellContent>
          <Flex>
            <Box mr="8px" height="32px">
            {nft ?
            <>
            <Balance
              bold={!isMobile}
              fontSize='14px'
              color='primary'
              decimals={5}
              unit={` ${vpCurrencyInput?.symbol ?? ''}`}
              value={parseFloat(getBalanceAmount(nft.lockValue, pool?.vaDecimals)?.toString())}
            />
            <Text fontSize="12px" color="textSubtle" textAlign="left">
              {t('Lock Value')}
            </Text>
            <Balance
              bold={!isMobile}
              fontSize='14px'
              color='primary'
              decimals={5}
              unit={` ${vpCurrencyInput?.symbol ??''}`}
              value={parseFloat(getBalanceAmount(nft.lockAmount, pool?.vaDecimals)?.toString())}
            />
            <Text fontSize="12px" color="textSubtle" textAlign="left">
              {t('Lock Amount')}
            </Text>
            </>
            :"-"}
          </Box>
          </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default TotalValueCell