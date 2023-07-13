import { useState, useEffect } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { Flex, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'

const Tab = styled.button<{ $active: boolean }>`
  display: inline-flex;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme, $active }) => ($active ? theme.colors.secondary : theme.colors.textSubtle)};
  border-width: ${({ $active }) => ($active ? '1px 1px 0 1px' : '0')};
  border-style: solid solid none solid;
  border-color: ${({ theme }) =>
    `${theme.colors.cardBorder} ${theme.colors.cardBorder} transparent ${theme.colors.cardBorder}`};
  outline: 0;
  padding: 12px 16px;
  border-radius: 16px 16px 0 0;
  font-size: 16px;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  background-color: ${({ theme, $active }) => ($active ? theme.colors.background : 'transparent')};
  transition: background-color 0.3s ease-out;
`

const TabMenu = ({ id }) => {
  const { t } = useTranslation()
  const { pathname, query } = useRouter()
  const { accountAddress } = query
  const [reportActive, setReportActive] = useState(pathname.includes('report'))
  const [transfersActive, setIsTransfersActive] = useState(pathname.includes('transfers'))

  useEffect(() => {
    setReportActive(pathname.includes('report'))
    setIsTransfersActive(pathname.includes('transfers'))
  }, [pathname])

  return (
    <Flex>
      <Tab
        onClick={() => {
          setReportActive(false)
          setIsTransfersActive(false)
        }}
        $active={!reportActive && !transfersActive}
        as={NextLinkFromReactRouter}
        to={`/profile/${accountAddress}`}
      >
        NFTs
      </Tab>
      <Tab
        onClick={() => setReportActive(true)}
        $active={reportActive}
        as={NextLinkFromReactRouter}
        to={`/profile/${accountAddress}/report/${id}`}
      >
        {t('Report')}
      </Tab>
      <Tab
        onClick={() => setIsTransfersActive(false)}
        $active={transfersActive}
        as={NextLinkFromReactRouter}
        to={`/profile/${accountAddress}/transfers`}
      >
        {t('Transfers')}
      </Tab>
    </Flex>
  )
}

export default TabMenu