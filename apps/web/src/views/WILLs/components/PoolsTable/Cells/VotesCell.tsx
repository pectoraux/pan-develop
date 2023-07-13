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

  return (
    <StyledCell role="cell" position='relative' mt="22px" bottom='8px'>
      <Flex flexDirection='column'>
        {pool?.unlocked ?
        <Flex flexDirection='row'>
          <Text mr='8px' mt='4px' fontSize="12px" color="primary" textAlign="left" textTransform="uppercase">
            {t('Unlocked')}
          </Text>
        </Flex>:
        <Flex flexDirection='row' position='relative' bottom='5px'>
          <Text mr='8px' mt='4px' fontSize="12px" color="failure" textAlign="left" textTransform="uppercase">
            {t('Locked')}
          </Text>
        </Flex>}
      </Flex>
    </StyledCell>
  )
}

export default TotalValueCell