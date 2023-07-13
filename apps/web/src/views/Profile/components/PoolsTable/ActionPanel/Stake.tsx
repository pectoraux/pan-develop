import { Button, Text, useModal, Pool, Skeleton } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallback, useState } from 'react'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { useTranslation } from '@pancakeswap/localization'

import { Token } from '@pancakeswap/sdk'
import { useCurrency } from 'hooks/Tokens'
import { DEFAULT_TFIAT } from 'config/constants/exchange'
import ConnectWalletButton from 'components/ConnectWalletButton'

import { ActionContainer, ActionContent, ActionTitles } from './styles'
import CreateGaugeModal from '../../CreateGaugeModal'

interface StackedActionProps {
  pool?: any
}

const Staked: React.FunctionComponent<any> = ({ pool }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  
  const currencyA = useCurrency(DEFAULT_TFIAT)
  const [currency, setCurrency] = useState(currencyA)
  const handleInputSelect = useCallback((currencyInput) => {setCurrency(currencyInput)},[],)
  const adminAccount = pool?.accounts?.find((acct) => acct?.ownerAddress?.toLowerCase() === account?.toLowerCase())
  const variant = adminAccount ? 'admin' : 'user'
  const [openPresentSettings] = useModal(<CreateGaugeModal variant={variant} pool={pool} currency={currency ?? currencyA} />,)
  
  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Start earning')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <ConnectWalletButton width="100%" />
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>
        <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
          {t('Adjust Settings')}{' '}
        </Text>
      </ActionTitles>
      <CurrencyInputPanel
        showInput={false}
        currency={currency ?? currencyA}
        onCurrencySelect={handleInputSelect}
        otherCurrency={currency ?? currencyA}
        id={pool?.sousId}
      />
      <ActionContent>
        <Button
          width="100%"
          onClick={openPresentSettings}
          variant="secondary"
        >
          {t('Control Panel')}
        </Button>
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
