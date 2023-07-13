import { Box, Flex, FlexProps, Text,  CopyButton } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
// import { CopyButton } from '../../CopyButton'

interface CopyAddressProps extends FlexProps {
  account: string
  title?: string
}

const Wrapper = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-radius: 16px;
  position: relative;
`

const CopyAddress: React.FC<CopyAddressProps> = ({ title, account, ...props }) => {
  const { t } = useTranslation()
  return (
    <Box {...props}>
      <Wrapper>
        <Text fontSize="13px" bold color="text" as="span" textTransform="uppercase">
        {title ?? account}
        </Text>
        <CopyButton width="20px" text={account} tooltipTop={-30} tooltipMessage={t('Copied')} />
      </Wrapper>
    </Box>
  )
}

export default CopyAddress
