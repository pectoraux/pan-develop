import { Flex, Grid, Text, Button, Input, BinanceIcon, ErrorIcon, LinkExternal} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { NftToken } from 'state/cancan/types'
import { Divider, RoundedImage } from '../shared/styles'
import { GreyedOutContainer } from './styles'

interface TransferStageProps {
  nftToSell?: any
  lowestPrice: number
  paymentCredits: string
  setPaymentCredits: React.Dispatch<React.SetStateAction<string>>
  creditUsers: string
  setCreditUsers: React.Dispatch<React.SetStateAction<string>>
  continueToNextStage: () => void
}

const BurnTokenForCreditStage: React.FC<any> = ({
  state,
  nftToSell,
  paymentCredits,
  setPaymentCredits,
  collectionId,
  creditUsers,
  setCreditUsers,
  handleChange,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const isInvalidField1 = false
  const isInvalidField2 = false
  const chunks = nftToSell?.images && nftToSell?.images?.split(",")
  const thumbnail = chunks?.length > 0 && nftToSell?.images?.split(",")[0]
  const getErrorText = () => {
    // if (isInvalidField1) {
    //   return t('This address is invalid')
    // }
    return null
  }
  return (
    <>
      <Text fontSize="22px" bold px="16px" pt="16px">
        {t('Reward Customers With Credits')}
      </Text>
      <Flex p="16px">
        <RoundedImage src={thumbnail} height={68} width={68} mr="8px" />
        <Grid flex="1" gridTemplateColumns="1fr 1fr" alignItems="center">
          <Text bold>{nftToSell?.tokenId}</Text>
          <Text fontSize="12px" color="textSubtle" textAlign="right">
            {`Collection #${collectionId}`}
          </Text>
        </Grid>
      </Flex>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('User Address')}
        </Text>
        <Input
          scale="sm"
          placeholder={t('input user address')}
          value={creditUsers}
          onChange={(e) => setCreditUsers(e.target.value)}
        />
        {isInvalidField1 && (
            <Text fontSize="12px" color="failure" mt="4px">
              {getErrorText()}
            </Text>
        )}
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Product ID')}
        </Text>
        <Input
          // ref={inputRef}
          type="text"
          scale="sm"
          name='productId'
          value={state.productId}
          placeholder={t('input product id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Payment Credit')}
        </Text>
        <Input
          // ref={inputRef}
          type="text"
          inputMode="decimal"
          pattern="^[0-9]+[.,]?[0-9]*$"
          scale="sm"
          value={paymentCredits}
          placeholder={t('input payment credit')}
          onChange={(e) => setPaymentCredits(e.target.value)}
        />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Text small color="textSubtle">
          {t("This action will create payment credit for the specified user's address.")}
        </Text>
      </Grid>
      <Flex flexDirection="column" alignItems="center" justifyContent="space-between" height="150px">
        <LinkExternal href=''>{t('Learn more about payment credits')}</LinkExternal>
      </Flex>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
          disabled={isInvalidField1 || isInvalidField2 }
        >
          {t('Confirm')}
        </Button>
      </Flex>
    </>
  )
}

export default BurnTokenForCreditStage
