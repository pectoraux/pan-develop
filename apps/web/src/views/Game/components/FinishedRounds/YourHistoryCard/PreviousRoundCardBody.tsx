/* eslint-disable react/no-array-index-key */
import { useMemo } from 'react'
import styled from 'styled-components'
import { Box, Flex, Text, CardBody, CardRibbon, LinkExternal } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { PotteryRoundInfo } from 'state/types'
import Divider from 'components/Divider'
import { getBlockExploreLink } from 'utils'
import Winner from './Winner'
import BurnButton from './BurnButton'


const StyledCardBody = styled(CardBody)`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const StyledCardRibbon = styled(CardRibbon)`
  right: -20px;
  top: -20px;

  ${({ theme }) => theme.mediaQueries.xs} {
    right: -10px;
    top: -10px;
  }
`

const WinnersContainer = styled(Flex)`
  width: 100%;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 20px 0 0 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 316px;
    flex-direction: row;
    margin: 0 0 0 32px;
  }
`

interface PreviousRoundCardBodyProps {
  latestRoundId: string
  finishedRoundInfo: PotteryRoundInfo
}

const PreviousRoundCardBody: React.FC<any> = ({
  roundId,
  latestRoundId,
  roundInfo,
  tokenId,
}) => {
  const { t } = useTranslation()
  // const { isFetched, roundId, prizePot, totalPlayers, txid, winners, lockDate } = finishedRoundInfo
  // const cakePriceBusd = usePriceCakeBusd()

  // const prizeAsBn = new BigNumber(prizePot)
  // const prize = getBalanceNumber(prizeAsBn)
  // const prizeInBusd = new BigNumber(prize).times(cakePriceBusd).toNumber()

  const isLatest = useMemo(() => new BigNumber(latestRoundId).minus(1).eq(roundId), [latestRoundId, roundId])
  
  return (
    <StyledCardBody>
      {isLatest && <StyledCardRibbon text={t('Latest')} />}
      <Flex flexDirection={['column']} width="100%">
        <Flex flexDirection={['column', 'column', 'row']}>
          <Text style={{ alignSelf: 'center' }} fontSize="20px" bold>
            {roundInfo?.name}
          </Text>
          <WinnersContainer>
            {roundInfo?.tokenIds.map((info, index) => <Winner key={`${info?.category}-${index}`} info={info} />)}
          </WinnersContainer>
        </Flex>
        <Box width="100%">
          <Divider />
        </Box>
      </Flex>
      <Flex flexDirection="column" width="100%" mt="8px">
        <Flex flexDirection="row" justify-content='space-between' width="100%" mt="8px">
          <Text fontSize="20px" textAlign={['center', 'center', 'left']} lineHeight="110%" bold>
            {t('Burn Object')}
          </Text>
          <BurnButton tokenId={tokenId} objectName={roundInfo?.name} />
        </Flex>
          <LinkExternal
            m={['10px auto auto auto', '10px auto auto auto', 'auto 0 0 auto']}
            href={getBlockExploreLink('txid', 'transaction')}
          >
            {t('View on BscScan')}
          </LinkExternal>
      </Flex>
    </StyledCardBody>
  )
}

export default PreviousRoundCardBody
