import { memo, useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { 
  Flex, 
  Link, 
  LinkExternal, 
  Button, 
  AutoRenewIcon, 
  Text, 
  CopyButton,
  ArrowForwardIcon, 
  SvgProps, 
  Svg, 
  Pool,
  Skeleton,
  TwitterIcon, 
  TelegramIcon, 
  LanguageIcon, 
  IconButton,
  useModal,
  Box,
  FlexGap,
} from '@pancakeswap/uikit'
import ReactMarkdown from 'components/ReactMarkdown'
import AddToWalletButton, { AddToWalletTextOptions } from 'components/AddToWallet/AddToWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { useAppDispatch } from 'state'
import { setCurrPoolData } from 'state/valuepools'
import { useCurrPool } from 'state/valuepools/hooks'
import getTimePeriods from 'utils/getTimePeriods'

interface ExpandedFooterProps {
  pool?: any
  account: string
  alignLinksToRight?: boolean
 showTotalStaked?: any}

const Wrapper = styled(Flex)`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-radius: 16px;
  position: relative;
`

const PoolStatsInfo: React.FC<any> = ({
  pool,
  account,
  alignLinksToRight = true,
}) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [pendingTx, setPendingTx] = useState(false)
  const { earningToken, id: valuepoolAddress } = pool
  const tokenAddress = valuepoolAddress || ''
  const dispatch = useAppDispatch()
  const currState = useCurrPool()

  const SmartContractIcon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
    return (
      <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 -15 122.000000 122.000000" {...props}>
        <g transform="translate(0.000000,122.000000) scale(0.100000,-0.100000)" stroke="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M465 1200 c-102 -27 -142 -46 -221 -105 -153 -115 -244 -293 -244
  -480 0 -136 62 -311 119 -334 30 -13 96 -6 119 12 9 7 12 57 12 188 0 211 -1
  209 95 209 95 0 95 1 95 -201 0 -180 2 -186 48 -153 22 15 22 19 22 234 0 257
  -3 250 95 250 97 0 95 4 95 -226 0 -107 4 -194 9 -194 4 0 20 9 35 21 l26 20
  0 244 c0 281 -6 265 98 265 43 0 63 -5 73 -17 10 -12 15 -65 19 -205 l5 -189
  67 56 c86 71 148 148 148 185 0 82 -113 249 -218 322 -152 106 -334 142 -497
  98z"
          />
        </g>
      </Svg>
    )
  }
  
  const ProposalIcon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
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

  const { days: daysDuration, hours: hoursDuration, minutes: minutesDuration } = getTimePeriods(Number(pool?.queueDuration ?? '0'))
  // const [onPresentPayChat] = useModal(<QuizModal title="PayChat" link="https://matrix.to/#/!aGnoPysxAyEOUwXcJW:matrix.org?via=matrix.org" />)

  return (
    <Flex flexDirection='column' maxHeight='200px' overflow='auto'>
      <Box><ReactMarkdown>{pool.description}</ReactMarkdown></Box>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Button
            as={Link}
            variant="text"
            p="0"
            height="auto"
            color="primary"
            endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : <ArrowForwardIcon onClick={() => { 
              setPendingTx(true) 
              router.push(`/valuepools/${pool?.id}`)
            }} color="primary" />}
            isLoading={pendingTx}
            onClick={() => {
              setPendingTx(true)
              router.push(`/valuepools/${pool?.id}`)
            }}
          >
            {t('View All Accounts')}
          </Button>
      </Flex>
      <Flex flex="1" flexDirection="column" alignSelf="flex-center">
      <Wrapper>
        <Text fontSize="12px" bold mb="10px" color="textSubtle" as="span" textTransform="uppercase">
          {t('Valuepool Address')} 
        </Text>
        <CopyButton width="24px" text={pool?.id} tooltipMessage={t('Copied')} tooltipTop={-30} />
      </Wrapper>
        <Text color="primary" fontSize="14px">
          {t("One Person One Vote")} {`->`} {pool?.onePersonOneVote ? t("True") : t("False")}
        </Text>
        <Text color="primary" fontSize="14px">
          {t("BNPL")} {`->`} {pool?.BNPL ? t("True") : t("False")}
        </Text>
        {pool.BNPL ?
          <Text color="primary" fontSize="14px">
          {t("Maximum Credit")} {`->`} {pool?.maxDueReceivable}
        </Text>:null}
        <Text color="primary" fontSize="14px">
          {t("Cosign Enabled")} {`->`} {pool?.cosignEnabled ? t("True") : t("False")}
        </Text>
        {pool.cosignEnabled ?
          <Text color="primary" fontSize="14px">
          {t("Minimum Cosigners")} {`->`} {pool?.minCosigners}
        </Text>:null}
        <Text color="primary" fontSize="14px">
        {t("Queue Duration")} {`->`} {' '}
          {daysDuration ?? ''}{' '}{daysDuration ? t('days') : ''}{' '}
          {hoursDuration ?? ''}{' '}{hoursDuration ? t('hours'): ''}{' '}
          {minutesDuration ?? ''}{' '}{minutesDuration ? t('minutes') : ''}
        </Text>
        <Text color="primary" fontSize="14px">
          {t("Total Paid By Sponsors")} {`->`} {pool?.totalpaidBySponsors}
        </Text>
        <Text color="primary" fontSize="14px">
          {t("Maximum withdrawable")} {`->`} {pool?.maxWithdrawable}{`%`}
        </Text>
        <Text color="primary" fontSize="14px">
          {t("Treasury Share")} {`->`} {pool?.treasuryShare}{`%`}
        </Text>
        <Text color="primary" fontSize="14px">
          {t("Merchant Badge Color")} {`->`} {pool?.merchantMinIDBadgeColor}
        </Text>
        {pool?.merchantValueName?
        <Text color="primary" fontSize="14px">
          {t("Merchant testimony value")} {`->`} {pool?.merchantValueName}
        </Text>: null}
        {pool?.valueName ?
        <Text color="primary" fontSize="14px">
          {t("Testimony value")} {`->`} {pool?.valueName}
        </Text>:null}
        {pool?.workspace ?
        <Text color="primary" fontSize="14px">
          {t("Workspace")} {`->`} {pool.workspace}
        </Text>:null}
        {pool?.countries ?
          <Text color="primary" fontSize="14px">
          {t("Country")} {`->`} {pool.country}
        </Text>:null}
        {pool?.cities ?
          <Text color="primary" fontSize="14px">
          {t("City")} {`->`} {pool.city}
        </Text>:null}
        {pool?.product ?
          <Text color="primary" fontSize="14px">
          {t("Product Tags")} {`->`} {pool.product}
        </Text>:null}
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal href={`/info/token/${pool.tokenAddress}`} bold={false} small>
          {t('See Token Info')}
        </LinkExternal>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal href={`/info/token/${pool?._va}`} bold={false} small>
          {t('See Va Token Info')}
        </LinkExternal>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal href={`/info/token/${pool?.id}`} bold={false} small>
          {t('See Vava Contract Info')}
        </LinkExternal>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal href={`/info/token/${pool?.devaddr_}`} bold={false} small>
          {t('See Admin Info')}
        </LinkExternal>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal href={earningToken?.projectLink} bold={false} small>
          {t('See Admin Channel')}
        </LinkExternal>
      </Flex>
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
            tokenSymbol={earningToken?.symbol}
            tokenDecimals={earningToken?.decimals}
            tokenLogo={`https://tokens.pancakeswap.finance/images/${tokenAddress}.png`}
          />
        </Flex>
      )}
      <Flex flexWrap="wrap" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'} alignItems="center">
      {pool?.tokens?.length ? 
        pool.tokens.filter((token) => account?.toLowerCase() === token?.owner?.toLowerCase())
        .map((balance) => (
        <Button
          key={balance.id}
          onClick={() => {
            const newState = { ...currState, [valuepoolAddress]: balance.id}
            dispatch(setCurrPoolData(newState))
          }}
          mt="4px"
          mr={['2px', '2px', '4px', '4px']}
          scale="sm"
          variant={currState[valuepoolAddress] === balance.id ? 'subtle' : 'tertiary'}
        >
          {balance.tokenId}
        </Button>
        ))
        : <Skeleton width={180} height="32px" mb="2px" />}
        {pool?.tokens?.length ? 
        <Button 
          key="clear-all" 
          variant="text" 
          scale="sm" 
          onClick={()=> dispatch(setCurrPoolData({}))} 
          style={{ whiteSpace: 'nowrap' }}
        >
          {t('Clear')}
        </Button>:null}
      </Flex>
      <Flex>
          <FlexGap gap="16px" pt="24px" pl="4px">
            <IconButton as={Link} style={{ cursor: "pointer" }} 
            // onClick={onPresentProject}
            >
              <LanguageIcon color="textSubtle" />
            </IconButton>
            <IconButton as={Link} style={{ cursor: "pointer" }} 
            // onClick={onPresentArticle}
            >
              <ProposalIcon color="textSubtle" />
            </IconButton>
            <IconButton as={Link} style={{ cursor: "pointer" }} 
            // onClick={onPresentPayChat}
            >
              <SmartContractIcon color="textSubtle" />
            </IconButton>
            {true && (
              <IconButton as={Link} style={{ cursor: "pointer" }} 
              // onClick={onPresentTwitter}
              >
                <TwitterIcon color="textSubtle" />
              </IconButton>
            )}
            {true && (
              <IconButton as={Link} style={{ cursor: "pointer" }} 
              // onClick={onPresentTelegram}
              >
                <TelegramIcon color="textSubtle" />
              </IconButton>
            )}
          </FlexGap>
      </Flex>
    </Flex>
  )
}

export default memo(PoolStatsInfo)
