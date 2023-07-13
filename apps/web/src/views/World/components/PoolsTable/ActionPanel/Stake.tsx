import { Button, Text, useModal, Pool } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallback, useState, useMemo } from 'react'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { useTranslation } from '@pancakeswap/localization'

import { Token } from '@pancakeswap/sdk'
import { useCurrency } from 'hooks/Tokens'
import ConnectWalletButton from 'components/ConnectWalletButton'
import CreateGaugeModal from 'views/Worlds/components/CreateGaugeModal'

import { ActionContainer, ActionContent, ActionTitles } from './styles'

interface StackedActionProps {
  pool?: any
}

const Staked: React.FunctionComponent<any> = ({ pool, currAccount }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const variant = pool?.devaddr_ === account ? "admin" : "user"
  const currencyId = useMemo(() => currAccount?.token?.address, [currAccount])
  const auditorCurrencyInput = useCurrency(currencyId)
  const [currency, setCurrency] = useState(auditorCurrencyInput)
  const [openPresentControlPanel] = useModal(
    <CreateGaugeModal variant={variant} pool={pool} currency={currency} />,)
  const handleInputSelect = useCallback((currencyInput) => setCurrency(currencyInput),[],)

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Connect your Wallet')}
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
        currency={currency ?? auditorCurrencyInput}
        onCurrencySelect={handleInputSelect}
        otherCurrency={currency ?? auditorCurrencyInput}
        id={pool?.sousId}
      />
      <ActionContent>
        <Button
          width="100%"
          onClick={openPresentControlPanel}
          variant="secondary"
        >
          {t('Control Panel')}
        </Button>
        {/* <Flex mb="40px"><NotificationDot show={userData?.requests?.length} /></Flex> */}
      </ActionContent>
      <ActionContent>
      <Button
          width="100%"
          // onClick={onPresentPreviousTx}
          variant="secondary"
        >
          {t('Transaction History')}
      </Button>
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
