/* eslint-disable jsx-a11y/anchor-is-valid */
import { useCallback, useState } from 'react'
import { AddressZero } from '@ethersproject/constants'
import { BunnyPlaceholderIcon, Spinner, LinkExternal, Link, AutoRenewIcon, Button, Flex, Grid, Text, useModal, Dots } from '@pancakeswap/uikit'
import { Collection } from 'state/cancan/types'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { useGetPaywallARP, useGetSubscriptionStatus, useGetNftShowOnlyUsers, useGetNftShowOnlyOnSale } from 'state/cancan/hooks'
import ConnectWalletButton from 'components/ConnectWalletButton'
import CollapsibleCard from 'components/CollapsibleCard'
import { FetchStatus } from 'config/constants/types'
import NFTMedia from 'views/CanCan/market/components/NFTMedia'
import { CollectibleLinkCard, CollectionCard } from 'views/CanCan/market/components/CollectibleCard'
import { useCollectionNfts } from 'views/CanCan/market/hooks/useCollectionNfts'
import { BNBAmountLabel } from 'views/CanCan/market/components/CollectibleCard/styles'
import BuyModal from 'views/CanCan/market/components/BuySellModals/BuyModal'
import OptionFilters from 'views/CanCan/market/components/BuySellModals/BuyModal/OptionFilters'
import { cancanBaseUrl } from 'views/CanCan/market/constants'
import AddReferralModal from 'views/CanCan/market/Collection/AddReferralModal'
import CloseReferralModal from 'views/CanCan/market/Collection/CloseReferralModal'
import AddItemModal from 'views/CanCan/market/Collection/AddItemModal'
import AddPartnerModal from 'views/CanCan/market/Collection/AddPartnerModal'
import RemoveItemModal from 'views/CanCan/market/Collection/RemoveItemModal'
import SubscribeModal from 'views/CanCan/market/Collection/SubscribeModal'
import UnregisterModal from 'views/CanCan/market/Collection/UnregisterModal'
import GridPlaceholder from 'views/CanCan/market/components/GridPlaceholder'


interface CollectionNftsProps {
  collection: Collection
  displayText: string
}

