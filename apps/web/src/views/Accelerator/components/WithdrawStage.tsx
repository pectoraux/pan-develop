import { useState, useMemo } from 'react'
import { Flex, Box, Text, Button, Pool } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { GreyedOutContainer, Divider } from './styles'

interface RemoveStageProps {
  pool?: any
  currBribeAddress: any 
  setCurrBribeAddress: (any) => void
  continueToNextStage: () => void
}

const RemoveStage: React.FC<any> = ({ 
  pool,
  currBribeAddress,
  setCurrBribeAddress,
  continueToNextStage 
}) => {
  const { t } = useTranslation()
  const currBribe = useMemo(() => {
    if (pool.userDataLoaded) {
      return pool.userData.bribes?.find((bribe) => bribe.tokenAddress === currBribeAddress)
    } 
    return pool.poolBribes?.find((bribe) => bribe.tokenAddress === currBribeAddress)
  },[currBribeAddress, pool])

  return (
    <>
    <GreyedOutContainer>
    {pool.bribes?.length ?
      <Flex mt="8px" mb="2px" justifyContent='center'>
        <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
          {t('Pick a bribe')}
        </Text>
      </Flex> : null}
      <Flex flexWrap="wrap" justifyContent='center' alignItems="center">
        {pool.bribes?.map((bribe) => (
          <Button
            key={bribe.tokenAddress}
            onClick={() => setCurrBribeAddress(bribe.tokenAddress)}
            mt="4px"
            mr={['2px', '2px', '4px', '4px']}
            scale="sm"
            variant={currBribeAddress === bribe.tokenAddress ? 'subtle' : 'tertiary'}
          >
            {bribe.symbol}
          </Button>
          ))}
        </Flex>
        </GreyedOutContainer>
      <Box p="16px" maxWidth="360px">
        <Text fontSize="24px" bold>
          {t('Claim Bribes')}
        </Text>
        <Text mt="24px" color="textSubtle">
          {t('Use this to withdraw all earnings from bribes')}
        </Text>
        <Text mt="16px" color="textSubtle">
          {t('Continue?')}
        </Text>
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Claim')}
        </Button>
      </Flex>
    </>
  )
}

export default RemoveStage
