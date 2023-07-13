import { useState, useCallback } from 'react'
import RichTextEditor from 'components/RichText';
import { Flex, Box, Text, Button } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
// import { Web3Storage, getFilesFromPath } from 'web3.storage'
import { Divider } from '../shared/styles'

interface RemoveStageProps {
  handleRawValueChange?: any
}

const PublishMediaStage: React.FC<any> = ({ state, updateValue }) => {
  const { t } = useTranslation()
  const [value, onChange] = useState('');
  console.log("PublishMediaStage===================>", value, state.thumbnail)
  // const token = process.env.API_TOKEN
  // const client = new Web3Storage({ token })

  const handleImageUpload = useCallback(
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
            console.log("1PublishMediaStage===================>", result.data.url)
            updateValue('thumbnail', result.data.url)
          })
          .catch(() => reject(new Error('Upload failed')));
      }),
    []
  );

  return (
    <>
      <Box p="16px">
        <Text fontSize="24px" bold>
          {t('Upload Media')}
        </Text>
        <Text mt="24px" color="textSubtle" mb="8px">
          {t('Your media will be uploaded to IPFS.')}
        </Text>
        <RichTextEditor
          id="rte"
          value={value}
          onChange={onChange}
          controls={[['image', 'video']]}
          // onImageUpload={handleImageUpload}
        />
        <Text mt="16px" color="textSubtle">
          {t('Continue?')}
        </Text>
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        {/* <Button mb="8px" onClick={uploadMedia}>
          {t('Upload')}
        </Button> */}
      </Flex>
    </>
  )
}

export default PublishMediaStage
