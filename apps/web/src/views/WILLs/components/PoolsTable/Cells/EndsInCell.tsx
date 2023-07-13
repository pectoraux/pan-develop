import { format } from 'date-fns'
import styled from 'styled-components'
import { Pool, Text, Flex, Box } from '@pancakeswap/uikit'
import { convertTimeToSeconds } from 'utils/timeHelper'
import { useTranslation } from '@pancakeswap/localization'
import BaseCell, { CellContent } from './BaseCell'

interface EarningsCellProps {
  name: string
  currAccount: any
}

const StyledCell = styled(BaseCell)`
  flex: 4.5;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
  }
`

const EarningsCell: React.FC<any> = ({ currAccount }) => {
  const { t } = useTranslation()
  const getDate = () => {
    try {
      return format(convertTimeToSeconds(currAccount?.nextDueReceivable), 'MMM do, yyyy HH:mm')
    } catch(err) { return "" }
    return '-'
  }
  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Next Due')}
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
