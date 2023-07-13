import { Box, Flex, Skeleton, Text, useMatchBreakpoints, Balance, Pool } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'

import styled from 'styled-components'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { Token } from '@pancakeswap/sdk'
import BaseCell, { CellContent } from './BaseCell'

interface StakedCellProps {
  pool?: any
  account: string
}

const StyledCell = styled(BaseCell)``

const StakedCell: React.FC<React.PropsWithChildren<StakedCellProps>> = ({ pool, account }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  // vault
  // const vaultData = useVaultPoolByKey(pool.vaultKey)
  // const {
  //   userData: {
  //     userShares,
  //     balance: { cakeAsBigNumber, cakeAsNumberBalance },
  //     isLoading,
  //   },
  // } = vaultData
  const hasSharesStaked = false
  const isVaultWithShares = false

  // pool
  const { stakingTokenPrice, stakingToken, userData } = pool
  // const stakedAutoDollarValue = getBalanceNumber(cakeAsBigNumber.multipliedBy(stakingTokenPrice), stakingToken.decimals)
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken.decimals)
  const stakedTokenDollarBalance = getBalanceNumber(
    stakedBalance.multipliedBy(stakingTokenPrice),
    stakingToken.decimals,
  )

  const labelText = 'staked'

  const hasStaked = account && (stakedBalance.gt(0) || isVaultWithShares)

  const userDataLoading = false

  return (
    <StyledCell role="cell" flex='2 0 100px'>
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
        {userDataLoading && account ? (
          <Skeleton width="80px" height="16px" />
        ) : (
          <>
            <Flex>
              <Box mr="8px" height="32px">
                <Balance
                  mt="4px"
                  bold={!isMobile}
                  fontSize={isMobile ? '14px' : '16px'}
                  color={hasStaked ? 'primary' : 'textDisabled'}
                  decimals={hasStaked ? 5 : 1}
                  value={hasStaked ? stakedTokenBalance : 0}
                />
                {hasStaked ? (
                  <Balance
                    display="inline"
                    fontSize="12px"
                    color="textSubtle"
                    decimals={2}
                    prefix="~"
                    value={stakedTokenDollarBalance}
                    unit=" USD"
                  />
                ) : (
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

export default StakedCell
