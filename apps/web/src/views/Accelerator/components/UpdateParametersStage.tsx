import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import dynamic from 'next/dynamic'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  original: any
  thumbnail: any
  title: any
  description: any
  setOriginal?: (any) => void
  setThumbnail?: (any) => void
  setTitle?: (any) => void
  setDescription?: (any) => void
  continueToNextStage?: () => void
}

const EasyMde = dynamic(() => import('components/EasyMde'), {
  ssr: false,
})

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const SetPriceStage: React.FC<any> = ({
  original,
  thumbnail,
  title,
  description,
  setOriginal,
  setThumbnail,
  setTitle,
  setDescription,
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
          {t('Media Link')}
        </Text>
        <Input
          type="text"
          scale="sm"
          value={original}
          placeholder={t('input your media link')}
          onChange={(e) => setOriginal(e.target.value)}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Thumbnail')}
        </Text>
        <Input
          type="text"
          scale="sm"
          value={thumbnail}
          placeholder={t('input link to thumbnail')}
          onChange={(e) => setThumbnail(e.target.value)}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Title')}
        </Text>
        <Input
          type="text"
          scale="sm"
          value={title}
          placeholder={t('input pitch title')}
          onChange={(e) => setTitle(e.target.value)}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Description')}
        </Text>
      <EasyMde
        id="description"
        name="description"
        onTextChange={(val) => setDescription(val)}
        value={description}
        required
      />
      </GreyedOutContainer>
    <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
      <Flex alignSelf="flex-start">
        <ErrorIcon width={24} height={24} color="textSubtle" />
      </Flex>
      <Box>
        <Text small color="textSubtle">
          {t('The will update your pitch. Please read the documentation for more information on each parameter')}
        </Text>
      </Box>
    </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
          // disabled={priceIsValid || adjustedPriceIsTheSame || priceIsOutOfRange}
        >
          {t('Update Pitch')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
