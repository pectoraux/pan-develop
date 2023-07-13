// import { useEffect, useState } from 'react'
// import styled from 'styled-components'
// import { Box, ButtonMenu, ButtonMenuItem, Flex, Grid, Text } from '@pancakeswap/uikit'
// import capitalize from 'lodash/capitalize'
// import isEmpty from 'lodash/isEmpty'
// import { useGetCollectionFilters } from 'state/cancan/hooks'
// import { NftAttribute } from 'state/marketPlace/types'
// import { useTranslation } from '@pancakeswap/localization'
// import { Item, HomeListTraitFilter, ClearAllButton } from '../components/Filters'
// import { useAppDispatch } from 'state'
// import useGetCollectionDistribution from '../hooks/useGetCollectionDistribution'
// import SortSelect from '../Collection/Items/SortSelect'
// import { WORKSPACES, COUNTRIES2, CITIES2, PAYWALLS, PRODUCTS } from 'config'
// import { AddressZero } from '@ethersproject/constants'
// import { setSocialCollectionFilters } from 'state/mk/reducer'

// interface FiltersProps {
//   address: string
//   attributes: NftAttribute[]
// }

// const GridContainer = styled(Grid)`
//   margin-bottom: 16px;
//   padding: 0 16px;
//   grid-gap: 8px 16px;
//   grid-template-columns: 1fr 1fr;
//   grid-template-areas:
//     'filterByTitle .'
//     'attributeFilters attributeFilters'
//     '. sortByTitle'
//     'filterByControls sortByControls';
//   ${({ theme }) => theme.mediaQueries.sm} {
//     grid-template-columns: 1fr 1fr 1fr;
//     grid-template-areas:
//       'filterByTitle . .'
//       'attributeFilters attributeFilters attributeFilters'
//       '. . sortByTitle'
//       'filterByControls . sortByControls';
//   }
//   ${({ theme }) => theme.mediaQueries.md} {
//     grid-template-columns: 2fr 5fr 1fr;
//     grid-template-areas:
//       'filterByTitle . .'
//       'filterByControls attributeFilters attributeFilters'
//       '. . sortByTitle'
//       '. . sortByControls';
//   }
//   ${({ theme }) => theme.mediaQueries.lg} {
//     grid-template-columns: 1.3fr 5fr 1fr;
//     grid-template-areas:
//       'filterByTitle . sortByTitle'
//       'filterByControls attributeFilters sortByControls';
//   }
//   ${({ theme }) => theme.mediaQueries.xxl} {
//     grid-template-columns: 1fr 5fr 1fr;
//   }
//   padding-left: 0px;

// `

// const FilterByTitle = styled(Text)`
//   grid-area: filterByTitle;
// `

// const FilterByControls = styled(Box)`
//   grid-area: filterByControls;
// `

// const SortByTitle = styled(Text)`
//   grid-area: sortByTitle;
// `

// const SortByControls = styled(Box)`
//   grid-area: sortByControls;
// `

// const ScrollableFlexContainer = styled(Flex)`
//   grid-area: attributeFilters;
//   align-items: center;
//   flex: 1;
//   flex-wrap: nowrap;
//   overflow-x: auto;
//   -webkit-overflow-scrolling: touch;

