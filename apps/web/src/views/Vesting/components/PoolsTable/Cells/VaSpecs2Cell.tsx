import { format } from 'date-fns'
import { useMemo } from 'react'
import { Flex, Box, Text, Balance, Pool, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { useCurrPool } from 'state/valuepools/hooks'
import { convertTimeToSeconds } from 'utils/timeHelper'
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

const TotalValueCell: React.FC<any> = ({ pool }) => {
  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()
  const currState = useCurrPool()
  const nft = useMemo(() => pool?.tokens?.find((n) => n.id === currState[pool?.id]), [pool, currState])
  
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
              decimals={0}
              value={(parseInt(nft.vavaPercentile ?? '0') + parseInt(nft.vaPercentile ?? '0')) / 2}
              unit="%"
            />
            <Text fontSize="12px" color="textSubtle" textAlign="left">
              {t('Percentile')}
            </Text>
            <Box mr="8px">
              <Text mt="4px" fontSize="14px" color="primary" bold>
                {parseInt(nft.lockTime)? format(convertTimeToSeconds(nft.lockTime), 'MMM do, yyyy HH:mm') : '-'}
              </Text>
            </Box>
            <Text fontSize="12px" color="textSubtle" textAlign="left">
              {t('Lock Ends')}
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