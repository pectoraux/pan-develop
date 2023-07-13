import { Flex, Box, Text, Button, Input } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { GreyedOutContainer } from './styles'
import { Divider } from '../shared/styles'

interface RemoveStageProps {
  addTask: () => void
}

const TaskStage: React.FC<RemoveStageProps> = ({ addTask}) => {
  const { t } = useTranslation()
  return (
    <>
      <Box p="16px" maxWidth="360px">
        <Text fontSize="24px" bold>
          {t('Survey & Calendar Link')}
        </Text>
        <Text mt="24px" color="textSubtle" mb="8px">
          {t('Let users book an appointment on this product by creating a calendar event on sites like Calendly, Cal.com... and pasting it below. Calendly links will display inline whilst others will have users open them in a new tab.')}
        </Text>
        <GreyedOutContainer style={{ paddingTop: "18px" }}>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Link to your bookings')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='bookingsLink'
          placeholder={t('paste link to bookings here')}
          onChange={()=>{}}
        />
        </GreyedOutContainer>
        <Text mt="24px" color="textSubtle" mb="8px">
          {t('Have users complete a survey after each purchase to inform you on your product, best marketing channels... Create survey or quizzes on sites like SurveyMonkey...')}
        </Text>
        <GreyedOutContainer style={{ paddingTop: "18px" }}>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Link to your Survey/Quiz')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='surveyLink'
          placeholder={t('paste link to a survey or quiz here')}
          onChange={()=>{}}
        />
        </GreyedOutContainer>
        <Text mt="16px" color="textSubtle">
          {t('Continue?')}
        </Text>
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={addTask}>
          {t('Confirm')}
        </Button>
      </Flex>
    </>
  )
}

export default TaskStage
