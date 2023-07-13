import { useTranslation } from '@pancakeswap/localization'
import { Box, Modal, useToast, Input } from '@pancakeswap/uikit'
import { FetchStatus } from 'config/constants/types'
import { useStakeMarketVoterContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { useGetVotingPower } from 'state/stakemarketvoting/hooks'
import { useState, useCallback, useEffect } from 'react'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import MainView from './MainView'
import { CastVoteModalProps, ConfirmVoteView } from './types'
import { VotingBoxBorder } from './styles'

const CastVoteModal: React.FC<any> = ({
  onSuccess,
  proposal,
  isChecked,
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
  const [tokenId, setTokenId] = useState('')
  const [profileId, setProfileId] = useState('')
  const isStartView = view === ConfirmVoteView.MAIN
  const handleBack = isStartView ? null : () => setView(ConfirmVoteView.MAIN)

  const { data, refetch, status } = useGetVotingPower(proposal?.ve, tokenId ?? '0')
  const [total, setTotal] = useState<any>()
  
  useEffect(() => {
    // const val = getBalanceNumber(data?.balance, data?.decimals)
    setTotal(
      parseFloat(
        (data?.percentile ?? 0).toString()
      ) + parseFloat(
        (proposal?.percentile ?? 0).toString()
      )
    )
  }, [data, proposal])

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
          const args = [
            proposal?.id, 
            proposal?.ve, 
            tokenId,
            profileId,
            proposal?.attackerId,
            isChecked ? '1' : '-1'
          ]
          console.log("st2==============>", args)
          return callWithGasPrice(stakeMarketVoterContract, 'vote', args)
          .catch((err) => {
            console.log("channel====================>", err)
          })
      })
      if (receipt?.status) {
        onSuccess()
        toastSuccess(
          t('Vote Submitted'),
          <ToastDescriptionWithTx txHash={receipt?.transactionHash}>
            {t('You have succesfully voted for %choice%', { choice: isChecked ? "Attacker" : "Defender" })}
          </ToastDescriptionWithTx>,
        )
      }
      setIsPending(false)
      setModalIsOpen(false)
      onDismiss()
  }, [
    t,
    isChecked,
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
            isChecked={isChecked}
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
