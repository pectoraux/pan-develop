import { Flex, Box, Text, Button, LinkExternal, Input, AutoRenewIcon, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/router';
import { useTranslation } from '@pancakeswap/localization'
import capitalize from 'lodash/capitalize'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import RichTextEditor from 'components/RichText';
import Filters from './Filters'
import { GreyedOutContainer } from './styles'
import { Divider } from '../shared/styles'

interface RemoveStageProps {
  variant: 'product' | 'paywall'
  addLocation: () => void
}

const LocationStage: React.FC<any> = ({ 
  state,
  variant,
  updateValue,
  nftFilters, 
  setNftFilters,
  handleChange,
  handleRawValueChange,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const variantName = capitalize(variant)
  const [value, onChange] = useState('');
  const [value3, onChange3] = useState('');
  const [pendingFb, setPendingFb] = useState(false)
  const collectionAddress = useRouter().query.collectionAddress as string
  const [activeButtonIndex, setActiveButtonIndex] = useState<any>(0)
  const [activeButtonIndex3, setActiveButtonIndex3] = useState(0)
  console.log("activeButtonIndex===================>", state.original, state.gif, state.thumbnail)
  const handleThumbnailUpload = useCallback(
    (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('image', file);
        fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            resolve(result.data.url)
            updateValue('thumbnail', result.data.url)
          })
          .catch(() => reject(new Error('Upload failed')));
      }),
    []
  );

  return (
    <>
      <Box p="16px" maxWidth="360px">
        <Text fontSize="24px" bold>
          {t('%variantName% Location Data', { variantName })}
        </Text>
        {variantName !== "Paywall" ?
        <Flex justifyContent="center" alignItems="center" mb="10px">
          <ButtonMenu scale="sm" variant='subtle' activeIndex={activeButtonIndex} onItemClick={setActiveButtonIndex}>
            <ButtonMenuItem>{t("Image/Video")}</ButtonMenuItem>
            <ButtonMenuItem>
              <LinkExternal href={variant === 'item' ? 'createArticle' : `${collectionAddress}/createArticle`}>
                {t('Article')}
              </LinkExternal>
            </ButtonMenuItem>
          </ButtonMenu> 
      </Flex>:null}
      {activeButtonIndex ?
        <Text mt="24px" color="textSubtle" mb="8px">
          {t('Write your article in the opened page.')}
        </Text>:
        <>
        <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Product Name (same name)')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="tokenId"
          value={state.tokenId}
          placeholder={t('same name as in previous step')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Link to Video')}
        </Text>
        <RichTextEditor
          id="original"
          value={value}
          onChange={(e) => {
            updateValue('original', e)
            onChange(e)
          }}
          controls={[['video']]}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Image')}
        </Text>
        <StyledItemRow>
          <ButtonMenu scale="xs" variant='subtle' activeIndex={activeButtonIndex3} onItemClick={setActiveButtonIndex3}>
            <ButtonMenuItem >{t('Upload')}</ButtonMenuItem>
            <ButtonMenuItem >{t('Link')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
      {activeButtonIndex3 ?
      <GreyedOutContainer>
      <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
        {t('Link to Image/Gif')}
      </Text>
      <Input
        type="text"
        scale="sm"
        name="thumbnail"
        value={state.thumbnail}
        placeholder={t('input link to img/gif')}
        onChange={handleChange}
      />
    </GreyedOutContainer>:
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Upload Image/Gif')}
        </Text>
        <RichTextEditor
          id="thumbnail"
          value={value3}
          controls={[['image']]}
          onChange={onChange3}
          onImageUpload={handleThumbnailUpload}
        />
      </GreyedOutContainer>}
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Description')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="description"
          value={state.description}
          placeholder={t('input a description')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Dynamic Prices')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="prices"
          value={state.prices}
          placeholder={t('input dynamic prices')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Dynamic pricing start and period')}
        </Text>
        <StyledItemRow>
        <Input
          type="text"
          scale="sm"
          name='start'
          value={state.start}
          placeholder={t('input start')}
          onChange={handleChange}
        />
        <span style={{ padding: "8px" }} />
        <Input
          type="text"
          scale="sm"
          name='period'
          value={state.period}
          placeholder={t('input period')}
          onChange={handleChange}
        />
        </StyledItemRow>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Is the item tradable?')}
        </Text>
        <StyledItemRow>
          <ButtonMenu scale="xs" variant='subtle' activeIndex={state.isTradable} onItemClick={handleRawValueChange('isTradable')}>
            <ButtonMenuItem >{t('No')}</ButtonMenuItem>
            <ButtonMenuItem >{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
        <Text mt="24px" color="textSubtle" mb="8px">
          {t('Click on each one of these to set your %variantName%\'s location data', {variantName})}
        </Text>
        <Filters showWorkspace={false} nftFilters={nftFilters} setNftFilters={setNftFilters} />
        <GreyedOutContainer style={{ paddingTop: "18px" }}>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Not satisfied with above tags ? Add custom tags')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="customTags"
          value={state.customTags}
          placeholder={t('comma separated tags')}
          onChange={handleChange}
        />
        </GreyedOutContainer>
        <Text mt="16px" color="textSubtle">
          {t('Continue?')}
        </Text>
        </>}
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" 
          disabled={pendingFb}
          onClick={continueToNextStage}
          endIcon={pendingFb ? <AutoRenewIcon spin color="currentColor" /> : undefined}
        >
          {t('Save Product Data')}
        </Button>
      </Flex>
    </>
  )
}

export default LocationStage
