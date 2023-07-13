import { Input,Text, AddIcon, MinusIcon, IconButton } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { ItemImage, StyledItemRow } from '../ListFilter/styles'
import { Item } from './types'

interface TraitItemRowProps {
  item: Item
  isSelected: boolean
  onSelect: () => void
}

const StyledInput = styled(Input)`
  border-radius: 16px;
  margin-left: auto;
  text-align: center;
  width: 100px;
`

export const TraitItemRow: React.FC<any> = ({ item, order, itemCount, setOrder, handleSelect, handleResults }) => {
  const newItem = item 
  console.log("newItem===============>", newItem)
  const handleAdd = ()=> {
    if (order) {
      setOrder(false)
      handleResults()
    } else {
      newItem.count = Math.min(itemCount+1, newItem.attr.max)
      if(newItem.attr.max) handleSelect(newItem)
    }
  }
  const handleMinus = ()=> {
    if (order) {
      setOrder(false)
      handleResults()
    } else {
      newItem.count = itemCount-1
      if(newItem.attr.max && newItem.count >= newItem.attr.min) handleSelect(newItem)
   }
  }

  const handleCustom = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.validity.valid) {
      newItem.count = Math.min(parseInt(event.target.value.replace(/,/g, '.')), newItem.attr.max)
      if(newItem.attr.max && newItem.count >= newItem.attr.min) handleSelect(newItem)
    }
  }

  return (
  <StyledItemRow alignItems="center" px="16px" py="8px">
    {item.image && <ItemImage src={item.image} height={48} width={48} mr="16px" />}
    <Text style={{ flex: 1 }}>{item.attr?.element}</Text>
    {itemCount !== undefined && item.attr.max > 0 && (
      <>
        <IconButton scale='sm' disabled={newItem.attr.max === 0} onClick={handleMinus}>
          <MinusIcon />
        </IconButton>
        <StyledInput
          color='black'
          // ref={inputRef}
          type="text"
          inputMode="decimal"
          // pattern="^[0-9]+[.,]?[0-9]*$"
          scale="sm"
          disabled={newItem.attr.max === 0}
          // value={formatNumber(itemCount, 0, 0)}
          placeholder={`${newItem.attr.currency}${formatNumber(itemCount !== undefined ? itemCount : newItem.attr.min, 0, 0)}`}
          onChange={handleCustom}
        />
        <IconButton scale='sm' disabled={newItem.attr.max === 0} onClick={handleAdd}>
          <AddIcon />
        </IconButton>
      </>
    )}
    {/* {radio && <Radio name="item-select" scale="sm" checked={itemCount === 1} value={item.label} onChange={() => { itemCount === 1 ? handleMinus() : handleAdd() }} ml="24px" />} */}
  </StyledItemRow>
)
      }
