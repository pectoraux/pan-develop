import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import capitalize from 'lodash/capitalize'
import { Item } from 'views/Nft/market/components/Filters'
import { WORKSPACES, COUNTRIES, CITIES, PRODUCTS2 } from 'config'
import { AddressZero } from '@ethersproject/constants'
import { ListTraitFilter } from './ListTraitFilter'

const ScrollableFlexContainer = styled(Flex)`
  grid-area: attributeFilters;
  flex-direction: column;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-wrap: wrap;
    overflow-x: revert;
  }
`

const Filters: React.FC<any> = ({ nftFilters, setNewFilters, country=false, city=false, product=false }) => {
  const workspaces= Object.entries(WORKSPACES)?.reduce(
    (accum: any, attr: any) => ({
      ...accum,
      Workspace: accum.Workspace 
      ? [...accum.Workspace, {traitType: "Workspace", value: attr[0], count: attr[1]}] 
      : [{traitType: "Workspace", value: attr[0], count: attr[1]}]
    }),
    {} as any,
  )
  const countries = Object.entries(COUNTRIES)?.reduce(
    (accum: any, attr: any) => ({
      ...accum,
      Country: accum.Country 
      ? [...accum.Country, {traitType: "Country", value: attr[0], count: attr[1]}] 
      : [{traitType: "Country", value: attr[0], count: attr[1]}]
    }),
    {} as any,
  )
  const cities = Object.entries(CITIES)?.reduce(
    (accum: any, attr: any) => ({
      ...accum,
      City: accum.City 
      ? [...accum.City, {traitType: "City", value: attr[0], count: attr[1]}] 
      : [{traitType: "City", value: attr[0], count: attr[1]}]
    }),
    {} as any,
  )
  const productsHome = Object.entries(PRODUCTS2)?.reduce(
    (accum: any, attr: any) => ({
      ...accum,
      Product: accum.Product 
      ? [...accum.Product, {traitType: "Product", value: attr[0], count: attr[1]}] 
      : [{traitType: "Product", value: attr[0], count: attr[1]}]
    }),
    {} as any,
  )
  const workspaceItems: Item[] = workspaces.Workspace.map((attr) => ({
    label: attr.value as string,
    count: attr.count ? attr.count : undefined,
    attr,
  }))
  const countryItems: Item[] = countries.Country.map((attr) => ({
    label: attr.value as string,
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
        <ScrollableFlexContainer>
            <ListTraitFilter
              key="workspace"
              title={capitalize("workspace")}
              nftFilters={nftFilters}
              setNewFilters={setNewFilters}
              traitType="workspace"
              items={workspaceItems}
              collectionAddress={AddressZero}
            />
            {country &&
            <ListTraitFilter
              key="country"
              title={capitalize("country")}
              nftFilters={nftFilters}
              setNewFilters={setNewFilters}
              traitType="country"
              items={countryItems}
              collectionAddress={AddressZero}
            />}
            {city &&
            <ListTraitFilter
              key="city"
              nftFilters={nftFilters}
              setNewFilters={setNewFilters}
              title={capitalize("city")}
              traitType="city"
              items={cityItems}
              collectionAddress={AddressZero}
            />}
            {product &&
            <ListTraitFilter
              key="product"
              nftFilters={nftFilters}
              setNewFilters={setNewFilters}
              title={capitalize("product tags")}
              traitType="product"
              items={productItems ?? []}
              collectionAddress={AddressZero}
            />}
        </ScrollableFlexContainer>
        )
}

export default Filters
