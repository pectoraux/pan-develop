import {
  Box,
  Text,
  Flex,
  Progress,
} from '@pancakeswap/uikit'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import TextEllipsis from 'views/Voting/components/TextEllipsis'

const Results: React.FC<any> = ({ weight, percent }) => {
  const { t } = useTranslation()
  const progress = percent
  return (
      <Flex style={{ flexDirection: 'column', width: '100%', height: '50%' }}>
          <Box key="vote" mt='24px'>
            <Flex alignItems="center" mb="8px">
              <TextEllipsis mb="4px" title="Votes">
                Votes
              </TextEllipsis>
            </Flex>
            <Box mb="4px">
              <Progress primaryStep={progress} scale="sm" />
            </Box>
            <Flex alignItems="center" justifyContent="space-between">
              <Text color="textSubtle">{t('%total% Votes', { total: formatNumber(weight, 0, 2) })}</Text>
              <Text>
                {progress.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
              </Text>
            </Flex>
          </Box>
      </Flex>
  )
}

export default Results
