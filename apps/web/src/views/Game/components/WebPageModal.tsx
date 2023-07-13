import styled from 'styled-components'
import {
  Modal,
  Flex,
  LinkExternal,
} from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import * as React from 'react';
import Iframe from 'react-iframe'


const StyledModal = styled(Modal)`
  position: relative;
  scroll-snap-align: start;
  overflow: hidden;
`

interface BuyTicketsModalProps {
  title: string
  link: string
  onDismiss?: () => void
}
const StyledLinkExternal = styled(LinkExternal)`
    font-weight: 400;
  `
  
const WebPageModal: React.FC<any> = ({ title, link, width="100px", height="400px", onDismiss }) => {
  const { theme } = useTheme()

  return (
    <Modal 
      title={<StyledLinkExternal href={link}>{title}</StyledLinkExternal>} 
      onDismiss={onDismiss}
      bodyPadding='0'
      width={width}
      minWidth="0"
      headerBackground={theme.colors.textSubtle}
    >
      <Flex justifyContent="center" alignItems="center" ml="10px">
        <Iframe url={link}
          height={height}
          id="myId"
        />
      </Flex>
    </Modal>
  )
}

export default WebPageModal
