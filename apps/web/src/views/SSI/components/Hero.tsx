import { Box, Button, Flex, Heading, ProposalIcon, AutoRenewIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import Container from 'components/Layout/Container'
import Link from 'next/link'
import useSWR from 'swr'
import { useWeb3React } from '@pancakeswap/wagmi'
import { FetchStatus } from 'config/constants/types'
import { getSSIDataFromAccount } from 'state/ssi/helpers'
import SearchBar from './SearchBar'

const StyledHero = styled(Box)`
  background: ${({ theme }) => theme.colors.gradientBubblegum};
  padding-bottom: 32px;
  padding-top: 32px;
`

const Hero = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { status, data } = useSWR(['profile-data', account?.toLowerCase()], async () => getSSIDataFromAccount(account?.toLowerCase()))

  return (
    <StyledHero>
      <Container>
        <Flex alignItems="center" justifyContent="space-between">
          <Box pr="32px">
            <Heading as="h1" scale="xxl" color="secondary" mb="16px">
              {t('SSI')}
            </Heading>
            <Heading as="h3" scale="lg" mb="16px">
              {t('Create a Self Sovereign Identity and own your data')}
            </Heading>
            <Flex>
              {status === FetchStatus.Fetched && !!data.publicKey ?
              <Flex flexDirection="column">
              <Flex mb="19px">
              <Link href="/ssi/proposal/create" passHref prefetch={false}>
                <Button startIcon={<ProposalIcon color="currentColor" width="24px" />}>{t('Make an Entry')}</Button>
              </Link>
              </Flex>
              <Link href="/ssi/proposal/createAutomaticData" passHref prefetch={false}>
                <Button startIcon={<ProposalIcon color="currentColor" width="24px" />}>{t('Make an Automatic Entry')}</Button>
              </Link>

              </Flex>:
              <Link href="/ssi/proposal/createKeys" passHref prefetch={false}>
                <Button 
                  disabled={status === FetchStatus.Fetching}
                  endIcon={status === FetchStatus.Fetching ? <AutoRenewIcon spin color="currentColor" /> : null}
                  startIcon={<ProposalIcon color="currentColor" width="24px" />}>{t('Create Keys')}</Button>
              </Link>}
            </Flex>
          </Box>
          <Box>
            <SearchBar />
          </Box>
        </Flex>
      </Container>
    </StyledHero>
  )
}

export default Hero
