import { Button, Text, useModal, Pool, Skeleton, Flex, NotificationDot } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallback, useState } from 'react'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { useTranslation } from '@pancakeswap/localization'
import { useERC20 } from 'hooks/useContract'

import BigNumber from 'bignumber.js'
import { Token } from '@pancakeswap/sdk'
import Dots from 'components/Loader/Dots'
import { getStakeMarketAddress } from 'utils/addressHelpers'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useCurrency } from 'hooks/Tokens'
import { useGetRequiresApproval } from 'state/valuepools/hooks'
import EnableButton from 'views/Game/components/Pot/Deposit/EnableButton'

import { useApprovePool } from '../../../hooks/useApprove'
import { ActionContainer, ActionContent, ActionTitles } from './styles'
import CreateGaugeModal from '../../CreateGaugeModal'

interface StackedActionProps {
  pool?: any
  toggleApplications: () => void
}

const Staked: React.FunctionComponent<any> = ({ pool, currPool, toggleApplications }) => {
  const { sousId, isFinished, userData, userDataLoaded } = pool
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const token = useCurrency(pool.tokenAddress) as any
  const stakemarketAddress = getStakeMarketAddress()
  const stakingTokenContract = useERC20(token?.address || '')
  // const { handleApprove: handlePoolApprove, pendingTx: pendingPoolTx } = useApprovePool(
  //   stakingTokenContract,
  //   sousId,
  //   stakemarketAddress,
  //   token?.symbol,
  // )
  const { isRequired: needsApproval, refetch } = useGetRequiresApproval(stakingTokenContract, account, stakemarketAddress)
  // if (needsApproval) {
  //   return <EnableButton 
  //           refetch={refetch} 
  //           tokenContract={stakingTokenContract} 
  //           gameFactoryAddress={stakemarketAddress} 
  //         />
  // }

  // const allowance = userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO
  // const needsApproval = !allowance.gt(0)
  const currencyA = token
  const [currency, setCurrency] = useState(currencyA)
  const handleInputSelect = useCallback((currencyInput) => {setCurrency(currencyInput)},[],)
  const variant = pool.owner === account ? "admin" : "user"
  const [openPresentControlPanel] = useModal(<CreateGaugeModal variant={variant} pool={currPool} sousId={sousId} currency={currency ?? token} />,)
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

  // if (!userDataLoaded) {
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

  if (needsApproval) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Enable contract')}
          </Text>
        </ActionTitles>
        <ActionContent>
          {/* <Button width="100%" 
          // disabled={pendingPoolTx} 
          onClick={handlePoolApprove} 
          variant="secondary">
            {t('Enable')}
          </Button> */}
          <EnableButton 
            refetch={refetch} 
            tokenContract={stakingTokenContract} 
            gameFactoryAddress={stakemarketAddress} 
          />
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
        {pool?.applications?.length && !parseInt(pool?.partnerStakeId) ?
        <Button
            width="100%"
            onClick={toggleApplications}
            variant="secondary"
            disabled={isFinished}
          >
            {t('Toggle Applications (#%pos%)', { pos: pool?.applications?.length ?? 0 })}
        </Button>:null}
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
