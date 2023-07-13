import { Radio, Text, Flex, Image } from '@pancakeswap/uikit'
import noop from 'lodash/noop'
import styled from 'styled-components'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { Item } from './types'

export const StyledItemRow = styled(Flex)`
  cursor: pointer;
  user-select: none;
`

export const ItemImage = styled(Image)`
  border-radius: 50%;
`

interface TraitItemRowProps {
  item: Item
  isSelected: boolean
  onSelect: () => void
}

export const TraitItemRow: React.FC<React.PropsWithChildren<TraitItemRowProps>> = ({ item, isSelected, onSelect }) => (
  <StyledItemRow alignItems="center" px="16px" py="8px" onClick={onSelect}>
    {item.image && <ItemImage src={item.image} height={48} width={48} mr="16px" />}
    <Text style={{ flex: 1 }}>{item.label}</Text>
    {item.count !== undefined && (
      <Text color="textSubtle" px="8px">
        {formatNumber(item.count, 0, 0)}
      </Text>
    )}
    <Radio name="item-select" scale="sm" checked={isSelected} value={item.label} onChange={noop} ml="24px" />
  </StyledItemRow>
)
