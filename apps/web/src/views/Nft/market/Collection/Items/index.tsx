import { useState } from 'react'
import { useRouter } from 'next/router'
import { createPortal } from 'react-dom'
import { Box, ScrollToTopButtonV2, useMatchBreakpoints, Flex, Button } from '@pancakeswap/uikit'
import { useGetCollection } from 'state/cancan/hooks'
import Container from 'components/Layout/Container'
import { useTranslation } from '@pancakeswap/localization'
import Filters from './Filters'
import CollectionNfts from './CollectionNfts'

const Items = () => {
  const [displayText, setDisplayText] = useState("")
  const collectionAddress = useRouter().query.collectionAddress as string
  const { collection, refresh } = useGetCollection(collectionAddress)
  const { isMd } = useMatchBreakpoints()
  const { t } = useTranslation()

  return (
    <Box py="32px">
        <Flex flexDirection='row'>
        <Filters 
          address={collection?.id || ''} 
          attributes={collection?.attributes} 
          setDisplayText={setDisplayText} 
        />
        <Flex
          style={{ gap: '16px', padding: '16px 16px 0 0' }}
          alignItems={[null, null, 'center']}
          flexDirection={['column', 'column', 'row']}
          flexWrap={isMd ? 'wrap' : 'nowrap'}
        >
          <Button
            scale="sm"
            // onClick={refresh}
            {...(isMd && { width: '100%' })}
          >
            {t('Refresh')}
          </Button>
        </Flex>
        </Flex>
      <Container>
        <CollectionNfts 
          collection={collection} 
          displayText={displayText} 
        />
      </Container>
      {createPortal(<ScrollToTopButtonV2 />, document.body)}
    </Box>
  )
}

export default Items
