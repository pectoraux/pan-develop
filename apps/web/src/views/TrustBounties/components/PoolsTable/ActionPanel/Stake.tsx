import { Button, Text, useModal, Pool, Skeleton, Flex, NotificationDot } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallback, useState } from 'react'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { useTranslation } from '@pancakeswap/localization'
import { useERC20 } from 'hooks/useContract'

import BigNumber from 'bignumber.js'
import { Token } from '@pancakeswap/sdk'
import Dots from 'components/Loader/Dots'
import { getTrustBountiesAddress } from 'utils/addressHelpers'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useCurrency } from 'hooks/Tokens'

import { ActionContainer, ActionContent, ActionTitles } from './styles'
import CreateGaugeModal from '../../CreateGaugeModal'

interface StackedActionProps {
  pool?: any
  toggleApplications: () => void
}

const Staked: React.FunctionComponent<any> = ({ pool, toggleApplications }) => {
  const { sousId, isFinished, userData, userDataLoaded } = pool
  const { t } = useTranslation()
  const { account } = useWeb3React()
  console.log("stakemarketAddress====================>", pool)
  const token = useCurrency(pool?.tokenAddress)
  const allowance = userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO
  const needsApproval = allowance.gt(0)
  const currencyA = token
  const [currency, setCurrency] = useState(currencyA)
  const handleInputSelect = useCallback((currencyInput) => {setCurrency(currencyInput)},[],)
  const variant = pool?.owner === account ? "admin" : "user"
  const [openPresentControlPanel] = useModal(<CreateGaugeModal variant={variant} pool={pool} currency={currency ?? token} />,)
  // const [onPresentPreviousTx] = useModal(<ActivityHistory />,)
  
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

  if (needsApproval) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Enable pool')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Button width="100%" 
          // disabled={pendingPoolTx} 
          // onClick={handlePoolApprove} 
          variant="secondary">
            {t('Enable')}
          </Button>
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
          onClick={openPresentControlPanel}
          variant="secondary"
          disabled={isFinished}
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
          disabled={isFinished}
        >
          {t('Transaction History')}
        </Button>
        {pool?.friendlyClaims?.length ?
        <Button
            width="100%"
            onClick={toggleApplications}
            variant="secondary"
          >
            {t('Friendly Claims (#%pos%)', { pos: pool?.friendlyClaims?.length ?? 0 })}
        </Button>:null}
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
