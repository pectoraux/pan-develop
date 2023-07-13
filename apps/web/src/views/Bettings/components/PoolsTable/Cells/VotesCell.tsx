import { Flex, Text, Balance, Pool, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Token } from '@pancakeswap/sdk'
import { useTranslation } from '@pancakeswap/localization'
import BaseCell from './BaseCell'

interface TotalStakedCellProps {
  pool?: any
}

const StyledCell = styled(BaseCell)`
  flex: 2 0 100px;
`

const TotalValueCell: React.FC<any> = ({ pool }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  return (
    <StyledCell role="cell" position='relative' bottom='8px'>
      <Flex flexDirection='column'>
        <Flex flexDirection='row'>
          <Text mr='8px' mt='4px' fontSize="12px" color="primary" textAlign="left">
            {t('Min. Ticket #')}
          </Text>
          <Balance
            bold={!isMobile}
            fontSize={isMobile ? '14px' : '16px'}
            color={Number(pool?.newMinTicketNumber) ? 'primary' : 'textDisabled'}
            decimals={0}
            value={Number(pool?.newMinTicketNumber) ?? 0}
          />
        </Flex>
        <Flex flexDirection='row' position='relative' bottom='5px'>
          <Text mr='8px' mt='4px' fontSize="12px" color="failure" textAlign="left">
            {t('Ticket Range')}
          </Text>
          <Balance
            bold={!isMobile}
            fontSize={isMobile ? '14px' : '16px'}
            color={Number(pool?.newTicketRange) ? 'primary' : 'textDisabled'}
            decimals={0}
            value={Number(pool?.newTicketRange) ?? 0}
          />
        </Flex>
      </Flex>
    </StyledCell>
  )
}

export default TotalValueCell