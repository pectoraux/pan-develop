import isEmpty from 'lodash/isEmpty'
import { Button, ButtonProps } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useAppDispatch } from 'state'
import { setCurrBribeData, setCurrPoolData } from 'state/profile'
import { useCurrPool, useCurrBribe } from 'state/profile/hooks'

interface ClearAllButtonProps extends ButtonProps {
  tokens: boolean
}

const ClearAllButton: React.FC<ClearAllButtonProps> = ({ tokens, ...props }) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const clearAll = () => {
      dispatch(setCurrPoolData({}))
  }
  const currTokenState = useCurrPool()

  if (!isEmpty(Object.values(currTokenState))) {
    return (
      <Button key="clear-all" variant="text" scale="sm" onClick={clearAll} style={{ whiteSpace: 'nowrap' }} {...props}>
        {t('Clear')}
      </Button>
    )
  }
}

export default ClearAllButton
