import styled from 'styled-components'
import { useWeb3React } from '@pancakeswap/wagmi'
import {
  Box,
  Card,
  CardHeader,
  ExpandableButton,
  Flex,
  Text,
  TokenPairImage as UITokenPairImage,
  Balance,
  Pool,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { vaultPoolConfig } from 'config/constants/pools'
import { VaultKey } from 'state/types'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useConfig } from 'views/Ifos/contexts/IfoContext'
import { Token } from '@pancakeswap/sdk'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'

const StyledCardMobile = styled(Card)`
  max-width: 400px;
  width: 100%;
`

const StyledTokenContent = styled(Flex)`
  ${Text} {
    line-height: 1.2;
    white-space: nowrap;
  }
`

interface IfoPoolVaultCardMobileProps {
  pool?: any
}

const IfoPoolVaultCardMobile: React.FC<React.PropsWithChildren<IfoPoolVaultCardMobileProps>> = ({ pool }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const credit = BIG_ZERO
  const { isExpanded, setIsExpanded } = useConfig()
  const cakeAsNumberBalance = getBalanceNumber(credit)

  // const vaultPool = useVaultPoolByKey(pool.vaultKey)

  // const {
  //   userData: { userShares, isLoading: isVaultUserDataLoading },
  //   fees: { performanceFeeAsDecimal },
  // } = vaultPool

  // const accountHasSharesStaked = userShares && userShares.gt(0)
  // const isLoading = !pool.userData || isVaultUserDataLoading

  return (
    <StyledCardMobile isActive>
      <CardHeader p="16px">
        <Flex justifyContent="space-between" alignItems="center">
          <StyledTokenContent alignItems="center" flex={1}>
            <UITokenPairImage width={24} height={24} {...vaultPoolConfig[VaultKey.CakeVault].tokenImage} />
            <Box ml="8px" width="180px">
              <Text small bold>
                {vaultPoolConfig[VaultKey.CakeVault].name}
              </Text>
              <Text color="textSubtle" fontSize="12px">
                {vaultPoolConfig[VaultKey.CakeVault].description}
              </Text>
            </Box>
          </StyledTokenContent>
          <StyledTokenContent flexDirection="column" flex={1}>
            <Text color="textSubtle" fontSize="12px">
              {t('iCAKE')}
            </Text>
            <Balance small bold decimals={3} value={cakeAsNumberBalance} />
          </StyledTokenContent>
          <ExpandableButton expanded={isExpanded} onClick={() => setIsExpanded((prev) => !prev)} />
        </Flex>
      </CardHeader>
      {/* {isExpanded && (
        <CakeVaultDetail
          showICake
          isLoading={isLoading}
          account={account}
          pool={pool}
          vaultPool={vaultPool}
          accountHasSharesStaked={accountHasSharesStaked}
          performanceFeeAsDecimal={performanceFeeAsDecimal}
        />
      )} */}
    </StyledCardMobile>
  )
}

export default IfoPoolVaultCardMobile
