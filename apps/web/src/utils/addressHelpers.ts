import { ChainId } from '@pancakeswap/sdk'
import { Pool } from '@pancakeswap/uikit'
import addresses from 'config/constants/contracts'
import { VaultKey } from 'state/types'

export const getAddress = (address: Pool.Address, chainId?: number): string => {
  return address[chainId] ? address[chainId] : address[ChainId.BSC_TESTNET]
}

export const getMasterChefAddress = (chainId?: number) => {
  return getAddress(addresses.masterChef, chainId)
}
export const getPoolGaugeAddress = (chainId?: number) => {
  return getAddress(addresses.poolGauge, chainId)
}
export const getFeeToAddress = (chainId?: number) => {
  return getAddress(addresses.feeTo, chainId)
}
export const getVeFromWorkspace = (wk: string) => {
  return getAddress(addresses[wk])
}
export const getBettingFactoryAddress = () => {
  return getAddress(addresses.bettingFactory)
}
export const getBettingHelperAddress = () => {
  return getAddress(addresses.bettingHelper)
}
export const getBettingMinterAddress = () => {
  return getAddress(addresses.bettingMinter)
}
export const getRampFactoryAddress = () => {
  return getAddress(addresses.rampFactory)
}
export const getRampHelperAddress = () => {
  return getAddress(addresses.rampHelper)
}
export const getRampAdsAddress = () => {
  return getAddress(addresses.rampAds)
}
export const getAuditorHelperAddress = () => {
  return getAddress(addresses.auditorHelper)
}
export const getAuditorHelper2Address = () => {
  return getAddress(addresses.auditorHelper2)
}
export const getAuditorNoteAddress = () => {
  return getAddress(addresses.auditorNote)
}
export const getWillNoteAddress = () => {
  return getAddress(addresses.willNote)
}
export const getWillFactoryAddress = () => {
  return getAddress(addresses.willFactory)
}
export const getWorldHelperAddress = () => {
  return getAddress(addresses.worldHelper)
}
export const getWorldHelper2Address = () => {
  return getAddress(addresses.worldHelper2)
}
export const getWorldHelper3Address = () => {
  return getAddress(addresses.worldHelper3)
}
export const getWorldNoteAddress = () => {
  return getAddress(addresses.worldNote)
}
export const getWorldFactoryAddress = () => {
  return getAddress(addresses.worldFactory)
}
export const getContributorsVoterAddress = () => {
  return getAddress(addresses.contributorsVoter)
}
export const getAcceleratorVoterAddress = () => {
  return getAddress(addresses.acceleratorVoter)
}
export const getAuditorFactoryAddress = () => {
  return getAddress(addresses.auditorFactory)
}
export const getSponsorHelperAddress = () => {
  return getAddress(addresses.sponsorHelper)
}
export const getSponsorFactoryAddress = () => {
  return getAddress(addresses.sponsorFactory)
}
export const getMasterChefV1Address = () => {
  return getAddress(addresses.masterChefV1)
}
export const getMulticallAddress = (chainId?: number) => {
  return getAddress(addresses.multiCall, chainId)
}
export const getLotteryV2Address = () => {
  return getAddress(addresses.lotteryV2)
}
export const getPancakeProfileAddress = () => {
  return getAddress(addresses.pancakeProfile)
}
export const getProfileAddress = () => {
  return getAddress(addresses.profile)
}
export const getProfileHelperAddress = () => {
  return getAddress(addresses.profileHelper)
}
export const getPancakeBunniesAddress = () => {
  return getAddress(addresses.pancakeBunnies)
}
export const getBunnyFactoryAddress = () => {
  return getAddress(addresses.bunnyFactory)
}
export const getPredictionsV1Address = () => {
  return getAddress(addresses.predictionsV1)
}
export const getClaimRefundAddress = () => {
  return getAddress(addresses.claimRefund)
}
export const getPointCenterIfoAddress = () => {
  return getAddress(addresses.pointCenterIfo)
}
export const getBunnySpecialAddress = () => {
  return getAddress(addresses.bunnySpecial)
}
export const getTradingCompetitionAddressEaster = () => {
  return getAddress(addresses.tradingCompetitionEaster)
}
export const getTradingCompetitionAddressFanToken = () => {
  return getAddress(addresses.tradingCompetitionFanToken)
}

export const getTradingCompetitionAddressMobox = () => {
  return getAddress(addresses.tradingCompetitionMobox)
}

export const getTradingCompetitionAddressMoD = () => {
  return getAddress(addresses.tradingCompetitionMoD)
}

export const getEasterNftAddress = () => {
  return getAddress(addresses.easterNft)
}