//   ${({ theme }) => theme.mediaQueries.md} {
//     flex-wrap: wrap;
//     overflow-x: revert;
//   }
// `
// const colDat = {
//   Workspace: {
//       "HealthCare": 1177,
//       "Construction": 1331,
//       "Education": 1211,
//       "SW & Data": 1241,
//       "Religion": 1028,
//       "Spiritual": 806,
//       "Finance": 1055,
//       "Beauty": 815,
//       "Labor": 1336
//   },
//   Country: {
//     "Togo": {
//       Total: 1,
//       Workspace: {
//         "HealthCare": 1187,
//         "Construction": 1331,
//         "Education": 1211,
//         "SW & Data": 1241,
//         "Religion": 1028,
//         "Spiritual": 806,
//         "Finance": 1055,
//         "Beauty": 815,
//         "Labor": 1336
//       },
//     },
//     "Ghana": {
//       Total: 1,
//       Workspace: {
//         "HealthCare": 1177,
//         "Construction": 1331,
//         "Education": 1211,
//         "SW & Data": 1241,
//         "Religion": 1028,
//         "Spiritual": 806,
//         "Finance": 1055,
//         "Beauty": 815,
//         "Labor": 1336
//       },
//     },
//     "Rwanda": {
//       Total: 1,
//       Workspace: {
//         "HealthCare": 1177,
//         "Construction": 1331,
//         "Education": 1211,
//         "SW & Data": 1241,
//         "Religion": 1028,
//         "Spiritual": 806,
//         "Finance": 1055,
//         "Beauty": 815,
//         "Labor": 1336
//       },
//     },
//     "Burkina Faso": {
//       Total: 1,
//       Workspace: {
//         "HealthCare": 1177,
//         "Construction": 1331,
//         "Education": 1211,
//         "SW & Data": 1241,
//         "Religion": 1028,
//         "Spiritual": 806,
//         "Finance": 1055,
//         "Beauty": 815,
//         "Labor": 1336
//       },
//     },
//     "Cote d'Ivoire": {
//       Total: 8,
//       Workspace: {
//         "HealthCare": 1177,
//         "Construction": 1331,
//         "Education": 1211,
//         "SW & Data": 1241,
//         "Religion": 1028,
//         "Spiritual": 806,
//         "Finance": 1055,
//         "Beauty": 815,
//         "Labor": 1336
//       },
//     },
//     "USA": {
//       Total: 8,
//       Workspace: {
//         "HealthCare": 1177,
//         "Construction": 1331,
//         "Education": 1211,
//         "SW & Data": 1241,
//         "Religion": 1028,
//         "Spiritual": 806,
//         "Finance": 1055,
//         "Beauty": 815,
//         "Labor": 1336
//       },
//     },
//     "France": {
//       Total: 5,
//       Workspace: {
//         "HealthCare": 1177,
//         "Construction": 1331,
//         "Education": 1211,
//         "SW & Data": 1241,
//         "Religion": 1028,
//         "Spiritual": 806,
//         "Finance": 1055,
//         "Beauty": 815,
//         "Labor": 1336
//       },
//     },
//     "Cameroon": {
//       Total: 5,
//       Workspace: {
//         "HealthCare": 1177,
//         "Construction": 1331,
//         "Education": 1211,
//         "SW & Data": 1241,
//         "Religion": 1028,
//         "Spiritual": 806,
//         "Finance": 1055,
//         "Beauty": 815,
//         "Labor": 1336
//       },
//     },
//     "Nigeria": {
//       Total: 6,
//       Workspace: {
//         "HealthCare": 1177,
//         "Construction": 1331,
//         "Education": 1211,
//         "SW & Data": 1241,
//         "Religion": 1028,
//         "Spiritual": 806,
//         "Finance": 1055,
//         "Beauty": 815,
//         "Labor": 1336
//       },
//     },
//   },
//   City: {
//     "Lome, Togo": {
//       Total: 7,
//       Workspace: {
//         "HealthCare": 1177,
//         "Construction": 1331,
//         "Education": 1211,
//         "SW & Data": 1241,
//         "Religion": 1028,
//         "Spiritual": 806,
//         "Finance": 1055,
//         "Beauty": 815,
//         "Labor": 1336
//       },
//     },
//     "Accra, Ghana": {
//       Total: 1,
//       Workspace: {
//         "HealthCare": 1177,
//         "Construction": 1331,
//         "Education": 1211,
//         "SW & Data": 1241,
//         "Religion": 1028,
//         "Spiritual": 806,
//         "Finance": 1055,
//         "Beauty": 815,
//         "Labor": 1336
//       },
//     },
//     "Kigali, Rwanda": {
//       Total: 1,
//       Workspace: {
//         "HealthCare": 1177,
//         "Construction": 1331,
//         "Education": 1211,
//         "SW & Data": 1241,
//         "Religion": 1028,
//         "Spiritual": 806,
//         "Finance": 1055,
//         "Beauty": 815,
//         "Labor": 1336
//       },
//     },
//     "Ouagadougou, Burkina Faso": {
//       Total: 1,
//       Workspace: {
//         "HealthCare": 1177,
//         "Construction": 1331,
//         "Education": 1211,
//         "SW & Data": 1241,
//         "Religion": 1028,
//         "Spiritual": 806,
//         "Finance": 1055,
//         "Beauty": 815,
//         "Labor": 1336
//       },
//     },
//     "Abidjan, Cote d'Ivoire": {
//       Total: 8,
//       Workspace: {
//         "HealthCare": 1177,
//         "Construction": 1331,
//         "Education": 1211,
//         "SW & Data": 1241,
//         "Religion": 1028,
//         "Spiritual": 806,
//         "Finance": 1055,
//         "Beauty": 815,
//         "Labor": 1336
//       },
//     },
//     "Washington, USA": {
//       Total: 6,
//       Workspace: {
//         "HealthCare": 1177,
//         "Construction": 1331,
//         "Education": 1211,
//         "SW & Data": 1241,
//         "Religion": 1028,
//         "Spiritual": 806,
//         "Finance": 1055,
//         "Beauty": 815,
//         "Labor": 1336
//       },
//     },
//     "Paris, France": {
//       Total: 1,
//       Workspace: {
//         "HealthCare": 1177,
//         "Construction": 1331,
//         "Education": 1211,
//         "SW & Data": 1241,
//         "Religion": 1028,
//         "Spiritual": 806,
//         "Finance": 1055,
//         "Beauty": 815,
//         "Labor": 1336
//       },
//     },
//     "Douala, Cameroon": {
//       Total: 5,
//       Workspace: {
//         "HealthCare": 1177,
//         "Construction": 1331,
//         "Education": 1211,
//         "SW & Data": 1241,
//         "Religion": 1028,
//         "Spiritual": 806,
//         "Finance": 1055,
//         "Beauty": 815,
//         "Labor": 1336
//       },
//     },
//     "Lagos, Nigeria": {
//       Total: 6,
//       Workspace: {
//         "HealthCare": 1177,
//         "Construction": 1331,
//         "Education": 1211,
//         "SW & Data": 1241,
//         "Religion": 1028,
//         "Spiritual": 806,
//         "Finance": 1055,
//         "Beauty": 815,
//         "Labor": 1336
//       },
//     },
//   },
//   Product: {
//     "Blue shades": {
//       Total: 1,
//       Workspace: "HealthCare",
//       Country: {
//     "Togo": 11,
//     "Ghana": 13,
//     "Rwanda": 12,
//     "Burkina Faso": 12,
//     "Cote d'Ivoire": 10,
//     "USA": 80,
//     "France": 10,
//     "Cameroon": 81,
//     "Nigeria": 13
//       },
//       City: {
//         "Lome, Togo": 117,
//         "Accra, Ghana": 131,
//         "Kigali, Rwanda": 211,
//         "Ouagadougou, Burkina Faso": 124,
//         "Abidjan, Cote d'Ivoire": 102,
//         "Washington, USA": 806,
//         "Paris, France": 105,
//         "Douala,Cameroon": 815,
//         "Lagos, Nigeria": 136
//       },
//     },
//     "Green sunglasses": {
//       Total: 2,
//       Workspace: "HealthCare",
//       Country: {
//         "Togo": 11,
//         "Ghana": 13,
//         "Rwanda": 12,
//         "Burkina Faso": 12,
//         "Cote d'Ivoire": 10,
//         "USA": 80,
//         "France": 10,
//         "Cameroon": 81,
//         "Nigeria": 13
//       },
//       City: {
//         "Lome, Togo": 117,
//         "Accra, Ghana": 131,
//         "Kigali, Rwanda": 211,
//         "Ouagadougou, Burkina Faso": 124,
//         "Abidjan, Cote d'Ivoire": 102,
//         "Washington, USA": 806,
//         "Paris, France": 105,
//         "Douala,Cameroon": 815,
//         "Lagos, Nigeria": 136
//       },
//     },
//     "Gold frame sunglasses": {
//       Total: 3,
//       Workspace: "Spiritual",
//       Country: {
//         "Togo": 11,
//         "Ghana": 13,
//         "Rwanda": 12,
//         "Burkina Faso": 12,
//         "Cote d'Ivoire": 10,
//         "USA": 80,
//         "France": 10,
//         "Cameroon": 81,
//         "Nigeria": 13
//       },
//       City: {
//         "Lome, Togo": 777,
//         "Accra, Ghana": 888,
//         "Kigali, Rwanda": 211,
//         "Ouagadougou, Burkina Faso": 124,
//         "Abidjan, Cote d'Ivoire": 102,
//         "Washington, USA": 806,
//         "Paris, France": 105,
//         "Douala,Cameroon": 815,
//         "Lagos, Nigeria": 136
//       },
//     },
//   },
//   Paywall: {
//     "Blue shades": {
//       Total: 1,
//       Workspace: "HealthCare",
//       Country: {
//     "Togo": 11,
//     "Ghana": 13,
//     "Rwanda": 12,
//     "Burkina Faso": 12,
//     "Cote d'Ivoire": 10,
//     "USA": 80,
//     "France": 10,
//     "Cameroon": 81,
//     "Nigeria": 13
//       },
//       City: {
//         "Lome, Togo": 117,
//         "Accra, Ghana": 131,
//         "Kigali, Rwanda": 211,
//         "Ouagadougou, Burkina Faso": 124,
//         "Abidjan, Cote d'Ivoire": 102,
//         "Washington, USA": 806,
//         "Paris, France": 105,
//         "Douala,Cameroon": 815,
//         "Lagos, Nigeria": 136
//       },
//     },
//     "Green sunglasses": {
//       Total: 2,
//       Workspace: "HealthCare",
//       Country: {
//         "Togo": 11,
//         "Ghana": 13,
//         "Rwanda": 12,
//         "Burkina Faso": 12,
//         "Cote d'Ivoire": 10,
//         "USA": 80,
//         "France": 10,
//         "Cameroon": 81,
//         "Nigeria": 13
//       },
//       City: {
//         "Lome, Togo": 117,
//         "Accra, Ghana": 131,
//         "Kigali, Rwanda": 211,
//         "Ouagadougou, Burkina Faso": 124,
//         "Abidjan, Cote d'Ivoire": 102,
//         "Washington, USA": 806,
//         "Paris, France": 105,
//         "Douala,Cameroon": 815,
//         "Lagos, Nigeria": 136
//       },
//     },
//     "Gold frame sunglasses": {
//       Total: 3,
//       Workspace: "Spiritual",
//       Country: {
//         "Togo": 11,
//         "Ghana": 13,
//         "Rwanda": 12,
//         "Burkina Faso": 12,
//         "Cote d'Ivoire": 10,
//         "USA": 80,
//         "France": 10,
//         "Cameroon": 81,
//         "Nigeria": 13
//       },
//       City: {
//         "Lome, Togo": 777,
//         "Accra, Ghana": 888,
//         "Kigali, Rwanda": 211,
//         "Ouagadougou, Burkina Faso": 124,
//         "Abidjan, Cote d'Ivoire": 102,
//         "Washington, USA": 806,
//         "Paris, France": 105,
//         "Douala,Cameroon": 815,
//         "Lagos, Nigeria": 136
//       },
//     },
//   }
// }

