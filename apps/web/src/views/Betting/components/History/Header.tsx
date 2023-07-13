import { useWeb3React } from '@pancakeswap/wagmi'
import {
  ArrowForwardIcon,
  Box,
  Button,
  Radio,
  Flex,
  Heading,
  Text,
  ButtonMenu,
  ButtonMenuItem,
} from '@pancakeswap/uikit'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { HistoryFilter } from 'state/types'
import { setHistoryFilter } from 'state/predictions'
// import { useGetHistoryFilter, useGetIsFetchingHistory } from 'state/bettings/hooks'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import Items from '../Items'

const Filter = styled.label`
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  margin-right: 16px;
`

const StyledHeader = styled(Box)`
  background: ${({ theme }) => theme.colors.gradientBubblegum};
  flex: none;
  padding: 16px;
`

const ButtonMenuContainer = styled.div`
  margin-bottom: 16px;
  width: 100%;
  & > div {
    width: 100%;
  }

  & button {
    width: 100%;
  }
`

interface HeaderProps {
  activeTab: HistoryTabs
  setActiveTab: (value: HistoryTabs) => void
}

export enum HistoryTabs {
  ROUNDS,
  PNL,
}

const Header: React.FC<any> = ({ activeTab, setHistoryPaneState, setActiveTab }) => {
  const historyFilter ="ALL" // useGetHistoryFilter()
  const isFetchingHistory = false// useGetIsFetchingHistory()
  const { t } = useTranslation()
  const dispatch = useLocalDispatch()
  const { account } = useWeb3React()

  const handleClick = () => {
    setHistoryPaneState(false)
  }

  const handleChange = (newFilter: any) => async () => {
    if (newFilter !== "ALL") {
      dispatch(setHistoryFilter(newFilter))
    }
  }

  const switchTab = async (tabIndex: number) => {
    setActiveTab(tabIndex)
    await handleChange(HistoryFilter.ALL)()
  }

  return (
    <StyledHeader>
      <Flex alignItems="center" justifyContent="space-between" mb="16px">
        {/* <Heading as="h3" size="md">
          {t('History')}
        </Heading> */}
        <Button onClick={handleClick} variant="text" endIcon={<ArrowForwardIcon color="primary" />} px="0">
          {t('Close')}
        </Button>
      </Flex>
      <ButtonMenuContainer>
        <ButtonMenu activeIndex={activeTab} scale="sm" variant="subtle" onItemClick={switchTab}>
          <ButtonMenuItem>{t('Your Tickets')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Channel')}</ButtonMenuItem>
        </ButtonMenu>
      </ButtonMenuContainer>
    </StyledHeader>
  )
}

export default Header
