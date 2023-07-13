import {
  AutoRenewIcon,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Input,
  Text,
  useToast,
} from '@pancakeswap/uikit'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useWeb3React } from '@pancakeswap/wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import snapshot from '@snapshot-labs/snapshot.js'
import isEmpty from 'lodash/isEmpty'
import times from 'lodash/times'
import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useInitialBlock } from 'state/block/hooks'
import useCatchTxError from 'hooks/useCatchTxError'
import { useValuepoolVoterContract } from 'hooks/useContract'

import { useTranslation } from '@pancakeswap/localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Container from 'components/Layout/Container'
import { PageMeta } from 'components/Layout/Page'
import ReactMarkdown from 'components/ReactMarkdown'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { DatePickerPortal } from 'views/Voting/components/DatePicker'
import Filters from "views/CanCan/market/components/BuySellModals/SellModal/Filters"
import Layout from '../components/Layout'
import { ADMINS } from '../config'
import { Label, SecondaryLabel } from './styles'

const hub = 'https://hub.snapshot.org'
const client = new snapshot.Client712(hub)

const EasyMde = dynamic(() => import('components/EasyMde'), {
  ssr: false,
})

const CreateProposal = () => {
  const { push, query } = useRouter()
  const [state, setState] = useState<any>(() => ({
    title: '',
    body: '',
    pool: '',
    id: '',
    ve: '',
    decimals: 18,
    tokenId: '',
    tokenAddress: '',
    amount: '',
    choices: ["Up Vote", "Down Vote"]
  }))
  const [isLoading, setIsLoading] = useState(false)
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { toastSuccess, toastError } = useToast()
  const { title, body } = state
  // const formErrors = getFormErrors(state, t)
  const [nftFilters, setNftFilters] = useState<any>({})
  
  // const { status, data } = useSWR([`votes-${pool?.name ?? ''}`, filterState], async () => getVavaVotes(pool?._va ?? ''))

  const { callWithGasPrice } = useCallWithGasPrice()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const valuepoolVoterContract = useValuepoolVoterContract()
  
  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const amount = getDecimalAmount(state.amount ?? 0, state.decimals)
      const args = [
        state.ve,
        state.pool,
        state.tokenAddress,
        state.tokenId,
        amount?.toString(),
        state.title,
        state.body
      ]
      const args2 = [
        state.ve,
        state.pool,
        nftFilters?.country?.toString(),
        nftFilters?.city?.toString(),
        nftFilters?.product?.toString(),
      ]
      console.log("createGauge==================>",args, args2)
      return callWithGasPrice(valuepoolVoterContract, 'createGauge', args)
      .then(() => {
        return callWithGasPrice(valuepoolVoterContract, 'updateTags', args2)
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("err==================>", err)
        toastError(
          t('Issue creating proposal'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {err}
          </ToastDescriptionWithTx>,
        )
      })
    })
  if (receipt?.status) {
      setIsLoading(false);
      toastSuccess(
        t('Proposal successfully created'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start receiving votes on your proposal.')}
        </ToastDescriptionWithTx>,
      )
    }
}, [
  t,
  state,
  nftFilters,
  toastError,
  toastSuccess,
  callWithGasPrice,
  valuepoolVoterContract,
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

  const options = useMemo(() => {
    return {
      hideIcons:
        account && ADMINS.includes(account.toLowerCase())
          ? []
          : ['guide', 'fullscreen', 'preview', 'side-by-side', 'image'],
    }
  }, [account])

  return (
    <Container py="40px">
      <PageMeta />
      <Box mb="48px">
        <Breadcrumbs>
          <Link href='/valuepools'>{t('ValuePool')}</Link>
          <Link href='/valuepools/voting'>{t('Voting')}</Link>
          <Text>{t('Make a Proposal')}</Text>
        </Breadcrumbs>
      </Box>
        <Layout>
          <Box>
            <Box mb="24px">
              <Label htmlFor="title">{t('Title')}</Label>
              <Input id="title" name="title" value={title} scale="lg" onChange={handleChange} required />
              {/* {formErrors.name && fieldsState.name && <FormErrors errors={formErrors.name} />} */}
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
              {/* {formErrors.body && fieldsState.body && <FormErrors errors={formErrors.body} />} */}
            </Box>
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
                  <SecondaryLabel>{t('veNFT Address')}</SecondaryLabel>
                  <Input
                    type="text"
                    scale="sm"
                    name='ve'
                    value={state.ve}
                    placeholder={t('input ve address')}
                    onChange={handleChange}
                  />
                </Box>
                <Box mb="24px">
                  <SecondaryLabel>{t('Decimals')}</SecondaryLabel>
                  <Input
                    type="text"
                    scale="sm"
                    name='decimals'
                    value={state.decimals}
                    placeholder={t('input decimals')}
                    onChange={handleChange}
                  />
                </Box>
                <Box mb="24px">
                  <SecondaryLabel>{t('Owner Address')}</SecondaryLabel>
                  <Input
                    type="text"
                    scale="sm"
                    name='pool'
                    value={state.pool}
                    placeholder={t('input owner address')}
                    onChange={handleChange}
                  />
                </Box>
                <Box mb="24px">
                  <SecondaryLabel>{t('Token Address')}</SecondaryLabel>
                  <Input
                    type="text"
                    scale="sm"
                    name='tokenAddress'
                    value={state.tokenAddress}
                    placeholder={t('input token address')}
                    onChange={handleChange}
                  />
                </Box>
                <Box mb="24px">
                  <SecondaryLabel>{t('Token ID')}</SecondaryLabel>
                  <Input
                    type="text"
                    scale="sm"
                    name='tokenId'
                    value={state.tokenId}
                    placeholder={t('input token id')}
                    onChange={handleChange}
                  />
                </Box>
                <Box mb="24px">
                  <SecondaryLabel>{t('Amount')}</SecondaryLabel>
                  <Input
                    type="text"
                    scale="sm"
                    name='amount'
                    value={state.amount}
                    placeholder={t('input amount to withdraw')}
                    onChange={handleChange}
                  />
                </Box>
                <Filters showWorkspace={false} nftFilters={nftFilters} setNftFilters={setNftFilters} />
                {account ? (
                  <>
                    <Button
                      type="submit"
                      width="100%"
                      isLoading={isLoading}
                      endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : null}
                      onClick={handleSubmit}
                      // disabled={!isEmpty(formErrors)}
                      mb="16px"
                    >
                      {t('Publish')}
                    </Button>
                  {/* <SecondaryLabel>{t('Voting Power: %vp%', { vp: balances.find((balance) => balance.id === state.tokenId)?.lockValue})}</SecondaryLabel> */}
                    {/* <Button scale="sm" type="button" variant="text" onClick={onPresentVoteDetailsModal} p={0}>
                      {t('Check voting power')}
                    </Button> */}
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
