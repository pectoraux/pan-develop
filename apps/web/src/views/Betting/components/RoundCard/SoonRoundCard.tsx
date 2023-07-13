import { Card, CardBody, Text, WaitIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { NodeRound, BetPosition } from 'state/types'
import useTheme from 'hooks/useTheme'
import { ROUND_BUFFER } from 'state/predictions/config'
import { formatRoundTime } from '../../helpers'
import useCountdown from '../../hooks/useCountdown'
import { RoundResultBox } from '../RoundResult'
import MultiplierArrow from './MultiplierArrow'
import CardHeader, { getBorderBackground } from './CardHeader'

interface SoonRoundCardProps {
  round: NodeRound
}

const SoonRoundCard: React.FC<any> = ({ betting }) => {
  // const { secondsRemaining } = useCountdown(Date.now() / 1000 + Number(betting?.startTime || 0) - Math.max(1,betting?.idx - 1) * Number(betting?.bracketDuration || 0))
  // const countdown = formatRoundTime(secondsRemaining)
  const { t } = useTranslation()
  const { theme } = useTheme()
  
  return (
    <Card borderBackground={getBorderBackground(theme, 'soon')}>
      <CardHeader status="soon" icon={<WaitIcon mr="4px" width="21px" />} title={t('Pending Results')} epoch={betting?.idx} />
      <CardBody p="16px">
        <RoundResultBox>
          <Text textAlign="center">
            <Text bold>{t('Closed Period')}</Text>
            {/* <Text fontSize="24px" bold>
              {`~${countdown}`}
            </Text> */}
          </Text>
        </RoundResultBox>
        <MultiplierArrow
          action={betting?.action}
          adminShare={betting?.adminShare}
          referrerShare={betting?.referrerShare}
        />
        {/* <MultiplierArrow betPosition={BetPosition.BEAR} isDisabled /> */}
      </CardBody>
    </Card>
  )
}

export default SoonRoundCard
