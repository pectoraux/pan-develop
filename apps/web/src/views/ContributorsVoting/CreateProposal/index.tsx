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
  useToast,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import times from 'lodash/times'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useInitialBlock } from 'state/block/hooks'

import { useTranslation } from '@pancakeswap/localization'
import truncateHash from '@pancakeswap/utils/truncateHash'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Container from 'components/Layout/Container'
import { PageMeta } from 'components/Layout/Page'
import ReactMarkdown from 'components/ReactMarkdown'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { getBlockExploreLink } from 'utils'
import { DatePickerPortal } from 'views/Voting/components/DatePicker'
import { useContributorsContract } from 'hooks/useContract'
import Layout from '../components/Layout'
import { ADMINS } from '../config'
import { Choice, makeChoice, MINIMUM_CHOICES } from './Choices'
import { getFormErrors } from './helpers'
import { FormErrors, Label, SecondaryLabel } from './styles'
import { FormState } from './types'

const EasyMde = dynamic(() => import('components/EasyMde'), {
  ssr: false,
})

const CreateProposal = () => {
  const [state, setState] = useState<any>(() => ({
    name: '',
    body: '',
    choices: times(MINIMUM_CHOICES).map(makeChoice),
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    snapshot: 0,
    mediaLink: '',
    original: '',
    thumbnail: ''
  }))
  const [isLoading, setIsLoading] = useState(false)
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const initialBlock = useInitialBlock()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess, toastError } = useToast()
  const [pendingFb, setPendingFb] = useState(false)
  const contributorsContract = useContributorsContract()
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const { name, body } = state
  const formErrors = getFormErrors(state, t)

  const handleCreatePitch = useCallback(async () => {
    setPendingFb(true);
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
    console.log("createClaim===============>", contributorsContract, [["","","",state.original,state.thumbnail],state.name,state.body])
      return callWithGasPrice(contributorsContract, 'updateContent', [
        ["","","",state.original,state.thumbnail],
        state.name,
        state.body
      ])
      .catch((err) => {
        setPendingFb(false);
        console.log("err0=================>", err)
        toastError(
          t('Issue creating or updating pitch'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {err}
          </ToastDescriptionWithTx>,
        )
      })
    })
    if (receipt?.status) {
      setPendingFb(false);
      toastSuccess(
        t('Pitch successfully updated'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start receiving votes on your pitch.')}
        </ToastDescriptionWithTx>,
      )
    }
  }, [
    t,
    state,
    toastError,
    toastSuccess,
    callWithGasPrice,
    contributorsContract,
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

  const handleEasyMdeChange = (value: string) => {
    updateValue('body', value)
  }

  const handleRawValueChange = (key: string) => (value: string) => {
    updateValue(key, value)
  }

  const options = useMemo(() => {
    return {
      hideIcons:
        account && ADMINS.includes(account.toLowerCase())
          ? []
          : ['guide', 'fullscreen', 'preview', 'side-by-side', 'image'],
    }
  }, [account])

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
          <Link href="/contributors">{t('Contributors')}</Link>
          <Link href="/contributors/voting">{t('Voting')}</Link>
          <Text>{t('Create or Update pitch')}</Text>
        </Breadcrumbs>
      </Box>
        <Layout>
         <Box>
            <Box mb="24px">
              <Label htmlFor="name">{t('Title')}</Label>
              <Input id="name" name="name" value={name} scale="lg" onChange={handleChange} required />
              {formErrors.name && fieldsState.name && <FormErrors errors={formErrors.name} />}
            </Box>
            <Box mb="24px">
              <Label htmlFor="body">{t('Content')}</Label>
              <Text color="textSubtle" mb="8px">
                {t('Tip: write in Markdown!')}
              </Text>
              <EasyMde
                id="body"
                name="body"
                onTextChange={handleEasyMdeChange}
                value={body}
                options={options}
                required
              />
              {formErrors.body && fieldsState.body && <FormErrors errors={formErrors.body} />}
            </Box>
            {body && (
              <Box mb="24px">
                <Card>
                  <CardHeader>
                    <Heading as="h3" scale="md">
                      {t('Preview')}
                    </Heading>
                  </CardHeader>
                  <CardBody p="0" px="24px">
                    <ReactMarkdown>{body}</ReactMarkdown>
                  </CardBody>
                </Card>
              </Box>
            )}
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
                  <SecondaryLabel>{t('Media Link')}</SecondaryLabel>
                  <Input
                    type="text"
                    scale="sm"
                    name='original'
                    value={state.original}
                    placeholder={t('input media link')}
                    onChange={handleChange}
                  />
                </Box>
                <Box mb="24px">
                  <SecondaryLabel>{t('Thumbnail')}</SecondaryLabel>
                  <Input
                    type="text"
                    scale="sm"
                    name='thumbnail'
                    value={state.thumbnail}
                    placeholder={t('input thumbnail link')}
                    onChange={handleChange}
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
                    <Button
                      type="submit"
                      width="100%"
                      isLoading={isLoading}
                      onClick={handleCreatePitch}
                      endIcon={pendingTx || pendingFb ? <AutoRenewIcon spin color="currentColor" /> : null}
                      mb="16px"
                    >
                      {t('Publish')}
                    </Button>
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
