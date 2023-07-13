import { useWeb3React } from '@pancakeswap/wagmi'
import orderBy from 'lodash/orderBy'
import { Box, Button, Flex, Heading, Text, Grid } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { Bet } from 'state/types'
import Iframe from 'react-iframe'
import { useConfig } from 'views/Betting/context/ConfigProvider'
// import { useGetCurrentHistoryPage, useGetHasHistoryLoaded, useGetIsFetchingHistory } from 'state/bettings/hooks'
import HistoricalBet from './HistoricalBet'
import V1ClaimCheck from '../v1/V1ClaimCheck'

interface RoundsTabProps {
  hasBetHistory: boolean
  bets: Bet[]
}

const RoundsTab: React.FC<any> = ({ currEvent }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  return (
    <Flex justifyContent='center' alignItems="center" padding="10px">
      {currEvent?.tickets?.length ?
      <Grid
        gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}
        alignItems="center"
      >
        {currEvent?.tickets?.filter((nft) => nft.owner?.toLowerCase() === account?.toLowerCase())
        .map((nft) => <Iframe url={nft.metadataUrl} height="500px" styles={{ marginBottom: "10px" }} id="myId" />)}
      </Grid>:
      <Text as="p" textAlign="center">
        {t('No tickets bounght for current event')}
      </Text>}
    </Flex>
  )
}

export default RoundsTab