export const getVaultPoolAddress = (vaultKey: VaultKey) => {
  if (!vaultKey) {
    return null
  }
  return getAddress(addresses[vaultKey])
}

export const getCakeVaultAddress = () => {
  return getAddress(addresses.cakeVault)
}

export const getCakeFlexibleSideVaultAddress = () => {
  return getAddress(addresses.cakeFlexibleSideVault)
}

export const getBunnySpecialCakeVaultAddress = () => {
  return getAddress(addresses.bunnySpecialCakeVault)
}
export const getBunnySpecialPredictionAddress = () => {
  return getAddress(addresses.bunnySpecialPrediction)
}
export const getBunnySpecialLotteryAddress = () => {
  return getAddress(addresses.bunnySpecialLottery)
}
export const getBunnySpecialXmasAddress = () => {
  return getAddress(addresses.bunnySpecialXmas)
}
export const getFarmAuctionAddress = () => {
  return getAddress(addresses.farmAuction)
}
export const getAnniversaryAchievement = () => {
  return getAddress(addresses.AnniversaryAchievement)
}

export const getNftMarketAddress = () => {
  return getAddress(addresses.nftMarket)
}
export const getNftSaleAddress = () => {
  return getAddress(addresses.nftSale)
}
export const getPancakeSquadAddress = () => {
  return getAddress(addresses.pancakeSquad)
}
export const getPotteryDrawAddress = () => {
  return getAddress(addresses.potteryDraw)
}
export const getZapAddress = () => {
  return getAddress(addresses.zap)
}
export const getICakeAddress = () => {
  return getAddress(addresses.iCake)
}

export const getBCakeFarmBoosterAddress = () => {
  return getAddress(addresses.bCakeFarmBooster)
}

export const getBCakeFarmBoosterProxyFactoryAddress = () => {
  return getAddress(addresses.bCakeFarmBoosterProxyFactory)
}

export const getNonBscVaultAddress = (chainId?: number) => {
  return getAddress(addresses.nonBscVault, chainId)
}

export const getCrossFarmingSenderAddress = (chainId?: number) => {
  return getAddress(addresses.crossFarmingSender, chainId)
}

export const getCrossFarmingReceiverAddress = (chainId?: number) => {
  return getAddress(addresses.crossFarmingReceiver, chainId)
}

export const getMarketEventsAddress = (chainId?: number) => {
  return getAddress(addresses.marketEvents, chainId)
}

export const getMarketCollectionsAddress = (chainId?: number) => {
  return getAddress(addresses.marketCollections, chainId)
}

export const getMarketOrdersAddress = (chainId?: number) => {
  return getAddress(addresses.marketOrders, chainId)
}

export const getMarketTradesAddress = (chainId?: number) => {
  return getAddress(addresses.marketTrades, chainId)
}

export const getMarketHelperAddress = (chainId?: number) => {
  return getAddress(addresses.marketHelper, chainId)
}

export const getMarketHelper2Address = (chainId?: number) => {
  return getAddress(addresses.marketHelper2, chainId)
}

export const getMarketHelper3Address = (chainId?: number) => {
  return getAddress(addresses.marketHelper3, chainId)
}

export const getNftMarketOrdersAddress = (chainId?: number) => {
  return getAddress(addresses.nftMarketOrders, chainId)
}

export const getNftMarketTradesAddress = (chainId?: number) => {
  return getAddress(addresses.nftMarketTrades, chainId)
}

export const getNftMarketHelperAddress = (chainId?: number) => {
  return getAddress(addresses.nftMarketHelper, chainId)
}

export const getNftMarketHelper2Address = (chainId?: number) => {
  return getAddress(addresses.nftMarketHelper2, chainId)
}

export const getNftMarketHelper3Address = (chainId?: number) => {
  return getAddress(addresses.nftMarketHelper3, chainId)
}

export const getMinterFactoryAddress = (chainId?: number) => {
  return getAddress(addresses.minterFactory, chainId)
}

export const getPaywallMarketOrdersAddress = (chainId?: number) => {
  return getAddress(addresses.paywallMarketOrders, chainId)
}

export const getPaywallMarketTradesAddress = (chainId?: number) => {
  return getAddress(addresses.paywallMarketTrades, chainId)
}

export const getPaywallMarketHelperAddress = (chainId?: number) => {
  return getAddress(addresses.paywallMarketHelper, chainId)
}

export const getPaywallMarketHelper2Address = (chainId?: number) => {
  return getAddress(addresses.paywallMarketHelper2, chainId)
}

export const getPaywallMarketHelper3Address = (chainId?: number) => {
  return getAddress(addresses.paywallMarketHelper3, chainId)
}

