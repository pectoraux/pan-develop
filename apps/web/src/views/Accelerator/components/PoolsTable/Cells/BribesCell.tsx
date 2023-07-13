import { useMemo } from 'react'
import styled from 'styled-components'
import { Text, Flex, Box, useModal, useMatchBreakpoints, Pool, Balance } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useToken } from 'hooks/Tokens'
import BigNumber from 'bignumber.js'
import { PoolCategory } from 'config/constants/types'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useCurrBribe, useCurrPool } from 'state/businesses/hooks'
import { formatNumber, getBalanceNumber, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
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

const EarningsCell: React.FC<any> = ({ currBribe }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const fullBalance = getBalanceNumber(currBribe?.rewardAmount, currBribe?.decimals)
  const earned = getBalanceNumber(currBribe?.earned, currBribe?.decimals)

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t("Bribe")}
        </Text>
            <Flex>
              <Box mr="8px" height="32px">
                <Balance
                  mt="4px"
                  bold={!isMobile}
                  fontSize={isMobile ? '14px' : '16px'}
                  color={fullBalance ? 'primary' : 'textDisabled'}
                  decimals={fullBalance ? 5 : 1}
                  value={fullBalance ?? 0}
                  unit={` ${currBribe?.symbol || ""}`}
                />
                {currBribe ? (
                  <Balance
                    display="inline"
                    fontSize="12px"
                    color="textSubtle"
                    decimals={2}
                    prefix={t("Earned ")}
                    value={earned}
                    unit={` ${currBribe?.symbol || ""}`}
                  />
                ) : (
                  <Text mt="4px" fontSize="12px" color="textDisabled">
                    {t("No Bribe Selected")}
                  </Text>
                )}
              </Box>
            </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default EarningsCell
