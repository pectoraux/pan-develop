import { ChangeEvent, useEffect, useRef, useState } from 'react'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Box,
  Button,
  Text,
  Flex,
  IconButton,
  InlineMenu,
  Input,
  InputGroup,
  SearchIcon,
  CloseIcon,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import orderBy from 'lodash/orderBy'
import { useGetNftFilters } from 'state/cancan/hooks'
import styled from 'styled-components'
import { useNftStorage } from 'state/cancan/storage'
import { Item } from './types'
import { FilterButton, ListOrderState, SearchWrapper } from '../ListFilter/styles'
import { TraitItemRow } from './styles'

interface ListTraitFilterProps {
  title?: string
  traitType: string
  items: Item[]
  collectionAddress: string
}

const TriggerButton = styled(Button)<{ hasItem: boolean }>`
  ${({ hasItem }) =>
    hasItem &&
    `
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    padding-right: 8px;
  `}
`

const CloseButton = styled(IconButton)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`

export const ListTraitFilter: React.FC<any> = ({ title, traitType, items, collectionAddress }) => {
  const { t } = useTranslation()
  const { updateItemFilters } = useNftStorage()
  const [isOpen, setIsOpen] = useState(false)
  const [order, setOrder] = useState(false)
  const [results, setResults] = useState([])
  const [query, setQuery] = useState('')
  const [orderState, setOrderState] = useState<ListOrderState>({ orderKey: 'count', orderDir: 'asc' })
  const wrapperRef = useRef(null)
  const menuRef = useRef(null)
  const nftFilters = useGetNftFilters(collectionAddress)
  const { orderKey, orderDir } = orderState

  const traitFilter = nftFilters[traitType]
  const isTraitSelected = !!traitFilter
  const cartItems = items.map((val) => {
  const newVal = val 
  newVal.count = traitFilter ? traitFilter[val.attr.value]?.count ?? val.attr.min : val.attr?.min
  return newVal
})
  const filteredItems =
    query && query.length > 1
      ? cartItems.filter((item) => item.label.toLowerCase().indexOf(query.toLowerCase()) !== -1)
      : cartItems
  
  const handleResults = () => {
    setResults(orderBy(filteredItems, orderKey, orderDir).copyWithin(0, 0, filteredItems.length))
  }

  const getItems = () => {
    if(order) {
      return orderBy(filteredItems, orderKey, orderDir)
    }
    return results.length ? results : filteredItems
  }

  const handleClearItem = () => {
    const newFilters = { ...nftFilters }

    delete newFilters[traitType]
    
    updateItemFilters({
      collectionAddress,
      nftFilters: newFilters,
    })
  }

  const handleMenuClick = () => setIsOpen(!isOpen)

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target
    setQuery(value)
  }

  const handleItemSelect = (item) => {
    console.log("item==================>", item)
    updateItemFilters({
      collectionAddress,
      nftFilters: { ...nftFilters, [item.attr.traitType]: { ...nftFilters[item.attr.traitType], [item.attr.value]: { count: item.count, currency: item.attr.currency, price: item.count * item.attr.unitPrice },  }},
    })
  }

  const toggleSort = (newOrderKey: string) => () => {
    setOrderState((prevOrderDir) => {
      setOrder(true)
      if (prevOrderDir.orderKey !== newOrderKey) {
        return {
          orderKey: newOrderKey,
          orderDir: 'asc',
        }
      }

      return {
        orderKey: newOrderKey,
        orderDir: prevOrderDir.orderDir === 'asc' ? 'desc' : 'asc',
      }
    })
  }

  // @TODO Fix this in the Toolkit
  // This is a fix to ensure the "isOpen" value is aligned with the menus's (to avoid a double click)
  useEffect(() => {
    const handleClickOutside = ({ target }: Event) => {
      if (
        wrapperRef.current &&
        menuRef.current &&
        !menuRef.current.contains(target) &&
        !wrapperRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [setIsOpen, wrapperRef, menuRef])

  return (
    <Flex alignItems="center" mr="4px" mb="4px">
      <Box ref={wrapperRef}>
        <InlineMenu
          component={
            <TriggerButton
              onClick={handleMenuClick}
              variant={isTraitSelected ? 'subtle' : 'light'}
              scale="sm"
              hasItem={isTraitSelected}
            >
              {title}
            </TriggerButton>
          }
          isOpen={isOpen}
          options={{ placement: 'bottom' }}
        >
          <Box maxWidth="375px" ref={menuRef}>
            <SearchWrapper alignItems="center" p="16px">
              <InputGroup startIcon={<SearchIcon color="textSubtle" />}>
                <Input name="query" placeholder={t('Search')} onChange={handleChange} value={query} />
              </InputGroup>
            </SearchWrapper>
            <Flex alignItems="center" p="16px">
              <FilterButton onClick={toggleSort('label')} style={{ flex: 1 }}>
                <Text fontSize="12px" color="secondary" fontWeight="bold" textTransform="uppercase">
                  {t('Name')}
                </Text>
                <Box width="18px">
                  {orderKey === 'label' && orderDir === 'asc' && <ArrowUpIcon width="18px" color="secondary" />}
                  {orderKey === 'label' && orderDir === 'desc' && <ArrowDownIcon width="18px" color="secondary" />}
                </Box>
              </FilterButton>
              <FilterButton onClick={toggleSort('count')}>
                <Text fontSize="12px" color="secondary" fontWeight="bold" textTransform="uppercase">
                  {t('count')}
                </Text>
                <Box width="18px">
                  {orderKey === 'count' && orderDir === 'asc' && <ArrowUpIcon width="18px" color="secondary" />}
                  {orderKey === 'count' && orderDir === 'desc' && <ArrowDownIcon width="18px" color="secondary" />}
                </Box>
              </FilterButton>
            </Flex>
            <Box height="240px" overflowY="auto">
              {filteredItems.length > 0 ? 
              getItems().map((filteredItem) => {
                  const handleSelect = (newItem) => {
                      handleItemSelect(newItem)
                  }
                  const itemCount = traitFilter ? traitFilter[filteredItem.attr.value] ? traitFilter[filteredItem.attr.value].count : filteredItem.attr.min : filteredItem.attr.min

                  return (
                    <TraitItemRow
                      key={filteredItem.label}
                      item={filteredItem}
                      order={order}
                      setOrder={setOrder}
                      handleResults={handleResults}
                      itemCount={itemCount}
                      handleSelect={handleSelect}
                    />
                  )
                }
              ) : (
                <Flex alignItems="center" justifyContent="center" height="230px">
                  <Text color="textDisabled" textAlign="center">
                    {t('No results found')}
                  </Text>
                </Flex>
              )}
            </Box>
          </Box>
        </InlineMenu>
      </Box>
      {isTraitSelected && (
        <CloseButton
          variant={isTraitSelected ? 'subtle' : 'light'}
          scale="sm"
          onClick={handleClearItem}
        >
          <CloseIcon color="currentColor" width="18px" />
        </CloseButton>
      )}
    </Flex>
  )
}
