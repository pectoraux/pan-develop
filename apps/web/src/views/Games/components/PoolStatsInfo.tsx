import { memo, useState } from 'react'
import { useRouter } from 'next/router'
import { 
  Flex, 
  Link, 
  LinkExternal, 
  Button, 
  Box,
  Skeleton,
  AutoRenewIcon, 
  Text, 
  ArrowForwardIcon, 
  SvgProps, 
  Svg, 
  Pool,
  TwitterIcon, 
  TelegramIcon, 
  LanguageIcon, 
  IconButton,
  useModal,
  FlexGap,
} from '@pancakeswap/uikit'
import AddToWalletButton, { AddToWalletTextOptions } from 'components/AddToWallet/AddToWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import ReactMarkdown from 'components/ReactMarkdown'
import { Token } from '@pancakeswap/sdk'
import { useAppDispatch } from 'state'
import { setCurrPoolData } from 'state/games'
import { useCurrPool } from 'state/games/hooks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import WebPagesModal from './WebPagesModal'

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
  const router = useRouter()
  const [pendingTx, setPendingTx] = useState(false)
  // const { token, gameAddress } = pool
  const tokenAddress = pool?.token?.address || ''
  const dispatch = useAppDispatch()
  const currState = useCurrPool()
  const { chainId } = useActiveWeb3React()
  const [onPresentNFT] = useModal(<WebPagesModal height="500px" pool={pool} />,)

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

  // const [onPresentPayChat] = useModal(<QuizModal title="PayChat" link="https://matrix.to/#/!aGnoPysxAyEOUwXcJW:matrix.org?via=matrix.org" />)
  const SCAN_DOMAIN = {
    56: 'bscscan',
    97: 'testnet.bscscan',
    4002: 'testnet.ftmscan'
  }
  return (
    <Flex flexDirection='column' maxHeight='200px' overflow='auto'>
      <Box><ReactMarkdown>{pool?.collection?.description ?? ''}</ReactMarkdown></Box>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Button
            as={Link}
            variant="text"
            p="0"
            height="auto"
            color="primary"
            endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : <ArrowForwardIcon onClick={() => { 
              setPendingTx(true) 
              router.push(`/games/${pool?.id}`)
            }} color="primary" />}
            isLoading={pendingTx}
            onClick={() => {
              setPendingTx(true)
              router.push(`/games/${pool?.id}`)
            }}
          >
            {t('View All Accounts')}
          </Button>
      </Flex>
      <Flex flex="1" flexDirection="column" alignSelf="flex-center">
        <Text color="primary" fontSize="14px">
          {t("Claimable")} {`->`} {pool?.claimable ? t("True") : t("False")}
        </Text>
        {/* {pool?.valueName ?
        <Text color="primary" fontSize="14px">
          {t("Testimony value")} {`->`} {pool?.valueName}
        </Text>:null} */}
        {pool?.collection?.country ?
          <Text color="primary" fontSize="14px">
          {t("Country")} {`->`} {pool.collection.country}
        </Text>:null}
        {pool?.collection?.city ?
          <Text color="primary" fontSize="14px">
          {t("City")} {`->`} {pool.collection.city}
        </Text>:null}
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal href={`https://${SCAN_DOMAIN[chainId]}.com/address/${pool?.token}`} bold={false} small>
          {t('See Token Info')}
        </LinkExternal>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal href={`https://${SCAN_DOMAIN[chainId]}.com/address/${pool?.gameContract}`} bold={false} small>
          {t('See Game Info')}
        </LinkExternal>
      </Flex>
      {pool?.owner ?
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal href={`https://${SCAN_DOMAIN[chainId]}.com/address/${pool?.owner}`} bold={false} small>
          {t('See Admin Info')}
        </LinkExternal>
      </Flex>:null}
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal href={`/cancan/collections/${pool?.id}`} bold={false} small>
          {t('See Game Channel')}
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
            tokenSymbol={pool?.token?.symbol}
            tokenDecimals={pool?.token?.decimals}
            tokenLogo={`https://tokens.pancakeswap.finance/images/${tokenAddress}.png`}
          />
        </Flex>
      )}
      <Flex flexWrap="wrap" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'} alignItems="center">
      {pool?.accounts?.length ? 
        pool?.accounts.filter((protocol) => account?.toLowerCase() === protocol?.owner?.toLowerCase())
        .map((balance) => (
        <Button
          key={balance.id}
          onClick={() => {
            const newState = { ...currState, [pool?.id]: balance.id}
            dispatch(setCurrPoolData(newState))
            onPresentNFT()
          }}
          mt="4px"
          mr={['2px', '2px', '4px', '4px']}
          scale="sm"
          variant={currState[pool?.id] === balance.id ? 'subtle' : 'tertiary'}
        >
          {balance.id}
        </Button>
        ))
        : null}
        {pool?.accounts?.length ? 
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
