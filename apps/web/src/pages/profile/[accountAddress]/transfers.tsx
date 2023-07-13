import { useWeb3React } from '@pancakeswap/wagmi'
import { useRouter } from 'next/router'
import { useAchievementsForAddress, useProfileForAddress } from 'state/profile/hooks'
import { NftProfileLayout } from 'views/Profile'
import Achievements from 'views/Profile/components/Achievements'
import PoolsTable from 'views/Profile/components/PoolsTable/PoolsTable'

const NftProfileAchievementsPage = () => {
  // const accountAddress = useRouter().query.accountAddress as string
  // const { profile } = useProfileForAddress(accountAddress)
  // const { achievements, isFetching: isAchievementFetching, refresh } = useAchievementsForAddress(accountAddress)
    const { account } = useWeb3React()
    
  return (
    <PoolsTable urlSearch='' pools={[
      // {
        // symbol: 'FET',
        // decimals: 18,
        // id: '0x0bDabC785a5e1C71078d6242FB52e70181C1F316',
        // sousId: '0',
        // userData: {}

      // }
    ]} account={account} />
  )
}

NftProfileAchievementsPage.Layout = NftProfileLayout

export default NftProfileAchievementsPage
