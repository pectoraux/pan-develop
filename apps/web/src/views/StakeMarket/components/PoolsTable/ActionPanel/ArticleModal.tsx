import { useEffect, useRef } from 'react'
import { 
  Card, 
  Box, 
  Modal,
} from '@pancakeswap/uikit'
import RichTextEditor from 'components/RichText';
import { useTranslation } from '@pancakeswap/localization'
import { Entry } from 'state/types'


interface SetPriceStageProps {
  entry: Entry
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const ArticleModal: React.FC<any> = ({
  currPool,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <Modal 
    title={t('Terms of stake %id%', { id: currPool?.sousId })}
    onDismiss={onDismiss}
    > 
      <Box mb="24px">
        <Card>
          <RichTextEditor readOnly value={currPool?.terms} id="rte" />
        </Card>
      </Box>
    </Modal>
  )
}

export default ArticleModal
