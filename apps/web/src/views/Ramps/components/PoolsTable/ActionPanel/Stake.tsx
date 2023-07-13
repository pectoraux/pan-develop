import { Button, Skeleton, Text, NotificationDot, useModal, Flex, Pool, Dots } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallback, useState, useMemo } from 'react'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { useTranslation } from '@pancakeswap/localization'
import { useERC20 } from 'hooks/useContract'
import { useGetRequiresApproval } from 'state/ramps/hooks'
import { FetchStatus } from 'config/constants/types'

import { Token } from '@pancakeswap/sdk'
import { useCurrency } from 'hooks/Tokens'
import ConnectWalletButton from 'components/ConnectWalletButton'

import { ActionContainer, ActionContent, ActionTitles } from './styles'
import { useApprovePool } from '../../../hooks/useApprove'
import CreateGaugeModal from '../../CreateGaugeModal'

interface StackedActionProps {
  pool?: any
}

const Staked: React.FunctionComponent<any> = ({ pool, rampAccount, toggleSessions }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const initialized = pool?.secretKeys?.length > 0 && pool?.clientIds?.length > 0 && pool?.publishableKeys?.length > 0
  const variant = !initialized
  ? "init"
  : pool?.devaddr_?.toLowerCase() === account?.toLowerCase() 
  ? "admin"
  : "user"
  console.log("initialized============>", initialized, variant, pool)
  const currencyId = useMemo(() => rampAccount?.token?.address, [rampAccount])
  const rampCurrencyInput = useCurrency(currencyId)
  const [currency, setCurrency] = useState(rampAccount?.address)
  const stakingTokenContract = useERC20(rampAccount?.token?.address || '')
  const { needsApproval, status } = useGetRequiresApproval(stakingTokenContract, account, pool?.rampAddress)
  const { handleApprove, pendingTx } = useApprovePool(
    stakingTokenContract,
    pool?.rampAddress,
    rampAccount?.token?.symbol,
  )
  const [openPresentControlPanel] = useModal(
    <CreateGaugeModal 
      variant={variant} 
      location="staked"
      pool={pool} 
      currency={currency ?? rampCurrencyInput} 
      rampAccount={rampAccount} 
    />,)
  const handleInputSelect = useCallback((currencyInput) => setCurrency(currencyInput),[],)
  console.log("79============>", pool, variant)

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

  if (!initialized) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Ramp not yet initialized. Please wait a few moments if you already did. Do not reinitialize, keep refreshing!')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Button
            width="100%"
            onClick={openPresentControlPanel}
            variant="secondary"
            disabled={pool?.devaddr_ !== account}
          >
            {t('Initialize Ramp')}
          </Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  // if (needsApproval) {
  //   return (
  //     <ActionContainer>
  //       <ActionTitles>
  //         <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
  //           {status !== FetchStatus.Fetching && t('Enable ramp')}
  //         </Text>
  //       </ActionTitles>
  //       <ActionContent>
  //         <Button width="100%" disabled={status === FetchStatus.Fetching || pendingTx} onClick={handleApprove} variant="secondary">
  //           {status === FetchStatus.Fetching && t('Loading')}
  //           {status === FetchStatus.Fetching && <Dots>.</Dots>}
  //           {status !== FetchStatus.Fetching && t('Enable')}
  //         </Button>
  //       </ActionContent>
  //     </ActionContainer>
  //   )
  // }

  // if (!pool?.userDataLoaded) {
  //   return (
  //     <ActionContainer>
  //       <ActionTitles>
  //         <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
  //           {t('Start bridging your money')}
  //         </Text>
  //       </ActionTitles>
  //       <ActionContent>
  //         <Skeleton width={180} height="32px" marginTop={14} />
  //       </ActionContent>
  //     </ActionContainer>
  //   )
  // }

  return (
    <ActionContainer>
      <ActionTitles>
        <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
          {pool?.accounts?.length ? t('Adjust Settings') : t('No Accounts Available Yet')}{' '}
        </Text>
      </ActionTitles>
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
      </ActionContent>
      <ActionContent>
      <Button
          width="100%"
          // onClick={onPresentPreviousTx}
          variant="secondary"
        >
          {t('Transaction History')}
      </Button>
      {pool?.allSessions?.length ?
        <>
        <Button
          width="100%"
          onClick={toggleSessions}
          variant="secondary"
        >
          {t('Toggle Sessions (#%pos%)', { pos: pool?.allSessions?.length })}
        </Button>
        {/* <Flex mb="40px"><NotificationDot show/></Flex> */}
        </>:null}
      </ActionContent>
      </>
    </ActionContainer>
  )
}

export default Staked
