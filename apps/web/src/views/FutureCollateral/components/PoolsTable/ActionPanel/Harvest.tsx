import { format } from 'date-fns'
import { Button, Text, Flex, Box, Balance, Pool } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import getTimePeriods from 'utils/getTimePeriods'
import CopyAddress from 'components/Menu/UserMenu/CopyAddress2'
import truncateHash from '@pancakeswap/utils/truncateHash'

import { ActionContainer, ActionTitles, ActionContent } from './styles'

const HarvestAction: React.FunctionComponent<any> = ({
  pool,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const actionTitle = (
    <>
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('Future Collateral Info')}{' '}
      </Text>
      {/* <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {currAccount?.token?.symbol}
      </Text> */}
    </>
  )

  // if (!account) {
  //   return (
  //     <ActionContainer>
  //       <ActionContent>
  //         <Button disabled>{t('Please Connect Your Wallet')}</Button>
  //       </ActionContent>
  //     </ActionContainer>
  //   )
  // }

  return (
    <ActionContainer>
      <ActionTitles>{actionTitle}</ActionTitles>
      <ActionContent>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <CopyAddress title={truncateHash(pool?.auditor)} account={pool?.auditor} />
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t("Auditor")}
          </Text>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" decimals={pool?.token?.decimals ?? 18} fontSize="12px" value={getBalanceNumber(pool?.fund, pool?.token?.decimals ?? 18)} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Channel Fund")}
            </Text>
          </Box>
        </Flex>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <CopyAddress title={truncateHash(pool?.owner)} account={pool?.owner} />
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t("Owner")}
          </Text>
        </Flex>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