export const getPaywallARPHelperAddress = (chainId?: number) => {
  return getAddress(addresses.paywallARPHelper, chainId)
}

export const getPaywallARPFactoryAddress = (chainId?: number) => {
  return getAddress(addresses.paywallARPFactory, chainId)
}
export const getARPFactoryAddress = (chainId?: number) => {
  return getAddress(addresses.ARPFactory, chainId)
}
export const getARPMinterAddress = (chainId?: number) => {
  return getAddress(addresses.ARPMinter, chainId)
}
export const getARPHelperAddress = (chainId?: number) => {
  return getAddress(addresses.ARPHelper, chainId)
}
export const getARPNoteAddress = (chainId?: number) => {
  return getAddress(addresses.ARPNote, chainId)
}
export const getBILLFactoryAddress = (chainId?: number) => {
  return getAddress(addresses.BILLFactory, chainId)
}
export const getBILLMinterAddress = (chainId?: number) => {
  return getAddress(addresses.BILLMinter, chainId)
}
export const getBILLHelperAddress = (chainId?: number) => {
  return getAddress(addresses.BILLHelper, chainId)
}
export const getBILLNoteAddress = (chainId?: number) => {
  return getAddress(addresses.BILLNote, chainId)
}
export const getLotteryAddress = (chainId?: number) => {
  return getAddress(addresses.lottery, chainId)
}
export const getRandomNumberGeneratorAddress = (chainId?: number) => {
  return getAddress(addresses.randomNumberGenerator, chainId)
}
export const getLotteryHelperAddress = (chainId?: number) => {
  return getAddress(addresses.lotteryHelper, chainId)
}
export const getGameFactoryAddress = (chainId?: number) => {
  return getAddress(addresses.gameFactory, chainId)
}
export const getGameMinterAddress = (chainId?: number) => {
  return getAddress(addresses.gameMinter, chainId)
}
export const getGameHelperAddress = (chainId?: number) => {
  return getAddress(addresses.gameHelper, chainId)
}
export const getGameHelper2Address = (chainId?: number) => {
  return getAddress(addresses.gameHelper2, chainId)
}
export const getNFTicketAddress = (chainId?: number) => {
  return getAddress(addresses.nfticket, chainId)
}

export const getNFTicketHelperAddress = (chainId?: number) => {
  return getAddress(addresses.nfticketHelper, chainId)
}

export const getNFTicketHelper2Address = (chainId?: number) => {
  return getAddress(addresses.nfticketHelper2, chainId)
}

export const getStakeMarketAddress = (chainId?: number) => {
  return getAddress(addresses.stakemarket, chainId)
}

export const getStakeMarketNoteAddress = (chainId?: number) => {
  return getAddress(addresses.stakemarketNote, chainId)
}

export const getStakeMarketVoterAddress = (chainId?: number) => {
  return getAddress(addresses.stakemarketVoter, chainId)
}

export const getStakeMarketBribeAddress = (chainId?: number) => {
  return getAddress(addresses.stakemarketBribe, chainId)
}

export const getTrustBountiesVoterAddress = (chainId?: number) => {
  return getAddress(addresses.trustbountiesvoter, chainId)
}

export const getTrustBountiesAddress = (chainId?: number) => {
  return getAddress(addresses.trustbounties, chainId)
}

export const getTrustBountiesHelperAddress = (chainId?: number) => {
  return getAddress(addresses.trustbountiesHelper, chainId)
}

export const getValuepoolVoterAddress = (chainId?: number) => {
  return getAddress(addresses.valuepoolVoter, chainId)
}

export const getValuepoolHelperAddress = (chainId?: number) => {
  return getAddress(addresses.valuepoolHelper, chainId)
}

export const getValuepoolHelper2Address = (chainId?: number) => {
  return getAddress(addresses.valuepoolHelper2, chainId)
}

export const getSSIAddress = (chainId?: number) => {
  return getAddress(addresses.ssi, chainId)
}

export const getVaFactoryAddress = (chainId?: number) => {
  return getAddress(addresses.vaFactory, chainId)
}

export const getValuepoolFactoryAddress = (chainId?: number) => {
  return getAddress(addresses.valuepoolFactory, chainId)
}

export const getBusinessVoterAddress = (chainId?: number) => {
  return getAddress(addresses.businessVoter, chainId)
}
export const getReferralVoterAddress = (chainId?: number) => {
  return getAddress(addresses.referralVoter, chainId)
}
export const getAffiliatesVoterAddress = (chainId?: number) => {
  return getAddress(addresses.affiliatesVoter, chainId)
}