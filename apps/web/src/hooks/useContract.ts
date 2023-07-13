import {
  Cake,
  CakeFlexibleSideVaultV2,
  CakeVaultV2,
  Erc20,
  Erc20Bytes32,
  Erc721collection,
  Marketcollections,
  MarketOrders,
  MarketTrades,
  MarketHelper,
  MarketHelper2,
  MarketHelper3,
  PaywallMarketOrders,
  PaywallMarketTrades,
  PaywallMarketHelper,
  PaywallMarketHelper2,
  PaywallMarketHelper3,
  MinterFactory,
  NftMarketOrders,
  NftMarketTrades,
  NftMarketHelper,
  NftMarketHelper2,
  NftMarketHelper3,
  Ve,
  PaywallARPFactory,
  PaywallARPHelper,
  MarketEvents,
  Multicall,
  Weth,
  Zap,
  Stakemarket,
  Stakemarketnote,
  Stakemarketbribe,
  Stakemarketvoter,
  Trustbounties,
  Trustbountiesvoter,
  TrustbountiesHelper,
} from 'config/abi/types'
import { JsonRpcProvider } from '@ethersproject/providers'
import { Wallet } from '@ethersproject/wallet'
import zapAbi from 'config/abi/zap.json'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useProviderOrSigner } from 'hooks/useProviderOrSigner'
import { useMemo } from 'react'
import { getMulticallAddress, getPredictionsV1Address, getZapAddress } from 'utils/addressHelpers'
import {
  getAnniversaryAchievementContract,
  getBCakeFarmBoosterContract,
  getBCakeFarmBoosterProxyFactoryContract,
  getBCakeProxyContract,
  getBep20Contract,
  getBunnyFactoryContract,
  getBunnySpecialCakeVaultContract,
  getBunnySpecialContract,
  getBunnySpecialLotteryContract,
  getBunnySpecialPredictionContract,
  getBunnySpecialXmasContract,
  getCakeContract,
  getCakeFlexibleSideVaultV2Contract,
  getCakePredictionsContract,
  getCakeVaultV2Contract,
  getChainlinkOracleContract,
  getClaimRefundContract,
  getEasterNftContract,
  getErc721CollectionContract,
  getErc721Contract,
  getFarmAuctionContract,
  getIfoV1Contract,
  getIfoV2Contract,
  getIfoV3Contract,
  getLotteryV2Contract,
  getLotteryContract,
  getRandomNumberGenerator,
  getLotteryHelperContract,
  getMasterchefContract,
  getMasterchefV1Contract,
  getNftMarketContract,
  getNftSaleContract,
  getPancakeBunniesContract,
  getPancakeSquadContract,
  getPointCenterIfoContract,
  getPotteryDrawContract,
  getPotteryVaultContract,
  getPredictionsContract,
  getPredictionsV1Contract,
  getProfileContract,
  getSouschefContract,
  getTradingCompetitionContractEaster,
  getTradingCompetitionContractFanToken,
  getTradingCompetitionContractMobox,
  getTradingCompetitionContractMoD,
  getNonBscVaultContract,
  getCrossFarmingProxyContract,
  getRampContract,
  getBettingContract,
  getVeContract,
  getRampHelperContract,
  getRampAdsContract,
  getAuditorContract,
  getAuditorHelperContract,
  getAuditorNoteContract,
  getAuditorFactoryContract,
  getWorldContract,
  getWorldHelperContract,
  getWorldHelper2Contract,
  getWorldHelper3Contract,
  getWorldNoteContract,
  getWorldFactoryContract,
  getSponsorContract,
  getSponsorHelperContract,
  getSponsorFactoryContract,
  getAcceleratorVoterContract,
  getContributorsVoterContract,
  getGaugeContract,
  getBribeContract,
  getVaContract,
  getPaywallContract,
  getValuepoolContract,
  getVaFactoryContract,
  getValuepoolHelperContract,
  getValuepoolHelper2Contract,
  getValuepoolVoterContract,
  getBusinessVoterContract,
  getReferralVoterContract,
  getSSIContract,
  getNFTicket,
  getNFTicketHelper,
  getValuepoolFactoryContract,
  getBettingFactoryContract,
  getBettingHelperContract,
  getBettingMinterContract,
  getRampFactoryContract,
  getMarketEventsContract,
  getMarketOrdersContract,
  getMarketTradesContract,
  getMarketHelperContract,
  getMarketHelper2Contract,
  getMarketHelper3Contract,
  getPaywallMarketOrdersContract,
  getPaywallMarketTradesContract,
  getPaywallMarketHelperContract,
  getPaywallMarketHelper2Contract,
  getPaywallARPFactoryContract,
  getPaywallARPHelperContract,
  getMinterContract,
  getMinterFactoryContract,
  getNftMarketOrdersContract,
  getNftMarketTradesContract,
  getNftMarketHelperContract,
  getNftMarketHelper2Contract,
  getNftMarketHelper3Contract,
  getStakeMarketContract,
  getTrustBountiesContract,
  getTrustBountiesHelperContract,
  getTrustBountiesVoterContract,
  getStakeMarketNoteContract,
  getStakeMarketBribeContract,
  getStakeMarketVoterContract,
  getMarketCollectionsContract,
  getPoolGaugeContract,
  getFeeToContract,
  getARPContract,
  getARPNoteContract,
  getARPHelperContract,
  getARPFactoryContract,
  getBILLContract,
  getBILLFactoryContract,
  getBILLHelperContract,
  getBILLNoteContract,
  getGameFactoryContract,
  getGameHelperContract,
  getGameHelper2Contract,
  getGameMinterContract,
  getGameContract,
  getWillContract,
  getWillNoteContract,
  getWillFactoryContract,
} from 'utils/contractHelpers'
import { useProvider, useSigner } from 'wagmi'

