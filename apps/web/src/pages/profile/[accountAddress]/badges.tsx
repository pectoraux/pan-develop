import { useWeb3React } from '@pancakeswap/wagmi'
import { useRouter } from 'next/router'
import { useProfileForAddress } from 'state/profile/hooks'
import { NftProfileLayout } from 'views/Profile'
import SubMenu from 'views/Profile/components/SubMenu'
import UnconnectedProfileNfts from 'views/Profile/components/UnconnectedProfileNfts'
import UserNfts from 'views/Profile/components/UserNfts'
import { useNftsForAddress } from 'views/Nft/market/hooks/useNftsForAddress'
import { useGetProtocols } from 'state/auditors/hooks'

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
  const protocols = useGetProtocols(account?.toLowerCase())

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
  let tokens = [];
  protocols?.data?.length && protocols?.data?.map((pt) => {
    const rt = pt?.tokens?.length && pt?.tokens?.map((tk) => tk.metadataUrl)
    return tokens.push(...rt)
  })
  return (
    <>
      <SubMenu />
      {isConnectedProfile ? (
        <UserNfts
          nfts={tokens}
          isLoading={isNftLoading}
          onSuccessSale={refreshUserNfts}
          onSuccessEditProfile={async () => {
            await refreshProfile()
            refreshUserNfts()
          }}
        />
      ) : (
        <UnconnectedProfileNfts nfts={nfts} isLoading={isNftLoading} />
      )}
    </>
  )
}

NftProfilePage.Layout = NftProfileLayout

export default NftProfilePage
