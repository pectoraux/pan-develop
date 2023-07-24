import { memo, useMemo } from 'react'
import { 
  Flex, 
  Link, 
  LinkExternal, 
  Text, 
  useModal,
  TwitterIcon, 
  TelegramIcon, 
  LanguageIcon, 
  Svg, 
  SvgProps,
  IconButton,
  FlexGap
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import AddToWalletButton, { AddToWalletTextOptions } from 'components/AddToWallet/AddToWalletButton'
import { Token } from '@pancakeswap/sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

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
  const { earningToken } = useMemo(() => {
    return {
      earningToken: pool.earningToken,
      arpAddress: pool.arpAddress
    }},[pool])
  const tokenAddress = earningToken?.address || ''
  const { chainId } = useActiveWeb3React()
  const SmartContractIcon: React.FC<SvgProps> = (props) => {
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
  // const [onPresentPayChat] = useModal(<QuizModal title="PayChat" link="https://matrix.to/#/!aGnoPysxAyEOUwXcJW:matrix.org?via=matrix.org" />)
  const SCAN_DOMAIN = {
    56: 'bscscan',
    97: 'testnet.bscscan',
    4002: 'testnet.ftmscan'
  }

  return (
    <Flex flexDirection='column'>
      <Flex flex="1" flexDirection="column" alignSelf="flex-center">
        <Text color="primary" fontSize="14px">
          {t("Bounty Required")} {`->`} {pool?.bountyRequired ? t("True") : t("False")}
        </Text>
        <Text color="primary" fontSize="14px">
          {t("Profile Required")} {`->`} {pool?.profileRequired ? t("True") : t("False")}
        </Text>
        <Text color="primary" fontSize="14px">
          {t("Stake Required")} {`->`} {pool?.stakeRequired}
        </Text>
        <Text color="primary" fontSize="14px">
          {t("Standalone")} {`->`} {parseFloat(pool?.tokenId) ? t("False") : t("True")}
        </Text>
        <Text color="primary" fontSize="14px">
          {t("Only Trusted Auditors")} {`->`} {pool?.onlyTrustWorthyAuditors ?  t("True") : t("False")}
        </Text>
        {/* {pool?.requiredIndentity ?
        <Text color="primary" fontSize="14px">
          {t("Required Indentity")} {`->`} {pool?.requiredIndentity}
        </Text>:null} */}
        <Text color="primary" fontSize="14px">
          {t("Minimum Badge Color")} {`->`} {pool?.minIDBadgeColor}
        </Text>
        {pool?.valueName ?
        <Text color="primary" fontSize="14px">
          {t("Testimony value")} {`->`} {pool.valueName}
        </Text>:null}
        {pool?.collection?.workspace ?
        <Text color="primary" fontSize="14px">
          {t("Workspace")} {`->`} {pool.workspace}
        </Text>:null}
        {pool?.collection?.countries ?
          <Text color="primary" fontSize="14px">
          {t("Countries")} {`->`} {pool.collection.countries}
        </Text>:null}
        {pool?.collection?.cities ?
          <Text color="primary" fontSize="14px">
          {t("Cities")} {`->`} {pool.collection?.cities}
        </Text>:null}
        {pool?.collection?.products ?
          <Text color="primary" fontSize="14px">
          {t("Tags")} {`->`} {pool.collection?.products}
        </Text>:null}
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal href={`https://${SCAN_DOMAIN[chainId]}.com/address/${pool.tokenAddress}`} bold={false} small>
          {t('See Token Info')}
        </LinkExternal>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal href={`https://${SCAN_DOMAIN[chainId]}.com/address/${pool?.owner}`} bold={false} small>
          {t('See Owner Info')}
        </LinkExternal>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal href={`https://${SCAN_DOMAIN[chainId]}.com/address/${pool?.collection?.owner}`} bold={false} small>
          {t('See Admin Info')}
        </LinkExternal>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal href={`/cancan/collections/${pool?.collection?.id}`} bold={false} small>
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
