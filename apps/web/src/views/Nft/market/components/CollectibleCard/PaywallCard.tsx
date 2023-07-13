import styled from 'styled-components'
import { useState } from 'react'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { StyledCollectibleCard } from './styles'
// import { PaywallCollectionCard } from '.'
// import {PaywallDetailsSection} from './PaywallDetailsSection'

const ExpandingWrapper = styled.div`
  padding: 1px;
  padding-left: 14px;
  padding-right: 14px;
  border-top: 2px solid ${({ theme }) => theme.colors.cardBorder};
  overflow: hidden;
`

const PaywallCard: React.FC<any> = ({ paywall, setPaywallContent }) => {
  const [showExpandableSection, setShowExpandableSection] = useState(true)
  return(
    <StyledCollectibleCard>
    {/* <PaywallCollectionCard

      key={paywall?.address}
      bgSrc={paywall?.banner.small}
      avatarSrc={paywall?.avatar}
      collectionName={paywall?.name}
      onClick={() => {setPaywallContent(paywall?.address)}}
      url=''
    > */}
      {paywall.name}
    {/* </PaywallCollectionCard> */}
    <ExpandingWrapper>
      <ExpandableSectionButton
        onClick={() => setShowExpandableSection(!showExpandableSection)}
        expanded={showExpandableSection}
      />
      {/* {showExpandableSection && (
        <PaywallDetailsSection
          paywall={paywall} 
          onClick={() => {setPaywallContent(paywall?.address)}}
        />
      )} */}
    </ExpandingWrapper>
  </StyledCollectibleCard>

  )
}

export default PaywallCard
