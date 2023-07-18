import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'
import BaseSubMenu from '../../Nft/market/components/BaseSubMenu'

const SubMenuComponent: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const accountAddress = router.query.accountAddress as string
  const { asPath } = router

  const ItemsConfig = [
    {
      label: t('Profile'),
      href: `/profile/${accountAddress}`,
    },
    {
      label: t('SSI'),
      href: `/profile/${accountAddress}/ssi`,
    },
    {
      label: t('NFTickets'),
      href: `/profile/${accountAddress}/nftickets`,
    },
    {
      label: t('Badges'),
      href: `/profile/${accountAddress}/badges`,
    },
    // {
    //   label: t('Notes'),
    //   href: `/profile/${accountAddress}/notes`,
    // },
    // {
    //   label: t('Others'),
    //   href: `/profile/${accountAddress}/others`,
    // },
  ]
  return <BaseSubMenu items={ItemsConfig} activeItem={asPath?.split('?')[0]} justifyContent="flex-start" mb="18px" />
}

export default SubMenuComponent
