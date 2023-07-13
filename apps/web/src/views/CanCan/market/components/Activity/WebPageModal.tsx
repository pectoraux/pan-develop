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
  
const WebPageModal: React.FC<any> = ({ nft, height="500px", onDismiss }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  return (
    <Modal 
      title={t("eReceipt")} 
      onDismiss={onDismiss}
      headerBackground={theme.colors.textSubtle}
    >
      <Iframe url={nft.metadataUrl} height={height} id="myId" />
    </Modal>
  )
}

export default WebPageModal
