import { useWeb3React } from '@pancakeswap/wagmi'
import { FetchStatus } from 'config/constants/types'
import { useCallback } from 'react'
import { getNftSg, getPaywallSg, getNftsMarketData, getNftsOnChainMarketData } from 'state/cancan/helpers'
import { NftLocation, TokenMarketData } from 'state/cancan/types'
import { useProfile } from 'state/profile/hooks'
import useSWR from 'swr'
import { isAddress } from 'utils'

const useNftOwn = (collectionAddress: string, tokenId: string, marketData?: TokenMarketData) => {
  const { account } = useWeb3React()
  const { isInitialized: isProfileInitialized, profile } = useProfile()

  return useSWR(
    account && isProfileInitialized
      ? ['nft', 'own', collectionAddress, tokenId, marketData?.currentSeller]
      : null,
    async () => {
      let isOwn = false
      let nftIsProfilePic = false
      let location: NftLocation

      nftIsProfilePic = tokenId === profile?.tokenId?.toString() && collectionAddress === profile?.collectionAddress
      if (nftIsProfilePic) {
        isOwn = true
        location = NftLocation.PROFILE
      } else {
        isOwn = isAddress(marketData?.currentSeller) === isAddress(account)
        location = NftLocation.FORSALE
      }

      return {
        isOwn,
        nftIsProfilePic,
        location,
      }
    },
  )
}

export const useCompleteNft = (collectionAddress: string, tokenId: string, isPaywall=false) => {
  const { data: nft, mutate } = useSWR(
    collectionAddress && tokenId ? ['nft', collectionAddress, tokenId] : null,
    async () => {
      return isPaywall ? getPaywallSg(`${collectionAddress}-${tokenId}`) : getNftSg(`${collectionAddress}-${tokenId}`)
    },
  )

  const { data: marketData, mutate: refetchNftMarketData } = useSWR(
    collectionAddress && tokenId ? ['nft', 'marketData', collectionAddress, tokenId] : null,
    async () => {
      const [onChainMarketDatas, marketDatas] = await Promise.all([
        getNftsOnChainMarketData(collectionAddress, [tokenId]),
        getNftsMarketData({ collection: collectionAddress, tokenId }, 1),
      ])
      const onChainMarketData = onChainMarketDatas[0]

      const marketDat = marketDatas.find((data) => data.tokenId === tokenId)

      if (!marketDat && !onChainMarketData) return null

      if (!onChainMarketData) return marketDat

      return { ...marketDat, ...onChainMarketData }
    },
  )

  const { data: nftOwn, mutate: refetchNftOwn, status } = useNftOwn(collectionAddress, tokenId, marketData)

  const refetch = useCallback(async () => {
    await mutate()
    await refetchNftMarketData()
    await refetchNftOwn()
  }, [mutate, refetchNftMarketData, refetchNftOwn])

  return {
    combinedNft: nft ? { ...nft, marketData, location: nftOwn?.location ?? NftLocation.WALLET } : undefined,
    isOwn: nftOwn,
    isProfilePic: nftOwn?.nftIsProfilePic || false,
    isLoading: status !== FetchStatus.Fetched,
    refetch,
  }
}
