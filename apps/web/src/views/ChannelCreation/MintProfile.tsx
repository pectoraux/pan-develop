import styled from 'styled-components'
import { useContext, useState, useCallback } from 'react'
import { AutoRenewIcon, Button, Card, CardBody, Heading, Input as UIKitInput, Text, Flex, useToast } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useProfileContract } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import NextStepButton from './NextStepButton'
import { ProfileCreationContext } from './contexts/ProfileCreationProvider'

const InputWrap = styled.div`
  position: relative;
  max-width: 240px;
  margin-bottom: 20px;
`

const Input = styled(UIKitInput)`
  padding-right: 40px;
`

const MintProfile: React.FC = () => {
  const [isDone, setIsDone] = useState(false)
  const [name, setName] = useState("")
  // const [bountyId, setBountyId] = useState("")
  const { actions } = useContext(ProfileCreationContext)
  const profileContract = useProfileContract()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isApproving } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()

  const handleCreateCollection = useCallback(async () => {
      // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
          return callWithGasPrice(profileContract, 'createProfile', [name])
          .catch((err) => {
            console.log("channel====================>", err)
          })
      })
      if (receipt?.status) {
          toastSuccess(
            t('Channel Created'),
            <ToastDescriptionWithTx txHash={receipt.transactionHash}>
              {t('You can now start listing your products either on CanCan or the NFT marketplace')}
            </ToastDescriptionWithTx>,
          )
          setIsDone(true);
      }
    }, [
      t,
      name,
      // bountyId,
      toastSuccess,
      profileContract,
      callWithGasPrice,
      fetchWithCatchTxError
    ])

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {t('Step %num%', { num: 3 })}
      </Text>
      <Heading as="h3" scale="xl" mb="24px">
        {t('Mint Profile NFT')}
      </Heading>
      <Card mb="24px">
        <CardBody>
          <Flex flexDirection='column' justifyContent='center' alignItems='center' >
          <InputWrap>
            <InputWrap>
                <Input
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('Enter your name')}
                  value={name}
                />
            </InputWrap>
          </InputWrap>
          <Button
            disabled={!name || isDone}
            onClick={handleCreateCollection}
            endIcon={isApproving ? <AutoRenewIcon spin color="currentColor" /> : undefined}
            id="approveStarterCollectible"
          >
            {t('Mint')}
          </Button>
          </Flex>
        </CardBody>
      </Card>
      <NextStepButton onClick={actions.nextStep} disabled={!isDone}>
        {t('Next Step')}
      </NextStepButton>
    </>
  )
}

export default MintProfile
