import { useMemo } from 'react'
import { Flex, Box, Text, Balance, Pool, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import BaseCell, { CellContent } from './BaseCell'

interface TotalStakedCellProps {
  pool?: any
  labelText?: string
  value?: string
  symbol?: string
  decimals?: any
}

const StyledCell = styled(BaseCell)`
  flex: 2 0 100px;
`

const TotalValueCell: React.FC<any> = ({ labelText, value, decimals, symbol }) => {
  const { isMobile } = useMatchBreakpoints()
  const totalStakedBalance = useMemo(() => getBalanceNumber(new BigNumber(value), decimals ?? 18), [value, decimals])

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
          <Flex>
            <Box mr="8px" height="32px">
            <Balance
              mt="4px"
              bold={!isMobile}
              fontSize={isMobile ? '14px' : '16px'}
              color={Number(value) ? 'primary' : 'textDisabled'}
              decimals={5}
              unit={` ${symbol ?? ''}`}
              value={Number(value) ? totalStakedBalance : 0}
            />
          </Box>
          </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default TotalValueCell