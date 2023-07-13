import styled from 'styled-components'
import { Box, Flex, Text, ProfileAvatar } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const Container = styled(Flex)`
  min-width: 158px;
  max-width: 158px;
  padding: 4px 4px 4px 10px;
  border-top: solid 2px ${({ theme }) => theme.colors.cardBorder};
  margin: auto;
  &:first-child {
    border: 0;
  }
`

interface WinnerProps {
  address: string
}

const Winner: React.FC<any> = ({ info }) => {
  const { t } = useTranslation()
  return (
    <Container>
      <ProfileAvatar style={{ alignSelf: 'center' }} width={24} height={24} src='' />
      <Box ml="4px">
        <Text fontSize="12px" color="primary">
          {t('Token ID:')} {info.tokenId}
        </Text>
        <Text minHeight="18px" fontSize="12px" color="primary">
          {t('Ratings:')} {info.ratings?.toString()}
        </Text>
        <Text minHeight="18px" fontSize="12px" color="primary">
          {t('Category:')} {info.category}
        </Text>
      </Box>
    </Container>
  )
}

export default Winner
