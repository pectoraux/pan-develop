import { useState } from 'react'
import {
  CardProps,
  CardHeader,
  Card,
  Flex,
  Heading,
  IconButton,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@pancakeswap/uikit'
import PaywallDetailsSection from './PaywallDetailsSection'

interface CollapsibleCardProps extends CardProps {
  initialOpenState?: boolean
  title: string
  paywall: any
  collection: any
}

const CollapsibleCard: React.FC<any> = ({
  initialOpenState = true,
  title,
  paywall,
  collection,
  children,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(initialOpenState)

  const toggleOpen = () => setIsOpen(!isOpen)

  return (
    <Card {...props}>
      <CardHeader p="16px">
        <Flex alignItems="center" justifyContent="space-between">
          <Heading as="h3">{title}</Heading>
          <IconButton variant="text" scale="sm" onClick={toggleOpen}>
            {isOpen ? <ChevronUpIcon width="24px" /> : <ChevronDownIcon width="24px" />}
          </IconButton>
        </Flex>
      </CardHeader>
      {isOpen && children}
      {paywall?
      <PaywallDetailsSection
        key={paywall?.id} 
        collection={collection}
        paywall={paywall} 
      />:null}
    </Card>
  )
}

export default CollapsibleCard
