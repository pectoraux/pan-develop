import { ChangeEvent, useRef, useState } from 'react'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Box,
  Button,
  Text,
  Flex,
  IconButton,
  Input,
  InputGroup,
  SearchIcon,
  CloseIcon,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import orderBy from 'lodash/orderBy'
import styled from 'styled-components'
import { FilterButton, ListOrderState, SearchWrapper } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { Item } from './types'
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

export const ListTraitFilter: React.FC<any> = ({ 
  title, 
  traitType, 
  items, 
  nftFilters,
  setNftFilters
}) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [orderState, setOrderState] = useState<ListOrderState>({ orderKey: 'count', orderDir: 'asc' })
  const wrapperRef = useRef(null)
  const menuRef = useRef(null)
  const { orderKey, orderDir } = orderState

  const traitFilter = nftFilters[traitType]
  const isTraitSelected = !!traitFilter

  const filteredItems =
    query && query.length > 1
      ? items.filter((item) => item.label.toLowerCase().indexOf(query.toLowerCase()) !== -1)
      : items

  const handleClearItem = () => {
    const newFilters = { ...nftFilters }
    delete newFilters[traitType]
    setNftFilters(newFilters)
  }

  const handleMenuClick = () => {
    setIsOpen(!isOpen)
  }

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target
    setQuery(value)
  }

  const handleItemSelect = ({ attr }: Item) => {
    const newFilters = { ...nftFilters, [traitType]: nftFilters[traitType] ? [...nftFilters[traitType], attr.value] : [attr.value]}
    setNftFilters(newFilters)
  }

  const toggleSort = (newOrderKey: string) => () => {
    setOrderState((prevOrderDir) => {
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

  return (
    <Flex flexDirection="column" alignItems="center" mr="4px" mb="4px">
    <Flex alignItems="center" mr="4px" mb="4px">
      <TriggerButton
              onClick={handleMenuClick}
              variant={isTraitSelected ? 'subtle' : 'light'}
              scale="sm"
              hasItem={isTraitSelected}
            >
          {title}
        </TriggerButton>
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
      <Box ref={wrapperRef}>
        {isOpen ?
          <Box maxWidth="375px" ref={menuRef}
            >
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
                {t('Count')}
              </Text>
              <Box width="18px">
                {orderKey === 'count' && orderDir === 'asc' && <ArrowUpIcon width="18px" color="secondary" />}
                {orderKey === 'count' && orderDir === 'desc' && <ArrowDownIcon width="18px" color="secondary" />}
              </Box>
            </FilterButton>
          </Flex>
          <Box height="240px" overflowY="auto">
            {filteredItems.length > 0 ? (
              orderBy(filteredItems, orderKey, orderDir).map((filteredItem) => {
                const handleSelect = () => handleItemSelect(filteredItem)
                const isItemSelected = traitFilter ? traitFilter.includes(filteredItem.attr.value) : false
                
                return (
                  <TraitItemRow
                    key={filteredItem.label}
                    item={filteredItem}
                    isSelected={isItemSelected}
                    onSelect={handleSelect}
                  />
                )
              })
            ) : (
              <Flex alignItems="center" justifyContent="center" height="230px">
                <Text color="textDisabled" textAlign="center">
                  {t('No results found')}
                </Text>
              </Flex>
            )}
          </Box>
        </Box>:null}
      </Box>
    </Flex>
  )
}
