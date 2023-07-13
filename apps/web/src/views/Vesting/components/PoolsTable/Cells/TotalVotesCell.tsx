import styled from 'styled-components'
import { Skeleton, Text, Flex, Box, Pool, Balance, useMatchBreakpoints } from '@pancakeswap/uikit'
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
  const { gaugeWeight, totalWeight, decimals } = pool

  const weight = new BigNumber(gaugeWeight).div(10**decimals)
  const weightPercent =  new BigNumber(gaugeWeight).times(100).div(totalWeight)
  const hasEarnings = weight.gt(0)

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Total Votes')}
        </Text>
        {!pool.userDataLoaded && account ? (
          <Skeleton width="80px" height="16px" />
        ) : (
          <>
            <Flex>
              <Box mr="8px" height="32px">
                <Balance
                  mt="4px"
                  bold={!isMobile}
                  fontSize={isMobile ? '14px' : '16px'}
                  color={hasEarnings ? 'primary' : 'textDisabled'}
                  decimals={hasEarnings ? 5 : 1}
                  value={hasEarnings ? parseFloat(weight?.toString()) : 0}
                />
                {parseFloat(weightPercent?.toString()) > 0 ? (
                  <Balance
                    display="inline"
                    fontSize="12px"
                    color="textSubtle"
                    decimals={2}
                    prefix="~"
                    value={parseFloat(weightPercent?.toString())}
                    unit="%"
                  />
                ):(
                  <Text mt="4px" fontSize="12px" color="textDisabled">
                    0 USD
                  </Text>
                )}
              </Box>
            </Flex>
          </>
        )}
      </CellContent>
    </StyledCell>
  )
}

export default EarningsCell
