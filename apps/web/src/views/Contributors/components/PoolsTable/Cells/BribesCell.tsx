import { useMemo } from 'react'
import styled from 'styled-components'
import { Text, Flex, Box, useMatchBreakpoints, Pool, Balance } from '@pancakeswap/uikit'
import { useCurrBribe } from 'state/contributors/hooks'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
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

const EarningsCell: React.FC<any> = ({ pool }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const currState = useCurrBribe()
  const tokenAddress = pool?.vestingTokenAddress || ''
  const currBribe = useMemo(() => {
    if (pool?.userDataLoaded) {
      return pool?.userData?.bribes?.find((bribe) => bribe.tokenAddress === currState[tokenAddress])
    } 
    return pool.bribes?.find((bribe) => bribe.tokenAddress === currState[tokenAddress])
  },[currState, tokenAddress, pool])
  const fullBalance = getBalanceNumber(currBribe?.rewardAmount, currBribe?.decimals)
  const earned = getBalanceNumber(currBribe?.earned, currBribe?.decimals)
  console.log("currState===================>", currState, currBribe, pool)
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
