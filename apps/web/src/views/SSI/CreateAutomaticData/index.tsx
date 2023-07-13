import {
  AutoRenewIcon,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Input,
  LinkExternal,
  Text,
  useModal,
  useToast,
} from '@pancakeswap/uikit'
import useSWR from 'swr'
import uniqueId from 'lodash/uniqueId'
import Select from 'components/Select/Select'
import { useWeb3React } from '@pancakeswap/wagmi'
import { ChangeEvent, useEffect,useState, useCallback } from 'react'
import { useInitialBlock } from 'state/block/hooks'

import { useTranslation } from '@pancakeswap/localization'
import truncateHash from '@pancakeswap/utils/truncateHash'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Container from 'components/Layout/Container'
import { PageMeta } from 'components/Layout/Page'
import Link from 'next/link'
import { getBlockExploreLink } from 'utils'
import { DatePickerPortal } from 'views/Voting/components/DatePicker'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useSSIContract } from 'hooks/useContract'
import EncryptRsa from 'encrypt-rsa'
import { getSSIData } from 'state/ssi/helpers'
import axios from 'axios'
import { SecondaryLabel } from './styles'
import Layout from '../components/Layout'
import { FormState } from './types'


const CreateProposal = () => {
  const [state, setState] = useState<any>(() => ({
    dataType: null,
    name: '',
    code: '',
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    profileId: '',
    auditorProfileId: '',
    searchable: false,
  }))
  const [isLoading, setIsLoading] = useState(false)
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const initialBlock = useInitialBlock()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const ssiContract = useSSIContract()
  const { toastSuccess, toastError } = useToast()
  const [randomCode, setRandomCode] = useState<any>()
  const { data } = useSWR(['ssi-data', account?.toLowerCase()], async () => getSSIData(1000,0,account?.toLowerCase()))
  const userData = data?.find((datum) => datum?.owner?.toLowerCase() === account?.toLowerCase())

  useEffect(() => setRandomCode(
    uniqueId(
      Date.now()?.toString()
    )
  ), [])

  const handleSubmit = async () => {
    setIsLoading(true)
    const messageHtml = `
      # Payswap SSI

      This is your verification code ++${randomCode}++
      
      _Thanks for using Payswap_
      `;
    const { data: emailRes } = await axios.post('/api/email', { 
      messageHtml,
      email: state.name
    })
    if (!emailRes.err) {
      setIsLoading(false)
        toastSuccess(
          t('Code Sent to your email address'),
          <ToastDescriptionWithTx>
            {t('Enter the code sent to your email below and then publish your email')}
          </ToastDescriptionWithTx>,
        )
    } else {
      setIsLoading(false)
        toastError(
          t('Failed to send code'),
          <ToastDescriptionWithTx>
            {t('Make sure your email is correct')}
          </ToastDescriptionWithTx>,
        )
    }
  }

  const handleCreateData = useCallback(async () => {
    try {
      setIsLoading(true)
      // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
        const encryptRsa = new EncryptRsa()
        const pk = `-----BEGIN PUBLIC KEY-----${userData?.ownerProfileId?.publicKey?.replace(/\s/g,'')}-----END PUBLIC KEY-----`
        const encryptedAnswer = state.name ? encryptRsa.encryptStringWithRsaPublicKey({ 
            text: state.name,   
            publicKey: pk,
          }):"";
          const args = [
            userData?.ownerProfileId?.id,
            userData?.ownerProfileId?.id,
            account,
            account,
            Date.now() / 1000,
            (Date.now() + 86400 * 24 * 54) / 1000,
            false,
            'email',
            encryptedAnswer,
            'general'
          ]
          console.log("public===================>", userData?.ownerProfileId?.publicKey, args)
          return callWithGasPrice(ssiContract, 'createData', args)
          .catch((err) => console.log("rerr1====================>", err))
      })
      if (receipt?.status) {
        setIsLoading(false)
        toastSuccess(
          t('Data Created'),
          <ToastDescriptionWithTx>
            {t('You can now start sharing this data with different services/users')}
          </ToastDescriptionWithTx>,
        )
      }
  } catch(err) {
    console.log("try err====================>", err)
  } finally {
    setIsLoading(false)
  }
}
  , [
    t,
  userData,
  state,
  account,
  ssiContract,
  toastSuccess,
  callWithGasPrice,
  fetchWithCatchTxError,
])

  const updateValue = (key: any, value: any) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))

    // Keep track of what fields the user has attempted to edit
    setFieldsState((prevFieldsState) => ({
      ...prevFieldsState,
      [key]: true,
    }))
  }

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    updateValue(inputName, value)
  }

  const handleTypeChange = (dataType_: string) => {
    updateValue('dataType', dataType_)
  }

  useEffect(() => {
    if (initialBlock > 0) {
      setState((prevState) => ({
        ...prevState,
        snapshot: initialBlock,
      }))
    }
  }, [initialBlock, setState])

  return (
    <Container py="40px">
      <PageMeta />
      <Box mb="48px">
        <Breadcrumbs>
          <Link href="/">{t('Home')}</Link>
          <Link href="/ssi">{t('SSI')}</Link>
          <Text>{t('Make an Entry')}</Text>
        </Breadcrumbs>
      </Box>
        <Layout>
          <Box>
            <Card>
              <CardHeader>
                <Heading as="h3" scale="md">
                  {t('Actions')}
                </Heading>
              </CardHeader>
              <CardBody>
                <Box mb="24px">
                  <SecondaryLabel>{t('Entry Type')}</SecondaryLabel>
                  <Select
                    // name="dataType"
                    options={[
                      {
                        label: t('Email'),
                        value: t('email'),
                      },
                      {
                        label: t('Phone Number'),
                        value: t('phone'),
                      },
                    ]}
                    onOptionChange={(val)=>{handleTypeChange(val.value)}}
                  />
                </Box>
                <Box mb="24px">
                  <SecondaryLabel>{t('Email')}</SecondaryLabel>
                  <Input 
                    id="name" 
                    name="name" 
                    value={state.name} 
                    scale="lg" 
                    onChange={handleChange} 
                    required 
                  />
                </Box>
                <Box mb="24px">
                  <SecondaryLabel>{t('Code')}</SecondaryLabel>
                  <Input 
                    id="code" 
                    name="code" 
                    value={state.code} 
                    scale="lg" 
                    onChange={handleChange} 
                    required 
                  />
                </Box>
                {account && (
                  <Flex alignItems="center" mb="8px">
                    <Text color="textSubtle" mr="16px">
                      {t('Creator')}
                    </Text>
                    <LinkExternal href={getBlockExploreLink(account, 'address')}>{truncateHash(account)}</LinkExternal>
                  </Flex>
                )}
                {account ? (
                  <>
                    <Button
                      type="submit"
                      width="100%"
                      isLoading={isLoading}
                      onClick={state.code === randomCode ? handleCreateData : handleSubmit}
                      endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : null}
                      disabled={!state.name}
                      mb="16px"
                    >
                      {state.code === randomCode ? t('Publish') : t('Send')}
                    </Button>
                  </>
                ) : (
                  <ConnectWalletButton width="100%" type="button" />
                )}
              </CardBody>
            </Card>
          </Box>
        </Layout>
      <DatePickerPortal />
    </Container>
  )
}

export default CreateProposal
