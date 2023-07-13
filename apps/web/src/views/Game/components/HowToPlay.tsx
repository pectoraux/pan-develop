import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { Flex, Text, Card, Box } from '@pancakeswap/uikit'
import Divider from 'components/Divider'

const HowToPlayContainer = styled(Flex)`
  width: 100%;
  margin: auto;
  padding: 48px 24px 0 24px;
  flex-direction: column;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.xl} {
    max-width: 1140px;
    padding-top: 56px;
  }
`

const CardContainer = styled(Flex)`
  width: 100%;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
`

const CardStyle = styled(Card)`
  width: 100%;
  margin: 0 0 24px 0;
  &:last-child {
    margin-bottom: 0;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    width: calc(33.33% - 16px);
    margin: 0 24px 0 0;
    &:last-child {
      margin-right: 0;
    }
  }
`

type Step = { title: string; subtitle: string; label: string }

const HowToPlay: React.FC<any> = ({ pool }) => {
  const { t } = useTranslation()
  const symb = pool?.token?.symbol?.toUpperCase() ?? 'tokens'
  const steps: Step[] = [
    {
      label: t('Step %number%', { number: 1 }),
      title: t('Buy Minutes'),
      subtitle: t(
        'Deposit %symb% to buy enough minutes.', { symb }
      ),
    },
    {
      label: t('Step %number%', { number: 2 }),
      title: t('Play the game'),
      subtitle: t(
        'Open up the game page and play until your minutes are close to end. The game will assign you a score',
      ),
    },
    {
      label: t('Step %number%', { number: 3 }),
      title: t('Claim & Withdrawal'),
      subtitle: t(
        "Look at your score versus other players and when you're proud of it, claim your winnings",
      ),
    },
  ]

  return (
    <HowToPlayContainer>
      <Text fontSize="40px" mb="24px" color="secondary" bold>
        {t('How to Play')}
      </Text>
      <Text textAlign="center">
        {t(
          'Deposit %symb% to get minutes on your ticket. The more minutes you buy, the higher the chance of winning (and of course, higher the rewards)!', { symb }
        )}
      </Text>
      <Text mb="40px">{t('Simple!')}</Text>
      <CardContainer>
        {steps.map((step) => (
          <CardStyle key={step.label}>
            <Flex flexDirection="column" padding="24px">
              <Text fontSize="12px" mb="16px" textTransform="uppercase" bold textAlign="right">
                {step.label}
              </Text>
              <Text fontSize="24px" mb="16px" color="secondary" bold>
                {step.title}
              </Text>
              <Text color="textSubtle">{step.subtitle}</Text>
            </Flex>
          </CardStyle>
        ))}
      </CardContainer>
      <Box width="100%" m="40px 0">
        <Divider />
      </Box>
    </HowToPlayContainer>
  )
}

export default HowToPlay
