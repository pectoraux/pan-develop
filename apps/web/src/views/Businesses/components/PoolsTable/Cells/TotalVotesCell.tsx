import styled from 'styled-components'
import { Skeleton, Text, Flex, Box, useMatchBreakpoints, Balance, Pool } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import BaseCell, { CellContent } from './BaseCell'

interface EarningsCellProps {
  pool?: any
  account: string
}

const StyledCell = styled(BaseCell)`
  flex: 4.5;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
  }
`

const EarningsCell: React.FC<any> = ({ pool, account }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { gaugeWeight, weightPercent } = pool
  const hasEarnings = new BigNumber(gaugeWeight).gt(0)

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Total Votes')}
        </Text>
        <Flex>
          <Box mr="8px" height="32px">
            <Balance
              mt="4px"
              bold={!isMobile}
              fontSize={isMobile ? '14px' : '16px'}
              color={hasEarnings ? 'primary' : 'textDisabled'}
              decimals={hasEarnings ? 5 : 1}
              value={hasEarnings ? gaugeWeight : 0}
            />
            {weightPercent > 0 ? (
              <Balance
                display="inline"
                fontSize="12px"
                color="textSubtle"
                decimals={2}
                prefix="~"
                value={weightPercent}
                unit=" %"
              />
            ):(
              <Text mt="4px" fontSize="12px" color="textDisabled">
                0 %
              </Text>
            )}
          </Box>
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default EarningsCell
