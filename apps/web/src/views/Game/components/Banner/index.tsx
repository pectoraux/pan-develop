import Image from 'next/image'
import styled from 'styled-components'
import { useMemo } from 'react'
import { Flex, Box, Text, useModal, Link, LinkExternal, Balance, IconButton } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useWeb3React } from '@pancakeswap/wagmi'
import StakeToWinButton from 'views/Game/components/Banner/StakeToWinButton'
import { OutlineText, DarkTextStyle } from 'views/Game/components/TextStyle'
import TicketsDecorations from 'views/Game/components/Banner/TicketsDecorations'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { usePotteryData } from 'state/pottery/hook'
import AvatarImage from 'views/CanCan/market/components/BannerHeader/AvatarImage'
import StyledBannerImageWrapper from 'views/CanCan/market/components/BannerHeader/BannerImage'
import MintButton from '../Pot/Deposit/MintButton'
import WebPageModal from '../WebPageModal'

const PotteryBanner = styled(Flex)`
  position: relative;
  overflow: hidden;
  padding: 64px 0 75px 0;
  background: linear-gradient(180deg, #ffd800 0%, #fdab32 100%);

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 87px 0 148px 0;
  }
`

const Decorations = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url(/images/pottery/bg-star.svg);
  background-repeat: no-repeat;
  background-position: center 0;
  background-size: cover;
  pointer-events: none;
`

const BannerBunny = styled.div`
  width: 221px;
  height: 348px;
  margin: 63px auto auto auto;
  background: url(/images/pottery/banner-bunny.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 1;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 370px;
    height: 549px;
    margin-top: 0;
  }
`

const BalanceStyle = styled(Balance)`
  padding: 0 2px;
  color: ${({ theme }) => theme.colors.secondary};
  background: #ffffff;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-stroke: 8px transparent;
  text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2), 0px 4px 12px rgba(14, 14, 44, 0.1);
`

interface BannerProps {
  handleScroll: () => void
}

const Banner: React.FC<any> = ({ collection, handleScroll }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  // const cakePriceBusd = usePriceCakeBusd()
  const { data } = usePotteryData()
  const symb = ` ${data?.token?.symbol?.toUpperCase() ?? '$'}`
  console.log("ball==============>", data)
  const userTickets = useMemo(() => {
    return data?.accounts?.filter((protocol) => protocol.owner?.toLowerCase() === account?.toLowerCase())
  }, [
    data, 
    account
  ])
  // const prizeInBusd = publicData.totalPrize.times(cakePriceBusd)
  const prizeTotal = getBalanceNumber(data?.totalPaid ?? 0, data?.token?.decimals ?? 18)
  const pricePerMinutes = getBalanceNumber(data?.pricePerMinutes ?? 0, data?.token?.decimals ?? 18)
  const [onPresentLink] = useModal(
    <WebPageModal 
      width="4px"
      height="500px"
      title={collection?.name ?? ''} 
      link="https://meet.jit.si/VocalLawyersSpanOk"
      // link={collection.telegramUrl} 
    />
  )

  return (
    <>
    <Flex flexDirection="column">
      <Box position="relative" pb="26px">
        <StyledBannerImageWrapper>
          <Image src={collection?.large ?? ''} layout="fill" objectFit="cover" priority />
        </StyledBannerImageWrapper>
        <Box position="absolute" bottom={0} left={-4}>
          <Flex alignItems="flex-end">
            <AvatarImage src={collection?.avatar ?? ''} />
          </Flex>
        </Box>
      </Box>
    </Flex>
    <Flex>
      <OutlineText
        mb="4px"
        fontSize={['20px', '20px', '20px', '20px', '24px']}
        style={{ alignSelf: 'flex-end' }}
        bold
        defaultType
      >
        {collection?.description}
      </OutlineText>
    </Flex>
    <PotteryBanner>
      <Decorations />
      <TicketsDecorations />
      <Flex
        margin="auto"
        style={{ zIndex: '1' }}
        flexDirection={['column-reverse', 'column-reverse', 'column-reverse', 'row']}
      >
        <BannerBunny />
        <Flex
          ml={['0', '0', '0', '46px']}
          flexDirection="column"
          alignItems={['center', 'center', 'center', 'flex-start']}
        >
          <Flex>
            <OutlineText
              mb="4px"
              fontSize={['20px', '20px', '20px', '20px', '24px']}
              style={{ alignSelf: 'flex-end' }}
              bold
              defaultType
            >
              {t('Play')}
            </OutlineText>
          <OutlineText fontSize={['24px', '24px', '24px', '24px', '32px']} bold ml="4px">
            {collection?.name ?? ''}
          </OutlineText>
          </Flex>
          <BalanceStyle bold unit={` ${symb}`} value={prizeTotal || 0} decimals={0} fontSize={['40px', '64px']} />
          <DarkTextStyle m="-16px 0 0 0" fontSize={['32px', '40px']} bold>
            {t('To be won !')}
          </DarkTextStyle>
          <StakeToWinButton handleScroll={handleScroll} />
          {/* {data?.claimable ? (
            <LockTimer lockTime={999223998} />
          ) : null} */}
          {data?.pricePerMinutes ?
            <Box style={{ marginTop: '30px' }}>
            <Text color="white" bold as="span">
              {t('Deposit %val% %symb% for', { val: pricePerMinutes, symb })}
            </Text>
            <DarkTextStyle ml="3px" bold as="span">
              {t('1 Minute')}
            </DarkTextStyle>
          </Box>:null}
          <Box>
            <Text color="white" bold as="span">
              {t('Play the game, get a score before')}
            </Text>
            <DarkTextStyle ml="3px" bold as="span">
              {t('the end of the deadline!')}
            </DarkTextStyle>
          </Box>
          <Box>
            <Text color="white" bold as="span">
              {t('Your earnings can then')}
            </Text>
            <DarkTextStyle ml="3px" bold as="span">
              {t('be claimed back here')}
            </DarkTextStyle>
          </Box>
          <Box>
            <Text color="white" bold as="span">
              {t('Join')}
            </Text>
            <DarkTextStyle ml="3px" bold as="span">
              {t('%num% other players', { num: data?.numPlayers ?? 0 })}
            </DarkTextStyle>
          </Box>
          <Box>
            <Text color="white" bold as="span">
              {t('Total Game Score')}
            </Text>
            <DarkTextStyle ml="3px" bold as="span">
              {data?.totalScore ?? 0}
            </DarkTextStyle>
          </Box>
          <Box>
            <Text color="white" bold as="span">
              {t('Total Game Earnings')}
            </Text>
            <DarkTextStyle ml="3px" bold as="span">
              {`${data?.totalEarned ?? 0} ${symb}`}
            </DarkTextStyle>
          </Box>
          {account ? 
          <Box>
            <Text color="white" bold as="span">
              {t('You have')}
            </Text>
            <DarkTextStyle ml="3px" bold as="span">
              {`${userTickets?.length ?? 0} tickets`}
            </DarkTextStyle>
          </Box>:null}
          {/* <BannerTimer /> */}
          <Flex mb="2px" justifyContent='flex-start'>
            <LinkExternal bold={false} small>
              {true && (
                <IconButton as={Link} style={{ cursor: "pointer" }} 
                onClick={onPresentLink}
                >
                  {t('Play Game')}
                </IconButton>
              )}
            </LinkExternal>
          </Flex>
          <MintButton collectionId={collection?.id} />
        </Flex>
      </Flex>
    </PotteryBanner>
    </>  
  )
}

export default Banner
