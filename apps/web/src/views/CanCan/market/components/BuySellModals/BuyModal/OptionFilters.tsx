import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Flex, Grid } from '@pancakeswap/uikit'
import capitalize from 'lodash/capitalize'
import isEmpty from 'lodash/isEmpty'
import { useGetNftFilters, useGetNftShowOnlyOnSale } from 'state/cancan/hooks'
import { NftAttribute } from 'state/cancan/types'
import { useNftStorage } from 'state/cancan/storage'
import { Item, ListTraitFilter } from './Filters'
// import useGetCollectionDistribution from '../../hooks/useGetCollectionDistribution'
import ClearAllButton from '../../../Collection/Items/ClearAllButton'
// import SortSelect from './SortSelect'

interface FiltersProps {
  address: string
  options: NftAttribute[]
}

const GridContainer = styled(Grid)`
  margin-bottom: 16px;
  padding: 0 16px;
  grid-gap: 8px 16px;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    'filterByTitle .'
    'attributeFilters attributeFilters'
    '. sortByTitle'
    'filterByControls sortByControls';
  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas:
      'filterByTitle . .'
      'attributeFilters attributeFilters attributeFilters'
      '. . sortByTitle'
      'filterByControls . sortByControls';
  }
  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 2fr 5fr 1fr;
    grid-template-areas:
      'filterByTitle . .'
      'filterByControls attributeFilters attributeFilters'
      '. . sortByTitle'
      '. . sortByControls';
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: 1.3fr 5fr 1fr;
    grid-template-areas:
      'filterByTitle . sortByTitle'
      'filterByControls attributeFilters sortByControls';
  }
  ${({ theme }) => theme.mediaQueries.xxl} {
    grid-template-columns: 1fr 5fr 1fr;
  }
`

const ScrollableFlexContainer = styled(Flex)`
  grid-area: attributeFilters;
  align-items: center;
  flex: 1;
  flex-wrap: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-wrap: wrap;
    overflow-x: revert;
  }
`

const Filters: React.FC<any> = ({ address, options }) => {
  // const { data } = useGetCollectionDistribution(address)

  const nftFilters = useGetNftFilters(address)
  const attrsByType: Record<string, NftAttribute[]> = options?.reduce(
    (accum: any, attr: any) => ({
      ...accum,
      [attr.traitType]: accum[attr.traitType] ? [...accum[attr.traitType], attr] : [attr],
    }),
    {},
  )
  const uniqueTraitTypes = attrsByType ? Object.keys(attrsByType) : []

  return (
    <GridContainer>
      <ScrollableFlexContainer>
        {uniqueTraitTypes.map((traitType) => {
          const attrs = attrsByType[traitType]
          const items: Item[] = attrs.map((attr) => ({
            label: capitalize(attr.value as string),
            count: 0,
            attr,
          }))

          return (
            <ListTraitFilter
              key={traitType}
              title={capitalize(traitType)}
              traitType={traitType}
              items={items}
              collectionAddress={address}
            />
          )
        })}
        {!isEmpty(nftFilters) && <ClearAllButton collectionAddress={address} mb="4px" />}
      </ScrollableFlexContainer>
    </GridContainer>
  )
}

export default Filters
