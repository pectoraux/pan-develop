import { useState } from 'react'
import { Card, CardBody, Heading, Text, LinkExternal, Checkbox, Flex } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import NextStepButton from './NextStepButton'
import useProfileCreation from './contexts/hook'

const InitBounty: React.FC = () => {
  const { actions } = useProfileCreation()
  const [isAcknowledged, setIsAcknowledged] = useState(false)
  const { t } = useTranslation()
  const handleAcknowledge = () => setIsAcknowledged(!isAcknowledged)

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {t('Step %num%', { num: 1 })}
      </Text>
      <Heading as="h3" scale="xl" mb="24px">
        {t('Initialize a Bounty')}
      </Heading>
      <Text as="p">{t('The bounty is used to keep users honest.')}</Text>
      <Text as="p">{t('It can be claimed through the stake market voter in case of dishonesty.')}</Text>
      <Text as="p">{t('Click next if you already have a bounty, else please create one before proceeding further')}</Text>
      <Card mb="24px">
        <CardBody>
          <Flex flexDirection='column' justifyContent='center' alignItems='center'>
          <LinkExternal mb="20px" ml="40px">{t('Go to Bounty Page')}</LinkExternal>
          <label htmlFor="checkbox" style={{ display: 'block', cursor: 'pointer', marginBottom: '24px' }}>
            <Flex alignItems="center">
              <div style={{ flex: 'none' }}>
                <Checkbox id="checkbox" scale="sm" checked={isAcknowledged} onChange={handleAcknowledge} />
              </div>
              <Text ml="8px">{t('I have a created bounty for my profile')}</Text>
            </Flex>
          </label>
          </Flex>
        </CardBody>
      </Card>
      <NextStepButton onClick={actions.nextStep} disabled={!isAcknowledged}>
        {t('Next Step')}
      </NextStepButton>
    </>
  )
}

export default InitBounty