// Imports below migrated from Exchange useContract.ts
import { Contract } from '@ethersproject/contracts'
import { WNATIVE } from '@pancakeswap/sdk'
import { ERC20_BYTES32_ABI } from 'config/abi/erc20'
import ERC20_ABI from 'config/abi/erc20.json'
import IPancakePairABI from 'config/abi/IPancakePair.json'
import multiCallAbi from 'config/abi/Multicall.json'
import WETH_ABI from 'config/abi/weth.json'
import { getContract } from 'utils'

import { IPancakePair } from 'config/abi/types/IPancakePair'
import { VaultKey } from 'state/types'
import { useActiveChainId } from './useActiveChainId'

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoV1Contract = (address: string) => {
  const { data: signer } = useSigner()
  return useMemo(() => getIfoV1Contract(address, signer), [address, signer])
}

export const useIfoV2Contract = (address: string) => {
  const { data: signer } = useSigner()
  return useMemo(() => getIfoV2Contract(address, signer), [address, signer])
}

export const useIfoV3Contract = (address: string) => {
  const { data: signer } = useSigner()
  return useMemo(() => getIfoV3Contract(address, signer), [address, signer])
}

export const useERC20 = (address: string, withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getBep20Contract(address, providerOrSigner), [address, providerOrSigner])
}

/**
 * @see https://docs.openzeppelin.com/contracts/3.x/api/token/erc721
 */
export const useERC721 = (address: string, withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getErc721Contract(address, providerOrSigner), [address, providerOrSigner])
}

export const useCake = (): { reader: Cake; signer: Cake } => {
  const providerOrSigner = useProviderOrSigner()
  return useMemo(
    () => ({
      reader: getCakeContract(null),
      signer: getCakeContract(providerOrSigner),
    }),
    [providerOrSigner],
  )
}

export const useBunnyFactory = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getBunnyFactoryContract(signer), [signer])
}

export const usePancakeBunnies = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getPancakeBunniesContract(signer), [signer])
}

