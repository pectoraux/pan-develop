import isEmpty from 'lodash/isEmpty'
import { Button, ButtonProps } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useAppDispatch } from 'state'
import { setCurrBribeData, setCurrPoolData } from 'state/businesses'
import { useCurrPool, useCurrBribe } from 'state/businesses/hooks'

interface ClearAllButtonProps extends ButtonProps {
  tokens: boolean
}

const ClearAllButton: React.FC<ClearAllButtonProps> = ({ tokens, ...props }) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const clearAll = () => {
    if (!tokens) {
      dispatch(setCurrBribeData({}))
    } else {
      dispatch(setCurrPoolData({}))
    }
  }
  const currBribe = useCurrBribe()
  const currTokenState = useCurrPool()

  return !isEmpty(tokens ? currTokenState : currBribe) ? (
    <Button key="clear-all" variant="text" scale="sm" onClick={clearAll} style={{ whiteSpace: 'nowrap' }} {...props}>
      {t('Clear')}
    </Button>
  ):null
}

export default ClearAllButton
