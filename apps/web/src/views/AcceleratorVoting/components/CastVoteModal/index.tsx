import { useTranslation } from '@pancakeswap/localization'
import { Box, Modal, useToast, Input } from '@pancakeswap/uikit'
import { FetchStatus } from 'config/constants/types'
import { useStakeMarketVoterContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { useGetVotingPower } from 'state/valuepoolvoting/hooks'
import { useState, useCallback, useEffect } from 'react'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import MainView from './MainView'
import { CastVoteModalProps, ConfirmVoteView } from './types'
import { VotingBoxBorder } from './styles'

const CastVoteModal: React.FC<any> = ({
  onSuccess,
  proposal,
  vote,
  onDismiss,
}) => {
  const [view, setView] = useState<ConfirmVoteView>(ConfirmVoteView.MAIN)
  const [modalIsOpen, setModalIsOpen] = useState(true)
  const [isPending, setIsPending] = useState(false)
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { signer: stakeMarketVoterContract } = useStakeMarketVoterContract()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [tokenId, setTokenId] = useState<any>(0)
  const [profileId, setProfileId] = useState<any>()
  const isStartView = view === ConfirmVoteView.MAIN
  const handleBack = isStartView ? null : () => setView(ConfirmVoteView.MAIN)

  const { data, refetch, status } = useGetVotingPower(proposal?.ve, tokenId)
  const [total, setTotal] = useState()
  
  // useEffect(() => {
  //   // const val = getBalanceNumber(data?.balance, data?.decimals)
  //   setTotal(parseFloat(data.percentile) + parseFloat(proposal?.percentile))
  // }, [data, proposal])

  const title = {
    [ConfirmVoteView.MAIN]: t('Confirm Vote'),
    [ConfirmVoteView.DETAILS]: t('Voting Power'),
  }

  const handleDismiss = () => {
    setModalIsOpen(false)
    onDismiss()
  }

  const handleCreateCollection = useCallback(async () => {
        setIsPending(true)
        // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
          console.log("st2==============>", [
            proposal?.id, 
            proposal?.ve, 
            tokenId,
            profileId,
            proposal?.attackerId,
            proposal.attackerId === vote?.value ? '1' : '-1'
          ])
          return callWithGasPrice(stakeMarketVoterContract, 'vote', [
            proposal?.id, 
            proposal?.ve, 
            tokenId,
            profileId,
            proposal?.attackerId,
            proposal.attackerId === vote?.value ? '1' : '-1'
          ])
          .catch((err) => {
            console.log("channel====================>", err)
          })
      })
      if (receipt?.status) {
        onSuccess()
        toastSuccess(
          t('Vote Submitted'),
          <ToastDescriptionWithTx txHash={receipt?.transactionHash}>
            {t('You have succesfully voted for %choice%', { choice: vote?.label ?? '' })}
          </ToastDescriptionWithTx>,
        )
      }
      setIsPending(false)
      setModalIsOpen(false)
      onDismiss()
  }, [
    t,
    vote,
    tokenId,
    profileId,
    proposal,
    onSuccess,
    onDismiss,
    setIsPending,
    setModalIsOpen,
    toastSuccess,
    callWithGasPrice,
    fetchWithCatchTxError,
    stakeMarketVoterContract
  ])

  return (
    <Modal
      title={title[view]}
      onBack={handleBack}
      onDismiss={onDismiss}
      hideCloseButton={!isStartView}
      headerBackground={theme.colors.gradientCardHeader}
    >
      <Box mb="24px">
        <VotingBoxBorder>
          <Input
            type="number"
            onChange={(e) => {
              setTokenId(e.target.value)
              refetch()
            }}
            placeholder={t('input token id')}
            value={tokenId}
          />
        </VotingBoxBorder>
        <VotingBoxBorder>
          <Input
            type="number"
            onChange={(e) => setProfileId(e.target.value)}
            placeholder={t('input your profile id')}
            value={profileId}
          />
        </VotingBoxBorder>
        {status === FetchStatus.Fetched && Number(tokenId) && view === ConfirmVoteView.MAIN ? (
          <MainView
            vote={vote}
            isError={false}
            isLoading={false}
            isPending={isPending}
            total={total}
            proposal={proposal}
            lockedCakeBalance={0}
            lockedEndTime={0}
            onConfirm={handleCreateCollection}
            onDismiss={handleDismiss}
          />
        ):null}
      </Box>
    </Modal>
  )
}

export default CastVoteModal
