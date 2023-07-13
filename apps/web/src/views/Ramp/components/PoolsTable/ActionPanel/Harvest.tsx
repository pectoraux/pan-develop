import { Button, Text, Flex, Box, Balance, Pool } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'

import { ActionContainer, ActionTitles, ActionContent } from './styles'

const HarvestAction: React.FunctionComponent<any> = ({
  pool,
  rampAccount,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const actionTitle = (
    <>
      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {rampAccount?.token?.symbol}{' '}
      </Text>
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('Earned')}
      </Text>
    </>
  )

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Button disabled>{t('Harvest')}</Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>{actionTitle}</ActionTitles>
      <ActionContent>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
           {t(rampAccount?.status || '')}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Account Status")}
          </Text>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
           {pool?.automatic === undefined
           ? '-'
           : pool?.automatic
           ? t('Automatic')
           : pool?.applicationLink 
           ? t('Semi-Automatic')
           : t('Manual')}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Account Type")}
          </Text>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={5} value={getBalanceNumber(rampAccount?.minted)} unit={` ${rampAccount?.token?.symbol}`} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Token Minted")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={5} value={getBalanceNumber(rampAccount?.burnt)} unit={` ${rampAccount?.token?.symbol}`} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Token Burnt")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={5} value={getBalanceNumber(rampAccount?.salePrice)} unit={` ${rampAccount?.token?.symbol}`} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Sale Price")}
            </Text>
          </Box>
        </Flex>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={rampAccount?.maxPartners} prefix='# '/>
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Maximum Partners")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {parseInt(rampAccount?.tokenId) ?
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={rampAccount?.tokenId} prefix='# '/>
            :<Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">N/A</Text>}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Attached veNFT Token Id")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {parseInt(rampAccount?.token?.bountyId) ?
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={rampAccount?.token?.bountyId} prefix='# '/>
            :<Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">N/A</Text>}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Attached Bounty Id")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {parseInt(rampAccount?.token?.profileId) ?
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={rampAccount?.token?.profileId} prefix='# '/>
            :<Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">N/A</Text>}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Attached Profile Id")}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {parseInt(rampAccount?.token?.badgeId) ?
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={rampAccount?.token?.profileId} prefix='# '/>
            :<Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">N/A</Text>}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Attached Badge Id")}
            </Text>
          </Box>
        </Flex>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
