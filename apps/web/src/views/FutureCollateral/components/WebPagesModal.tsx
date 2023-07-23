import { Modal, Grid } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import * as React from 'react';
import Iframe from 'react-iframe'
import { useTranslation } from '@pancakeswap/localization';

interface BuyTicketsModalProps {
  title: string
  link: string
  onDismiss?: () => void
}
  
const WebPageModal: React.FC<any> = ({ tokenId, metadataUrl, height="400px", onDismiss }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  return (
    <Modal 
      title={t("NFT ID: %tokenId%", { tokenId })} 
      onDismiss={onDismiss}
      headerBackground={theme.colors.textSubtle}
    >
      <Iframe url={metadataUrl} height={height} styles={{ marginBottom: "10px" }} id="myId" />
    </Modal>
  )
}

export default WebPageModal
