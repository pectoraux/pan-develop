import styled from 'styled-components'
import { Box, Flex, Text, Heading } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Divider from 'components/Divider'
import Image from 'next/image'
import { usePotteryData } from 'state/pottery/hook'

const PrizeFundsContainer = styled(Flex)`
  width: 100%;
  margin: auto;
  padding: 0 24px;
  flex-direction: column;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.xl} {
    max-width: 1140px;
  }
`

const BulletList = styled.ul`
  list-style-type: none;
  margin-left: 8px;
  padding: 0;
  li {
    margin: 0;
    padding: 0;
  }
  li::before {
    content: '•';
    margin-right: 4px;
    color: ${({ theme }) => theme.colors.textSubtle};
  }
  li::marker {
    font-size: 12px;
  }
`

const StyledStepCard = styled(Box)`
  display: flex;
  align-self: center;
  position: relative;
  background: ${({ theme }) => theme.colors.cardBorder};
  padding: 1px 1px 3px 1px;
  border-radius: ${({ theme }) => theme.radii.card};
`

const StepCardInner = styled(Box)`
  width: 100%;
  padding: 24px;
  background: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => theme.radii.card};
`

const AllocationGrid = styled.div`
  display: grid;
  grid-template-columns: 4fr 1fr;
  grid-auto-rows: max-content;
  row-gap: 4px;
`

const AllocationColorCircle = styled.div<{ color: string }>`
  border-radius: 50%;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  background-color: ${({ color }) => color};
`

const AllocationMatch: React.FC<React.PropsWithChildren<{ color: string; text: string }>> = ({ color, text }) => {
  return (
    <Flex alignItems="center">
      <AllocationColorCircle color={color} />
      <Text color="textSubtle">{text}</Text>
    </Flex>
  )
}

const PoolAllocations = ({ data }) => {
  const { t } = useTranslation()
  const prizePool = 100 - parseInt(data?.teamShare || '0') - parseInt(data?.creatorShare || '0') - parseInt(data?.referrerFee || '0')
  return (
    <StyledStepCard width={['100%', '280px', '330px', '380px']}>
      <StepCardInner height="auto">
        <Flex mb="34px" justifyContent="center">
          <Image width={103} height={103} src="/images/pottery/chart.svg" />
        </Flex>
        <AllocationGrid>
          <AllocationMatch color="#D750B2" text={t('Prize Pool')} />
          <Text textAlign="right" bold mb="12px">
            {prizePool}%
          </Text>
          <AllocationMatch color="#A881FC" text={t('Creator Share')} />
          <Text textAlign="right" bold mb="12px">
            {parseInt(data?.creatorShare || '0')}%
          </Text>
          <AllocationMatch color="#36E8F5" text={t('Payswap Share')} />
          <Text textAlign="right" bold>
            {parseInt(data?.teamShare || '0')}%
          </Text>
        </AllocationGrid>
      </StepCardInner>
    </StyledStepCard>
  )
}

const PrizeFunds: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { data } = usePotteryData()
  const prizePool = 100 - parseInt(data?.teamShare || '0') - parseInt(data?.creatorShare || '0') - parseInt(data?.referrerFee || '0')

  return (
    <PrizeFundsContainer>
      <Heading mb="43px" scale="xl" color="secondary">
        {t('Split Breakdown')}
      </Heading>
      <Flex flexDirection={['column', 'column', 'column', 'column', 'row']}>
        <Flex width={['100%', '100%', '100%', '498px']} flexDirection="column">
          <Heading my="16px" scale="md">
            {t('Prize Pool (%val%%)', { val: prizePool })}
          </Heading>
          <BulletList>
            <li>
              <Text display="inline" color="textSubtle">
                {t('%val%% of the prize pot is distributed to players based on scores.', { val: prizePool })}
              </Text>
            </li>
          </BulletList>
          {parseInt(data?.creatorShare || '0') ?
          <>
          <Heading my="16px" scale="md">
            {t('Game Creator (%val%%)', { val: parseInt(data?.creatorShare || '0') })}
          </Heading>
          <BulletList>
            <li>
              <Text display="inline" color="textSubtle">
                {t("%val%% of the prize pot goes to the game's team", { val: parseInt(data?.creatorShare || '0') })}
              </Text>
            </li>
          </BulletList>
          </>:null}
          {parseInt(data?.teamShare || '0') ?
          <>
          <Heading my="16px" scale="md">
            {t('Payswap Fees (%val%%)', { val: parseInt(data?.teamShare || '0') })}
          </Heading>
          <BulletList>
            <li>
              <Text display="inline" color="textSubtle">
                {t('%val%% of the prize pot goes to the Payswap team', { val: parseInt(data?.teamShare || '0') })}
              </Text>
            </li>
          </BulletList>
          </>:null}
          {parseInt(data?.referrerFee || '0') ?
          <>
          <Heading my="16px" scale="md">
            {t('Referrer Fees (%val%%)', { val: parseInt(data?.referrerFee || '0') })}
          </Heading>
          <BulletList>
            <li>
              <Text display="inline" color="textSubtle">
                {t("%val%% of proceeds from each user goes to his/her referrer", { val: parseInt(data?.referrerFee || '0') })}
              </Text>
            </li>
          </BulletList>
          </>:null}
        </Flex>
        <Flex
          ml={['0px', '0px', '0px', '0px', '40px']}
          mt={['40px', '40px', '40px', '40px', '0px']}
          justifyContent="center"
        >
          <PoolAllocations data={data} />
        </Flex>
      </Flex>
      {/* <Text maxWidth="918px" mt="20px" fontSize="14px" color="textSubtle">
        {t(
          'Since the rewards from lock-staking are only distributed at the end of the duration, the prize pool to be distributed in each of the 10 weeks upon deposit is borrowed from the CAKE treasury based on the estimated APY. The rewards at the end of the duration from the deposit will be used to repay the treasury and to distribute the 20% staking rewards. Because the APY may change over the duration based on other deposits and their lock-periods in the lock CAKE pool, there may be a small deviance from the above percentages specified (+/- 10%). But, ultimately all staking rewards net of the Pottery fees will be returned to depositors through prize pool or rewards -- the expected value is the same.',
        )}
      </Text> */}
      <Box width="100%" m="40px 0">
        <Divider />
      </Box>
    </PrizeFundsContainer>
  )
}

export default PrizeFunds
