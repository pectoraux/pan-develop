import { Flex, Box, Text, Button } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Divider } from './styles'

interface RemoveStageProps {
  continueToNextStage: () => void
}

const RemoveStage: React.FC<any> = ({ continueToNextStage }) => {
  const { t } = useTranslation()
  return (
    <>
      <Box p="16px" maxWidth="360px">
        <Text fontSize="24px" bold>
          {t('Mint Gaming NFT')}
        </Text>
        <Text mt="24px" color="textSubtle">
          {t('This will mint a gaming NFT for you.')}
        </Text>
        <Text mt="16px" color="textSubtle">
          {t('Continue?')}
        </Text>
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button variant="success" mb="8px" onClick={continueToNextStage}>
          {t('Mint')}
        </Button>
      </Flex>
    </>
  )
}

export default RemoveStage
