import { Box } from '@pancakeswap/uikit'
// import { BettingUser } from 'state/types'
import MobileRow from './MobileRow'

interface MobileResultsProps {
  results: any
}

const MobileResults: React.FC<any> = ({ results }) => {
  return (
    <Box mb="24px">
      {results.map((result, index) => (
        <MobileRow key={result.id} rank={index + 4} user={result} />
      ))}
    </Box>
  )
}

export default MobileResults
