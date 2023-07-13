import { Button, Text, useModal, Pool } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallback, useState, useMemo } from 'react'
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

const Staked: React.FunctionComponent<any> = ({ pool, rampAccount }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const variant = pool?.devaddr_ !== account ? "admin" : "user"
  const currencyId = useMemo(() => rampAccount?.token?.address, [rampAccount])
  const rampCurrencyInput = useCurrency(currencyId)
  const [currency, setCurrency] = useState(rampCurrencyInput)
  const [openPresentControlPanel] = useModal(
    <CreateGaugeModal variant={variant} location="arps" pool={pool} currency={currency} />,)
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

  if (pool?.automatic === undefined) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Ramp not yet initialized')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Button
            width="100%"
            // onClick={onPresentInitARP}
            variant="secondary"
            disabled={pool?.devaddr_ !== account}
          >
            {t('Initialize ARP')}
          </Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>
        <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
          {pool?.accounts?.length ? t('Adjust Settings') : t('No Accounts Available Yet')}{' '}
        </Text>
      </ActionTitles>
      {!pool?.accounts?.length && variant !== "admin" ? null:
      <>
        <CurrencyInputPanel
          showInput={false}
          currency={currency ?? rampCurrencyInput}
          onCurrencySelect={handleInputSelect}
          otherCurrency={currency ?? rampCurrencyInput}
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
      </>}
    </ActionContainer>
  )
}

export default Staked
