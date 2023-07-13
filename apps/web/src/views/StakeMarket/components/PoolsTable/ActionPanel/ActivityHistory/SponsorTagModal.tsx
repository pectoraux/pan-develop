import { useEffect, useRef, useState, useCallback } from 'react'
import { 
  Card, 
  Flex, 
  Grid, 
  Box, 
  Text, 
  Modal, 
  Button, 
  CardBody, 
  CardHeader, 
  AutoRenewIcon, 
  ErrorIcon, 
  useToast, 
  Heading,
  Input,
  ButtonMenu, 
  ButtonMenuItem,
} from '@pancakeswap/uikit'
import Select from 'components/Select/Select'
import ReactMarkdown from 'components/ReactMarkdown'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useNFTicketHelper } from 'hooks/useContract'
import { Divider } from 'views/ARPs/components/styles'
import { Entry } from 'state/types'
import { GreyedOutContainer } from 'views/Nft/market/components/BuySellModals/SellModal/styles'
// import { Label, SecondaryLabel } from '../CreateProposal/styles'
// import { combineDateAndTime } from '../CreateProposal/helpers'


interface SetPriceStageProps {
  entry: Entry
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateContentModal: React.FC<any> = ({
  tag,
  merchantId,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const { toastSuccess } = useToast()
  const [sponsorAddress, setSponsorAddress] = useState<any>('')
  const [minutes, setMinutes] = useState<any>(0)
  const [media, setMedia ] = useState<any>('')
  const nfticketHelper = useNFTicketHelper()

  const handleSponsorTag = useCallback(async () => {
    setPendingFb(true);
      // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
        console.log("rerr1=============>", [
          sponsorAddress,
          merchantId,
          minutes,
          tag,
          media
        ])
        return callWithGasPrice(nfticketHelper, 'sponsorTag', [
          sponsorAddress,
          merchantId,
          minutes,
          tag,
          media
        ])
        .catch((err) => console.log("err=============>", err))
      })
      if (receipt?.status) {
        toastSuccess(
          t('Data successfully shared'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('You can now show your NFTProof as proof of the data you shared.')}
          </ToastDescriptionWithTx>,
        )
      }
    onDismiss()
  }, [
    t,
    tag,
    media,
    minutes,
    onDismiss,
    merchantId,
    toastSuccess,
    nfticketHelper,
    sponsorAddress,
    callWithGasPrice,
    fetchWithCatchTxError,
  ])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <Modal 
    title={t('Sponsor Tag: [%tag%]', { tag })}
    onDismiss={onDismiss}
    > 
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Sponsor Card Address')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name='sponsor'
          value={sponsorAddress}
          placeholder={t('input address of sponsor card')}
          onChange={(e) => setSponsorAddress(e.target.value)}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Number of minutes')}
        </Text>
        <Input
          type="number"
          scale="sm"
          name='sponsor'
          value={minutes}
          placeholder={t('number of minutes to buy')}
          onChange={(e) => setMinutes(e.target.value)}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Media Link')}
        </Text>
        <Input
          type="text"
          scale="sm"
          value={media}
          placeholder={t('link to sponsored content')}
          onChange={(e) => setMedia(e.target.value)}
        />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t('This will display your media on NFTickets of users who purchased items from this collection with this tag.')}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={handleSponsorTag}
        >
          {t('Confirm Sponsorship')}
        </Button>
      </Flex>
    </Modal>
  )
}

export default CreateContentModal
