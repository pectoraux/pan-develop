import axios from 'axios'
import { loadStripe } from "@stripe/stripe-js"
import { useWeb3React } from '@pancakeswap/wagmi'
import { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { Text, Flex, Balance, Button, Box, Card, Toggle, CopyButton, useModal, AutoRenewIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useCurrency } from 'hooks/Tokens'
import CreateGaugeModal from 'views/Ramps/components/CreateGaugeModal'
import { useRampHelper } from 'hooks/useContract'
import { useGetAccountSg } from 'state/ramps/hooks'

const CardWrapper = styled(Card)`
  display: inline-block;
  min-width: 190px;
  margin-left: 16px;
  :hover {
    cursor: pointer;
    opacity: 1;
  }
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

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`;
const Wrapper = styled(Flex)`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-radius: 16px;
  position: relative;
`
const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`;

const DataCard = ({ session, pool }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { data: accountData } = useGetAccountSg(account, 'stripe')
  const [ isLoading, setIsLoading] = useState(false)
  const csId = session?.id ? `${truncateHash(session?.id, 10, 10)}` : null
  const address = session?.token?.address ? `${truncateHash(session?.token?.address, 10, 10)}` : null
  const currency = useCurrency(address)
  const rampHelperContract = useRampHelper()
  const variant = !session?.mintSession 
  ? 'transfer'
  : session?.ppDataFound 
  ? 'mint'
  : 'charge'
  const [openPresentControlPanel] = useModal(
    <CreateGaugeModal variant={variant} session={session} location="staked" pool={pool} currency={currency} />,)
  
  const processCharge = async () => {
    setIsLoading(true)
    const route = variant === 'charge' ? '/api/charge' : '/api/transfer'
    const args = variant === 'charge' 
    ? { 
      account, 
      price: session?.amount, 
      currency: session?.token, 
      rampAddress: pool?.rampAddress,
      sk: pool?.secretKeys?.length && pool?.secretKeys[0]
    } 
    : { 
      amount: session.amount, 
      symbol: session?.token?.symbol, 
      accountId: accountData?.id,  
      sk: pool?.secretKeys?.length && pool?.secretKeys[0]
    }
    console.log("7processCharge==================>", route, args, session)
    if (pool?.automatic) {
      const { data } = await axios.post(route, args)
      if (data.error || data.amount === undefined) {
        setIsLoading(false)
        console.log("data.error=====================>", data.error)
      } else if (variant === "charge") {
        const stripe = await loadStripe(pool?.publishableKeys?.length && pool?.publishableKeys[0])
        await stripe.redirectToCheckout({ sessionId: data?.id })
      } else {
        await rampHelperContract.postMint(session?.id).then(() => 
          setIsLoading(false)
        )
      }
    } else {
      await rampHelperContract.postMint(session?.id).then(() => 
        setIsLoading(false)
      )
    }
  }// acct_1MRgIdAcbvYb7YlN
  return (
    <CardWrapper>
      <TopMoverCard>
      <Flex flex="1" flexDirection="column" alignSelf="flex-center" mb="8px">
          <Text lineHeight="1" fontSize="14px" color="textSubtle" as="span">
            {csId}
          </Text>
          <Wrapper>
            <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
              {t('ID')} 
            </Text>
            <CopyButton width="24px" text={session?.id} tooltipMessage={t('Copied')} tooltipTop={-30} />
          </Wrapper>
        </Flex>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center" mb="8px">
          <Text lineHeight="1" fontSize="14px" color="textSubtle" as="span">
            {address}
          </Text>
          <Wrapper>
            <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
              {t('User Address')} 
            </Text>
            <CopyButton width="24px" text={session?.token?.address} tooltipMessage={t('Copied')} tooltipTop={-30} />
          </Wrapper>
        </Flex>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center" mb="8px">
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span" textTransform="uppercase">
           {session?.mintSession ? t('Mint Session') : t('Burn Session')}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Session Type")}
          </Text>
        </Flex>
        <Box mr="8px" height="32px" mb="8px">
          <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={session?.token?.decimals} value={session?.amount} unit={` ${session?.token?.symbol}`} />
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("Amount")}
          </Text>
        </Box>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <Box mr="8px" height="32px">
            {parseInt(session?.identityTokenId) ?
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={session?.identityTokenId} prefix='# ' />
            :<Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">N/A</Text>}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t("Attached Identity Token Id")}
            </Text>
          </Box>
        </Flex>
        <Flex alignItems='center' justifyContent='center'>
          {variant === "transfer" ?
          <Button 
            scale='sm'
            variant='secondary'
            disabled={!session?.active || session.user?.toLowerCase() !== account?.toLowerCase()}
            endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
            onClick={processCharge}
          >
          {t('Process Post Burn')}
        </Button>:
        <Button 
          scale='sm'
          variant='secondary'
          disabled={!session?.active || session.user?.toLowerCase() !== account?.toLowerCase()}
          endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
          onClick={variant === "mint" ? openPresentControlPanel: processCharge}
        >
          {variant === "mint" ? t('Mint') : t('Process Charge')}
      </Button>}
        </Flex>
      </TopMoverCard>
    </CardWrapper>
  )
}

const Cart: React.FC<any> = ({ pool }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const increaseRef = useRef<HTMLDivElement>(null)
  const moveLeftRef = useRef<boolean>(true)
  const [ mintOnly, setMintOnly ] = useState(true)
  const [ burnOnly, setBurnOnly ] = useState(true)
  const [ mineOnly, setMineOnly ] = useState(true)

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

  const mintOnlySwitch = (
    <ToggleWrapper>
      <Toggle checked={mintOnly} onChange={() => setMintOnly(!mintOnly)} scale="sm" />
      <Text> {t("Mint Only")}</Text>
    </ToggleWrapper>
  );

  const burnOnlySwitch = (
    <ToggleWrapper>
      <Toggle checked={burnOnly} onChange={() => setBurnOnly(!burnOnly)} scale="sm" />
      <Text> {t("Burn Only")}</Text>
    </ToggleWrapper>
  );
  
  const mineOnlySwitch = (
    <ToggleWrapper>
      <Toggle checked={mineOnly} onChange={() => setMineOnly(!mineOnly)} scale="sm" />
      <Text> {t("Mine Only")}</Text>
    </ToggleWrapper>
  );

  return (
    <Card my="6px" style={{ width: "100%" }}> 
      <Text ml="16px" mt="8px" color='primary'>
        {t("Sessions")}
      </Text>
      <ViewControls>
        {mineOnlySwitch}
        {mintOnlySwitch}
        {burnOnlySwitch}
      </ViewControls>
      <ScrollableRow ref={increaseRef}>
        {pool?.allSessions.filter((session) =>
          mintOnly && session.mintSession || 
          burnOnly && !session.mintSession ||
          mineOnly && session?.user?.toLowerCase() === account?.toLowerCase())
        .map((session) =>
          <DataCard session={session} pool={pool} />
        )}
      </ScrollableRow>
    </Card>
  )
}

export default Cart
