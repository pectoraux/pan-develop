import styled from 'styled-components'
import  { useMemo, useState } from 'react'
import { Flex, Box, Text, Balance, Input } from '@pancakeswap/uikit'
import { GreyCard } from 'components/Card'
import { usePotteryData } from 'state/pottery/hook'
import { calculateCakeAmount } from 'views/Game/helpers'
import BigNumber from 'bignumber.js'
import { LockTimer } from 'views/Game/components/Timer'
import { BIG_ONE } from '@pancakeswap/utils/bigNumber'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import SubgraphHealthIndicator from 'components/SubgraphHealthIndicator'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import YourDeposit from '../YourDeposit'
import WalletNotConnected from './WalletNotConnected'
import AvailableWithdraw from './AvailableWithdraw'
import PrizeToBeClaimed from './PrizeToBeClaimed'
import CardFooter from './CardFooter'
import WinRate from '../WinRate'

const Container = styled(Flex)`
  flex-direction: column;
  padding: 16px 24px;
`

const Claim: React.FC<any> = ({ tokenId, setTokenId }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { data, publicData, userData } = usePotteryData()
  const symb = ` ${data?.token?.symbol?.toUpperCase() ?? '$'}`
  const [identityTokenId, setIdentityTokenId] = useState('')

  const tokenData = useMemo(() => {
    return data?.accounts?.find((protocol) => protocol.id === tokenId)
  }, [
    data, 
    tokenId
  ])

  return (
    <>
    <Box>
      <Container>
        <GreyCard mb="18px">
          <Flex justifyContent="space-between">
            <YourDeposit tokenId={tokenId} setTokenId={setTokenId} />
            <WinRate />
          </Flex>
        </GreyCard>
        <Flex justifyContent="space-between">
          <Text color="textSubtle">{t('Total Spent')}</Text>
          <Balance bold decimals={2} value={tokenData?.price ?? 0} unit={symb} />
        </Flex>
        <Flex justifyContent="space-between">
          <Text color="textSubtle">{t('Score')}</Text>
          <Balance bold decimals={2} value={getBalanceNumber(tokenData?.score || 0)} />
        </Flex>
        {tokenData?.timer && <LockTimer lockTime={tokenData?.timer} />}
        {tokenData?.deadline && <LockTimer lockTime={tokenData?.deadline} />}
      </Container>
    </Box>
    <Box>
      {account ? (
        <Container>
          <GreyCard>
            <SubgraphHealthIndicator inline subgraphName="pancakeswap/pottery" />
            <Flex justifyContent="space-between" mb="20px">
              <Text fontSize="12px" color="secondary" bold as="span" ml="4px" textTransform="uppercase">
                {t('Identity Token Id')}
              </Text>
              <Input
                type="text"
                scale="sm"
                value={identityTokenId}
                placeholder={t('input your identity token id')}
                onChange={(e) => setIdentityTokenId(e.target.value)}
              />
            </Flex>
            {/* {userData.withdrawAbleData.map((data) => (
              <AvailableWithdraw key={data.id} withdrawData={data} />
            ))} */}
            <PrizeToBeClaimed tokenId={tokenId} tokenData={tokenData} gameData={data} />
          </GreyCard>
        </Container>
      ) : (
        <WalletNotConnected />
      )}
      <CardFooter account={account} publicData={publicData} userData={userData} />
    </Box>
    </>
  )
}

export default Claim
