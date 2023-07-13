import { ChangeEvent } from 'react'
import { Flex, Radio, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { EntryState } from 'state/types'

interface FiltersProps {
  filterState: EntryState
  onFilterChange: (filterState: EntryState) => void
  isLoading: boolean
}

const StyledFilters = styled(Flex).attrs({ alignItems: 'center' })`
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  padding: 14px 0 14px 24px;
`

const FilterLabel = styled.label`
  align-items: center;
  cursor: pointer;
  display: flex;
  margin-right: 16px;
`

const options = [
  { value: EntryState.ACTIVE, label: 'Active' },
  { value: EntryState.EXPIRED, label: 'Expired' },
  { value: EntryState.PENDING, label: 'Pending' },
]

const Filters: React.FC<React.PropsWithChildren<FiltersProps>> = ({ filterState, onFilterChange, isLoading }) => {
  const { t } = useTranslation()

  return (
    <StyledFilters>
      {options.map(({ value, label }) => {
        const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
          const { value: radioValue } = evt.currentTarget
          onFilterChange(radioValue as EntryState)
        }

        return (
          <FilterLabel key={label}>
            <Radio
              scale="sm"
              value={value}
              checked={filterState === value}
              onChange={handleChange}
              disabled={isLoading}
            />
            <Text ml="8px">{t(label)}</Text>
          </FilterLabel>
        )
      })}
    </StyledFilters>
  )
}

export default Filters
