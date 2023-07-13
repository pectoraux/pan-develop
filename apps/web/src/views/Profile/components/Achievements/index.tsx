import { Card, CardBody, Heading } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import AchievementsList from './AchievementsList'

const Achievements: React.FC<
  React.PropsWithChildren<{
    sousId?:any,
    onSuccess?: () => void
  }>
> = () => {
  const { t } = useTranslation()
  
  return (
    <Card>
      <CardBody>
        <Heading as="h4" scale="md" mb="16px">
          {t('Credit Report')}
        </Heading>
        <AchievementsList />
      </CardBody>
    </Card>
  )
}

export default Achievements