const CollectionNfts: React.FC<any> = ({ collection, displayText }) => {
  const { owner, id } = collection || {}
  const { t } = useTranslation()
  const { nfts, isFetchingNfts, page, setPage, resultSize, isLastPage } = useCollectionNfts(id)
  const showOnlyNftsUsers = useGetNftShowOnlyUsers(id)
  const showOnlyNftsOnSale = useGetNftShowOnlyOnSale(id)
  const [currentPartner, setCurrentPartner] = useState(null)
  const [userCollectionId, setUserCollectionId] = useState(null)
  const [userBountyId, setUserBountyId] = useState(null)
  const [onPresentUnregister] = useModal(<UnregisterModal collectionId={id} userBountyId={userBountyId} userCollectionId={userCollectionId} />,)
  console.log("nfts=================>", nfts, collection)
  const handleLoadMore = useCallback(() => {
    setPage(page + 1)
  }, [setPage, page])

  if ((!nfts || nfts?.length === 0) && isFetchingNfts) {
    return <GridPlaceholder />
  }

  return (
    <>
      <Flex p="16px">
        <Text bold>
        {!Number.isNaN(resultSize) ?<>
          {displayText}{" -> "}{resultSize} {t('Result(s)')}</>
        :<Dots>{t('Loading')}</Dots>}
        </Text>
      </Flex>
      {showOnlyNftsOnSale && currentPartner ?
      <CollapsibleCard 
        key={currentPartner.id} 
        title={`${currentPartner.partnerCollection.name} -> ${currentPartner.mirrors?.filter((mirror) => !mirror.partner)?.length ?? 0} ${t('Result(s)')}`}
        mb="32px">
        <Content owner={collection.owner} registration={currentPartner} />
      </CollapsibleCard>: null}
      {!showOnlyNftsOnSale && !showOnlyNftsUsers && collection?.paywalls?.map((paywall) => {
          return (
            <CollapsibleCard 
              key={paywall.id}
              paywall={paywall}
              collection={collection}
              title={`${paywall?.tokenId} -> ${paywall.mirrors?.length} ${t('Result(s)')}`}
              mb="32px">
              <Paywall collection={collection} paywall={paywall} />
            </CollapsibleCard>
          )
        })}
      {nfts.length > 0 && !showOnlyNftsOnSale && !showOnlyNftsUsers ? (
        <>
          <Grid
            gridGap="16px"
            gridTemplateColumns={['1fr', null, 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
            alignItems="start"
          >
            {nfts.map((nft: any) => {
              const currentAskPriceAsNumber = nft && parseFloat(nft?.currentAskPrice)

              return (
                <CollectibleLinkCard
                  key={nft?.tokenId}
                  nft={nft}
                  referrer={owner?.toLowerCase() !== nft?.currentSeller?.toLowerCase() &&  nft?.currentSeller}
                  currentAskPrice={currentAskPriceAsNumber > 0 ? currentAskPriceAsNumber : undefined}
                />
              )
            })}
          </Grid>
          <Flex mt="60px" mb="12px" justifyContent="center">
            {!isLastPage && (
              <Button
                onClick={handleLoadMore}
                scale="sm"
                disabled={isFetchingNfts}
                endIcon={isFetchingNfts ? <AutoRenewIcon spin color="currentColor" /> : undefined}
              >
                {isFetchingNfts ? t('Loading') : t('Load more')}
              </Button>
            )}
          </Flex>
        </>
      ) : showOnlyNftsOnSale && collection.partnerRegistrations?.length > 0 ? (
        collection.partnerRegistrations.filter((registration) => registration.active && registration.partnerCollection?.id)
        .map((registration) => {
          return <Grid gridGap="16px" 
                  onClick={() => {
                    if (currentPartner && currentPartner.id === registration.id) {
                      setCurrentPartner(null)
                    } else {
                      setCurrentPartner(registration)
                    }
                  }}
                  gridTemplateColumns={['1fr', '1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} mb="64px">
                    <CollectionCard
                      key={registration.partnerCollection?.id}
                      bgSrc={registration.partnerCollection?.small}
                      avatarSrc={registration.partnerCollection?.avatar}
                      collectionName={registration.partnerCollection?.name}
                    >
                      <Flex alignItems="center">
                        <Text fontSize="12px" color="textSubtle">
                          {t('Volume')}
                        </Text>
                        <BNBAmountLabel
                          amount={registration.partnerCollection.totalVolumeBNB ? parseFloat(registration.partnerCollection.totalVolumeBNB) : 0}
                        />
                      </Flex>
                      <Flex mb="2px" justifyContent='flex-end'>
                        <LinkExternal href={`${cancanBaseUrl}/collections/${registration.partnerCollection.id}`} bold={false} small>
                          {t('See Channel')}
                        </LinkExternal>
                      </Flex>
                    </CollectionCard>
                  </Grid>
        })
      ): showOnlyNftsUsers && collection.registrations?.length > 0 ? (
        collection.registrations.filter((registration) => registration.active)
        .map((registration) => {
          return <Grid gridGap="16px" 
                    gridTemplateColumns={['1fr', '1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} mb="64px">
                    <CollectionCard
                      key={registration.userCollection?.id}
                      bgSrc={registration.userCollection?.small}
                      avatarSrc={registration.userCollection?.avatar}
                      collectionName={registration.userCollection?.name}
                    >
                      <Flex alignItems="center">
                        <Text fontSize="12px" color="textSubtle">
                          {t('Volume')}
                        </Text>
                        <BNBAmountLabel
                          amount={registration.userCollection?.totalVolumeBNB ? parseFloat(registration.userCollection.totalVolumeBNB) : 0}
                        />
                      </Flex>
                      <Flex mb="2px" justifyContent='flex-start'>
                        <Link onClick={() => {
                            setUserCollectionId(registration.userCollection?.id)
                            setUserBountyId(registration.bountyId)
                            onPresentUnregister()
                          }} 
                          color='failure' 
                          mr="18px" 
                          style={{ cursor: 'pointer' }} 
                          bold={false} 
                          small
                        >
                          {t('Unregister')}
                        </Link>
                        <LinkExternal href={`${cancanBaseUrl}/collections/${registration.userCollection?.id}`} bold={false} small>
                          {t('See Channel')}
                        </LinkExternal>
                      </Flex>
                    </CollectionCard>
                  </Grid>
        })
      ) : (
        <Flex alignItems="center" py="48px" flexDirection="column">
          <BunnyPlaceholderIcon width="96px" mb="24px" />
          <Text fontWeight={600}>{t('No items found')}</Text>
        </Flex>
      )}
    </>
  )
}

const Content: React.FC<any> = ({ owner, registration }) => {
  const { t } = useTranslation()
  const [onPresentAddReferral] = useModal(<AddReferralModal registration={registration} />,)
  const [onPresentCloseReferral] = useModal(<CloseReferralModal registration={registration} />,)
  
  return registration.mirrors?.length > 0 ? (
    <Flex flexDirection="column">
      <Flex flexDirection="row" justifyContent="center">
        <Button mt="5px" onClick={onPresentAddReferral}>
          {t('Add')}
        </Button>
        <Button mt="5px" variant='danger' ml="18px" onClick={onPresentCloseReferral}>
          {t('Remove')}
        </Button>
      </Flex>
      <Grid
        style={{ padding: '20px' }}
        gridGap="16px"
        gridTemplateColumns={['1fr', null, 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
        alignItems="start"
      >
          {registration.mirrors?.map((reg) => {
            const nft = reg.item
            const currentAskPriceAsNumber = nft && parseFloat(nft?.currentAskPrice)
            return (
              <CollectibleLinkCard
                key={nft?.tokenId}
                nft={nft}
                referrer={owner?.toLowerCase() !== nft?.currentSeller?.toLowerCase() &&  nft?.currentSeller}
                currentAskPrice={currentAskPriceAsNumber > 0 ? currentAskPriceAsNumber : undefined}
              />
            )})}
      </Grid>
    </Flex>
  ) : (
    <Flex alignItems="center" py="48px" flexDirection="column">
      <BunnyPlaceholderIcon width="96px" mb="24px" />
      <Button onClick={onPresentAddReferral}>
        {t('Add')}
      </Button>
      <Text fontWeight={600}>{t('This wall is empty')}</Text>
    </Flex>
  )
}

const Paywall: React.FC<any> = ({ collection, paywall }) => {
  console.log("paywall======================>", paywall)
  const { t } = useTranslation()
  const  { account } = useWeb3React()
  // const paywallARP = useGetPaywallARP(collection?.id ?? '', paywall?.id ?? '')
  const paywallARP = useGetPaywallARP(paywall?.collection?.id ?? '') as any as any
  const [nfticketId, setNfticketId] = useState('')
  const { ongoingSubscription, status } = useGetSubscriptionStatus(paywallARP?.paywallAddress ?? '', account ?? '', nfticketId ?? '', paywall?.tokenId ?? '')
  const isAdmin = paywall?.currentSeller?.toLowerCase() === account?.toLowerCase()
  const [onPresentAddItem] = useModal(<AddItemModal collection={collection} paywall={paywall} />,)
  const [onPresentAddItem2] = useModal(<AddItemModal partner collection={collection} paywall={paywall} />,)
  const [onPresentPartner] = useModal(<AddPartnerModal partner collection={collection} paywall={paywall} paywallARP={paywallARP} />,)
  const [onPresentRemoveItem] = useModal(<RemoveItemModal collection={collection} paywall={paywall} />,)
  const [onPresentSubscribe] = useModal(<SubscribeModal collection={collection} paywall={paywall} />,)
  const [onPresentBuySubscription] = useModal(<BuyModal variant='paywall' nftToBuy={paywall} />)
  const options = paywall?.option_categories?.map((cat, index) => {
    return {
      "id": `${index}`,
      "category": `${cat}`,
      "element": `${paywall?.option_elements && paywall?.option_elements[index]}`,
      "traitType": `${paywall?.option_traitTypes && paywall?.option_traitTypes[index]}`,
      "value": `${paywall?.option_values && paywall?.option_values[index]}`,
      "min": `${paywall?.option_mins && paywall?.option_mins[index]}`,
      "max": `${paywall?.option_maxs && paywall?.option_maxs[index]}`,
      "unitPrice": `${paywall?.option_unitPrices && paywall?.option_unitPrices[index]}`,
      "currency": `${paywall?.option_currencies && paywall?.option_currencies[index]}`,
    }
  }) || []

  if (!account) {
    return <Flex justifyContent='center' alignItems='center' mt="18px" mb="18px">
            <ConnectWalletButton scale='sm' />
           </Flex>
  }

  if (status === FetchStatus.Fetching ) {
    return <Flex justifyContent='center' alignItems='center' mt="18px" mb="18px">
              <Spinner size={50} />
            </Flex>
  }

  return isAdmin && paywall?.mirrors?.length > 0 ? (
    <Flex flexDirection="column">
      <Flex flexDirection="row" justifyContent="center">
        <Button mt="5px" onClick={onPresentAddItem}>
          {t('Add')}
        </Button>
        <Button mt="5px" variant='success' onClick={onPresentPartner}>
          {t('Add Partner')}
        </Button>
        <Button mt="5px" variant='danger' onClick={onPresentRemoveItem}>
          {t('Remove')}
        </Button>
      </Flex>
      <Grid
        style={{ padding: '20px' }}
        gridGap="16px"
        gridTemplateColumns={['1fr', null, 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
        alignItems="start"
      >
          {paywall.mirrors.filter((mirror) => !!mirror.item).map((mirror) => {
            const nft = mirror.item
            const currentAskPriceAsNumber = nft && parseFloat(nft?.currentAskPrice)
            return (
              <CollectibleLinkCard
                key={nft?.tokenId}
                nft={nft}
                referrer={mirror?.partner && collection?.owner?.toLowerCase() !== nft?.currentSeller?.toLowerCase() ?  collection?.owner : AddressZero}
                currentAskPrice={currentAskPriceAsNumber > 0 ? currentAskPriceAsNumber : undefined}
              />
            )})}
      </Grid>
    </Flex>
  ) : !isAdmin ? ( 
    <Flex alignItems="center" py="48px" flexDirection="column">
      <Flex flex="2" justifyContent={['center', null, 'flex-end']} alignItems="center" maxWidth={440}>
        <NFTMedia key={paywall.tokenId} nft={paywall} width={440} height={440} />
      </Flex>
      <Flex justifyContent='center' alignItems="center" ml="10px" flexDirection="column">
        <LinkExternal href={`${cancanBaseUrl}/collections/${collection?.id}/paywall/${paywall?.tokenId}`} bold>
          {t('View Paywall')}
        </LinkExternal>
      </Flex>
      {!ongoingSubscription ?
        <Flex alignItems="center" flexDirection="column">
          {paywall?.option_mins?.length ?
            <>
            <Text textTransform="uppercase" mt={['16px', '16px', '48px']} textAlign="center" color="textSubtle" fontSize="12px" bold>
              {t('Customize your order')}
            </Text>
            <Flex justifyContent='center' alignItems='center'>
              <OptionFilters address={account} options={options} />
            </Flex>
            </>:null}
          <Flex alignItems="center" flexDirection="row">
            <Button 
              mr="18px"
              variant='success'
              onClick={onPresentBuySubscription}
            >
              {t('Buy Subscription')}
            </Button>
            <Button onClick={onPresentSubscribe}>
              {t('Start Subscription')}
            </Button>
          </Flex>
        </Flex>:null}
        {!paywall?.canPublish ?
          <Flex alignItems="center" mt="18px" flexDirection="row">
            <Button mr="18px" onClick={onPresentAddItem2}>
              {t('Add')}
            </Button>
            <Button variant='success' onClick={onPresentPartner}>
              {t('Partner')}
            </Button>
          </Flex>:null}
    </Flex>
    ):(
    <Flex alignItems="center" py="48px" flexDirection="column">
      <Flex flex="2" justifyContent={['center', null, 'flex-end']} alignItems="center" maxWidth={440}>
        <NFTMedia key={paywall.tokenId} nft={paywall} width={440} height={440} />
      </Flex>
      <Flex justifyContent='center' alignItems="center" ml="10px" flexDirection="column">
        <LinkExternal href={`${cancanBaseUrl}/collections/${collection?.id}/paywall/${paywall?.tokenId}`} bold>
          {t('View Paywall')}
        </LinkExternal>
      </Flex>
      <Button mb="18px" onClick={onPresentAddItem}>
        {t('Add')}
      </Button>
      <Button variant='success' onClick={onPresentPartner}>
          {t('Add Partner')}
        </Button>
      <Text fontWeight={600}>{t('Paywall is empty')}</Text>
    </Flex>
  )
}

export default CollectionNfts
