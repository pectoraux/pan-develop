import { useState } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { Text, Flex, Button, IconButton } from '@pancakeswap/uikit'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import Partners from './Partners'

export interface ExpandableSectionProps {
  paywall: any
  collection: any
}

const Wrapper = styled.div`
  margin-bottom: 14px;
`

const ExpandingWrapper = styled.div`
  padding: 1px;
  padding-left: 14px;
  padding-right: 14px;
  border-top: 2px solid ${({ theme }) => theme.colors.cardBorder};
  overflow: scroll;
  max-height: 300px;
`
const TriggerButton = styled(Button)<{ hasItem: boolean }>`
  ${({ hasItem }) =>
    hasItem &&
    `
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    padding-right: 18px;
  `}
`
const CloseButton = styled(IconButton)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  padding-right: 18px;
  `

const ProductDetailsSection: React.FC<ExpandableSectionProps> = ({ paywall, collection }) => {
  const { t } = useTranslation()
  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const isAuction = Number(paywall?.bidDuration ?? 0) > 0
  const dropInDatePassed = Number(paywall?.dropinTimer ?? 0) < Date.now()
  
  return (
    <ExpandingWrapper>
      <ExpandableSectionButton
        key={paywall.collectionAddress + paywall.tokenId}
        onClick={() => setShowExpandableSection(!showExpandableSection)}
        expanded={showExpandableSection}
      />
      {showExpandableSection ? (
        <>
        <Partners paywall={paywall} collection={collection} />
        <Wrapper>
        <Flex justifyContent="space-between">
          <Text color='secondary'>{t('SuperLikes')}:</Text>
          <Text color='secondary'>{paywall?.superLikes ?? 0}</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text color='failure'>{t('SuperDislikes')}:</Text>
          <Text color='failure'>{paywall?.superDislikes ?? 0}</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text color='secondary'>{t('Likes')}:</Text>
          <Text color='secondary'>{paywall.likes ?? 0}</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text color='failure'>{t('Dislikes')}:</Text>
          <Text color='failure'>{paywall.disLikes ?? 0}</Text>
        </Flex>
        {isAuction && 
        <Flex justifyContent="center">
          <TriggerButton
            variant='light'
            scale="sm"
            width="100%"
            hasItem={isAuction}
          >
            {t('ONGOING AUCTION')}
          </TriggerButton>
          
        </Flex>}
        {!dropInDatePassed && 
        <Flex justifyContent="center">
          <TriggerButton
            variant='light'
            scale="sm"
            width="100%"
            hasItem={isAuction}
          >
            {t('DROPIN')}
          </TriggerButton>
          <CloseButton
            variant='light'
            scale="sm"
          />
        </Flex>}
        <hr/>
        <Flex justifyContent="center">
          <Text>{t(paywall.description)}</Text>
        </Flex>
        </Wrapper>
        </>
      ):null}
    </ExpandingWrapper>
  )
}

export default ProductDetailsSection
