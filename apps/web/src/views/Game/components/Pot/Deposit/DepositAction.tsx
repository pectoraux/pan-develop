import styled from 'styled-components'
import { useState, useMemo } from 'react'
import {
  Flex,
  Box,
  Button,
  Text,
  HelpIcon,
  useTooltip,
  LogoRoundIcon,
  Skeleton,
  InputProps,
  NumericalInput,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import { useERC20 } from 'hooks/useContract'
import useTokenBalance from 'hooks/useTokenBalance'
import { getFullDisplayBalance, getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { useWeb3React } from '@pancakeswap/wagmi'
import { getGameFactoryAddress } from 'utils/addressHelpers'
import { useUserEnoughCakeValidator } from 'views/Pools/components/LockedPool/hooks/useUserEnoughCakeValidator'
import { useGetRequiresApproval } from 'state/valuepools/hooks'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import EnableButton from './EnableButton'
import DepositButton from './DepositButton'

const InputPanel = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: 20px;
  padding-bottom: 30px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  z-index: 1;
`

const Container = styled.div<InputProps>`
  border-radius: 16px;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.input};
  box-shadow: ${({ theme, isWarning }) => (isWarning ? theme.shadows.warning : theme.shadows.inset)};
`

interface DepositActionProps {
  totalValueLockedValue: number
}

const DepositAction: React.FC<any> = ({ tokenId, gameData }) => {
  const { t } = useTranslation()
  const [depositAmount, setDepositAmount] = useState<any>('')
  const [numMinutes, setNumMinutes] = useState<any>(BIG_ZERO)
  const [identityTokenId, setIdentityTokenId] = useState<any>('')
  
  const symb = ` ${gameData?.token?.symbol?.toUpperCase() ?? '$'}`

  // const maxTotalDepositToNumber = getBalanceNumber(publicData.maxTotalDeposit)
  // const remainingCakeCanStake = new BigNumber(maxTotalDepositToNumber).minus(totalValueLockedValue).toString()

  const { account } = useWeb3React()
  const { balance: userCake } = useTokenBalance(gameData?.token?.address)
  const userCakeDisplayBalance = getFullDisplayBalance(userCake, gameData?.token?.decimals, 3)
  const { userNotEnoughCake, notEnoughErrorMessage } = useUserEnoughCakeValidator(depositAmount, userCake)
  const tokenContract = useERC20(gameData?.token?.address || '')
  const pricePerMinutes = getBalanceAmount(gameData?.pricePerMinutes, gameData?.token?.decimals)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(
      'CAKE deposit will be diverted to the fixed-term staking pool. Please note that CAKE deposited can ONLY be withdrawn after 10 weeks.',
    ),
    {
      placement: 'bottom',
    },
  )

  const onClickMax = () => {
    const userCakeBalance = getBalanceAmount(userCake, gameData?.token?.decimals ?? 18)
    setDepositAmount(userCakeBalance?.toString())
    setNumMinutes(userCakeBalance.dividedBy(pricePerMinutes))
  }

  const showMaxButton = useMemo(
    () => new BigNumber(depositAmount).multipliedBy(gameData?.token?.decimals).eq(userCake),
    [depositAmount, userCake, gameData],
  )
  const gameFactoryAddress = getGameFactoryAddress()
  const { isRequired: needsApproval, refetch } = useGetRequiresApproval(tokenContract, account, gameFactoryAddress)
  console.log("needsApproval================>", needsApproval, tokenContract, account, gameFactoryAddress)
  if (needsApproval) {
    return <EnableButton refetch={refetch} tokenContract={tokenContract} gameFactoryAddress={gameFactoryAddress} />
  }

  // if (publicData.getStatus !== PotteryDepositStatus.BEFORE_LOCK) {
  //   return (
  //     <Button disabled mt="10px" width="100%">
  //       {t('Deposit closed until next Pottery')}
  //     </Button>
  //   )
  // }
  return (
    <Box>
      <Box mb="4px">
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold as="span">
          {t('Buy %val% minutes in', { val: numMinutes && numMinutes?.isNaN() ? '' : numMinutes?.dividedBy(pricePerMinutes) })}
        </Text>
        <Text fontSize="12px" ml="4px" color="textSubtle" bold as="span">
          {symb}
        </Text>
      </Box>
      <InputPanel>
        <Container>
          <Text fontSize="14px" color="textSubtle" mb="12px" textAlign="right">
            {t('Balance: %balance%', { balance: userCakeDisplayBalance })}
          </Text>
          <Flex mb="6.5px">
            <NumericalInput
              style={{ textAlign: 'left' }}
              className="pottery-amount-input"
              value={depositAmount}
              onUserInput={(val) => {
                setDepositAmount(val)
                setNumMinutes(new BigNumber(val))
                console.log("pricePerMinutes===================>", val)
              }}
            />
            <Flex ml="8px">
              {!showMaxButton && (
                <Button onClick={onClickMax} scale="xs" variant="secondary" style={{ alignSelf: 'center' }}>
                  {t('Max').toUpperCase()}
                </Button>
              )}
              <LogoRoundIcon m="0 4px" width="24px" height="24px" />
              <Text>{symb}</Text>
            </Flex>
          </Flex>
        </Container>
      </InputPanel>
      <InputPanel>
        <Container>
          <Text fontSize="14px" color="textSubtle" mb="12px" textAlign="right">
            {t('Identity Token Id')}
          </Text>
          <Flex mt="6.5px">
            <NumericalInput
              style={{ textAlign: 'left' }}
              placeholder='0'
              value={identityTokenId}
              onUserInput={(val) => setIdentityTokenId(val)}
            />
          </Flex>
        </Container>
      </InputPanel>
      {/* <Flex>
        <Flex ml="auto">
          <Text fontSize="12px" color="textSubtle">
            {t('Deposited CAKE will be locked for 10 weeks')}
          </Text>
          <Flex ref={targetRef}>
            {tooltipVisible && tooltip}
            <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
          </Flex>{' '}
        </Flex>
      </Flex> */}
      {userNotEnoughCake ? (
        <Button disabled mt="10px" width="100%">
          {notEnoughErrorMessage}
        </Button>
      ) : (
        <DepositButton
          tokenId={tokenId}
          numMinutes={numMinutes?.dividedBy(pricePerMinutes)}
          identityTokenId={identityTokenId}
          collectionAddress={gameData?.owner}
          setDepositAmount={setDepositAmount}
          setNumMinutes={setNumMinutes}
          setIdentityTokenId={setIdentityTokenId}
        />
      )}
    </Box>
  )
}

export default DepositAction
