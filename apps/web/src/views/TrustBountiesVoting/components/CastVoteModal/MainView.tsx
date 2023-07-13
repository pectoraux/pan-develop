import { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import {
  IconButton,
  Text,
  Skeleton,
  Button,
  AutoRenewIcon,
  ChevronRightIcon,
  Message,
  Flex,
  RocketIcon,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'
import TextEllipsis from '../TextEllipsis'
import { VotingBoxBorder, VotingBoxCardInner, ModalInner } from './styles'
import { CastVoteModalProps } from './types'

interface MainViewProps {
  vote: {
    label: string
    value: number
  }
  isLoading: boolean
  isPending: boolean
  isError: boolean
  total: number
  disabled?: boolean
  lockedCakeBalance: number
  lockedEndTime: number
  onConfirm: () => void
  onViewDetails: () => void
  onDismiss: CastVoteModalProps['onDismiss']
}

const MainView: React.FC<any> = ({
  isChecked,
  total,
  isPending,
  isLoading,
  proposal,
  isError,
  onConfirm,
  onViewDetails,
  onDismiss,
  disabled,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <ModalInner>
        <Text color="secondary" mb="8px" textTransform="uppercase" fontSize="12px" bold>
          {t('Voting For')}
        </Text>
        <TextEllipsis bold fontSize="20px" mb="8px" title={t("Confirm Vote")}>
          {t("Voting for %val%", { val: isChecked ? "Attacker" : "Defender"})}
        </TextEllipsis>
        <Text color="secondary" mb="8px" textTransform="uppercase" fontSize="12px" bold>
          {t('Your Voting Power')}
        </Text>
        {isLoading && !isError ? (
          <Skeleton height="64px" mb="12px" />
        ) : isError ? (
          <Message variant="danger" mb="12px">
            <Text color="text">{t('Error occurred, please try again later')}</Text>
          </Message>
        ) : (
          <>
            <VotingBoxBorder onClick={onViewDetails} style={{ cursor: 'pointer' }}>
              <VotingBoxCardInner>
                <Flex flexDirection="column">
                  <Text bold fontSize="20px" color={total === 0 ? 'failure' : 'text'}>
                    {formatNumber(total, 0, 3)}
                  </Text>
                </Flex>
                <IconButton scale="sm" variant="text">
                  <ChevronRightIcon width="24px" />
                </IconButton>
              </VotingBoxCardInner>
            </VotingBoxBorder>
            {total === 0 ? (
              <Message variant="danger" mb="12px">
                <Text color="danger">
                  {t(
                    'Hold some tokens in your wallet or on PaySwap at the snapshot block to get voting power for future proposals.',
                  )}
                </Text>
              </Message>
            ) : (
              <Text as="p" color="textSubtle" fontSize="14px">
                {t('Are you sure you want to vote for the above choice? This action cannot be undone.')}
              </Text>
            )}
          </>
        )}
      </ModalInner>
      <Button
        isLoading={isPending}
        endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
        disabled={disabled || isLoading || total === 0}
        width="100%"
        mb="8px"
        onClick={onConfirm}
      >
        {t('Confirm Vote')}
      </Button>
      <Button variant="secondary" width="100%" onClick={onDismiss}>
        {t('Cancel')}
      </Button>
    </>
  )
}

export default MainView
