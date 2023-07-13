import { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Text, Flex, Box, Card, Button, useModal, CopyButton, Balance, Skeleton } from '@pancakeswap/uikit'
import Dots from 'components/Loader/Dots'
import getTimePeriods from 'utils/getTimePeriods'
import { useCurrency } from 'hooks/Tokens'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { usePool } from 'state/stakemarket/hooks'
import { ActionContainer, ActionContent, ActionTitles } from './styles'
import CreateGaugeModal from '../../CreateGaugeModal'

const CardWrapper = styled(Flex)`
  display: inline-block;
  align-iterms: center;
  justify-content: center;
  min-width: 190px;
  margin-left: 16px;
  :hover {
    cursor: pointer;
    opacity: 0.8;
  }
`
const Wrapper = styled(Flex)`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-radius: 16px;
  position: relative;
`
const TopMoverCard = styled(Box)`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 16px;
`
export const ScrollableRow = styled.div`
  width: 100%;
  overflow-x: auto;
  padding: 16px 0;
  white-space: nowrap;
  ::-webkit-scrollbar {
    display: none;
  }
`

const DataCard = ({ pool, sousId, token }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { pool: partnerPool } = usePool(sousId)
  const { days: daysPayable, hours: hoursPayable, minutes: minutesPayable } = getTimePeriods(Number(pool?.periodPayable ?? '0'))
  const { days: daysReceivable, hours: hoursReceivable, minutes: minutesReceivable } = getTimePeriods(Number(pool?.periodReceivable ?? '0'))
  const [openPresentAccept] = useModal(<CreateGaugeModal variant="accept" pool={partnerPool} application={pool} currency={token} />,)

  return (
    <CardWrapper>
      <TopMoverCard>
      {Number(pool?.sousId) ?
      <>
      <Wrapper>
        <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
          {t('Applicant Address')} 
        </Text>
        <CopyButton width="24px" text={pool?.owner} tooltipMessage={t('Copied')} tooltipTop={-30} />
      </Wrapper>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
        <Box mr="8px" height="32px">
        <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={pool?.sousId}/>
        <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
          {t("Stake ID")}
        </Text>
        </Box>
        <Box mr="8px" height="32px">
        <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={5} value={getBalanceNumber(pool?.paidReceivable, token?.decimals)} unit={` ${token?.symbol}`} />
        <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
          {t("Paid Receivable")}
        </Text>
        </Box>
        <Box mr="8px" height="32px">
        <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={5} value={getBalanceNumber(pool?.amountPayable, token?.decimals)} unit={` ${token?.symbol}`} />
        <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
          {t("Amount Payable")}
        </Text>
        </Box>
        <Box mr="8px" height="32px">
        <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={5} value={getBalanceNumber(pool?.amountReceivable, token?.decimals)} unit={` ${token?.symbol}`} />
        <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
          {t("Amount Receivable")}
        </Text>
        </Box>
        </Flex>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
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
        <Box mr="8px" height="32px">
        <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={pool?.bountyId}/>
        <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
          {t("Bounty ID")}
        </Text>
        </Box>
        <Box mr="8px" height="32px">
        <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={pool?.profileId}/>
        <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
          {t("Profile ID")}
        </Text>
        </Box>
        <Box mr="8px" height="32px">
        <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={pool?.tokenId}/>
        <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
          {t("Token ID")}
        </Text>
        </Box>
        </Flex>
        <Flex alignItems='center' justifyContent='center' >
          <Button 
            scale='sm'
            variant='secondary'
            disabled={partnerPool.owner !== account}
            onClick={openPresentAccept}
          >
            {t('Accept')}
          </Button>
        </Flex>
        </> : <Skeleton width="100%" height="300px" marginTop={14} />}
      </TopMoverCard>
    </CardWrapper>
  )
}

const Cart: React.FC<any> = ({ sousId }) => {
  const increaseRef = useRef<HTMLDivElement>(null)
  const moveLeftRef = useRef<boolean>(true)
  const { pool } = usePool(sousId)
  const { t } = useTranslation()

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (increaseRef.current) {
        if (increaseRef.current.scrollLeft === increaseRef.current.scrollWidth - increaseRef.current.clientWidth) {
          moveLeftRef.current = false
        } else if (increaseRef.current.scrollLeft === 0) {
          moveLeftRef.current = true
        }
        increaseRef.current.scrollTo(
          moveLeftRef.current ? increaseRef.current.scrollLeft + 1 : increaseRef.current.scrollLeft - 1,
          0,
        )
      }
    }, 30)

    return () => {
      clearInterval(scrollInterval)
    }
  }, [])

  const token = useCurrency(pool.tokenAddress)

  return (
    <Card my="6px" style={{ width: "100%" }}> 
      <ScrollableRow ref={increaseRef}>
        {pool?.applications?.map((app) => 
        <DataCard key={`application-token-${app?.sousId}`} pool={app} sousId={sousId} token={token} />)}
      </ScrollableRow>
    </Card>
  )
}

export default Cart
