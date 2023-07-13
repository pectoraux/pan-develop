import { useMemo, useState } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { Button, AutoRenewIcon, Box, Flex, Text, Input } from '@pancakeswap/uikit'
import { useClaimPottery } from 'views/Game/hooks/useClaimPottery'

interface ClaimButtonProps {
  rewardToken: number
}

const ClaimButton: React.FC<any> = ({ tokenId, identityTokenId, gameData, rewardToken }) => {
  const { t } = useTranslation()
  const { isPending, handleClaim } = useClaimPottery({ gameData, identityTokenId, tokenId })
  const isDisabledButton = useMemo(() => rewardToken === 0 || isPending, [rewardToken, isPending])

  return (
    <Button
      width={['110px', '110px', '162px']}
      ml="auto"
      disabled={isDisabledButton}
      endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
      onClick={handleClaim}
    >
      {t('Claim')}
    </Button>
  )
}

export default ClaimButton
