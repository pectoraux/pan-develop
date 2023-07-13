import { useWeb3React } from '@pancakeswap/wagmi'
import { useRouter } from 'next/router'
import { useSSIForAddress } from 'state/profile/hooks'
import { NftProfileLayout } from 'views/Profile'
import SubMenu from 'views/Profile/components/SubMenu'
import UnconnectedProfileNfts from 'views/Profile/components/UnconnectedProfileNfts'
import UserNfts from 'views/Profile/components/UserNfts'
import { useNftsForAddress } from 'views/Nft/market/hooks/useNftsForAddress'

const NftProfilePage = () => {
  const { account } = useWeb3React()
  const accountAddress = useRouter().query.accountAddress as string
  const isConnectedProfile = account?.toLowerCase() === accountAddress?.toLowerCase()
  
  const {
    nfts,
    isValidating: isProfileFetching,
    refresh: refreshProfile,
  } = useSSIForAddress(accountAddress, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  })
  console.log("ssidata===============>", nfts, isConnectedProfile)
  // const {
  //   // nfts,
  //   isLoading: isNftLoading,
  //   refresh: refreshUserNfts,
  // } = useNftsForAddress(accountAddress, profile, isProfileFetching)
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
  // ]
  return (
    <>
      <SubMenu />
      <UserNfts
        nfts={nfts?.map((nft) => nft.metadataUrl)}
        isLoading={isProfileFetching}
        onSuccessSale={refreshProfile}
        onSuccessEditProfile={async () => {
          await refreshProfile()
        }}
      />
    </>
  )
}

NftProfilePage.Layout = NftProfileLayout

export default NftProfilePage