// const colData = {
//   Workspace: {
//       "Togo": 1177,
//       "Ghana": 1331,
//       "Rwanda": 1211,
//       "Burkina Faso": 1241,
//       "Cote d'Ivoire": 1028,
//       "USA": 806,
//       "France": 1055,
//       "Cameroon": 815,
//       "Nigeria": 1336
//   },
//   Country: {
//       "Viking outfit": 845,
//       "Officer outfit": 826,
//       "Default": 1260,
//       "Green kimono": 1069,
//       "VIP": 710,
//       "Bodyguard outfit": 954,
//       "gray kimono": 1094,
//       "Space Z Suit": 897,
//       "Viking": 1013,
//       "Doctor": 785,
//       "King": 547
//   },
//   City: {
//       "NY Hat": 859,
//       "Ring": 620,
//       "Top hat": 822,
//       "Red cap": 781,
//       "Crown": 488,
//       "Headset": 640,
//       "Cowboy hat second": 601,
//       "Leopad hat": 776,
//       "Captain hat": 861,
//       "Cowboy hat": 540,
//       "Pirate hat second": 692,
//       "Pirate hat": 578,
//       "DR Hat": 734
//   },
//   Channel: {
//       "Blue shades": 904,
//       "Green sunglasses": 598,
//       "Gold frame sunglasses": 799,
//       "Stylish green glasses": 785,
//       "King": 643,
//       "Pirate": 690,
//       "VR headset": 881,
//       "Thug life sunglasses": 708,
//       "Reading glasses": 901,
//       "Star shaped sunglasses": 663,
//       "Round shades": 763,
//       "Super star": 635
//   },
//   Product: {
//     "Blue shades": 904,
//     "Green sunglasses": 598,
//     "Gold frame sunglasses": 799,
//     "Stylish green glasses": 785,
//     "King": 643,
//     "Pirate": 690,
//     "VR headset": 881,
//     "Thug life sunglasses": 708,
//     "Reading glasses": 901,
//     "Star shaped sunglasses": 663,
//     "Round shades": 763,
//     "Super star": 635
// },
// }

