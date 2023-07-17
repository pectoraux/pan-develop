import { useWeb3React } from '@pancakeswap/wagmi'
import { useRouter } from 'next/router'
import { useProfileForAddress } from 'state/profile/hooks'
import { NftProfileLayout } from 'views/Profile'
import SubMenu from 'views/Profile/components/SubMenu'
import UnconnectedProfileNfts from 'views/Profile/components/UnconnectedProfileNfts'
import UserNfts from 'views/Profile/components/UserNfts'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useNftsForAddress, getUrl } from 'views/Nft/market/hooks/useNftsForAddress'
import { getProfileHelperContract } from 'utils/contractHelpers'

const NftProfilePage = () => {
  const { account } = useWeb3React()
  const accountAddress = useRouter().query.accountAddress as string
  const isConnectedProfile = account?.toLowerCase() === accountAddress?.toLowerCase()
  const {
    profile,
    isValidating: isProfileFetching,
    refresh: refreshProfile,
  } = useProfileForAddress(accountAddress, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  })
  const {
    nfts,
    isLoading: isNftLoading,
    refresh: refreshUserNfts,
  } = useNftsForAddress(accountAddress, profile, isProfileFetching)
  console.log("isConnectedProfile================>", isConnectedProfile, profile)
  // nfts = [
  //   {
  //     tokenId: "Uber",
  //     collectionName: "1",
  //     // location: "https://lll",
  //     marketData: {
  //       currentAskPrice: "10",
  //       isTradable: true
  //     }
  //   },
  //   {
  //     tokenId: "Airbnb",
  //     collectionName: "1",
  //     // location: "https://lll",
  //     marketData: {
  //       currentAskPrice: "1",
  //       isTradable: true
  //     }
  //   },
  //   {
  //     tokenId: "Blablacar",
  //     collectionName: "1",
  //     // location: "https://lll",
  //     marketData: {
  //       currentAskPrice: "2",
  //       isTradable: true
  //     }
  //   },
  //   {
  //     tokenId: "Dice",
  //     collectionName: "1",
  //     // location: "https://lll",
  //     marketData: {
  //       currentAskPrice: "0.1",
  //       isTradable: true
  //     }
  //   },
  //   {
  //     tokenId: "Dice",
  //     collectionName: "1",
  //     // location: "https://lll",
  //     marketData: {
  //       currentAskPrice: "0.1",
  //       isTradable: true
  //     }
  //   },
  // ]
  return (
    <>
      <SubMenu />
        <UserNfts
          nfts={[profile?.metadataUrl]}
          isLoading={isNftLoading}
          onSuccessSale={refreshUserNfts}
          onSuccessEditProfile={async () => {
            await refreshProfile()
            refreshUserNfts()
          }}
        />
    </>
  )
}

NftProfilePage.Layout = NftProfileLayout

export default NftProfilePage