export const useProfileContract = (withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getProfileContract(providerOrSigner), [providerOrSigner])
}

export const useLotteryV2Contract = () => {
  const providerOrSigner = useProviderOrSigner()
  return useMemo(() => getLotteryV2Contract(providerOrSigner), [providerOrSigner])
}

export const useLotteryContract = () => {
  const providerOrSigner = useProviderOrSigner()
  return useMemo(() => getLotteryContract(providerOrSigner), [providerOrSigner])
}

export const useRandomNumberGenerator = () => {
  const providerOrSigner = useProviderOrSigner()
  return useMemo(() => getRandomNumberGenerator(providerOrSigner), [providerOrSigner])
}

export const useLotteryHelperContract = () => {
  const providerOrSigner = useProviderOrSigner()
  return useMemo(() => getLotteryHelperContract(providerOrSigner), [providerOrSigner])
}

export const useMasterchef = (withSignerIfPossible = true) => {
  const { chainId } = useActiveChainId()
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getMasterchefContract(providerOrSigner, chainId), [providerOrSigner, chainId])
}

export const useMasterchefV1 = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getMasterchefV1Contract(signer), [signer])
}

export const useSousChef = (id) => {
  const { data: signer } = useSigner()
  return useMemo(() => getSouschefContract(id, signer), [id, signer])
}

export const usePointCenterIfoContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getPointCenterIfoContract(signer), [signer])
}

export const useBunnySpecialContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getBunnySpecialContract(signer), [signer])
}

export const useClaimRefundContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getClaimRefundContract(signer), [signer])
}

export const useTradingCompetitionContractEaster = (withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getTradingCompetitionContractEaster(providerOrSigner), [providerOrSigner])
}

export const useTradingCompetitionContractFanToken = (withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getTradingCompetitionContractFanToken(providerOrSigner), [providerOrSigner])
}

export const useTradingCompetitionContractMobox = (withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getTradingCompetitionContractMobox(providerOrSigner), [providerOrSigner])
}

export const useTradingCompetitionContractMoD = (withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getTradingCompetitionContractMoD(providerOrSigner), [providerOrSigner])
}

export const useEasterNftContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getEasterNftContract(signer), [signer])
}

export const useVaultPoolContract = (vaultKey: VaultKey): CakeVaultV2 | CakeFlexibleSideVaultV2 => {
  const { data: signer } = useSigner()
  return useMemo(() => {
    if (vaultKey === VaultKey.CakeVault) {
      return getCakeVaultV2Contract(signer)
    }
    if (vaultKey === VaultKey.CakeFlexibleSideVault) {
      return getCakeFlexibleSideVaultV2Contract(signer)
    }
    return null
  }, [signer, vaultKey])
}

export const useCakeVaultContract = (withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getCakeVaultV2Contract(providerOrSigner), [providerOrSigner])
}

export const usePredictionsContract = (address: string, tokenSymbol: string) => {
  const { data: signer } = useSigner()
  return useMemo(() => {
    if (address === getPredictionsV1Address()) {
      return getPredictionsV1Contract(signer)
    }
    const getPredContract = tokenSymbol === 'CAKE' ? getCakePredictionsContract : getPredictionsContract

    return getPredContract(address, signer)
  }, [address, tokenSymbol, signer])
}

export const useChainlinkOracleContract = (address, withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getChainlinkOracleContract(address, providerOrSigner), [providerOrSigner, address])
}

export const useSpecialBunnyCakeVaultContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getBunnySpecialCakeVaultContract(signer), [signer])
}

export const useSpecialBunnyPredictionContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getBunnySpecialPredictionContract(signer), [signer])
}

export const useBunnySpecialLotteryContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getBunnySpecialLotteryContract(signer), [signer])
}

export const useBunnySpecialXmasContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getBunnySpecialXmasContract(signer), [signer])
}

