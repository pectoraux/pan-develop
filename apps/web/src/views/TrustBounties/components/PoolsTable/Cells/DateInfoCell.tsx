import styled from 'styled-components'
import { Text, Flex, Box, Pool } from '@pancakeswap/uikit'
import { format } from 'date-fns'
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

const EarningsCell: React.FC<any> = ({ labelText, pool }) => {
  const getDate = () => {
    try {
      return format(convertTimeToSeconds(pool?.endTime), 'MMM do, yyyy HH:mm')
    } catch(err) {
      return '-'
    }
  }

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
            <Flex>
              <Box mr="8px" height="32px">
                <Text mt="4px" fontSize="14px" color="primary" bold>
                  {getDate()}
                </Text>
              </Box>
            </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default EarningsCell
