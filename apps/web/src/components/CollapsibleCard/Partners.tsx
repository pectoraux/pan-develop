import { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Text, Flex, Grid, LinkExternal, Box, Card } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { BNBAmountLabel } from 'views/Nft/market/components/CollectibleCard/styles'
import { CollectionCard } from 'views/Nft/market/components/CollectibleCard'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { AddressZero } from '@ethersproject/constants'

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
`

export const ScrollableRow = styled.div`
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  ::-webkit-scrollbar {
    display: none;
  }
`

const DataCard = ({ paywall, collection }) => {
  const { t } = useTranslation()
  const referrer = collection?.owner?.toLowerCase() !== paywall?.currentSeller?.toLowerCase() ?  collection?.owner : ''
  const link = `${nftsBaseUrl}/collections/${paywall?.collection?.id}/paywall/${paywall?.tokenId}`
  const linkPad = referrer ? `?referrer=${referrer}` : ''
  return (
    <CardWrapper>
      <TopMoverCard>
              <CollectionCard
                key={paywall?.id}
                bgSrc={paywall?.images?.length > 3 && paywall?.images[4]}
                avatarSrc={paywall?.collection?.avatar}
                collectionName={paywall?.tokenId}
              >
                <Flex alignItems="center">
                  <Text fontSize="12px" color="textSubtle">
                    {t('Volume')}
                  </Text>
                  <BNBAmountLabel
                    amount={paywall?.collection?.totalVolumeBNB ? parseFloat(paywall?.collection.totalVolumeBNB) : 0}
                  />
                </Flex>
                <Flex mb="2px" justifyContent='flex-end'>
                  <LinkExternal href={link + linkPad} bold={false} small>
                    {t('See Paywall Page')}
                  </LinkExternal>
                </Flex>
              </CollectionCard>
      </TopMoverCard>
    </CardWrapper>
  )
}

const Cart = ({ paywall, collection }) => {
  const { t } = useTranslation()
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

  return (
    <> 
      <Text ml="16px" mt="8px" color='primary'>
        {t("Partners")}
      </Text>
      <ScrollableRow ref={increaseRef}>
        {paywall?.mirrors?.filter((mirror) => !!mirror.partnerPaywall).map((mirror) =>
          <DataCard paywall={mirror?.partnerPaywall} collection={collection} />
        )}
      </ScrollableRow>
    </>
  )
}

export default Cart
