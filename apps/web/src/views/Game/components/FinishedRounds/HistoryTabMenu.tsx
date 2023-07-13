import { ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const HistoryTabMenu = ({ setActiveIndex, activeIndex }) => {
  const { t } = useTranslation()

  return (
    <ButtonMenu activeIndex={activeIndex} onItemClick={setActiveIndex} scale="sm" variant="subtle">
      <ButtonMenuItem>{t('Game Objects')}</ButtonMenuItem>
      <ButtonMenuItem>{t('Your Objects')}</ButtonMenuItem>
    </ButtonMenu>
  )
}

export default HistoryTabMenu
