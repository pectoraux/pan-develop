import { useTranslation } from '@pancakeswap/localization'
import { Box, Modal, useToast, Input, Button, AutoRenewIcon } from '@pancakeswap/uikit'
import { FetchStatus } from 'config/constants/types'
import { useValuepoolVoterContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
// import { useGetVotingPower } from 'state/valuepoolvoting/hooks'
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
  isChecked,
  onDismiss,
}) => {
  const [view, setView] = useState<ConfirmVoteView>(ConfirmVoteView.MAIN)
  const [modalIsOpen, setModalIsOpen] = useState(true)
  const [isPending, setIsPending] = useState(false)
  const { t } = useTranslation()
  const { theme } = useTheme()
  const valuepoolVoterContract = useValuepoolVoterContract()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [tokenId, setTokenId] = useState('')
  const [profileId, setProfileId] = useState('')
  const [identityTokenId, setIdentityTokenId] = useState('')
  const isStartView = view === ConfirmVoteView.MAIN
  const handleBack = isStartView ? null : () => setView(ConfirmVoteView.MAIN)

  const title = {
    [ConfirmVoteView.MAIN]: t('Confirm Vote'),
    [ConfirmVoteView.DETAILS]: t('Voting Power'),
  }

  const handleDismiss = () => {
    setModalIsOpen(false)
    onDismiss()
  }

  const handleVote = useCallback(async () => {
        setIsPending(true)
        // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
          const args = [
            proposal?.id?.split("-")[0],
            proposal?.id?.split("-")[1],
            tokenId ?? 0,
            profileId ?? 0,
            identityTokenId ?? 0,
            isChecked
          ]
          console.log("st2==============>", args)
          return callWithGasPrice(valuepoolVoterContract, 'vote', args)
          .catch((err) => {
            console.log("channel====================>", err)
          })
      })
      if (receipt?.status) {
        onSuccess()
        toastSuccess(
          t('Vote Submitted'),
          <ToastDescriptionWithTx txHash={receipt?.transactionHash}>
            {t('You have succesfully voted')}
          </ToastDescriptionWithTx>,
        )
      }
      setIsPending(false)
      setModalIsOpen(false)
      onDismiss()
  }, [
    t,
    tokenId,
    profileId,
    isChecked,
    identityTokenId,
    proposal,
    onSuccess,
    onDismiss,
    setIsPending,
    setModalIsOpen,
    toastSuccess,
    callWithGasPrice,
    fetchWithCatchTxError,
    valuepoolVoterContract
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
              // refetch()
            }}
            placeholder={t('input veNFT token id')}
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
        <VotingBoxBorder>
          <Input
            type="number"
            onChange={(e) => setIdentityTokenId(e.target.value)}
            placeholder={t('input your identity token id')}
            value={identityTokenId}
          />
        </VotingBoxBorder>
        <Button
          isLoading={isPending}
          endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
          // disabled={disabled || isLoading || total === 0}
          width="100%"
          mb="8px"
          onClick={handleVote}
        >
          {t('Confirm Vote')}
        </Button>
        {/* {
        // status === FetchStatus.Fetched && 
        Number(tokenId) && view === ConfirmVoteView.MAIN ? (
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
        ):null} */}
      </Box>
    </Modal>
  )
}

export default CastVoteModal
