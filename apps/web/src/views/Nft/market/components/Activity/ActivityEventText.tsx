import { Text, TextProps } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { MarketEvent } from '../../../../../state/nftMarket/types'

interface ActivityEventTextProps extends TextProps {
  marketEvent: MarketEvent
}

const ActivityEventText: React.FC<React.PropsWithChildren<ActivityEventTextProps>> = ({ marketEvent, ...props }) => {
  const { t } = useTranslation()
  console.log("marketEvent==============>", marketEvent)
  const events = {
    "NewNFT": {
      text: t('Listed'),
      color: 'textSubtle',
    },
    "NewItem": {
      text: t('Listed'),
      color: 'textSubtle',
    },
    "NewPaywall": {
      text: t('Listed'),
      color: 'textSubtle',
    },
    "CancelNFT": {
      text: t('Delisted'),
      color: 'textSubtle',
    },
    "CancelItem": {
      text: t('Delisted'),
      color: 'textSubtle',
    },
    "CancelPaywall": {
      text: t('Delisted'),
      color: 'textSubtle',
    },
    "ModifyNFT": {
      text: t('Modified'),
      color: 'textSubtle',
    },
    "ModifyItem": {
      text: t('Modified'),
      color: 'textSubtle',
    },
    "ModifyPaywall": {
      text: t('Modified'),
      color: 'textSubtle',
    },
    [MarketEvent.BUY]: {
      text: t('Bought'),
      color: 'success',
    },
    "SELL": {
      text: t('Sold'),
      color: 'failure',
    },
  }

  return (
    <Text {...props} color={events[marketEvent]?.color}>
      {events[marketEvent]?.text}
    </Text>
  )
}

export default ActivityEventText
