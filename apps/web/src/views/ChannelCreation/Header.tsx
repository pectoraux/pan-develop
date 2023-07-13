import { useContext } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@pancakeswap/wagmi'
import { Breadcrumbs, Heading, Text, Link, Button } from '@pancakeswap/uikit'
import { useTranslation, TranslateFunction } from '@pancakeswap/localization'
import { ProfileCreationContext } from './contexts/ProfileCreationProvider'

const Wrapper = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.colors.textSubtle};
  margin-top: 32px;
  margin-bottom: 24px;
  padding-bottom: 24px;
`

const steps = (t: TranslateFunction) => [
  t('Create Channel')
]

const Header: React.FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { currentStep } = useContext(ProfileCreationContext)

  return (
    <Wrapper>
      <Heading as="h1" scale="xxl" color="secondary" mb="8px" id="profile-setup-title">
        {t('Channel Setup')}
      </Heading>
      <Heading as="h2" scale="lg" mb="8px">
        {t('Create a storefront to sell your products and services throughout the world!')}
      </Heading>
      <Link href={`/profile/${account}`}>
        <Button mb="24px" scale="sm" variant="secondary">
          {t('Go to profile')}
        </Button>
      </Link>
      <Breadcrumbs>
        {steps(t).map((translationKey, index) => {
          return (
            <Text key={t(translationKey)} color={index <= currentStep ? 'text' : 'textDisabled'}>
              {translationKey}
            </Text>
          )
        })}
      </Breadcrumbs>
    </Wrapper>
  )
}

export default Header
