import styled from 'styled-components'
import { Text, Flex, Box, Pool } from '@pancakeswap/uikit'
import { format } from 'date-fns'
import { usePool } from 'state/stakemarket/hooks'
import Countdown from 'views/Lottery/components/Countdown'
import { convertTimeToSeconds } from 'utils/timeHelper'
import BaseCell, { CellContent } from './BaseCell'

interface EarningsCellProps {
  labelText: string
  pool?: any
}

const StyledCell = styled(BaseCell)`
  flex: 4.5;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
  }
`

const EarningsCell: React.FC<any> = ({ labelText, sousId }) => {
  const { pool } = usePool(sousId)
  
  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
            <Flex>
              {!parseFloat(pool?.waitingDuration) ?
              <Box mr="8px" height="32px">
                <Text mt="4px" fontSize="14px" color="primary" bold>
                  {parseInt(pool?.nextDueReceivable)? format(convertTimeToSeconds(pool?.nextDueReceivable), 'MMM do, yyyy HH:mm') : '-'}
                </Text>                
                <Text mt="4px" fontSize="14px" color="textSubtle">
                  {parseInt(pool?.nextDuePayable) ? format(convertTimeToSeconds(pool?.nextDuePayable), 'MMM do, yyyy HH:mm') : '-'}
                </Text>
              </Box>:
              <Box mr="8px" height="32px">
                <Countdown
                  nextEventTime={pool.waitingDuration}
                  postCountdownText=''
                  preCountdownText=''
                />
              </Box>}
            </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default EarningsCell
