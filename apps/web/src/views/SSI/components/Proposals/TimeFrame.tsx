import { Text } from '@pancakeswap/uikit'
import { toDate, format } from 'date-fns'
import { useTranslation } from '@pancakeswap/localization'
import { EntryState } from 'state/types'

interface TimeFrameProps {
  startDate: number
  endDate: number
  entryState: EntryState
}

const getFormattedDate = (timestamp: number) => {
  const date = toDate(timestamp * 1000)
  return format(date, 'MMM do, yyyy HH:mm')
}

const TimeFrame: React.FC<React.PropsWithChildren<TimeFrameProps>> = ({ startDate, endDate, entryState }) => {
  const { t } = useTranslation()
  const textProps = {
    fontSize: '16px',
    color: 'textSubtle',
    ml: '8px',
  }

  if (entryState === EntryState.EXPIRED) {
    return <Text {...textProps}>{t('Expired %date%', { date: getFormattedDate(startDate) })}</Text>
  }
  if (entryState === EntryState.PENDING) {
    return <Text {...textProps}>{t('Starts %date%', { date: getFormattedDate(startDate) })}</Text>
  }
  return <Text {...textProps}>{t('Expires %date%', { date: getFormattedDate(endDate) })}</Text>
}

export default TimeFrame
