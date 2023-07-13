import styled from 'styled-components'
import { Modal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { LotteryStatus } from 'config/constants/types'
import { useLottery } from 'state/lottery/hooks'
import useTheme from 'hooks/useTheme'
import PreviousRoundTicketsInner from './PreviousRoundTicketsInner'
import CurrentRoundTicketsInner from './CurrentRoundTicketsInner'

const StyledModal = styled(Modal)`
  ${({ theme }) => theme.mediaQueries.md} {
    width: 280px;
  }
`

interface ViewTicketsModalProps {
  roundId: string
  roundStatus?: LotteryStatus
  onDismiss?: () => void
}

const ViewTicketsModal: React.FC<React.PropsWithChildren<ViewTicketsModalProps>> = ({
  onDismiss,
  roundId,
  roundStatus,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const isPreviousRound = false

  return (
    <StyledModal
      title={t('Ticket Info')}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradientCardHeader}
    >
      {isPreviousRound ? <PreviousRoundTicketsInner roundId={roundId} /> : <CurrentRoundTicketsInner />}
    </StyledModal>
  )
}

export default ViewTicketsModal
