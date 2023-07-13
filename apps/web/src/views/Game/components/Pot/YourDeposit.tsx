import { Box, Text, Skeleton, Balance, Input } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { usePotteryData } from 'state/pottery/hook'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'

interface YourDepositProps {
  depositBalance?: any
}

const YourDeposit: React.FC<any> = ({ tokenId, setTokenId }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  // const cakePriceBusd = usePriceCakeBusd()
  const { data, userData } = usePotteryData()
  const tokenData = useMemo(() => {
    return data?.accounts?.find((protocol) => protocol.id === tokenId)
  }, [
    data, 
    tokenId
  ])
  const symb = ` ${data?.token?.symbol?.toUpperCase() ?? '$'}`
  // const totalDepositBalance = getBalanceAmount(tokenData?.depositBalance).toNumber()
  // const balanceInBusd = new BigNumber(totalDepositBalance).times(cakePriceBusd).toNumber()

  return (
    <Box>
      <Box mb="4px">
        <Text fontSize="12px" color="textSubtle" bold as="span" textTransform="uppercase">
          {t('Your')}
        </Text>
        <Text fontSize="12px" color="secondary" bold as="span" ml="4px" textTransform="uppercase">
          {t('Token Id')}
        </Text>
        <Input
          type="text"
          scale="sm"
          value={tokenId}
          placeholder={t('input your token id')}
          onChange={(e) => setTokenId(e.target.value)}
        />
      </Box>
      <Box mb="4px">
        <Text fontSize="12px" color="textSubtle" bold as="span" textTransform="uppercase">
          {t('Your')}
        </Text>
        <Text fontSize="12px" color="secondary" bold as="span" ml="4px" textTransform="uppercase">
          {t('Score')}
        </Text>
      </Box>
      {account && userData.isLoading ? (
        <>
          <Skeleton width="100px" height="35px" />
          <Skeleton width="40px" height="18px" />
        </>
      ) : (
        <>
          <Balance
            bold
            decimals={3}
            fontSize={['20px', '20px', '24px']}
            lineHeight="110%"
            value={tokenData?.score}
          />
          <Balance unit={symb} prefix={t('Score Percentile: ')} decimals={2} value={tokenData?.scorePercentile || 0} fontSize="12px" color="textSubtle" />
          <Balance unit={symb} prefix={t('Price Percentile: ')} decimals={2} value={tokenData?.pricePercentile || 0} fontSize="12px" color="textSubtle" />
        </>
      )}
    </Box>
  )
}

export default YourDeposit
