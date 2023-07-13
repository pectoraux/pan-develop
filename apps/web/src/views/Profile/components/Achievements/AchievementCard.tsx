import styled from 'styled-components'
import { Flex, Text, TimerIcon } from '@pancakeswap/uikit'
import getTimePeriods from 'utils/getTimePeriods'
import { useTranslation } from '@pancakeswap/localization'
import { BNBAmountLabel } from 'views/CanCan/market/components/CollectibleCard/styles'
import AchievementAvatar from './AchievementAvatar'
import AchievementTitle from './AchievementTitle'

interface AchievementCardProps {
  lateSeconds: number
  lateValue: number
  badge: string
  title: string
}

const Details = styled(Flex)`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  padding-left: 8px;
  padding-right: 8px;
`

const AchievementCard: React.FC<React.PropsWithChildren<AchievementCardProps>> = ({ 
  lateSeconds,
  lateValue,
  badge,
  title
}) => {
  const { days, hours, minutes } = getTimePeriods(Number(lateSeconds ?? '0'))
  const { t } = useTranslation()
  return (
    <Flex>
      <AchievementAvatar badge={badge} />
      <Details>
        <AchievementTitle title={title} />
      </Details>
      <Flex alignItems="center" mr="18px">
        <BNBAmountLabel amount={lateValue ? parseFloat(lateValue?.toString()) : 0} />
      </Flex>
      <Flex alignItems="center">
      <TimerIcon width="18px" color="textSubtle" mr="4px" />
      <Text color="textSubtle" >
          {days}{' '}{t('days')}{' '}{hours}{' '}{t('hours')}{' '}{minutes}{' '}{t('minutes')}
      </Text>
      </Flex>
    </Flex>
  )
}

export default AchievementCard
