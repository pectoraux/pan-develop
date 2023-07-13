import { useState, useMemo } from 'react'
import styled from 'styled-components'
import { Button, Text, useModal, Flex, Box, Balance, Pool, IconButton, CopyButton, Link, Svg, SvgProps } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import getTimePeriods from 'utils/getTimePeriods'
import { useCurrency } from 'hooks/Tokens'
import { ActionContainer, ActionTitles, ActionContent } from './styles'
import ArticleModal from './ArticleModal'

const Wrapper = styled(Flex)`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-radius: 16px;
  position: relative;
`

const HarvestAction: React.FunctionComponent<any> = ({ pool, currPool, setCurrPool }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { sousId,  partnerData } = pool
  const token = useCurrency(pool.tokenAddress)

  const balances = pool?.partnerStakeIds?.reduce((acc, partnerStakeId) => {
    acc.push(partnerStakeId)
    return acc
  },[sousId]) 
  const [_tokenId, setTokenId] = useState(sousId)
  
  const ProposalIcon: React.FC<SvgProps> = (props) => {
    return (
      <Svg viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M10.037 6a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5zM9.287 9.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM10.037 12a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5z" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.287 4a2 2 0 012-2h13a2 2 0 012 2v15c0 1.66-1.34 3-3 3h-14c-1.66 0-3-1.34-3-3v-2c0-.55.45-1 1-1h2V4zm0 16h11v-2h-12v1c0 .55.45 1 1 1zm14 0c.55 0 1-.45 1-1V4h-13v12h10c.55 0 1 .45 1 1v2c0 .55.45 1 1 1z"
        />
      </Svg>
    )
  }

  setCurrPool(useMemo(() => [pool, ...partnerData].find((p) => parseInt(p.sousId) === parseInt(_tokenId)), [_tokenId]))

  const { days: daysPayable, hours: hoursPayable, minutes: minutesPayable } = getTimePeriods(Number(currPool?.periodPayable ?? '0'))
  const { days: daysReceivable, hours: hoursReceivable, minutes: minutesReceivable } = getTimePeriods(Number(currPool?.periodReceivable ?? '0'))

  const [onPresentArticle] = useModal(<ArticleModal currPool={currPool} />,)

  const actionTitle = (
    <Flex flexDirection="column" justifyContent="space-around">
      <Flex flexDirection="row" justifyContent="space-around">
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('Stake Uses')}{' '}{token?.symbol}
      </Text>
    </Flex>
    <Flex flexDirection="row" justifyContent="space-around">
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('Account Overview')} 
      </Text>
      <Wrapper>
        <Text fontSize="12px" bold mb="10px" color="textSubtle" as="span" textTransform="uppercase">
          {t('Account Address')} 
        </Text>
          <CopyButton width="24px" text={currPool?.owner} tooltipMessage={t('Copied')} tooltipTop={-30} />
      </Wrapper>
    </Flex>
    </Flex>
    )

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Button disabled>{t('Connect your wallet')}</Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>{actionTitle}</ActionTitles>
      <ActionContent>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <Box mr="8px" height="32px">
          <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={token?.decimals ?? 18} value={getBalanceNumber(currPool?.paidPayable, token?.decimals)} />
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Paid Payable")}
          </Text>
          </Box>
          <Box mr="8px" height="32px">
          <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={token?.decimals ?? 18} value={getBalanceNumber(currPool?.paidReceivable, token?.decimals)} />
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Paid Receivable")}
          </Text>
          </Box>
          <Box mr="8px" height="32px">
          <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={token?.decimals ?? 18} value={getBalanceNumber(currPool?.amountPayable, token?.decimals)} />
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Amount Payable")}
          </Text>
          </Box>
          <Box mr="8px" height="32px">
          <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={token?.decimals ?? 18} value={getBalanceNumber(currPool?.amountReceivable, token?.decimals)} />
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Amount Receivable")}
          </Text>
          </Box>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {daysPayable}{' '}{t('days')}{' '}{hoursPayable}{' '}{t('hours')}{' '}{minutesPayable}{' '}{t('minutes')}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Period Payable")}
          </Text>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {daysReceivable}{' '}{t('days')}{' '}{hoursReceivable}{' '}{t('hours')}{' '}{minutesReceivable}{' '}{t('minutes')}
          </Text>
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t("Period Receivable")}
          </Text>
        </Flex>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center" mb="9px">
          <Box mr="8px" height="32px">
          <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={token?.decimals ?? 18} value={getBalanceNumber(currPool?.userData?.duePayable, token?.decimals)} />
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Due Payable")}
          </Text>
          </Box>
          <Box mr="8px" height="32px">
          <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={token?.decimals ?? 18} value={getBalanceNumber(currPool?.userData?.dueReceivable, token?.decimals)} />
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Due Receivable")}
          </Text>
          </Box>
          <Box mr="8px" height="32px">
          <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={currPool?.profileId}/>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Profile Id")}
          </Text>
          </Box>
          <Box mr="8px" height="32px">
          <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={currPool?.bountyId}/>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Bounty Id")}
          </Text>
          </Box>
          <Box mr="8px" height="32px">
          <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={currPool?.tokenId}/>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Token Id")}
          </Text>
          </Box>
          <Flex flexDirection="row">
          <IconButton as={Link} style={{ cursor: "pointer" }} 
            onClick={onPresentArticle}
          >
            <Text color="primary" fontSize="12px" bold textTransform="uppercase">
            {t("Terms")}
            </Text>
            <ProposalIcon color="textSubtle" />
          </IconButton>
          </Flex>
        </Flex>
      </ActionContent>
      <Flex flexWrap="wrap" justifyContent="center" alignItems="center">
      {balances.filter((balance) => !!parseInt(balance)).map((balance) => (
        <Button
          key={balance}
          onClick={(e) => setTokenId(balance)}
          mt="4px"
          mr={['2px', '2px', '4px', '4px']}
          scale="sm"
          variant={_tokenId === balance ? 'subtle' : 'tertiary'}
        >
          {balance}
        </Button>
        ))}
        </Flex>
    </ActionContainer>
  )
}

export default HarvestAction