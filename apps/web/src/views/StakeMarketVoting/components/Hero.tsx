import { Box, Button, Flex, Heading, ProposalIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import Container from 'components/Layout/Container'
import Link from 'next/link'
import DesktopImage from './DesktopImage'

const StyledHero = styled(Box)`
  background: ${({ theme }) => theme.colors.gradientBubblegum};
  padding-bottom: 32px;
  padding-top: 32px;
`

const Hero = () => {
  const { t } = useTranslation()

  return (
    <StyledHero>
      <Container>
        <Flex alignItems="center" justifyContent="space-between">
          <Box pr="32px">
            <Heading as="h1" scale="xxl" color="secondary" mb="16px">
              {t('Litigations')}
            </Heading>
            <Heading as="h3" scale="lg" mb="16px">
              {t('Have your say in litigations opposing users of the stake market')}
            </Heading>
          </Box>
          <DesktopImage src="/images/voting/voting-presents.png" width={361} height={214} />
        </Flex>
      </Container>
    </StyledHero>
  )
}

export default Hero
