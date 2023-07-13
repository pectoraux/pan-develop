import { memo, useMemo } from 'react'
import { 
  Flex, 
  LinkExternal, 
  Button, 
  Text, 
  Pool,
  Skeleton,
} from '@pancakeswap/uikit'
import AddToWalletButton, { AddToWalletTextOptions } from 'components/AddToWallet/AddToWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { setCurrPoolData } from 'state/pools'
import { useCurrPool } from 'state/pools/hooks'
import { useAppDispatch } from 'state'

interface ExpandedFooterProps {
  pool?: any
  account: string
  alignLinksToRight?: boolean
 showTotalStaked?: any}

const PoolStatsInfo: React.FC<any> = ({
  pool,
  account,
  alignLinksToRight = true,
}) => {
  const { t } = useTranslation()
  const { id: tokenAddress, earningToken, userData } = pool
  const dispatch = useAppDispatch()
  const currState = useCurrPool()
  const currAccount = useMemo(() => userData?.accounts?.find((bal) => bal.id ===  currState[pool?.id]), [currState])

  return (
    <Flex flexDirection='column' maxHeight='200px' overflow='auto'>
      <Flex flex="1" flexDirection="column" alignSelf="flex-center">
        <Text color="primary" fontSize="14px">
          {t("Name")} {`->`} {pool?.name}
        </Text>
        <Text color="primary" fontSize="14px">
          {t("Symbol")} {`->`} {pool?.symbol}
        </Text>
        <Text color="primary" fontSize="14px">
          {t("Decimals")} {`->`} {pool?.decimals}
        </Text>
        <Text color="primary" fontSize="14px">
          {t("User Accounts")} {`->`} {userData?.accounts?.length ?? 0}
        </Text>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal href={`/info/token/${pool?.id}`} bold={false} small>
          {t('See Token Info')}
        </LinkExternal>
      </Flex>
      {currAccount ?
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal href={`/info/token/${currAccount?.ve}`} bold={false} small>
          {t('See Current Token Info')}
        </LinkExternal>
      </Flex>:null}
      {account && tokenAddress && (
        <Flex justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <AddToWalletButton
            variant="text"
            p="0"
            height="auto"
            style={{ fontSize: '14px', fontWeight: '400', lineHeight: 'normal' }}
            marginTextBetweenLogo="4px"
            textOptions={AddToWalletTextOptions.TEXT}
            tokenAddress={tokenAddress}
            tokenSymbol={pool?.symbol}
            tokenDecimals={pool?.decimals}
            tokenLogo={`https://tokens.pancakeswap.finance/images/${tokenAddress}.png`}
          />
        </Flex>
      )}
      {userData?.accounts?.length ?
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
          {t('Pick a token ID')}
        </Text>
      </Flex> : <Skeleton width={180} height="32px" mb="2px" />}
      <Flex flexWrap="wrap" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'} alignItems="center">
      {userData?.accounts?.map((balance) => (
        <Button
          key={balance.id}
          onClick={() => {
            const newState = { ...currState, [tokenAddress]: balance.id}
            dispatch(setCurrPoolData(newState))
          }}
          mt="4px"
          mr={['2px', '2px', '4px', '4px']}
          scale="sm"
          variant={currState[tokenAddress] === balance.id ? 'subtle' : 'tertiary'}
        >
          {balance.tokenId}
        </Button>
        ))}
      </Flex>
    </Flex>
  )
}

export default memo(PoolStatsInfo)