export const useAnniversaryAchievementContract = (withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getAnniversaryAchievementContract(providerOrSigner), [providerOrSigner])
}

export const useNftSaleContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getNftSaleContract(signer), [signer])
}

export const usePancakeSquadContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getPancakeSquadContract(signer), [signer])
}

export const useFarmAuctionContract = (withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getFarmAuctionContract(providerOrSigner), [providerOrSigner])
}

export const useNftMarketContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getNftMarketContract(signer), [signer])
}

export const useErc721CollectionContract = (
  collectionAddress: string,
): { reader: Erc721collection; signer: Erc721collection } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getErc721CollectionContract(null, collectionAddress),
      signer: getErc721CollectionContract(signer, collectionAddress),
    }),
    [signer, collectionAddress],
  )
}

export const useMarketCollectionsContract = () 
: { reader: Marketcollections; signer: Marketcollections } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getMarketCollectionsContract(null),
      signer: getMarketCollectionsContract(signer),
    }),
    [signer],
  )
}

export const useMarketEventsContract = () 
: { reader: MarketEvents; signer: MarketEvents } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getMarketEventsContract(null),
      signer: getMarketEventsContract(signer),
    }),
    [signer],
  )
}

export const useMarketOrdersContract = () 
: { reader: MarketOrders; signer: MarketOrders } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getMarketOrdersContract(null),
      signer: getMarketOrdersContract(signer),
    }),
    [signer],
  )
}

export const useMarketTradesContract = () 
: { reader: MarketTrades; signer: MarketTrades } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getMarketTradesContract(null),
      signer: getMarketTradesContract(signer),
    }),
    [signer],
  )
}

export const useMarketHelperContract = () 
: { reader: MarketHelper; signer: MarketHelper } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getMarketHelperContract(null),
      signer: getMarketHelperContract(signer),
    }),
    [signer],
  )
}

export const useMarketHelper2Contract = () 
: { reader: MarketHelper2; signer: MarketHelper2 } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getMarketHelper2Contract(null),
      signer: getMarketHelper2Contract(signer),
    }),
    [signer],
  )
}

export const useMarketHelper3Contract = () 
: { reader: MarketHelper3; signer: MarketHelper3 } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getMarketHelper3Contract(null),
      signer: getMarketHelper3Contract(signer),
    }),
    [signer],
  )
}

export const usePaywallMarketOrdersContract = () 
: { reader: PaywallMarketOrders; signer: PaywallMarketOrders } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getPaywallMarketOrdersContract(null),
      signer: getPaywallMarketOrdersContract(signer),
    }),
    [signer],
  )
}

export const usePaywallMarketTradesContract = () 
: { reader: PaywallMarketTrades; signer: PaywallMarketTrades } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getPaywallMarketTradesContract(null),
      signer: getPaywallMarketTradesContract(signer),
    }),
    [signer],
  )
}

export const usePaywallMarketHelperContract = () 
: { reader: PaywallMarketHelper; signer: PaywallMarketHelper } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getPaywallMarketHelperContract(null),
      signer: getPaywallMarketHelperContract(signer),
    }),
    [signer],
  )
}

export const usePaywallMarketHelper2Contract = () 
: { reader: PaywallMarketHelper2; signer: PaywallMarketHelper2 } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getPaywallMarketHelper2Contract(null),
      signer: getPaywallMarketHelper2Contract(signer),
    }),
    [signer],
  )
}

export const usePaywallARPFactoryContract = () 
: { reader: PaywallARPFactory; signer: PaywallARPFactory } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getPaywallARPFactoryContract(null),
      signer: getPaywallARPFactoryContract(signer),
    }),
    [signer],
  )
}

export const usePaywallARPHelperContract = () 
: { reader: PaywallARPHelper; signer: PaywallARPHelper } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getPaywallARPHelperContract(null),
      signer: getPaywallARPHelperContract(signer),
    }),
    [signer],
  )
}

