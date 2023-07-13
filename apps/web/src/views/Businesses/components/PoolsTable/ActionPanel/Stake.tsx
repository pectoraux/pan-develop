import { Button, Text, useModal, Pool, Skeleton } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallback, useState } from 'react'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { useTranslation } from '@pancakeswap/localization'

import { Token } from '@pancakeswap/sdk'
import { useCurrency } from 'hooks/Tokens'
import ConnectWalletButton from 'components/ConnectWalletButton'

import { ActionContainer, ActionContent, ActionTitles } from './styles'
import CreateGaugeModal from '../../CreateGaugeModal'

interface StackedActionProps {
  pool?: any
}

const Staked: React.FunctionComponent<any> = ({ pool }) => {
  const {
    userDataLoaded,
    vestingTokenAddress
  } = pool
  const { t } = useTranslation()
  const { account } = useWeb3React()
  
  const currencyA = useCurrency(vestingTokenAddress)
  const [currency, setCurrency] = useState(currencyA)
  const handleInputSelect = useCallback((currencyInput) => {setCurrency(currencyInput)},[],)
  const isOwner = pool?.owner?.toLowerCase() === account?.toLowerCase()
  const [openPresentUserSettings] = useModal(<CreateGaugeModal pool={pool} currency={currency} />,)
  const [openPresentAdminSettings] = useModal(<CreateGaugeModal variant="admin" pool={pool} currency={currency} />,)
  
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
          onClick={isOwner ? openPresentAdminSettings : openPresentUserSettings}
          variant="secondary"
        >
          {t('Control Panel')}
        </Button>
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
