import {
  MenuItemsType,
  DropdownMenuItemType,
  SwapIcon,
  SwapFillIcon,
  EarnFillIcon,
  EarnIcon,
  TrophyIcon,
  TrophyFillIcon,
  NftIcon,
  NftFillIcon,
  MoreIcon,
  DropdownMenuItems,
} from '@pancakeswap/uikit'
import { ContextApi } from '@pancakeswap/localization'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { cancanBaseUrl } from 'views/CanCan/market/constants'
import { perpLangMap } from 'utils/getPerpetualLanguageCode'
import { perpTheme } from 'utils/getPerpetualTheme'
import { SUPPORT_ONLY_BSC } from 'config/constants/supportChains'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean; image?: string } & {
  items?: ConfigMenuDropDownItemsType[]
}

const addMenuItemSupported = (item, chainId) => {
  if (!chainId || !item.supportChainIds) {
    return item
  }
  if (item.supportChainIds?.includes(chainId)) {
    return item
  }
  return {
    ...item,
    disabled: true,
  }
}

const config: (
  t: ContextApi['t'],
  isDark: boolean,
  languageCode?: string,
  chainId?: number,
) => ConfigMenuItemsType[] = (t, isDark, languageCode, chainId) =>
  [
    {
      label: t('Trade'),
      icon: SwapIcon,
      fillIcon: SwapFillIcon,
      href: '/swap',
      showItemsOnMobile: false,
      items: [
        {
          label: t('dRamps'),
          href: '/ramps',
        },
        {
          label: t('Swap'),
          href: '/swap',
        },
        {
          label: t('Limit'),
          href: '/limit-orders',
          supportChainIds: SUPPORT_ONLY_BSC,
          image: '/images/decorations/3d-coin.png',
        },
        {
          label: t('Liquidity'),
          href: '/liquidity',
        },
        // {
        //   label: t('Transfer'),
        //   href: '/transfer',
        // },
        // {
        //   label: t('Perpetual'),
        //   href: `https://perp.pancakeswap.finance/${perpLangMap(languageCode)}/futures/BTCUSDT?theme=${perpTheme(
        //     isDark,
        //   )}`,
        //   supportChainIds: SUPPORT_ONLY_BSC,
        //   type: DropdownMenuItemType.EXTERNAL_LINK,
        // },
        // {
        //   label: t('Bridge'),
        //   href: 'https://bridge.pancakeswap.finance/',
        //   type: DropdownMenuItemType.EXTERNAL_LINK,
        // },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Mint'),
      href: '/accelerator',
      icon: EarnIcon,
      fillIcon: EarnFillIcon,
      image: '/images/decorations/pe2.png',
      items: [
        {
          label: t('Accelerator'),
          href: '/accelerator',
        },
        {
          label: t('Businesses'),
          href: '/businesses',
        },
        {
          label: t('Contributors'),
          href: '/contributors',
        },
        {
          label: t('Leviathans'),
          href: '/vesting',
        },
        {
          label: t('Referrals'),
          href: '/referrals',
        },
        {
          label: t('Worlds'),
          href: '/worlds',
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Earn'),
      href: '/auditors',
      icon: EarnIcon,
      fillIcon: EarnFillIcon,
      image: '/images/decorations/pe2.png',
      items: [
        {
          label: t('ARPs'),
          href: '/arps',
        },
        {
          label: t('Auditors'),
          href: '/auditors',
        },
        {
          label: t('Bills'),
          href: '/bills',
        },
        {
          label: t('Pools'),
          href: '/pools',
          supportChainIds: SUPPORT_ONLY_BSC,
        },
        {
          label: t('Sponsors'),
          href: '/sponsors',
        },
        {
          label: t('Wills'),
          href: '/wills',
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Win'),
      href: '/bettings',
      icon: TrophyIcon,
      fillIcon: TrophyFillIcon,
      // supportChainIds: SUPPORT_ONLY_BSC,
      items: [
        {
          label: t('Bettings'),
          href: '/bettings',
          image: '/images/decorations/lottery.png',
        },
        {
          label: t('Games'),
          href: '/games',
          image: '/images/decorations/lottery.png',
        },
        {
          label: t('Lotteries'),
          href: '/lotteries',
          image: '/images/decorations/lottery.png',
        },
        {
          label: t('ValuePools'),
          href: '/valuepools',
          image: '/images/decorations/tc.png',
        },
        // {
        //   label: t('Bettings'),
        //   href: '/prediction',
        //   image: '/images/decorations/prediction.png',
        // },
        // {
        //   type: DropdownMenuItemType.DIVIDER,
        // },
        // {
        //   label: t('Trading Competition'),
        //   href: '/competition',
        //   image: '/images/decorations/tc.png',
        //   hideSubNav: true,
        // },
        // {
        //   label: t('Prediction (BETA)'),
        //   href: '/prediction',
        //   image: '/images/decorations/prediction.png',
        // },
        // {
        //   label: t('Lottery'),
        //   href: '/lottery',
        //   image: '/images/decorations/lottery.png',
        // },
        // {
        //   label: t('Pottery (BETA)'),
        //   href: '/pottery',
        //   image: '/images/decorations/lottery.png',
        // },
      ],
    },
    {
      label: t('CanCan'),
      href: `${cancanBaseUrl}`,
      icon: NftIcon,
      fillIcon: NftFillIcon,
      // supportChainIds: SUPPORT_ONLY_BSC,
      image: '/images/decorations/nft.png',
      items: [
        {
          label: t('Overview'),
          href: `${cancanBaseUrl}`,
        },
        {
          label: t('Collections'),
          href: `${cancanBaseUrl}/collections`,
        },
        {
          label: t('Activity'),
          href: `${cancanBaseUrl}/activity`,
        },
      ],
    },
    {
      label: t('eCollectible'),
      href: `${nftsBaseUrl}`,
      icon: NftIcon,
      fillIcon: NftFillIcon,
      // supportChainIds: SUPPORT_ONLY_BSC,
      image: '/images/decorations/nft.png',
      items: [
        {
          label: t('Overview'),
          href: `${nftsBaseUrl}`,
        },
        {
          label: t('Collections'),
          href: `${nftsBaseUrl}/collections`,
        },
        {
          label: t('Activity'),
          href: `${nftsBaseUrl}/activity`,
        },
      ],
    },
    {
      label: '',
      href: '/info',
      icon: MoreIcon,
      hideSubNav: true,
      items: [
        // {
        //   label: t('Info'),
        //   href: '/info',
        // },
        // {
        //   label: t('IFO'),
        //   href: '/ifo',
        //   // supportChainIds: SUPPORT_ONLY_BSC,
        //   image: '/images/ifos/ifo-bunny.png',
        // },
        {
          label: t('Voting'),
          href: '/voting',
          // supportChainIds: SUPPORT_ONLY_BSC,
          image: '/images/voting/voting-bunny.png',
        },
        {
          label: t('SSI'),
          href: '/ssi',
          // supportChainIds: SUPPORT_ONLY_BSC,
          image: '/images/voting/voting-bunny.png',
        },
        {
          type: DropdownMenuItemType.DIVIDER,
        },
        {
          label: t('PayChat'),
          href: `https://perp.pancakeswap.finance/${perpLangMap(languageCode)}/futures/BTCUSDT?theme=${perpTheme(
            isDark,
          )}`,
          type: DropdownMenuItemType.EXTERNAL_LINK,
        },
        {
          type: DropdownMenuItemType.DIVIDER,
        },
        {
          label: t('Blog'),
          href: 'https://medium.com/pancakeswap',
          type: DropdownMenuItemType.EXTERNAL_LINK,
        },
        {
          label: t('Docs'),
          href: 'https://docs.pancakeswap.finance',
          type: DropdownMenuItemType.EXTERNAL_LINK,
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