export const useNftMarketOrdersContract = () 
: { reader: NftMarketOrders; signer: NftMarketOrders } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getNftMarketOrdersContract(null),
      signer: getNftMarketOrdersContract(signer),
    }),
    [signer],
  )
}

export const useNftMarketTradesContract = () 
: { reader: NftMarketTrades; signer: NftMarketTrades } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getNftMarketTradesContract(null),
      signer: getNftMarketTradesContract(signer),
    }),
    [signer],
  )
}

export const useNftMarketHelperContract = () 
: { reader: NftMarketHelper; signer: NftMarketHelper } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getNftMarketHelperContract(null),
      signer: getNftMarketHelperContract(signer),
    }),
    [signer],
  )
}

export const useNftMarketHelper2Contract = () 
: { reader: NftMarketHelper2; signer: NftMarketHelper2 } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getNftMarketHelper2Contract(null),
      signer: getNftMarketHelper2Contract(signer),
    }),
    [signer],
  )
}

export const useNftMarketHelper3Contract = () 
: { reader: NftMarketHelper3; signer: NftMarketHelper3 } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getNftMarketHelper3Contract(null),
      signer: getNftMarketHelper3Contract(signer),
    }),
    [signer],
  )
}

export const useMinterFactoryContract = () 
: { reader: MinterFactory; signer: MinterFactory } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getMinterFactoryContract(null),
      signer: getMinterFactoryContract(signer),
    }),
    [signer],
  )
}

export const useMinterContract = (address, withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getMinterContract(address, providerOrSigner), [providerOrSigner, address])
}

export const useStakeMarketContract = () 
: { reader: Stakemarket; signer: Stakemarket } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getStakeMarketContract(null),
      signer: getStakeMarketContract(signer),
    }),
    [signer],
  )
}

export const useStakeMarketNoteContract = () 
: { reader: Stakemarketnote; signer: Stakemarketnote } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getStakeMarketNoteContract(null),
      signer: getStakeMarketNoteContract(signer),
    }),
    [signer],
  )
}

export const useTrustBountiesVoterContract = () 
: { reader: Trustbountiesvoter; signer: Trustbountiesvoter } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getTrustBountiesVoterContract(null),
      signer: getTrustBountiesVoterContract(signer),
    }),
    [signer],
  )
}

export const useTrustBountiesContract = () 
: { reader: Trustbounties; signer: Trustbounties } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getTrustBountiesContract(null),
      signer: getTrustBountiesContract(signer),
    }),
    [signer],
  )
}

export const useTrustBountiesHelperContract = () 
: { reader: TrustbountiesHelper; signer: TrustbountiesHelper } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getTrustBountiesHelperContract(null),
      signer: getTrustBountiesHelperContract(signer),
    }),
    [signer],
  )
}

export const useStakeMarketBribeContract = () 
: { reader: Stakemarketbribe; signer: Stakemarketbribe } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getStakeMarketBribeContract(null),
      signer: getStakeMarketBribeContract(signer),
    }),
    [signer],
  )
}

export const useStakeMarketVoterContract = () 
: { reader: Stakemarketvoter; signer: Stakemarketvoter } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getStakeMarketVoterContract(null),
      signer: getStakeMarketVoterContract(signer),
    }),
    [signer],
  )
}

// Code below migrated from Exchange useContract.ts

