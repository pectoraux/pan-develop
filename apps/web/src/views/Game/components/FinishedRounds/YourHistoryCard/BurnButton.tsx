import { useTranslation } from '@pancakeswap/localization'
import { Button, AutoRenewIcon } from '@pancakeswap/uikit'
import { useBurnObject } from 'views/Game/hooks/useBurnObject'
import { PotteryDepositStatus } from 'state/types'

interface DepositButtonProps {
  status: PotteryDepositStatus
  depositAmount: string
  potteryVaultAddress: string
  setDepositAmount: (value: string) => void
}

const BurnButton: React.FC<any> = ({
  objectName,
  tokenId,
}) => {
  const { t } = useTranslation()
  const { isPending, handleBurnObject } = useBurnObject(
    objectName,
    tokenId,
  )

  return (
    <Button
      mt="10px"
      width="100%"
      variant='danger'
      isLoading={isPending}
      // disabled={status !== PotteryDepositStatus.BEFORE_LOCK || depositAmountAsBN.lte(0) || depositAmountAsBN.isNaN()}
      endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
      onClick={handleBurnObject}
    >
      {t('Burn Object')}
    </Button>
  )
}

export default BurnButton
