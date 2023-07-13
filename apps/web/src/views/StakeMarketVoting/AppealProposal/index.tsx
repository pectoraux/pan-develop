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
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useWeb3React } from '@pancakeswap/wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import snapshot from '@snapshot-labs/snapshot.js'
import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import useCatchTxError from 'hooks/useCatchTxError'
import { useStakeMarketContract } from 'hooks/useContract'
import Filters from "views/CanCan/market/components/BuySellModals/SellModal/Filters"

import { useTranslation } from '@pancakeswap/localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Container from 'components/Layout/Container'
import { PageMeta } from 'components/Layout/Page'
import ReactMarkdown from 'components/ReactMarkdown'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { DatePickerPortal } from 'views/Voting/components/DatePicker'
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
    limitAmount: '',
    id: '',
    tokenId: '',
    attackerStakeId: '',
    defenderStakeId: '',
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
  const { signer: stakeMarketContract } = useStakeMarketContract()
  
  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const args = [
        state.attackerStakeId,
        // state.defenderStakeId,
        state.title,
        state.body,
        nftFilters.product?.toString() || ""
      ]
      console.log("updateStatusOrAppeal============>", args)
      return callWithGasPrice(stakeMarketContract, 'updateStatusOrAppeal', args)
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
        t('Litigation successfully updated/appealed'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start processing payments or receiving votes on your litigation.')}
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
  stakeMarketContract,
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
          <Link href='/stakemarket'>{t('Stake Market')}</Link>
          <Link href='/stakemarket/voting'>{t('Voting')}</Link>
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
                  <SecondaryLabel>{t('Attacker Stake ID')}</SecondaryLabel>
                  <Input
                    type="text"
                    scale="sm"
                    name='attackerStakeId'
                    value={state.attackerStakeId}
                    placeholder={t('input your stake id')}
                    onChange={handleChange}
                  />
                </Box>
                {/* <Box mb="24px">
                  <SecondaryLabel>{t('Defender Stake ID')}</SecondaryLabel>
                  <Input
                    type="text"
                    scale="sm"
                    name='defenderStakeId'
                    value={state.defenderStakeId}
                    placeholder={t('input defender stake id')}
                    onChange={handleChange}
                  />
                </Box> */}
                <Filters showWorkspace={false} showCountry={false} showCity={false} nftFilters={nftFilters} setNftFilters={setNftFilters} />
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
