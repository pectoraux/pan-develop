import { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Text, Flex, Box, Card, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Badge, { BadgeProps } from '@mui/material/Badge';
import NFTMedia from 'views/Nft/market/components/NFTMedia'
import PreviewImage from 'views/Nft/market/components/CollectibleCard/PreviewImage'
import { RoundedImage } from 'views/Nft/market/Collection/IndividualNFTPage/shared/styles';

const CardWrapper = styled(NextLinkFromReactRouter)`
  display: inline-block;
  min-width: 190px;
  margin-left: 16px;
  :hover {
    cursor: pointer;
    opacity: 0.6;
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

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.colors.gradientCardHeader}`,
    padding: '0 4px',
  },
}));

const DataCard: React.FC<any> = ({ sponsor }) => {
  return (
    <CardWrapper to={`/sponsors/${sponsor.id}`}>
      <Flex flexDirection='column' justifyContent='center' alignSelf='center'> 
        <RoundedImage
          width={200}
          height={200}
          src={sponsor?.avatar}
          // alt={sponsor?.id}
          as={PreviewImage}
        />
        <Text fontSize={10} width='200px' style={{ whiteSpace: 'break-spaces' }} >
        {sponsor.sponsorDescription}
        </Text>
      </Flex>
    </CardWrapper>
  )
}

const Cart: React.FC<any> = ({ sponsors }) => {
  const { t } = useTranslation()
  // const topPriceIncrease = useMemo(() => {
  //   return Object.values(allTokens)
  //     .sort(({ data: a }, { data: b }) => {
  //       // eslint-disable-next-line no-nested-ternary
  //       return a && b ? (Math.abs(a?.priceUSDChange) > Math.abs(b?.priceUSDChange) ? -1 : 1) : -1
  //     })
  //     .slice(0, Math.min(20, Object.values(allTokens).length))
  // }, [allTokens])

  const increaseRef = useRef<HTMLDivElement>(null)
  const moveLeftRef = useRef<boolean>(true)

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
  // if (topPriceIncrease.length === 0 || !topPriceIncrease.some((entry) => entry.data)) {
  //   return null
  // }

  return (
    <Card my="6px" style={{ width: "100%" }}> 
      <Text ml="16px" mt="8px" color='primary'>
        {t("Valuepool Sponsors")}
      </Text>
      <ScrollableRow ref={increaseRef}>
        {sponsors.map((sponsor) =>
          <DataCard sponsor={sponsor} />
        )}
      </ScrollableRow>
    </Card>
  )
}

export default Cart
