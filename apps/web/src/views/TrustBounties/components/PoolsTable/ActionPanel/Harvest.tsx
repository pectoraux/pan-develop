import { useState, useMemo } from 'react'
import styled from 'styled-components'
import { Button, Text, Flex, Box, Pool, CopyButton } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { ActionContainer, ActionTitles, ActionContent } from './styles'

const Wrapper = styled(Flex)`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-radius: 16px;
  position: relative;
`

const HarvestAction: React.FunctionComponent<any> = ({ pool }) => {
  const { t } = useTranslation()

  const actionTitle = (
    <Flex flexDirection="row" justifyContent="space-around">
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('Terms')} 
      </Text>
      <Wrapper>
        <Text fontSize="12px" bold mb="10px" color="textSubtle" as="span" textTransform="uppercase">
          {t('Account Address')} 
        </Text>
          <CopyButton width="24px" text={pool?.owner} tooltipMessage={t('Copied')} tooltipTop={-30} />
      </Wrapper>
    </Flex>
  )

  return (
    <ActionContainer>
      <ActionTitles>{actionTitle}</ActionTitles>
      <ActionContent>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <Box mr="8px" height="122px">
          {t(pool?.terms ?? '')}
          </Box>
        </Flex>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
