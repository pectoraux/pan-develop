import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  state: any,
  handleChange?: (any) => void
  continueToNextStage?: () => void
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const SetPriceStage: React.FC<any> = ({
  state,
  isNameUsed,
  handleChange,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('User Name')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='name'
          value={state.name}
          placeholder={t('input user name')}
        onChange={handleChange}
        />
      </GreyedOutContainer>
      {state.name ? 
      <Text color="primary" ml="20px" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
        {t("%name% is %pos% taken", { name: state.name, pos: isNameUsed ? '' : 'not' })}
      </Text>:null}
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Referrer Profile ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='referrerProfileId'
          value={state.referrerProfileId}
          placeholder={t('input referrer profile id')}
        onChange={handleChange}
        />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('The will create a new profile for your account. Please read the documentation for more details')}
        </Text>
      </Box>
    </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
        >
          {t('Create Profile')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
