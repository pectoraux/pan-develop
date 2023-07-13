import { useState } from 'react'
import styled from 'styled-components'
import { Flex, Box } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { useTranslation } from '@pancakeswap/localization'
import { OutlineText } from 'views/Game/components/TextStyle'
import { FINISHED_ROUNDS_BG, FINISHED_ROUNDS_BG_DARK } from 'views/Lottery/pageSectionStyles'
import { ConvexTop } from 'components/PageSection/svg/CurvedSvg'
import AllHistoryCard from './AllHistoryCard'
import HistoryTabMenu from './HistoryTabMenu'
import YourHistoryCard from './YourHistoryCard'

const FinishedRoundsBg = styled(Flex)<{ isDark: boolean }>`
  position: relative;
  width: 100%;
  flex-direction: column;
  background: ${({ isDark }) => (isDark ? FINISHED_ROUNDS_BG_DARK : FINISHED_ROUNDS_BG)};
`

const COVEX_BG =
  'linear-gradient(90deg,rgba(168,129,252,1) 0%,rgb(160 121 244) 15%,rgb(145 104 226) 30%,rgb(136 95 216) 45%,rgb(139 98 219) 65%,rgb(148 108 230) 80%,rgba(168,129,252,1) 100%)'

const FinishedRounds: React.FC<any> = ({ tokenId }) => {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const [historyTabMenuIndex, setHistoryTabMenuIndex] = useState(0)

  return (
    <FinishedRoundsBg isDark={isDark}>
      <ConvexTop clipFill={{ light: COVEX_BG, dark: COVEX_BG }} />
      <Flex mb="24px" width="100%" flexDirection="column" alignItems="center" justifyContent="center">
        <OutlineText fontSize="40px" mb="32px" bold textAlign="center">
          {t('Object Recipes')}
        </OutlineText>
        <Box mb="24px">
          <HistoryTabMenu
            activeIndex={historyTabMenuIndex}
            setActiveIndex={(index) => setHistoryTabMenuIndex(index)}
          />
        </Box>
        {historyTabMenuIndex === 0 ? (
          <AllHistoryCard tokenId={tokenId} />
        // ) : historyTabMenuIndex === 1 ? (
        ):(
          <YourHistoryCard tokenId={tokenId} />
        )}
      </Flex>
    </FinishedRoundsBg>
  )
}

export default FinishedRounds
