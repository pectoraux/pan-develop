import { useCallback } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { Button, AutoRenewIcon } from '@pancakeswap/uikit'
import { useMintTicket } from 'views/Game/hooks/useMintTicket'
import { PotteryDepositStatus } from 'state/types'

interface DepositButtonProps {
  status: PotteryDepositStatus
  depositAmount: string
  potteryVaultAddress: string
  setDepositAmount: (value: string) => void
}

const MintButton: React.FC<any> = ({ collectionId }) => {
  const { t } = useTranslation()
  const { isPending, handleMint } = useMintTicket(collectionId)

  const onClickMint = useCallback(async () => {
    await handleMint()
  }, [handleMint])

  return (
    <Button
      mt="10px"
      width="100%"
      isLoading={isPending}
      endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
      onClick={onClickMint}
    >
      {t('Mint new ticket')}
    </Button>
  )
}

export default MintButton
