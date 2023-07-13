import { useState } from 'react'
import styled from 'styled-components'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardProps,
  Heading,
  Radio,
  Text,
  useModal,
  useToast,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { Proposal } from 'state/types'
import { useTranslation } from '@pancakeswap/localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import CastVoteModal from '../components/CastVoteModal'

interface VoteProps extends CardProps {
  proposal: Proposal
  onSuccess?: () => void
}

interface State {
  label: string
  value: number
}

const Choice = styled.label<{ isChecked: boolean; isDisabled: boolean }>`
  align-items: center;
  border: 1px solid ${({ theme, isChecked }) => theme.colors[isChecked ? 'success' : 'cardBorder']};
  border-radius: 16px;
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  display: flex;
  margin-bottom: 16px;
  padding: 16px;
`

const ChoiceText = styled.div`
  flex: 1;
  padding-left: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 0;
`

const Vote: React.FC<any> = ({ proposal, onSuccess, ...props }) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { account } = useWeb3React()
  const [isChecked, setIsChecked] = useState<boolean>()

  const handleSuccess = async () => {
    toastSuccess(t('Vote cast!'))
    onSuccess?.()
  }
  
  const [presentCastVoteModal] = useModal(
    <CastVoteModal onSuccess={handleSuccess} proposal={proposal} isChecked={isChecked} block={Number(proposal.attackerId)} />,
  )

  return (
    <Card {...props}>
      <CardHeader>
        <Heading as="h3" scale="md">
          {t('Cast your vote')}
        </Heading>
      </CardHeader>
      <CardBody>
        <Choice key='attacker' isChecked={isChecked} isDisabled={!account}>
          <div style={{ flexShrink: 0 }}>
            <Radio scale="sm" value={isChecked ? 1 : 0} checked={isChecked} onChange={() => setIsChecked(true)} disabled={!account} />
          </div>
          <ChoiceText>
            <Text as="span" title='aye'>
              {t("Attacker")}
            </Text>
          </ChoiceText>
        </Choice>
        <Choice key='defender' isChecked={!isChecked} isDisabled={!account}>
          <div style={{ flexShrink: 0 }}>
            <Radio scale="sm" value={isChecked ? 1 : 0} checked={!isChecked} onChange={() => setIsChecked(false)} disabled={!account} />
          </div>
          <ChoiceText>
            <Text as="span" title='nay'>
              {t("Defender")}
            </Text>
          </ChoiceText>
        </Choice>
        {account ? (
          <Button onClick={presentCastVoteModal}>
            {t('Cast Vote')}
          </Button>
        ) : (
          <ConnectWalletButton />
        )}
      </CardBody>
    </Card>
  )
}

export default Vote
