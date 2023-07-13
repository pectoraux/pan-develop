import { useMemo } from 'react'
import { Flex, Box, Text, Balance, Pool, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { getBalanceNumber, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import { Token } from '@pancakeswap/sdk'
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

const TotalValueCell: React.FC<any> = ({ pool, labelText }) => {
  const { isMobile } = useMatchBreakpoints()
  const defaultToken = pool?.tokenData?.length ? pool?.tokenData[0] : ""
  const decimals = defaultToken?.decimals ?? 18
  const totalStakedBalance = useMemo(() => getFullDisplayBalance(pool?.endAmount, decimals, 5), [pool,decimals])
  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
          <Flex>
            {defaultToken ? 
            <Box mr="8px" height="32px">
              <Balance
                mt="4px"
                bold={!isMobile}
                fontSize={isMobile ? '14px' : '16px'}
                color={Number(pool?.endAmount) ? 'primary' : 'textDisabled'}
                decimals={5}
                unit={` ${defaultToken?.symbol?.toUpperCase() ?? ''}`}
                value={Number(pool?.endAmount) ? Number(totalStakedBalance) : 0}
              />
            </Box>: '-'}
          </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default TotalValueCell