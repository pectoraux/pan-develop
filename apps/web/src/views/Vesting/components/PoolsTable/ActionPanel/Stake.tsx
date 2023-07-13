import { Button, Text, useModal, Pool, Flex, Dots, Skeleton, NotificationDot } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallback, useState } from 'react'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { useTranslation } from '@pancakeswap/localization'

import { Token } from '@pancakeswap/sdk'
import { useCurrency } from 'hooks/Tokens'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useGetRequiresApproval, usePool } from 'state/valuepools/hooks'
import { useERC20 } from 'hooks/useContract'

import { useApprovePool } from '../../../hooks/useApprove'
import { ActionContainer, ActionContent, ActionTitles } from './styles'
import CreateGaugeModal from '../../CreateGaugeModal'
import InitValuepoolModal from '../../InitValuepoolModal'
import InitVaModal from '../../InitVaModal'

interface StackedActionProps {
  pool?: any
}

const Staked: React.FunctionComponent<any> = ({ 
  sousId, 
  id, 
  toggleSponsors, 
  toggleScheduledPurchases
 }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { pool } = usePool(id)
  const variant = pool?.devaddr_ !== account ? "admin" : "user"
  const vpCurrencyInput = useCurrency(pool?.tokenAddress)
  const [currency, setCurrency] = useState(vpCurrencyInput)
  const stakingTokenContract = useERC20(pool?.tokenAddress || '')
  const { isRequired: needsApproval, refetch } = useGetRequiresApproval(stakingTokenContract, account, pool?.id ?? '')
  const { isRequired: needsVaApproval, refetch:refetchVa } = useGetRequiresApproval(stakingTokenContract, account, pool?.ve ?? '')
  console.log("pool.id=================>", pool)
  const { handleApprove: handleVAPoolApprove, pendingTx: pendingVAPoolTx } = useApprovePool(
    stakingTokenContract,
    pool?.id,
    currency?.symbol,
    refetch
  )
  const { handleApprove: handleVAVAPoolApprove, pendingTx: pendingVAVAPoolTx } = useApprovePool(
    stakingTokenContract,
    pool?.ve,
    currency?.symbol,
    refetchVa
  )

  const [openPresentControlPanel] = useModal(
    <CreateGaugeModal variant={variant} location="valuepool" pool={pool} currency={currency} />,)
  const [openPresentSponsors] = useModal(
    <CreateGaugeModal variant="add_sponsors" location="valuepool" pool={pool} currency={currency} />,)
  const [onPresentInitVava] = useModal(<InitValuepoolModal pool={pool}  />,)
  const [onPresentInitVa] = useModal(<InitVaModal pool={pool}  />,)
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

  if (!pool.initialized) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Valuepool not yet initialized')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Button
            width="100%"
            onClick={onPresentInitVava}
            variant="secondary"
            disabled={pool?.devaddr_?.toLowerCase() !== account?.toLowerCase()}
          >
            {t('Initialize Valuepool')}
          </Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!pool?.vaName) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Va not yet initialized')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Button
            width="100%"
            onClick={onPresentInitVa}
            variant="secondary"
            disabled={pool?.devaddr_?.toLowerCase() !== account.toLowerCase()}
          >
            {t('Initialize Va')}
          </Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  // if (!pool?.userDataLoaded) {
  //   return (
  //     <ActionContainer>
  //       <ActionTitles>
  //         <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
  //           <Dots>{t('Loading')}</Dots>
  //         </Text>
  //       </ActionTitles>
  //       <ActionContent>
  //         <Skeleton width={180} height="32px" marginTop={14} />
  //       </ActionContent>
  //     </ActionContainer>
  //   )
  // }

  // if (!parseFloat(userData.tokenId) && pool?.devaddr_ !== account) {
  // return (
  //     <ActionContainer>
  //       <ActionTitles>
  //         <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
  //           {t('No Account Found')}
  //         </Text>
  //       </ActionTitles>
  //       <ActionContent>
  //         <Button
  //         as={LinkExternal}
  //           width="100%"
  //           href={`/valuepools/${pool.earningToken.address}`}
  //           variant="secondary"
  //         >
  //           {t('Apply for an Account')}
  //         </Button>
  //       </ActionContent>
  //     </ActionContainer>
  //   )
  // }

  if (needsApproval || needsVaApproval) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Enable %va% pool', { va: needsApproval && needsVaApproval
            ? 'VA & VAVA'
            : needsApproval
            ? 'VA'
            : 'VAVA'
          })}
          </Text>
        </ActionTitles>
        <ActionContent>
          {needsApproval ?
          <Button width="100%" disabled={pendingVAPoolTx} onClick={handleVAPoolApprove} variant="secondary">
            {t('Enable VA')}
          </Button>:null}
        </ActionContent>
        <ActionContent>
          {needsVaApproval ?
          <Button width="100%" disabled={pendingVAVAPoolTx} onClick={handleVAVAPoolApprove} variant="secondary">
            {t('Enable VAVA')}
          </Button>:null}
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>
        <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
          {pool?.tokens?.length ? t('Adjust Settings') : t('No Accounts Available Yet')}{' '}
        </Text>
      </ActionTitles>
      <CurrencyInputPanel
        showInput={false}
        currency={currency ?? vpCurrencyInput}
        onCurrencySelect={handleInputSelect}
        otherCurrency={currency ?? vpCurrencyInput}
        id={pool?.id}
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
          mr="3px"
          width="100%"
          onClick={openPresentSponsors}
          variant="secondary"
        >
          {t('Sponsor')}
        </Button>
        {pool?.sponsorAddresses?.length > 0 ?
        <Button
          mr="3px"
          width="100%"
          onClick={toggleSponsors}
          variant="secondary"
        >
          {t('Toggle Sponsors (#%pos%)', { pos: pool?.sponsorAddresses?.length })}
        </Button>:null}
        {pool?.queue?.length ?
        <>
        <Button
          width="100%"
          onClick={toggleScheduledPurchases}
          variant="secondary"
        >
          {t('Toggle Purchases (#%pos%)', { pos: pool?.queue?.length })}
        </Button>
        {/* <Flex mb="40px"><NotificationDot show /></Flex> */}
        </>:null}
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
