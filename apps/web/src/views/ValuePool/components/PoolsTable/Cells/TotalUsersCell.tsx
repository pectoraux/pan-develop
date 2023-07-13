import styled from 'styled-components'
import { Text, Flex, Box, useMatchBreakpoints, Balance, Pool } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { Token } from '@pancakeswap/sdk'
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

const EarningsCell: React.FC<any> = ({ pool, vpAccount, labelText }) => {
  const { isMobile } = useMatchBreakpoints()

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
        <Flex>
          <Box mr="8px" height="32px">
          {Number(vpAccount?.tokenId) ? (
            <Balance
              mt="4px"
              bold={!isMobile}
              fontSize={isMobile ? '14px' : '16px'}
              color={Number(vpAccount?.tokenId) ? 'primary' : 'textDisabled'}
              decimals={0}
              prefix='# '
              value={vpAccount?.tokenId}
            />
            ):(
              <Text mt="8px" ml="8px" fontSize="12px" color="textDisabled">N/A</Text>
            )}
          </Box>
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default EarningsCell
