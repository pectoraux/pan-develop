import { useMemo } from 'react'
import { Modal, Grid } from '@pancakeswap/uikit'
import { usePool, useCurrPool } from 'state/bettings/hooks'
import useTheme from 'hooks/useTheme'
import * as React from 'react';
import Iframe from 'react-iframe'
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
  const currAccount = useMemo(() => pool?.bettingEvents?.find((n) => n.id === currState[pool?.id]), [pool, currState]) 
  return (
    <Modal 
      title={t("Betting NFTs")} 
      onDismiss={onDismiss}
      headerBackground={theme.colors.textSubtle}
    >
      <Grid
          gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}
          alignItems="start"
        >
          {currAccount?.tickets?.map((nft) => <Iframe url={nft.metadataUrl} height={height} styles={{ marginBottom: "10px" }} id="myId" />)}
      </Grid>
    </Modal>
  )
}

export default WebPageModal
