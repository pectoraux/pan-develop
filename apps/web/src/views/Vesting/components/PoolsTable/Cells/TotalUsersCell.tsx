import styled from 'styled-components'
import { Text, Flex, Box, useMatchBreakpoints, Balance, Pool } from '@pancakeswap/uikit'
import BaseCell, { CellContent } from './BaseCell'

interface EarningsCellProps {
  pool?: any
  account: string
  labelText: string
}

const StyledCell = styled(BaseCell)`
  flex: 4.5;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
  }
`

const EarningsCell: React.FC<any> = ({ pool, labelText }) => {
  const { isMobile } = useMatchBreakpoints()
  const hasUsers = Number(pool.tokens?.length)

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
              color={hasUsers ? 'primary' : 'textDisabled'}
              decimals={0}
              prefix='# '
              value={hasUsers ?? 0}
            />
          </Box>
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default EarningsCell
