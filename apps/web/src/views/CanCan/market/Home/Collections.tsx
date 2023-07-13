import { Button, ChevronRightIcon, Flex, Grid, Heading, Text, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import { cancanBaseUrl } from 'views/CanCan/market/constants'
import { Collection } from 'state/cancan/types'
import { useTranslation } from '@pancakeswap/localization'
import { CollectionCard } from '../components/CollectibleCard'
import { BNBAmountLabel } from '../components/CollectibleCard/styles'

const Collections: React.FC<any> = ({
  title,
  testId,
  collections,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" mb="32px">
        <Heading as="h3" scale="lg" data-test={testId}>
          {title}
        </Heading>
        <Button
          as={NextLinkFromReactRouter}
          to={`${cancanBaseUrl}/collections/`}
          variant="secondary"
          minWidth="132px"
          scale="sm"
          endIcon={<ChevronRightIcon color="primary" width="24px" />}
        >
          {t('View All')}
        </Button>
      </Flex>
      <Grid gridGap="16px" gridTemplateColumns={['1fr', '1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} mb="64px">
        {collections?.slice(0, 6).map((collection) => {
          return (
            <CollectionCard
              key={collection?.id}
              bgSrc={collection?.small ?? ''}
              avatarSrc={collection?.avatar ?? ''}
              collectionName={collection?.name ?? ''}
              url={`${cancanBaseUrl}/collections/${collection.id}`}
            >
              <Flex alignItems="center">
                <Text fontSize="12px" color="textSubtle">
                  {t('Volume')}
                </Text>
                <BNBAmountLabel amount={collection?.totalVolumeBNB ? parseFloat(collection?.totalVolumeBNB) : 0} />
              </Flex>
            </CollectionCard>
          )
        })}
      </Grid>
    </>
  )
}

export default Collections
