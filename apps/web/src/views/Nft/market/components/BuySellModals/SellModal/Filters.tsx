import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Box, ButtonMenu, ButtonMenuItem, Flex, Grid, Text } from '@pancakeswap/uikit'
import capitalize from 'lodash/capitalize'
import isEmpty from 'lodash/isEmpty'
import { useGetNftFilters } from 'state/cancan/hooks'
import { ListTraitFilter } from './ListTraitFilter'
import { ListTraitFilter2 } from './ListTraitFilter2'
import { DatePicker, DatePickerPortal } from 'views/Voting/components/DatePicker'
import { NftAttribute } from 'state/cancan/types'
import { useTranslation } from '@pancakeswap/localization'
import { Item } from 'views/CanCan/market/components/Filters'
import { useAppDispatch } from 'state'
import { WORKSPACES, COUNTRIES2, CITIES2, PAYWALLS, PRODUCTS } from 'config'
import { AddressZero } from '@ethersproject/constants'

interface FiltersProps {
  address: string
  variant: 'product' | 'paywall'
  attributes: NftAttribute[]
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

const FilterByTitle = styled(Text)`
  grid-area: filterByTitle;
`

const FilterByControls = styled(Box)`
  grid-area: filterByControls;
`

const SortByTitle = styled(Text)`
  grid-area: sortByTitle;
`

const SortByControls = styled(Box)`
  grid-area: sortByControls;
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

const Filters: React.FC<any> = ({ 
  variant, 
  nftFilters, 
  setNftFilters, 
  showWorkspace = true,
  showCountry = true, 
  showCity = true, 
  showProduct = true, 
}) => {
  const workspaces = Object.entries(WORKSPACES)?.reduce(
    (accum: any, attr: any) => ({
      ...accum,
      Workspace: accum.Workspace ? [...accum.Workspace, {traitType: "Workspace", value: attr[0], count: attr[1]}] : 
      [{traitType: "Workspace", value: attr[0], count: attr[1]}]
    }),
    {} as any,
  )
  const countries = Object.entries(COUNTRIES2)?.reduce(
    (accum: any, attr: any) => ({
      ...accum,
      Country: nftFilters.workspace ? 
      (accum.Country ? [...accum.Country, {traitType: "Country", value: attr[0], count: attr[1].Total}] : 
      [{traitType: "Country", value: attr[0], count: nftFilters.workspace?.value && attr[1].Workspace ? attr[1].Workspace[nftFilters.workspace?.value] : 0}])
      :(accum.Country ? [...accum.Country, {traitType: "Country", value: attr[0], count: attr[1].Total}] : 
      [{traitType: "Country", value: attr[0], count: attr[1].Total}]),
    }),
    {} as any,
  )
  const cities = Object.entries(CITIES2)?.reduce(
    (accum: any, attr: any) => ({
      ...accum,
      City: nftFilters.workspace ? 
      (accum.City ? [...accum.City, {traitType: "City", value: attr[0], count: attr[1].Total}] : 
      [{traitType: "City", value: attr[0], count: nftFilters.workspace.value && attr[1].Workspace ? attr[1].Workspace[nftFilters.workspace.value] : 0}])
      :(accum.City ? [...accum.City, {traitType: "City", value: attr[0], count: attr[1].Total}] : 
      [{traitType: "City", value: attr[0], count: attr[1].Total}]),
    }),
    {} as any,
  )
  // .filter((item) => nftFilters.workspace ? item[1].Workspace === nftFilters.workspace?.value : true)
  const productsHome = Object.entries(PRODUCTS)?.reduce(
    (accum: any, attr: any) => ({
      ...accum,
      Product: nftFilters.city ? 
      (accum.Product ? [...accum.Product, {traitType: "Product", value: attr[0], count: attr[1].City[nftFilters.city.value]}]:
      [{traitType: "Product", value: attr[0], count: nftFilters.city.value ? attr[1].City[nftFilters.city.value] : 0}]):
      nftFilters.country ? 
      (accum.Product ? [...accum.Product, {traitType: "Product", value: attr[0], count: attr[1].Country[nftFilters.country.value]}]:
      [{traitType: "Product", value: attr[0], count: nftFilters.country.value ? attr[1].Country[nftFilters.country.value] : 0}]): 
      (accum.Product ? [...accum.Product, {traitType: "Product", value: attr[0], count: attr[1].Total}]:
      [{traitType: "Product", value: attr[0], count: attr[1].Total}])
    }),
    {} as any,
  )
  const workspaceItems: Item[] = workspaces.Workspace.map((attr) => ({
    label: attr.value as string,
    count: attr.count ? attr.count : undefined,
    attr,
  }))
  const countryItems: Item[] = countries.Country.map((attr) => ({
    label: capitalize(attr.value as string),
    count: attr.count ? attr.count : undefined,
    attr,
  }))
  const cityItems: Item[] = cities.City.map((attr) => ({
    label: attr.value as string,
    count: attr.count ? attr.count : undefined,
    attr,
  }))
  const productItems: Item[] = productsHome.Product?.map((attr) => ({
    label: attr.value as string,
    count: attr.count ? attr.count : undefined,
    attr,
  }))

  return (
    <>
      <ScrollableFlexContainer>
        {showWorkspace &&
        <ListTraitFilter2
          key="workspace"
          title={capitalize("workspace")}
          traitType="workspace"
          items={workspaceItems}
          nftFilters={nftFilters}
          setNftFilters={setNftFilters}
          collectionAddress={AddressZero}
        />}
        {showCountry &&
        <ListTraitFilter
          key="country"
          title={capitalize("country")}
          traitType="country"
          items={countryItems}
          nftFilters={nftFilters}
          setNftFilters={setNftFilters}
          collectionAddress={AddressZero}
        />}
        {showCity &&
        <ListTraitFilter
          key="city"
          title={capitalize("city")}
          traitType="city"
          items={cityItems}
          nftFilters={nftFilters}
          setNftFilters={setNftFilters}
          collectionAddress={AddressZero}
        />}
        {showProduct &&
        <ListTraitFilter
          key="product"
          title={capitalize("product tags")}
          traitType="product"
          items={productItems ?? []}
          nftFilters={nftFilters}
          setNftFilters={setNftFilters}
          collectionAddress={AddressZero}
        />}
      </ScrollableFlexContainer>
    </>
  )
}

export default Filters
