import styled from 'styled-components'
import { TabMenu as UIKitTabMenu, Tab, Flex, VerifiedIcon, CommunityIcon, AddIcon, AutoRenewIcon, ListViewIcon, PrizeIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { EntryType } from 'state/types'

interface TabMenuProps {
  proposalType: EntryType
  onTypeChange: (proposalType: EntryType) => void
}

const StyledTabMenu = styled.div`
  background-color: ${({ theme }) => theme.colors.input};
  padding-top: 16px;
`

const getIndexFromType = (entryType: EntryType) => {
  switch (entryType) {
    case EntryType.GENERAL:
      return 1
    case EntryType.EDUCATION:
      return 2
    case EntryType.PROFESSIONAL:
      return 3
    case EntryType.HEALTHCARE:
      return 4
    case EntryType.PROPERTIES:
      return 5
    case EntryType.OTHERS:
      return 6
    case EntryType.SEARCHABLE:
      return 7
    default:
      return 0
  }
}

const getTypeFromIndex = (index: number) => {
  switch (index) {
    case 1:
      return EntryType.GENERAL
    case 2:
      return EntryType.EDUCATION
    case 3:
      return EntryType.PROFESSIONAL
    case 4:
      return EntryType.HEALTHCARE
    case 5:
      return EntryType.PROPERTIES
    case 6:
      return EntryType.OTHERS
    case 7:
      return EntryType.SEARCHABLE
    default:
      return EntryType.SHARED
  }
}

const TabMenu: React.FC<React.PropsWithChildren<TabMenuProps>> = ({ proposalType, onTypeChange }) => {
  const { t } = useTranslation()
  const handleItemClick = (index: number) => {
    onTypeChange(getTypeFromIndex(index))
  }

  return (
    <StyledTabMenu>
      <UIKitTabMenu activeIndex={getIndexFromType(proposalType)} onItemClick={handleItemClick}>
        <Tab>{t('Inbox')}</Tab>
        <Tab>
          <Flex alignItems="center">
            <VerifiedIcon color="currentColor" mr="4px" />
            {t('General')}
          </Flex>
        </Tab>
        <Tab>
          {' '}
          <Flex alignItems="center">
            <PrizeIcon color="currentColor" mr="4px" />
            {t('Education')}
          </Flex>
        </Tab>
        <Tab>
          {' '}
          <Flex alignItems="center">
            <CommunityIcon color="currentColor" mr="4px" />
            {t('Professional')}
          </Flex>
        </Tab>
        <Tab>
          {' '}
          <Flex alignItems="center">
            <AddIcon color="currentColor" mr="4px" />
            {t('HealthCare')}
          </Flex>
        </Tab>
        <Tab>
          {' '}
          <Flex alignItems="center">
            <ListViewIcon color="currentColor" mr="4px" />
            {t('Properties')}
          </Flex>
        </Tab>
        <Tab>
          {' '}
          <Flex alignItems="center">
            <AutoRenewIcon color="currentColor" mr="4px" />
            {t('Others')}
          </Flex>
        </Tab>
        <Tab>
          {' '}
          <Flex alignItems="center">
            {t('Searchable')}
          </Flex>
        </Tab>
      </UIKitTabMenu>
    </StyledTabMenu>
  )
}

export default TabMenu