// returns null on errors
export function useContract<T extends Contract = Contract>(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true,
): T | null {
  const { provider } = useActiveWeb3React()

  const providerOrSigner = useProviderOrSigner(withSignerIfPossible) ?? provider

  const canReturnContract = useMemo(() => address && ABI && providerOrSigner, [address, ABI, providerOrSigner])

  return useMemo(() => {
    if (!canReturnContract) return null
    try {
      return getContract(address, ABI, providerOrSigner)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, providerOrSigner, canReturnContract]) as T
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useWNativeContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveChainId()
  return useContract<Weth>(chainId ? WNATIVE[chainId]?.address : undefined, WETH_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract<Erc20Bytes32>(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): IPancakePair | null {
  return useContract(pairAddress, IPancakePairABI, withSignerIfPossible)
}

export function useMulticallContract() {
  const { chainId } = useActiveChainId()
  return useContract<Multicall>(getMulticallAddress(chainId), multiCallAbi, false)
}

export const usePotterytVaultContract = (address) => {
  const { data: signer } = useSigner()
  return useMemo(() => getPotteryVaultContract(address, signer), [address, signer])
}

export const usePotterytDrawContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getPotteryDrawContract(signer), [signer])
}

export function useZapContract(withSignerIfPossible = true) {
  return useContract<Zap>(getZapAddress(), zapAbi, withSignerIfPossible)
}

export function useBCakeFarmBoosterContract(withSignerIfPossible = true) {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getBCakeFarmBoosterContract(providerOrSigner), [providerOrSigner])
}

export function useBCakeFarmBoosterProxyFactoryContract(withSignerIfPossible = true) {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getBCakeFarmBoosterProxyFactoryContract(providerOrSigner), [providerOrSigner])
}

export function useBCakeProxyContract(proxyContractAddress: string, withSignerIfPossible = true) {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(
    () => proxyContractAddress && getBCakeProxyContract(proxyContractAddress, providerOrSigner),
    [providerOrSigner, proxyContractAddress],
  )
}

export const useNonBscVault = (withSignerIfPossible = true) => {
  const { chainId } = useActiveChainId()
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getNonBscVaultContract(providerOrSigner, chainId), [providerOrSigner, chainId])
}

export const useCrossFarmingProxy = (proxyContractAddress: string, withSignerIfPossible = true) => {
  const { chainId } = useActiveChainId()
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(
    () => proxyContractAddress && getCrossFarmingProxyContract(proxyContractAddress, providerOrSigner, chainId),
    [proxyContractAddress, providerOrSigner, chainId],
  )
}

export const useVeContract = (address, withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getVeContract(address, providerOrSigner), [providerOrSigner, address])
}

export const useBettingContract = (address, withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getBettingContract(address, providerOrSigner), [providerOrSigner, address])
}

export const useRampContract = (address, withSignerIfPossible = true, withPayswapSigner=false) => {
  let providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  const provider = useProvider()
  if (withPayswapSigner) {
    providerOrSigner = new Wallet(process.env.NEXT_PUBLIC_PAYSWAP_SIGNER, provider)
  }
  return useMemo(() => getRampContract(address, providerOrSigner), [providerOrSigner, address])
}

export const useRampFactory = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getRampFactoryContract(signer), [signer])
}

export const useRampHelper = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getRampHelperContract(signer), [signer])
}

export const useRampAds = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getRampAdsContract(signer), [signer])
}

export const useAuditorContract = (address, withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getAuditorContract(address, providerOrSigner), [providerOrSigner, address])
}

export const useAuditorFactory = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getAuditorFactoryContract(signer), [signer])
}

export const useAuditorHelper = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getAuditorHelperContract(signer), [signer])
}

export const useAuditorNote = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getAuditorNoteContract(signer), [signer])
}

export const useARPContract = (address, withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getARPContract(address, providerOrSigner), [providerOrSigner, address])
}

export const useARPFactory = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getARPFactoryContract(signer), [signer])
}

export const useARPHelper = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getARPHelperContract(signer), [signer])
}

export const useARPNote = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getARPNoteContract(signer), [signer])
}

export const useWILLContract = (address, withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getWillContract(address, providerOrSigner), [providerOrSigner, address])
}

export const useWILLFactory = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getWillFactoryContract(signer), [signer])
}

export const useWILLNote = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getWillNoteContract(signer), [signer])
}

export const useBILLContract = (address, withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getBILLContract(address, providerOrSigner), [providerOrSigner, address])
}

