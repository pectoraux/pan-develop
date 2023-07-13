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
import Select from 'components/Select/Select'
import { useWeb3React } from '@pancakeswap/wagmi'
import times from 'lodash/times'
import { ChangeEvent, useEffect, useCallback, useState } from 'react'
import { useInitialBlock } from 'state/block/hooks'

import { useTranslation } from '@pancakeswap/localization'
import truncateHash from '@pancakeswap/utils/truncateHash'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Container from 'components/Layout/Container'
import { PageMeta } from 'components/Layout/Page'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getBlockExploreLink } from 'utils'
import { DatePicker, DatePickerPortal, TimePicker } from 'views/Voting/components/DatePicker'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useSSIContract } from 'hooks/useContract'
import EncryptRsa from 'encrypt-rsa'
import { getSSIDatum } from 'state/ssi/helpers'
import Choices, { Choice, makeChoice, MINIMUM_CHOICES } from './Choices'
import { combineDateAndTime, getFormErrors } from './helpers'
import { FormErrors, Label, SecondaryLabel } from './styles'
import Layout from '../components/Layout'
import VoteDetailsModal from '../components/VoteDetailsModal'
import { FormState } from './types'

const CreateProposal = () => {
  const [state, setState] = useState<any>(() => ({
    dataType: null,
    name: '',
    choices: times(MINIMUM_CHOICES).map(makeChoice),
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
  const { toastSuccess } = useToast()
  const { data } = useSWR(['profile-data', state.profileId], async () => getSSIDatum(state.profileId))
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const { name, choices } = state
  const formErrors = getFormErrors(state, t)

  const handleCreateData = useCallback(async () => {
      console.log("datadata===========================>", data)
      try {
        setIsLoading(true)
        // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
          const encryptRsa = new EncryptRsa()
          console.log("1public===================>",encryptRsa, choices)
          const questions = 
          state.choices.filter((choice, index) => {return index % 2 === 0 ? choice.value : false})
          state.choices.filter((choice, index) => {return index % 2 !== 0 ? choice.value : false})
          .map((choice, index) => {
            const pk = `-----BEGIN PUBLIC KEY-----${data.publicKey?.replace(/\s/g,'')}-----END PUBLIC KEY-----`
            console.log("1pk===================>", pk)
            const encryptedAnswer = choice.value ? encryptRsa.encryptStringWithRsaPublicKey({ 
              text: choice.value,   
              publicKey: pk,
            }):"";
            console.log("public===================>", data?.publicKey, [
              state.profileId,
              state.auditorProfileId,
              state.name,
              account,
              combineDateAndTime(state.startDate, state.startTime)?.toString(),
              combineDateAndTime(state.endDate, state.endTime)?.toString(),
              state.searchable,
              questions[index].value.toLowerCase(),
              state.searchable ? choice.value : encryptedAnswer,
              state.dataType
            ])
            return callWithGasPrice(ssiContract, 'createData', [
              state.profileId,
              state.auditorProfileId,
              state.name,
              account,
              combineDateAndTime(state.startDate, state.startTime)?.toString(),
              combineDateAndTime(state.endDate, state.endTime)?.toString(),
              state.searchable,
              questions[index].value.toLowerCase(),
              state.searchable ? choice.value : encryptedAnswer,
              state.dataType
            ])
            .catch((err) => console.log("rerr1====================>", err))
        })
      })
      if (receipt?.status) {
        setIsLoading(false)
        toastSuccess(
          t('Data Created'),
          <ToastDescriptionWithTx txHash={receipt?.transactionHash}>
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
    data,
    state,
    choices,
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

  const handleChoiceChange = (newChoices: Choice[]) => {
    updateValue('choices', newChoices)
  }

  const handleDateChange = (key: string) => (value: Date) => {
    updateValue(key, value)
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
            <Box mb="24px">
              <Label htmlFor="name">{t('Owner Wallet Address')}</Label>
              <Input id="name" name="name" value={name} scale="lg" onChange={handleChange} required />
              {formErrors.name && fieldsState.name && <FormErrors errors={formErrors.name} />}
            </Box>
            <Choices choices={choices} onChange={handleChoiceChange} />
            {formErrors.choices && fieldsState.choices && <FormErrors errors={formErrors.choices} />}
          </Box>
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
                        label: t('Others'),
                        value: t('others'),
                      },
                      {
                        label: t('General'),
                        value: t('general'),
                      },
                      {
                        label: t('HealthCare'),
                        value: t('healthcare'),
                      },
                      {
                        label: t('Education'),
                        value: t('education'),
                      },
                      {
                        label: t('Professional'),
                        value: t('professional'),
                      },
                      {
                        label: t('Properties'),
                        value: t('properties'),
                      },
                    ]}
                    onOptionChange={(val)=>{handleTypeChange(val.value)}}
                  />
                  {formErrors.dataType && fieldsState.dataType && <FormErrors errors={formErrors.dataType} />}
                </Box>
                <Box mb="24px">
                  <SecondaryLabel>{t('Entry Profile ID')}</SecondaryLabel>
                  <Input 
                    id="profileId" 
                    name="profileId" 
                    value={state.profileId} 
                    scale="lg" 
                    onChange={handleChange} 
                    required 
                  />
                  {formErrors.profileId && fieldsState.profileId && <FormErrors errors={formErrors.profileId} />}
                </Box>
                <Box mb="24px">
                  <SecondaryLabel>{t("Entry Auditor's Profile ID")}</SecondaryLabel>
                  <Input 
                    id="auditorProfileId" 
                    name="auditorProfileId" 
                    value={state.auditorProfileId} 
                    scale="lg" 
                    onChange={handleChange} 
                    required 
                  />
                  {formErrors.auditorProfileId && fieldsState.auditorProfileId && <FormErrors errors={formErrors.auditorProfileId} />}
                </Box>
                <Box mb="24px">
                  <SecondaryLabel>{t('Start Date')}</SecondaryLabel>
                  <DatePicker
                    name="startDate"
                    onChange={handleDateChange('startDate')}
                    selected={state.startDate}
                    placeholderText="YYYY/MM/DD"
                  />
                  {formErrors.startDate && fieldsState.startDate && <FormErrors errors={formErrors.startDate} />}
                </Box>
                <Box mb="24px">
                  <SecondaryLabel>{t('Start Time')}</SecondaryLabel>
                  <TimePicker
                    name="startTime"
                    onChange={handleDateChange('startTime')}
                    selected={state.startTime}
                    placeholderText="00:00"
                  />
                  {formErrors.startTime && fieldsState.startTime && <FormErrors errors={formErrors.startTime} />}
                </Box>
                <Box mb="24px">
                  <SecondaryLabel>{t('End Date')}</SecondaryLabel>
                  <DatePicker
                    name="endDate"
                    onChange={handleDateChange('endDate')}
                    selected={state.endDate}
                    placeholderText="YYYY/MM/DD"
                  />
                  {formErrors.endDate && fieldsState.endDate && <FormErrors errors={formErrors.endDate} />}
                </Box>
                <Box mb="24px">
                  <SecondaryLabel>{t('End Time')}</SecondaryLabel>
                  <TimePicker
                    name="endTime"
                    onChange={handleDateChange('endTime')}
                    selected={state.endTime}
                    placeholderText="00:00"
                  />
                  {formErrors.endTime && fieldsState.endTime && <FormErrors errors={formErrors.endTime} />}
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
                      onClick={handleCreateData}
                      endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : null}
                      // disabled={!isEmpty(formErrors)}
                      mb="16px"
                    >
                      {t('Publish')}
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