// const Filters: React.FC<any> = () => {
//   const dispatch = useAppDispatch()
//   // const { data } = useGetCollectionDistribution(address)
//   const data = colData
//   const { t } = useTranslation()
//   const nftFilters = useGetCollectionFilters()

//   const workspaces= Object.entries(WORKSPACES)?.reduce(
//     (accum, attr, index) => ({
//       ...accum,
//       ["Workspace"]: accum["Workspace"] ? [...accum["Workspace"], {traitType: "Workspace", value: attr[0], count: attr[1]}] : 
//       [{traitType: "Workspace", value: attr[0], count: attr[1]}]
//     }),
//     {},
//   )
//   const countries= Object.entries(COUNTRIES2)?.reduce(
//     (accum, attr, index) => ({
//       ...accum,
//       ["Country"]: nftFilters['workspace'] ? 
//       (accum["Country"] ? [...accum["Country"], {traitType: "Country", value: attr[0], count: attr[1].Total}] : 
//       [{traitType: "Country", value: attr[0], count: attr[1].Workspace[nftFilters['workspace']?.value ?? 0]}])
//       :(accum["Country"] ? [...accum["Country"], {traitType: "Country", value: attr[0], count: attr[1].Total}] : 
//       [{traitType: "Country", value: attr[0], count: attr[1].Total}]),
//     }),
//     {},
//   )
//   const cities= Object.entries(CITIES2)?.reduce(
//     (accum, attr, index) => ({
//       ...accum,
//       ["City"]: nftFilters['workspace'] ? 
//       (accum["City"] ? [...accum["City"], {traitType: "City", value: attr[0], count: attr[1].Total}] : 
//       [{traitType: "City", value: attr[0], count: attr[1].Workspace[nftFilters['workspace'].value]}])
//       :(accum["City"] ? [...accum["City"], {traitType: "City", value: attr[0], count: attr[1].Total}] : 
//       [{traitType: "City", value: attr[0], count: attr[1].Total}]),
//     }),
//     {},
//   )
//   const productsHome= Object.entries(PRODUCTS)?
//   .filter((item) => nftFilters['workspace'] ? item[1].Workspace === nftFilters['workspace']?.value : true)
//   .reduce(
//     (accum: any, attr: any) => ({
//       ...accum,
//       ["Product"]: 
//               nftFilters['city'] ? 
//               (accum["Product"] ? [...accum["Product"], {traitType: "Product", value: attr[0], count: attr[1].City[nftFilters['city'].value]}]:
//               [{traitType: "Product", value: attr[0], count: attr[1].City[nftFilters['city'].value]}]):
//               nftFilters['country'] ? 
//               (accum["Product"] ? [...accum["Product"], {traitType: "Product", value: attr[0], count: attr[1].Country[nftFilters['country'].value]}]:
//               [{traitType: "Product", value: attr[0], count: attr[1].Country[nftFilters['country'].value]}]): 
//               (accum["Product"] ? [...accum["Product"], {traitType: "Product", value: attr[0], count: attr[1].Total}]:
//               [{traitType: "Product", value: attr[0], count: attr[1].Total}])
//     }),
//     {},
//   )
//   const workspaceItems: Item[] = workspaces["Workspace"].map((attr) => ({
//     label: attr.value as string,
//     count: attr.count ? attr.count : undefined,
//     attr,
//   }))
//   const countryItems: Item[] = countries["Country"].map((attr) => ({
//     label: capitalize(attr.value as string),
//     count: attr.count ? attr.count : undefined,
//     attr,
//   }))
//   const cityItems: Item[] = cities["City"].map((attr) => ({
//     label: attr.value as string,
//     count: attr.count ? attr.count : undefined,
//     attr,
//   }))
//   const productItems: Item[] = productsHome["Product"]?.map((attr) => ({
//     label: attr.value as string,
//     count: attr.count ? attr.count : undefined,
//     attr,
//   }))
//   return (
//     <GridContainer>
//       {/* <SortByTitle fontSize="12px" textTransform="uppercase" color="textSubtle" fontWeight={600} mb="4px">
//         {t('Sort By')}
//       </SortByTitle>
//       <SortByControls>
//         <SortSelect collectionAddress={AddressZero} />
//       </SortByControls> */}
//       <ScrollableFlexContainer>
//       <FilterByTitle textTransform="uppercase" color="textSubtle" fontSize="12px" marginRight="10px" bold>
//         {t('Filter by')}
//       </FilterByTitle>
//             <HomeListTraitFilter
//               key={"workspace"}
//               title={capitalize("workspace")}
//               traitType={"workspace"}
//               items={workspaceItems ?? []}
//               collectionAddress={AddressZero}
//             />
//             <HomeListTraitFilter
//               key={"country"}
//               title={capitalize("country")}
//               traitType={"country"}
//               items={countryItems ?? []}
//               collectionAddress={AddressZero}
//             />
//             <HomeListTraitFilter
//               key={"city"}
//               title={capitalize("city")}
//               traitType={"city"}
//               items={cityItems ?? []}
//               collectionAddress={AddressZero}
//             />
//             <HomeListTraitFilter
//               key={"product"}
//               title={capitalize("product")}
//               traitType={"product"}
//               items={productItems ?? []}
//               collectionAddress={AddressZero}
//             />
//         {!isEmpty(nftFilters) && <ClearAllButton mb="4px" />}
//       </ScrollableFlexContainer>
//     </GridContainer>
//   )
// }

// export default Filters
