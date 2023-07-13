import { useMemo } from 'react'
import { Modal, Grid } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import * as React from 'react';
import Iframe from 'react-iframe'
import { useCurrPool } from 'state/bills/hooks'
import { useTranslation } from '@pancakeswap/localization';

interface BuyTicketsModalProps {
  title: string
  link: string
  onDismiss?: () => void
}
  
const WebPageModal: React.FC<any> = ({ pool, height="400px", onDismiss }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const currState = useCurrPool()
  const nft = useMemo(() => pool?.accounts?.find((n) => n.id === currState[pool?.id]), [pool, currState])
  return (
    <Modal 
      title={t("NFT %val% & Notes", { val: nft?.protocolId })} 
      onDismiss={onDismiss}
      headerBackground={theme.colors.textSubtle}
    >
      <Grid 
        gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}
        alignItems="start"
        >
        <Iframe url={nft.metadataUrl} height={height} id="myId" />
        {nft?.notes?.map((note) => <Iframe url={note.metadataUrl} height={height} styles={{ marginBottom: "10px" }} id="myId2" />)}
      </Grid>
    </Modal>
  )
}

export default WebPageModal