export const useBILLFactory = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getBILLFactoryContract(signer), [signer])
}

export const useBILLHelper = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getBILLHelperContract(signer), [signer])
}

export const useBILLNote = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getBILLNoteContract(signer), [signer])
}

export const useGameFactory = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getGameFactoryContract(signer), [signer])
}

export const useGameMinter = (withPayswapSigner = false) => {
  const { data: signer } = useSigner()
  // const provider = useProvider()
  let signerFinal = signer
  if (withPayswapSigner) {
    const provider = new JsonRpcProvider("https://rpc.testnet.fantom.network", 4002)
    signerFinal = new Wallet(process.env.NEXT_PUBLIC_PAYSWAP_SIGNER, provider)
  }
  return useMemo(() => getGameMinterContract(signerFinal), [signerFinal])
}

export const useGameHelper = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getGameHelperContract(signer), [signer])
}

export const useGameHelper2 = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getGameHelper2Contract(signer), [signer])
}

export const useGameContract = (address, withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getGameContract(address, providerOrSigner), [providerOrSigner, address])
}

export const useWorldContract = (address, withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getWorldContract(address, providerOrSigner), [providerOrSigner, address])
}

export const useWorldFactory = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getWorldFactoryContract(signer), [signer])
}

export const useWorldHelper = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getWorldHelperContract(signer), [signer])
}

export const useWorldHelper2 = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getWorldHelper2Contract(signer), [signer])
}

export const useWorldHelper3 = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getWorldHelper3Contract(signer), [signer])
}

export const useWorldNote = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getWorldNoteContract(signer), [signer])
}

export const useSponsorContract = (address, withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getSponsorContract(address, providerOrSigner), [providerOrSigner, address])
}

export const useSponsorFactory = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getSponsorFactoryContract(signer), [signer])
}

export const useAcceleratorContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getAcceleratorVoterContract(signer), [signer])
}

export const useContributorsContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getContributorsVoterContract(signer), [signer])
}

export const useSponsorHelper = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getSponsorHelperContract(signer), [signer])
}

export const useValuepoolVoterContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getValuepoolVoterContract(signer), [signer])
}

export const useValuepoolHelperContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getValuepoolHelperContract(signer), [signer])
}

export const useValuepoolHelper2Contract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getValuepoolHelper2Contract(signer), [signer])
}

export const useVaFactoryContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getVaFactoryContract(signer), [signer])
}

export const useBusinessVoter = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getBusinessVoterContract(signer), [signer])
}

export const useSSIContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getSSIContract(signer), [signer])
}

export const useGaugeContract = (address, withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getGaugeContract(address, providerOrSigner), [providerOrSigner, address])
}

export const useBribeContract = (address, withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getBribeContract(address, providerOrSigner), [providerOrSigner, address])
}

export const useValuepoolContract = (address, withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getValuepoolContract(address, providerOrSigner), [providerOrSigner, address])
}

export const useVaContract = (address, withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getVaContract(address, providerOrSigner), [providerOrSigner, address])
}

export const usePaywallContract = (address, withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getPaywallContract(address, providerOrSigner), [providerOrSigner, address])
}

export const useNFTicket = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getNFTicket(signer), [signer])
}

export const useNFTicketHelper = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getNFTicketHelper(signer), [signer])
}

export const useValuepoolFactory = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getValuepoolFactoryContract(signer), [signer])
}

export const useBettingFactory = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getBettingFactoryContract(signer), [signer])
}

export const useBettingHelper = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getBettingHelperContract(signer), [signer])
}

export const useBettingMinter = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getBettingMinterContract(signer), [signer])
}

export const usePoolGaugeContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getPoolGaugeContract(signer), [signer])
}

export const useFeeToContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getFeeToContract(signer), [signer])
}

export const useReferralVoter = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getReferralVoterContract(signer), [signer])
}