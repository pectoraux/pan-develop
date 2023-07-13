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
} from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { Proposal } from 'state/types'
import { useTranslation } from '@pancakeswap/localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import CreateGaugeModal from 'views/Accelerator/components/CreateGaugeModal'

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

const Vote: React.FC<any> = ({ proposal, ...props }) => {
  const [variant, setVariant] = useState('')
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [openPresentSettings] = useModal(<CreateGaugeModal variant={variant} pool={proposal} />,)

  return (
    <Card {...props}>
      <CardHeader>
        <Heading as="h3" scale="md">
          {t('Cast your vote')}
        </Heading>
      </CardHeader>
      <CardBody>
        <Choice key='like' isChecked={variant === 'like'} isDisabled={!account}>
          <div style={{ flexShrink: 0 }}>
            <Radio scale="sm" value='like' checked={variant === 'like'} 
            onChange={() => setVariant('like')} disabled={!account} />
          </div>
          <ChoiceText>
            <Text as="span" title='attacker'>
              {t("Like")}
            </Text>
          </ChoiceText>
        </Choice>
        <Choice key='dislike' isChecked={variant === 'dislike'} isDisabled={!account}>
          <div style={{ flexShrink: 0 }}>
            <Radio scale="sm" value='dislike' checked={variant === 'dislike'} 
            onChange={() => setVariant('dislike')} disabled={!account} />
          </div>
          <ChoiceText>
            <Text as="span" title='dislike'>
              {t("Dislike")}
            </Text>
          </ChoiceText>
        </Choice>
        {account ? (
          <Button onClick={openPresentSettings} disabled={!account}>
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
