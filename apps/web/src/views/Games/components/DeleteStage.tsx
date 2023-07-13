import { Flex, Box, Text, Input, Button } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { GreyedOutContainer, Divider } from './styles'

interface RemoveStageProps {
  continueToNextStage: () => void
}

const RemoveStage: React.FC<any> = ({ state, handleChange, continueToNextStage }) => {
  const { t } = useTranslation()
  return (
    <>
    <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Collection ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='collectionId'
          value={state.collectionId}
          placeholder={t('input your collection id')}
          onChange={handleChange}
        />
    </GreyedOutContainer>
      <Box p="16px" maxWidth="360px">
        <Text fontSize="24px" bold>
          {t('Delete Game')}
        </Text>
        <Text mt="24px" color="textSubtle">
          {t('Use this to remove your game from the factory.')}
        </Text>
        <Text mt="16px" color="textSubtle">
          {t('Continue?')}
        </Text>
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button variant="danger" mb="8px" onClick={continueToNextStage}>
          {t('Delete')}
        </Button>
      </Flex>
    </>
  )
}

export default RemoveStage
