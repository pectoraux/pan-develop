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
  
const WebPageModal: React.FC<any> = ({ nfts, height="400px", onDismiss }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  return (
    <Modal 
      title={t("Will Notes")} 
      onDismiss={onDismiss}
      headerBackground={theme.colors.textSubtle}
    >
      <Grid
          gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}
          alignItems="start"
        >
          {nfts?.map((nft) => <Iframe url={nft.metadataUrl} height={height} styles={{ marginBottom: "10px" }} id="myId" />)}
      </Grid>
    </Modal>
  )
}

export default WebPageModal
