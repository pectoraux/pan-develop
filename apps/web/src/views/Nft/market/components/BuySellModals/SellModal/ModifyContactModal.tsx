import { Flex, Box, Text, Button, Input } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Filters from 'views/ChannelCreation/Filters'
import { GreyedOutContainer } from './styles'
import { Divider } from '../shared/styles'

interface RemoveStageProps {
  state: any,
  nftFilters: any, 
  setNftFilters: (any) => void
  handleChange: (any) => void
  continueToNextStage: () => void
}

const ModifyCollectionModal: React.FC<any> = ({ 
  state,
  nftFilters, 
  setNftFilters,
  handleChange,
  continueToNextStage }) => {
  const { t } = useTranslation()

  return (
    <>
      <Box p="16px" maxWidth="360px">
        <Text fontSize="24px" bold>
          {t('Modify Channel Info')}
        </Text>
        <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Name')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='name'
          value={state.name}
          placeholder={t('input channel name')}
          onChange={handleChange}
        />
        </GreyedOutContainer>
        <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Channel Description')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='description'
          value={state.description}
          placeholder={t('input channel description')}
          onChange={handleChange}
        />
        </GreyedOutContainer>
        <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Contact Channels')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='contactChannels'
          value={state.contactChannels}
          placeholder={t('input contact channels')}
          onChange={handleChange}
        />
        </GreyedOutContainer>
        <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Contacts')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='contacts'
          placeholder={t('input contacts')}
          value={state.contacts}
          onChange={handleChange}
        />
        </GreyedOutContainer>
        <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Small Banner')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='bannerSmall'
          value={state.bannerSmall}
          placeholder={t('small banner(1500x500)')}
          onChange={handleChange}
        />
        </GreyedOutContainer>
        <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Large Banner')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='bannerLarge'
          value={state.bannerLarge}
          placeholder={t('large banner(1500x500)')}
          onChange={handleChange}
        />
        </GreyedOutContainer>
        <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Avatar')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='avatar'
          value={state.avatar}
          placeholder={t('avatar(700x700)')}
          onChange={handleChange}
        />
        </GreyedOutContainer>
        <Filters nftFilters={nftFilters} setNftFilters={setNftFilters} />
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Confirm')}
        </Button>
      </Flex>
    </>
  )
}

export default ModifyCollectionModal
