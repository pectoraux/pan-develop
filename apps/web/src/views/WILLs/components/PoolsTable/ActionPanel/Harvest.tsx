import CopyAddress from 'components/Menu/UserMenu/CopyAddress2'
import { Button, Text, Flex, Box, Balance, Pool } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import Divider from 'components/Divider'
import getTimePeriods from 'utils/getTimePeriods'
import { ActionContainer, ActionTitles, ActionContent } from './styles'

const HarvestAction: React.FunctionComponent<any> = ({
  pool,
  currToken,
  currAccount,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { days, hours, minutes } = getTimePeriods(Number(pool?.willWithdrawalPeriod ?? '0'))
  const { days: days2, hours: hours2, minutes: minutes2 } = getTimePeriods(Number(pool?.updatePeriod ?? '0'))

  const actionTitle = (
    <Flex flexDirection="row">
      <Flex flex="1" flexDirection="column" alignSelf="flex-center">
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('Current Token')}{' '}
      </Text>
      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {currToken?.symbol}
      </Text>
      </Flex>
      {currAccount ? 
      <Flex flex="1" flexDirection="column" alignSelf="flex-center">
        <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('Current Heir')}{' '}
      </Text>
      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
      {currAccount?.protocolId}
    </Text>
    </Flex>:null}
    </Flex>
  )

  if (!account) {
    return (
      <ActionContainer>
        <ActionContent>
          <Button disabled>{t('Please Connect Your Wallet')}</Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!currToken) {
    return (
      <ActionContainer>
        <ActionContent>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Pick a token")}
          </Text>
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>{actionTitle}</ActionTitles>
      <ActionContent>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          {currToken.id ? 
          <>
          <CopyAddress title={t('Curr Token Address')} account={account} />
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={currToken.decimals ?? 18} value={getBalanceNumber(currToken?.totalLiquidity, currToken.decimals ?? 18)} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Total Liquidity")}
            </Text>
          </Box>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {currToken?.tokenType === "0" ? "Fugible" : currToken?.tokenType === "1" ? "NFT - ERC721" : 'NFT - ERC1155'}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Token Type")}
          </Text>
          </>:null}
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {days}{' '}{t('days')}{' '}{hours}{' '}{t('hours')}{' '}{minutes}{' '}{t('minutes')}
          </Text>
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t("Will Withdrawable Period")}
          </Text>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {days2}{' '}{t('days')}{' '}{hours2}{' '}{t('hours')}{' '}{minutes2}{' '}{t('minutes')}
          </Text>
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t("Update Period")}
          </Text>
          </Flex>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
        <Box mr="8px" height="32px">
            {parseInt(currAccount?.profileId) ?
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={currAccount?.profileId} prefix='# '/>
            :<Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">N/A</Text>}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Attached Profile Id")}
            </Text>
          </Box>
          {currAccount?.tokenData?.map((td) =>
            <>
            <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
              {td?.tokenType === 0 ? "Fugible" : td?.tokenType === 1 ? "NFT - ERC721" : 'NFT - ERC1155'}
            </Text>
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Token Type")}
            </Text>
            <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
              {td?.tokenType === "0" ? "Fugible" : td?.tokenType === "1" ? "NFT - ERC721" : 'NFT - ERC1155'}
            </Text>
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Token Type")}
            </Text>
            <Box mr="8px" height="32px">
            {parseInt(currAccount?.adminBountyId) ?
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={currAccount?.adminBountyId} prefix='# '/>
            :<Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">N/A</Text>}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Admin Bounty Id")}
            </Text>
          </Box>
          <Divider/>
            </>
          )}
        </Flex>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
