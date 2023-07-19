import type { Signer } from '@ethersproject/abstract-signer'
import type { Provider } from '@ethersproject/providers'
import { provider } from 'utils/wagmi'
import { Contract } from '@ethersproject/contracts'
import poolsConfig from 'config/constants/pools'
import { PoolCategory } from 'config/constants/types'
import { CAKE } from '@pancakeswap/tokens'

// Addresses
import {
  getAddress,
  getPancakeBunniesAddress,
  getBunnyFactoryAddress,
  getBunnySpecialAddress,
  getPoolGaugeAddress,
  getLotteryAddress,
  getLotteryHelperAddress,
  getRandomNumberGeneratorAddress,
  getLotteryRandomNumberGeneratorAddress,
  getFeeToAddress,
  getLotteryV2Address,
  getMasterChefAddress,
  getMasterChefV1Address,
  getPointCenterIfoAddress,
  getClaimRefundAddress,
  getTradingCompetitionAddressEaster,
  getEasterNftAddress,
  getCakeVaultAddress,
  getMulticallAddress,
  getBunnySpecialCakeVaultAddress,
  getBunnySpecialPredictionAddress,
  getBunnySpecialLotteryAddress,
  getFarmAuctionAddress,
  getAnniversaryAchievement,
  getNftMarketAddress,
  getNftSaleAddress,
  getPancakeSquadAddress,
  getTradingCompetitionAddressFanToken,
  getTradingCompetitionAddressMobox,
  getTradingCompetitionAddressMoD,
  getBunnySpecialXmasAddress,
  getICakeAddress,
  getPotteryDrawAddress,
  getZapAddress,
  getCakeFlexibleSideVaultAddress,
  getPredictionsV1Address,
  getBCakeFarmBoosterAddress,
  getBCakeFarmBoosterProxyFactoryAddress,
  getNonBscVaultAddress,
  getCrossFarmingSenderAddress,
  getCrossFarmingReceiverAddress,
  getRampHelperAddress,
  getRampAdsAddress,
  getRampFactoryAddress,
  getAuditorHelperAddress,
  getAuditorHelper2Address,
  getAuditorNoteAddress,
  getReferralVoterAddress,
  getContributorsVoterAddress,
  getAcceleratorVoterAddress,
  getAuditorFactoryAddress,
  getSponsorHelperAddress,
  getSponsorFactoryAddress,
  getProfileAddress,
  getProfileHelperAddress,
  getMarketEventsAddress,
  getMarketOrdersAddress,
  getMarketTradesAddress,
  getMarketHelperAddress,
  getMarketHelper2Address,
  getMarketHelper3Address,
  getNftMarketOrdersAddress,
  getNftMarketTradesAddress,
  getNftMarketHelperAddress,
  getNftMarketHelper2Address,
  getNftMarketHelper3Address,
  getMinterFactoryAddress,
  getPaywallMarketOrdersAddress,
  getPaywallMarketTradesAddress,
  getPaywallMarketHelperAddress,
  getPaywallMarketHelper2Address,
  getPaywallMarketHelper3Address,
  getPaywallARPFactoryAddress,
  getPaywallARPHelperAddress,
  getARPFactoryAddress,
  getARPHelperAddress,
  getARPNoteAddress,
  getARPMinterAddress,
  getBILLFactoryAddress,
  getBILLHelperAddress,
  getBILLNoteAddress,
  getBILLMinterAddress,
  getGameFactoryAddress,
  getGameHelperAddress,
  getGameHelper2Address,
  getGameMinterAddress,
  getNFTicketAddress,
  getNFTicketHelperAddress,
  getNFTicketHelper2Address,
  getStakeMarketAddress,
  getStakeMarketNoteAddress,
  getStakeMarketHeperAddress,
  getStakeMarketVoterAddress,
  getStakeMarketBribeAddress,
  getMarketCollectionsAddress,
  getTrustBountiesVoterAddress,
  getTrustBountiesAddress,
  getTrustBountiesHelperAddress,
  getValuepoolVoterAddress,
  getValuepoolFactoryAddress,
  getVaFactoryAddress,
  getSSIAddress,
  getValuepoolHelperAddress,
  getValuepoolHelper2Address,
  getBettingHelperAddress,
  getBettingFactoryAddress,
  getBettingMinterAddress,
  getBusinessVoterAddress,
  getAffiliatesVoterAddress,
  getWillFactoryAddress,
  getWillNoteAddress,
  getWorldFactoryAddress,
  getWorldNoteAddress,
  getWorldHelperAddress,
  getWorldHelper2Address,
  getWorldHelper3Address,
  getCardAddress,
} from 'utils/addressHelpers'

// ABI
import cardABI from 'config/abi/card.json'
import profileABI from 'config/abi/profile.json'
import profileHelperABI from 'config/abi/profileHelper.json'
import poolGaugeAbi from 'config/abi/poolGauge.json'
import feeToAbi from 'config/abi/feeTo.json'
import worldAbi from 'config/abi/world.json'
import worldHelperAbi from 'config/abi/worldHelper.json'
import worldHelper2Abi from 'config/abi/worldHelper2.json'
import worldHelper3Abi from 'config/abi/worldHelper3.json'
import worldNoteAbi from 'config/abi/worldNote.json'
import worldFactoryAbi from 'config/abi/worldFactory.json'
import contributorsVoterAbi from 'config/abi/contributorsvoter.json'
import acceleratorVoterAbi from 'config/abi/acceleratorvoter.json'
import referralVoterAbi from 'config/abi/referralvoter.json'
import pancakeBunniesAbi from 'config/abi/pancakeBunnies.json'
import bunnyFactoryAbi from 'config/abi/bunnyFactory.json'
import bunnySpecialAbi from 'config/abi/bunnySpecial.json'
import bep20Abi from 'config/abi/erc20.json'
import erc721Abi from 'config/abi/erc721.json'
import lpTokenAbi from 'config/abi/lpToken.json'
import cakeAbi from 'config/abi/cake.json'
import ifoV1Abi from 'config/abi/ifoV1.json'
import ifoV2Abi from 'config/abi/ifoV2.json'
import pointCenterIfo from 'config/abi/pointCenterIfo.json'
import lotteryV2Abi from 'config/abi/lotteryV2.json'
import lotteryAbi from 'config/abi/lottery.json'
import randomNumberGeneratorAbi from 'config/abi/randomNumberGenerator.json'
import lotteryRandomNumberGeneratorAbi from 'config/abi/lotteryRandomNumberGenerator.json'
import lotteryHelperAbi from 'config/abi/lotteryHelper.json'
import masterChef from 'config/abi/masterchef.json'
import masterChefV1 from 'config/abi/masterchefV1.json'
import sousChef from 'config/abi/sousChef.json'
import sousChefV2 from 'config/abi/sousChefV2.json'
import sousChefBnb from 'config/abi/sousChefBnb.json'
import claimRefundAbi from 'config/abi/claimRefund.json'
import bettingAbi from 'config/abi/betting.json'
import bettingMinterAbi from 'config/abi/bettingMinter.json'
import bettingHelperAbi from 'config/abi/bettingHelper.json'
import bettingFactoryAbi from 'config/abi/bettingFactory.json'
import tradingCompetitionEasterAbi from 'config/abi/tradingCompetitionEaster.json'
import tradingCompetitionFanTokenAbi from 'config/abi/tradingCompetitionFanToken.json'
import tradingCompetitionMoboxAbi from 'config/abi/tradingCompetitionMobox.json'
import tradingCompetitionMoDAbi from 'config/abi/tradingCompetitionMoD.json'
import easterNftAbi from 'config/abi/easterNft.json'
import cakeVaultV2Abi from 'config/abi/cakeVaultV2.json'
import cakeFlexibleSideVaultV2Abi from 'config/abi/cakeFlexibleSideVaultV2.json'
import predictionsAbi from 'config/abi/predictions.json'
import predictionsV1Abi from 'config/abi/predictionsV1.json'
import chainlinkOracleAbi from 'config/abi/chainlinkOracle.json'
import MultiCallAbi from 'config/abi/Multicall.json'
import bunnySpecialCakeVaultAbi from 'config/abi/bunnySpecialCakeVault.json'
import bunnySpecialPredictionAbi from 'config/abi/bunnySpecialPrediction.json'
import bunnySpecialLotteryAbi from 'config/abi/bunnySpecialLottery.json'
import bunnySpecialXmasAbi from 'config/abi/bunnySpecialXmas.json'
import farmAuctionAbi from 'config/abi/farmAuction.json'
import anniversaryAchievementAbi from 'config/abi/anniversaryAchievement.json'
import nftMarketAbi from 'config/abi/nftMarket.json'
import nftSaleAbi from 'config/abi/nftSale.json'
import pancakeSquadAbi from 'config/abi/pancakeSquad.json'
import erc721CollectionAbi from 'config/abi/erc721collection.json'
import potteryVaultAbi from 'config/abi/potteryVaultAbi.json'
import potteryDrawAbi from 'config/abi/potteryDrawAbi.json'
import zapAbi from 'config/abi/zap.json'
import iCakeAbi from 'config/abi/iCake.json'
import ifoV3Abi from 'config/abi/ifoV3.json'
import cakePredictionsAbi from 'config/abi/cakePredictions.json'
import bCakeFarmBoosterAbi from 'config/abi/bCakeFarmBooster.json'
import bCakeFarmBoosterProxyFactoryAbi from 'config/abi/bCakeFarmBoosterProxyFactory.json'
import bCakeProxyAbi from 'config/abi/bCakeProxy.json'
import nonBscVault from 'config/abi/nonBscVault.json'
import crossFarmingSenderAbi from 'config/abi/crossFarmingSender.json'
import crossFarmingReceiverAbi from 'config/abi/crossFarmingReceiver.json'
import crossFarmingProxyAbi from 'config/abi/crossFarmingProxy.json'
import rampAbi from 'config/abi/ramp.json'
import veAbi from 'config/abi/ve.json'
import rampHelperAbi from 'config/abi/rampHelper.json'
import rampFactoryAbi from 'config/abi/rampFactory.json'
import rampAdsAbi from 'config/abi/rampAds.json'
import willAbi from 'config/abi/will.json'
import willFactoryAbi from 'config/abi/willFactory.json'
import willNoteAbi from 'config/abi/willNote.json'
import auditorAbi from 'config/abi/auditor.json'
import auditorHelperAbi from 'config/abi/auditorHelper.json'
import auditorHelper2Abi from 'config/abi/auditorHelper2.json'
import auditorNoteAbi from 'config/abi/auditorNote.json'
import auditorFactoryAbi from 'config/abi/auditorFactory.json'
import sponsorAbi from 'config/abi/sponsor.json'
import sponsorHelperAbi from 'config/abi/sponsorNote.json'
import sponsorFactoryAbi from 'config/abi/sponsorFactory.json'
import marketEventsAbi from 'config/abi/marketEvents.json'
import marketCollectionsAbi from 'config/abi/marketcollections.json'
import marketOrdersAbi from 'config/abi/marketOrders.json'
import marketTradesAbi from 'config/abi/marketTrades.json'
import marketHelperAbi from 'config/abi/marketHelper.json'
import marketHelper2Abi from 'config/abi/marketHelper2.json'
import marketHelper3Abi from 'config/abi/marketHelper3.json'
import nftMarketOrdersAbi from 'config/abi/nftMarketOrders.json'
import nftMarketTradesAbi from 'config/abi/nftMarketTrades.json'
import nftMarketHelperAbi from 'config/abi/nftMarketHelper.json'
import nftMarketHelper2Abi from 'config/abi/nftMarketHelper2.json'
import nftMarketHelper3Abi from 'config/abi/nftMarketHelper3.json'
import minterFactoryAbi from 'config/abi/minterFactory.json'
import paywallMarketOrdersAbi from 'config/abi/paywallMarketOrders.json'
import paywallMarketTradesAbi from 'config/abi/paywallMarketTrades.json'
import paywallMarketHelperAbi from 'config/abi/paywallMarketHelper.json'
import paywallMarketHelper2Abi from 'config/abi/paywallMarketHelper2.json'
import paywallMarketHelper3Abi from 'config/abi/paywallMarketHelper3.json'
import paywallARPFactoryAbi from 'config/abi/paywallARPFactory.json'
import paywallARPHelperAbi from 'config/abi/paywallARPHelper.json'
import paywallAbi from 'config/abi/paywall.json'
import minterAbi from 'config/abi/minter.json'
import arpAbi from 'config/abi/arp.json' 
import arpNoteAbi from 'config/abi/arpNote.json' 
import arpHelperAbi from 'config/abi/arpHelper.json'
import arpFactoryAbi from 'config/abi/arpFactory.json'
import arpMinterAbi from 'config/abi/arpMinter.json'
import billAbi from 'config/abi/bill.json' 
import billNoteAbi from 'config/abi/billNote.json' 
import billHelperAbi from 'config/abi/billHelper.json'
import billFactoryAbi from 'config/abi/billFactory.json'
import billMinterAbi from 'config/abi/billMinter.json'
import gameAbi from 'config/abi/game.json'
import gameHelperAbi from 'config/abi/gameHelper.json'
import gameHelper2Abi from 'config/abi/gameHelper2.json'
import gameFactoryAbi from 'config/abi/gameFactory.json'
import gameMinterAbi from 'config/abi/gameMinter.json'
import NFTicketAbi from 'config/abi/nfticket.json'
import NFTicketHelperAbi from 'config/abi/nfticketHelper.json'
import NFTicketHelper2Abi from 'config/abi/nfticketHelper2.json'
import stakemarketAbi from 'config/abi/stakemarket.json'
import tustbountiesvoterAbi from 'config/abi/trustbountiesvoter.json'
import tustbountiesAbi from 'config/abi/trustbounties.json'
import tustbountiesHelperAbi from 'config/abi/trustbountiesHelper.json'
import stakemarketNoteAbi from 'config/abi/stakemarketnote.json'
import stakemarketHelperAbi from 'config/abi/stakemarkethelper.json'
import stakemarketBribeAbi from 'config/abi/stakemarketbribe.json'
import stakemarketVoterAbi from 'config/abi/stakemarketvoter.json'
import valuepoolHelperAbi from 'config/abi/valuepoolhelper.json'
import valuepoolHelper2Abi from 'config/abi/valuepoolhelper2.json'
import vestingAbi from 'config/abi/vesting.json'
import gaugeAbi from 'config/abi/gauge.json'
import bribeAbi from 'config/abi/bribe.json'
import businessVoterAbi from 'config/abi/businessvoter.json'
import veFactoryAbi from 'config/abi/vefactory.json'
import valuepoolFactoryAbi from 'config/abi/valuepoolfactory.json'
import valuepoolVoterAbi from 'config/abi/valuepoolvoter.json'
import valuepoolAbi from 'config/abi/valuepool.json'
import vaAbi from 'config/abi/va.json'
import SSIAbi from 'config/abi/SSI.json'

// Types
import type {
  ChainlinkOracle,
  FarmAuction,
  Predictions,
  AnniversaryAchievement,
  IfoV1,
  IfoV2,
  Erc20,
  Erc721,
  Cake,
  BunnyFactory,
  PancakeBunnies,
  Profile,
  ProfileHelper,
  LotteryV2,
  LotteryHelper,
  Lottery,
  Masterchef,
  MasterchefV1,
  SousChef,
  SousChefV2,
  BunnySpecial,
  LpToken,
  ClaimRefund,
  TradingCompetitionEaster,
  TradingCompetitionFanToken,
  EasterNft,
  Multicall,
  BunnySpecialCakeVault,
  BunnySpecialPrediction,
  BunnySpecialLottery,
  NftMarket,
  NftSale,
  PancakeSquad,
  Erc721collection,
  PointCenterIfo,
  CakeVaultV2,
  CakeFlexibleSideVaultV2,
  TradingCompetitionMobox,
  ICake,
  TradingCompetitionMoD,
  PotteryVaultAbi,
  PotteryDrawAbi,
  Zap,
  PredictionsV1,
  BCakeFarmBooster,
  BCakeFarmBoosterProxyFactory,
  BCakeProxy,
  NonBscVault,
  CrossFarmingSender,
  CrossFarmingReceiver,
  CrossFarmingProxy,
  Ramp,
  RampAds,
  RampHelper,
  RampFactory,
  MarketEvents,
  Marketcollections,
  MarketOrders,
  MarketTrades,
  MarketHelper,
  MarketHelper2,
  MarketHelper3,
  NftMarketOrders,
  NftMarketTrades,
  NftMarketHelper,
  NftMarketHelper2,
  NftMarketHelper3,
  PaywallMarketOrders,
  PaywallMarketTrades,
  PaywallMarketHelper,
  PaywallMarketHelper2,
  PaywallMarketHelper3,
  PaywallARPFactory,
  PaywallARPHelper,
  Paywall,
  Minter,
  MinterFactory,
  Nfticket,
  NfticketHelper,
  NfticketHelper2,
  Stakemarket,
  Stakemarketnote,
  Stakemarkethelper,
  Stakemarketbribe,
  Stakemarketvoter,
  Trustbounties,
  TrustbountiesHelper,
  Trustbountiesvoter,
  Valuepoolhelper,
  Valuepoolhelper2,
  Valuepool,
  Valuepoolfactory,
  Valuepoolvoter,
  Vefactory,
  Va,
  Ve,
  SSI,
  Vesting,
  Gauge,
  Bribe,
  Businessvoter,
  AuditorFactory,
  AuditorHelper,
  AuditorHelper2,
  AuditorNote,
  Auditor,
  WorldFactory,
  WorldHelper,
  WorldHelper2,
  WorldHelper3,
  WorldNote,
  World,
  SponsorFactory,
  SponsorNote,
  Sponsor,
  Contributorsvoter,
  Acceleratorvoter,
  Referralvoter,
  PoolGauge,
  FeeTo,
  Arp,
  ArpNote,
  ArpMinter,
  ArpHelper,
  ArpFactory,
  Bill,
  BillNote,
  BillMinter,
  BillHelper,
  BillFactory,
  Will,
  WillNote,
  WillFactory,
  GameMinter,
  GameHelper,
  GameHelper2,
  GameFactory,
  // GameContract,
  Betting,
  BettingFactory,
  BettingHelper,
  BettingMinter,
  RandomNumberGenerator,
  LotteryRandomNumberGenerator,
  Card,
} from 'config/abi/types'
import { ChainId } from '@pancakeswap/sdk'

export const getContract = ({
  abi,
  address,
  chainId = ChainId.FANTOM_TESTNET,
  signer,
}: {
  abi: any
  address: string
  chainId?: ChainId
  signer?: Signer | Provider
}) => {
  const signerOrProvider = signer ?? provider({ chainId })
  return new Contract(address, abi, signerOrProvider)
}

export const getBep20Contract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: bep20Abi, address, signer }) as Erc20
}
export const getErc721Contract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: erc721Abi, address, signer }) as Erc721
}
export const getLpContract = (address: string, chainId?: number, signer?: Signer | Provider) => {
  return getContract({ abi: lpTokenAbi, address, signer, chainId }) as LpToken
}
export const getIfoV1Contract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: ifoV1Abi, address, signer }) as IfoV1
}
export const getIfoV2Contract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: ifoV2Abi, address, signer }) as IfoV2
}
export const getIfoV3Contract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: ifoV3Abi, address, signer })
}
export const getSouschefContract = (id: number, signer?: Signer | Provider) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  const abi = config.poolCategory === PoolCategory.BINANCE ? sousChefBnb : sousChef
  return getContract({ abi, address: getAddress(config.contractAddress), signer }) as SousChef
}
export const getSouschefV2Contract = (id: number, signer?: Signer | Provider) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  return getContract({ abi: sousChefV2, address: getAddress(config.contractAddress), signer }) as SousChefV2
}

export const getPointCenterIfoContract = (signer?: Signer | Provider) => {
  return getContract({ abi: pointCenterIfo, address: getPointCenterIfoAddress(), signer }) as PointCenterIfo
}
export const getCakeContract = (signer?: Signer | Provider, chainId?: number) => {
  return getContract({
    abi: cakeAbi,
    address: chainId ? CAKE[chainId].address : CAKE[ChainId.BSC].address,
    signer,
  }) as Cake
}
export const getProfileContract = (signer?: Signer | Provider) => {
  return getContract({ abi: profileABI, address: getProfileAddress(), signer }) as Profile
}
export const getProfileHelperContract = (signer?: Signer | Provider) => {
  return getContract({ abi: profileHelperABI, address: getProfileHelperAddress(), signer }) as ProfileHelper
}
export const getPancakeBunniesContract = (signer?: Signer | Provider) => {
  return getContract({ abi: pancakeBunniesAbi, address: getPancakeBunniesAddress(), signer }) as PancakeBunnies
}
export const getBunnyFactoryContract = (signer?: Signer | Provider) => {
  return getContract({ abi: bunnyFactoryAbi, address: getBunnyFactoryAddress(), signer }) as BunnyFactory
}
export const getBunnySpecialContract = (signer?: Signer | Provider) => {
  return getContract({ abi: bunnySpecialAbi, address: getBunnySpecialAddress(), signer }) as BunnySpecial
}
export const getLotteryV2Contract = (signer?: Signer | Provider) => {
  return getContract({ abi: lotteryV2Abi, address: getLotteryV2Address(), signer }) as LotteryV2
}
export const getLotteryHelperContract = (signer?: Signer | Provider) => {
  return getContract({ abi: lotteryHelperAbi, address: getLotteryHelperAddress(), signer }) as LotteryHelper
}
export const getLotteryContract = (signer?: Signer | Provider) => {
  return getContract({ abi: lotteryAbi, address: getLotteryAddress(), signer }) as Lottery
}
export const getRandomNumberGenerator = (signer?: Signer | Provider) => {
  return getContract({ abi: randomNumberGeneratorAbi, address: getRandomNumberGeneratorAddress(), signer }) as RandomNumberGenerator
}
export const getLotteryRandomNumberGenerator = (signer?: Signer | Provider) => {
  return getContract({ abi: lotteryRandomNumberGeneratorAbi, address: getLotteryRandomNumberGeneratorAddress(), signer }) as LotteryRandomNumberGenerator
}
export const getMasterchefContract = (signer?: Signer | Provider, chainId?: number) => {
  return getContract({ abi: masterChef, address: getMasterChefAddress(chainId), signer }) as Masterchef
}
export const getMasterchefV1Contract = (signer?: Signer | Provider) => {
  return getContract({ abi: masterChefV1, address: getMasterChefV1Address(), signer }) as MasterchefV1
}
export const getClaimRefundContract = (signer?: Signer | Provider) => {
  return getContract({ abi: claimRefundAbi, address: getClaimRefundAddress(), signer }) as ClaimRefund
}
export const getTradingCompetitionContractEaster = (signer?: Signer | Provider) => {
  return getContract({
    abi: tradingCompetitionEasterAbi,
    address: getTradingCompetitionAddressEaster(),
    signer,
  }) as TradingCompetitionEaster
}

export const getTradingCompetitionContractFanToken = (signer?: Signer | Provider) => {
  return getContract({
    abi: tradingCompetitionFanTokenAbi,
    address: getTradingCompetitionAddressFanToken(),
    signer,
  }) as TradingCompetitionFanToken
}
export const getTradingCompetitionContractMobox = (signer?: Signer | Provider) => {
  return getContract({
    abi: tradingCompetitionMoboxAbi,
    address: getTradingCompetitionAddressMobox(),
    signer,
  }) as TradingCompetitionMobox
}

export const getTradingCompetitionContractMoD = (signer?: Signer | Provider) => {
  return getContract({
    abi: tradingCompetitionMoDAbi,
    address: getTradingCompetitionAddressMoD(),
    signer,
  }) as TradingCompetitionMoD
}

export const getEasterNftContract = (signer?: Signer | Provider) => {
  return getContract({ abi: easterNftAbi, address: getEasterNftAddress(), signer }) as EasterNft
}
export const getCakeVaultV2Contract = (signer?: Signer | Provider) => {
  return getContract({ abi: cakeVaultV2Abi, address: getCakeVaultAddress(), signer }) as CakeVaultV2
}

export const getCakeFlexibleSideVaultV2Contract = (signer?: Signer | Provider) => {
  return getContract({
    abi: cakeFlexibleSideVaultV2Abi,
    address: getCakeFlexibleSideVaultAddress(),
    signer,
  }) as CakeFlexibleSideVaultV2
}

export const getPredictionsContract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: predictionsAbi, address, signer }) as Predictions
}

export const getPredictionsV1Contract = (signer?: Signer | Provider) => {
  return getContract({ abi: predictionsV1Abi, address: getPredictionsV1Address(), signer }) as PredictionsV1
}

export const getCakePredictionsContract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: cakePredictionsAbi, address, signer }) as Predictions
}

export const getChainlinkOracleContract = (address: string, signer?: Signer | Provider, chainId?: number) => {
  return getContract({ abi: chainlinkOracleAbi, address, signer, chainId }) as ChainlinkOracle
}
export const getMulticallContract = (chainId: ChainId) => {
  return getContract({ abi: MultiCallAbi, address: getMulticallAddress(chainId), chainId }) as Multicall
}
export const getBunnySpecialCakeVaultContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: bunnySpecialCakeVaultAbi,
    address: getBunnySpecialCakeVaultAddress(),
    signer,
  }) as BunnySpecialCakeVault
}
export const getBunnySpecialPredictionContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: bunnySpecialPredictionAbi,
    address: getBunnySpecialPredictionAddress(),
    signer,
  }) as BunnySpecialPrediction
}
export const getBunnySpecialLotteryContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: bunnySpecialLotteryAbi,
    address: getBunnySpecialLotteryAddress(),
    signer,
  }) as BunnySpecialLottery
}
export const getBunnySpecialXmasContract = (signer?: Signer | Provider) => {
  return getContract({ abi: bunnySpecialXmasAbi, address: getBunnySpecialXmasAddress(), signer })
}
export const getFarmAuctionContract = (signer?: Signer | Provider) => {
  return getContract({ abi: farmAuctionAbi, address: getFarmAuctionAddress(), signer }) as unknown as FarmAuction
}
export const getAnniversaryAchievementContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: anniversaryAchievementAbi,
    address: getAnniversaryAchievement(),
    signer,
  }) as AnniversaryAchievement
}

export const getNftMarketContract = (signer?: Signer | Provider) => {
  return getContract({ abi: nftMarketAbi, address: getNftMarketAddress(), signer }) as NftMarket
}
export const getNftSaleContract = (signer?: Signer | Provider) => {
  return getContract({ abi: nftSaleAbi, address: getNftSaleAddress(), signer }) as NftSale
}
export const getPancakeSquadContract = (signer?: Signer | Provider) => {
  return getContract({ abi: pancakeSquadAbi, address: getPancakeSquadAddress(), signer }) as PancakeSquad
}
export const getErc721CollectionContract = (signer?: Signer | Provider, address?: string) => {
  return getContract({ abi: erc721CollectionAbi, address, signer }) as Erc721collection
}

export const getPotteryVaultContract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: potteryVaultAbi, address, signer }) as PotteryVaultAbi
}

export const getPotteryDrawContract = (signer?: Signer | Provider) => {
  return getContract({ abi: potteryDrawAbi, address: getPotteryDrawAddress(), signer }) as PotteryDrawAbi
}

export const getZapContract = (signer?: Signer | Provider) => {
  return getContract({ abi: zapAbi, address: getZapAddress(), signer }) as Zap
}

export const getIfoCreditAddressContract = (signer?: Signer | Provider) => {
  return getContract({ abi: iCakeAbi, address: getICakeAddress(), signer }) as ICake
}

export const getBCakeFarmBoosterContract = (signer?: Signer | Provider) => {
  return getContract({ abi: bCakeFarmBoosterAbi, address: getBCakeFarmBoosterAddress(), signer }) as BCakeFarmBooster
}

export const getBCakeFarmBoosterProxyFactoryContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: bCakeFarmBoosterProxyFactoryAbi,
    address: getBCakeFarmBoosterProxyFactoryAddress(),
    signer,
  }) as BCakeFarmBoosterProxyFactory
}

export const getBCakeProxyContract = (proxyContractAddress: string, signer?: Signer | Provider) => {
  return getContract({ abi: bCakeProxyAbi, address: proxyContractAddress, signer }) as BCakeProxy
}

export const getNonBscVaultContract = (signer?: Signer | Provider, chainId?: number) => {
  return getContract({ abi: nonBscVault, address: getNonBscVaultAddress(chainId), chainId, signer }) as NonBscVault
}

export const getCrossFarmingSenderContract = (signer?: Signer | Provider, chainId?: number) => {
  return getContract({
    abi: crossFarmingSenderAbi,
    address: getCrossFarmingSenderAddress(chainId),
    chainId,
    signer,
  }) as CrossFarmingSender
}

export const getCrossFarmingReceiverContract = (signer?: Signer | Provider, chainId?: number) => {
  return getContract({
    abi: crossFarmingReceiverAbi,
    address: getCrossFarmingReceiverAddress(chainId),
    chainId,
    signer,
  }) as CrossFarmingReceiver
}

export const getCrossFarmingProxyContract = (
  proxyContractAddress: string,
  signer?: Signer | Provider,
  chainId?: number,
) => {
  return getContract({ abi: crossFarmingProxyAbi, address: proxyContractAddress, chainId, signer }) as CrossFarmingProxy
}

export const getRampContract = (rampAddress: string, signer?: Signer | Provider) => {
  return getContract({
    abi: rampAbi, 
    address: rampAddress, 
    signer
  }) as Ramp
}

export const getVeContract = (veAddress: string, signer?: Signer | Provider) => {
  return getContract({
    abi: veAbi, 
    address: veAddress, 
    signer
  }) as Ve
}

export const getRampAdsContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: rampAdsAbi, 
    address: getRampAdsAddress(), 
    signer
  }) as RampAds
}

export const getRampFactoryContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: rampFactoryAbi, 
    address: getRampFactoryAddress(), 
    signer
  }) as RampFactory
}

export const getRampHelperContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: rampHelperAbi, 
    address: getRampHelperAddress(), 
    signer
  }) as RampHelper
}

export const getAuditorHelperContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: auditorHelperAbi, 
    address: getAuditorHelperAddress(), 
    signer
  }) as AuditorHelper
}

export const getAuditorHelper2Contract = (signer?: Signer | Provider) => {
  return getContract({
    abi: auditorHelper2Abi, 
    address: getAuditorHelper2Address(), 
    signer
  }) as AuditorHelper2
}

export const getAuditorNoteContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: auditorNoteAbi, 
    address: getAuditorNoteAddress(), 
    signer
  }) as AuditorNote
}

export const getWorldHelperContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: worldHelperAbi, 
    address: getWorldHelperAddress(), 
    signer
  }) as WorldHelper
}

export const getWorldHelper2Contract = (signer?: Signer | Provider) => {
  return getContract({
    abi: worldHelper2Abi, 
    address: getWorldHelper2Address(), 
    signer
  }) as WorldHelper2
}

export const getWorldHelper3Contract = (signer?: Signer | Provider) => {
  return getContract({
    abi: worldHelper3Abi, 
    address: getWorldHelper3Address(), 
    signer
  }) as WorldHelper3
}

export const getWorldNoteContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: worldNoteAbi, 
    address: getWorldNoteAddress(), 
    signer
  }) as WorldNote
}

export const getContributorsVoterContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: contributorsVoterAbi, 
    address: getContributorsVoterAddress(), 
    signer
  }) as Contributorsvoter
}

export const getAcceleratorVoterContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: acceleratorVoterAbi, 
    address: getAcceleratorVoterAddress(), 
    signer
  }) as Acceleratorvoter
}

export const getReferralVoterContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: referralVoterAbi, 
    address: getReferralVoterAddress(), 
    signer
  }) as Referralvoter
}

export const getAuditorFactoryContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: auditorFactoryAbi, 
    address: getAuditorFactoryAddress(), 
    signer
  }) as AuditorFactory
}

export const getAuditorContract = (auditorContractAddress: string, signer?: Signer | Provider) => {
  return getContract({
    abi: auditorAbi, 
    address: auditorContractAddress, 
    signer
  }) as Auditor
}

export const getCardContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: cardABI, 
    address: getCardAddress(), 
    signer
  }) as Card
}

export const getWillContract = (willContractAddress: string, signer?: Signer | Provider) => {
  return getContract({
    abi: willAbi, 
    address: willContractAddress, 
    signer
  }) as Will
}

export const getWillFactoryContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: willFactoryAbi, 
    address: getWillFactoryAddress(), 
    signer
  }) as WillFactory
}

export const getWillNoteContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: willNoteAbi, 
    address: getWillNoteAddress(), 
    signer
  }) as WillNote
}

export const getWorldFactoryContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: worldFactoryAbi, 
    address: getWorldFactoryAddress(), 
    signer
  }) as WorldFactory
}

export const getWorldContract = (worldContractAddress: string, signer?: Signer | Provider) => {
  return getContract({
    abi: worldAbi, 
    address: worldContractAddress, 
    signer
  }) as World
}

export const getSponsorHelperContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: sponsorHelperAbi, 
    address: getSponsorHelperAddress(), 
    signer
  }) as SponsorNote
}

export const getSponsorFactoryContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: sponsorFactoryAbi, 
    address: getSponsorFactoryAddress(), 
    signer
  }) as SponsorFactory
}

export const getSponsorContract = (sponsorContractAddress: string, signer?: Signer | Provider) => {
  return getContract({
    abi: sponsorAbi, 
    address: sponsorContractAddress, 
    signer
  }) as Sponsor
}

export const getMarketEventsContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: marketEventsAbi, 
    address: getMarketEventsAddress(), 
    signer
  }) as MarketEvents
}

export const getMarketCollectionsContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: marketCollectionsAbi, 
    address: getMarketCollectionsAddress(), 
    signer
  }) as Marketcollections
}

export const getMarketOrdersContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: marketOrdersAbi, 
    address: getMarketOrdersAddress(), 
    signer
  }) as MarketOrders
}

export const getMarketTradesContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: marketTradesAbi, 
    address: getMarketTradesAddress(), 
    signer
  }) as MarketTrades
}

export const getMarketHelperContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: marketHelperAbi, 
    address: getMarketHelperAddress(), 
    signer
  }) as MarketHelper
}

export const getMarketHelper2Contract = (signer?: Signer | Provider) => {
  return getContract({
    abi: marketHelper2Abi, 
    address: getMarketHelper2Address(), 
    signer
  }) as MarketHelper2
}

export const getMarketHelper3Contract = (signer?: Signer | Provider) => {
  return getContract({
    abi: marketHelper3Abi, 
    address: getMarketHelper3Address(), 
    signer
  }) as MarketHelper3
}

export const getNftMarketOrdersContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: nftMarketOrdersAbi, 
    address: getNftMarketOrdersAddress(), 
    signer
  }) as NftMarketOrders
}

export const getNftMarketTradesContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: nftMarketTradesAbi, 
    address: getNftMarketTradesAddress(), 
    signer
  }) as NftMarketTrades
}

export const getNftMarketHelperContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: nftMarketHelperAbi, 
    address: getNftMarketHelperAddress(), 
    signer
  }) as NftMarketHelper
}

export const getNftMarketHelper2Contract = (signer?: Signer | Provider) => {
  return getContract({
    abi: nftMarketHelper2Abi, 
    address: getNftMarketHelper2Address(), 
    signer
  }) as NftMarketHelper2
}

export const getNftMarketHelper3Contract = (signer?: Signer | Provider) => {
  return getContract({
    abi: nftMarketHelper3Abi, 
    address: getNftMarketHelper3Address(), 
    signer
  }) as NftMarketHelper3
}

export const getMinterFactoryContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: minterFactoryAbi, 
    address: getMinterFactoryAddress(), 
    signer
  }) as MinterFactory
}

export const getPaywallMarketOrdersContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: paywallMarketOrdersAbi, 
    address: getPaywallMarketOrdersAddress(), 
    signer
  }) as PaywallMarketOrders
}

export const getPaywallMarketTradesContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: paywallMarketTradesAbi, 
    address: getPaywallMarketTradesAddress(), 
    signer
  }) as PaywallMarketTrades
}

export const getPaywallMarketHelperContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: paywallMarketHelperAbi, 
    address: getPaywallMarketHelperAddress(), 
    signer
  }) as PaywallMarketHelper
}

export const getPaywallMarketHelper2Contract = (signer?: Signer | Provider) => {
  return getContract({
    abi: paywallMarketHelper2Abi, 
    address: getPaywallMarketHelper2Address(), 
    signer
  }) as PaywallMarketHelper2
}

export const getPaywallMarketHelper3Contract = (signer?: Signer | Provider) => {
  return getContract({
    abi: paywallMarketHelper3Abi, 
    address: getPaywallMarketHelper3Address(), 
    signer
  }) as PaywallMarketHelper3
}

export const getPaywallARPHelperContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: paywallARPHelperAbi, 
    address: getPaywallARPHelperAddress(), 
    signer
  }) as PaywallARPHelper
}

export const getPaywallARPFactoryContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: paywallARPFactoryAbi, 
    address: getPaywallARPFactoryAddress(), 
    signer
  }) as PaywallARPFactory
}

export const getARPContract = (arpContractAddress: string, signer?: Signer | Provider) => {
  return getContract({
    abi: arpAbi, 
    address: arpContractAddress, 
    signer
  }) as Arp
}

export const getARPFactoryContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: arpFactoryAbi, 
    address: getARPFactoryAddress(), 
    signer
  }) as ArpFactory
}

export const getARPHelperContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: arpHelperAbi, 
    address: getARPHelperAddress(), 
    signer
  }) as ArpHelper
}

export const getARPNoteContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: arpNoteAbi, 
    address: getARPNoteAddress(), 
    signer
  }) as ArpNote
}

export const getARPMinterContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: arpMinterAbi, 
    address: getARPMinterAddress(), 
    signer
  }) as ArpMinter
}

export const getBILLContract = (billContractAddress: string, signer?: Signer | Provider) => {
  return getContract({
    abi: billAbi, 
    address: billContractAddress, 
    signer
  }) as Bill
}

export const getBILLFactoryContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: billFactoryAbi, 
    address: getBILLFactoryAddress(), 
    signer
  }) as BillFactory
}

export const getBILLHelperContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: billHelperAbi, 
    address: getBILLHelperAddress(), 
    signer
  }) as BillHelper
}

export const getBILLNoteContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: billNoteAbi, 
    address: getBILLNoteAddress(), 
    signer
  }) as BillNote
}

export const getBILLMinterContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: billMinterAbi, 
    address: getBILLMinterAddress(), 
    signer
  }) as BillMinter
}

export const getGameContract = (gameContractAddress: string, signer?: Signer | Provider) => {
  return getContract({
    abi: gameAbi, 
    address: gameContractAddress, 
    signer
  }) as GameHelper
}

export const getGameFactoryContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: gameFactoryAbi, 
    address: getGameFactoryAddress(), 
    signer
  }) as GameFactory
}

export const getGameHelperContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: gameHelperAbi, 
    address: getGameHelperAddress(), 
    signer
  }) as GameHelper
}

export const getGameHelper2Contract = (signer?: Signer | Provider) => {
  return getContract({
    abi: gameHelper2Abi, 
    address: getGameHelper2Address(), 
    signer
  }) as GameHelper2
}

export const getGameMinterContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: gameMinterAbi, 
    address: getGameMinterAddress(), 
    signer
  }) as GameMinter
}

export const getNFTicket = (signer?: Signer | Provider) => {
  return getContract({
    abi: NFTicketAbi, 
    address: getNFTicketAddress(), 
    signer
  }) as Nfticket
}

export const getNFTicketHelper = (signer?: Signer | Provider) => {
  return getContract({
    abi: NFTicketHelperAbi, 
    address: getNFTicketHelperAddress(), 
    signer
  }) as NfticketHelper
}

export const getNFTicketHelper2 = (signer?: Signer | Provider) => {
  return getContract({
    abi: NFTicketHelper2Abi, 
    address: getNFTicketHelper2Address(), 
    signer
  }) as NfticketHelper2
}

export const getPaywallContract = (paywallAddress: string, signer?: Signer | Provider) => {
  return getContract({
    abi: paywallAbi, 
    address: paywallAddress, 
    signer
  }) as Paywall
}

export const getMinterContract = (minterAddress: string, signer?: Signer | Provider) => {
  return getContract({
    abi: minterAbi, 
    address: minterAddress, 
    signer
  }) as Minter
}

export const getStakeMarketVoterContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: stakemarketVoterAbi, 
    address: getStakeMarketVoterAddress(), 
    signer
  }) as Stakemarketvoter
}

export const getStakeMarketBribeContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: stakemarketBribeAbi, 
    address: getStakeMarketBribeAddress(), 
    signer
  }) as Stakemarketbribe
}

export const getStakeMarketContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: stakemarketAbi, 
    address: getStakeMarketAddress(), 
    signer
  }) as Stakemarket
}

export const getStakeMarketNoteContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: stakemarketNoteAbi, 
    address: getStakeMarketNoteAddress(), 
    signer
  }) as Stakemarketnote
}

export const getStakeMarketHelperContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: stakemarketHelperAbi, 
    address: getStakeMarketHeperAddress(), 
    signer
  }) as Stakemarkethelper
}

export const getTrustBountiesVoterContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: tustbountiesvoterAbi, 
    address: getTrustBountiesVoterAddress(), 
    signer
  }) as Trustbountiesvoter
}

export const getTrustBountiesContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: tustbountiesAbi, 
    address: getTrustBountiesAddress(), 
    signer
  }) as Trustbounties
}

export const getTrustBountiesHelperContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: tustbountiesHelperAbi, 
    address: getTrustBountiesHelperAddress(), 
    signer
  }) as TrustbountiesHelper
}

export const getValuepoolVoterContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: valuepoolVoterAbi, 
    address: getValuepoolVoterAddress(), 
    signer
  }) as Valuepoolvoter
}

export const getValuepoolContract = (valuepoolAddress: string, signer?: Signer | Provider) => {
  return getContract({
    abi: valuepoolAbi, 
    address: valuepoolAddress, 
    signer
  }) as Valuepool
}

export const getValuepoolFactoryContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: valuepoolFactoryAbi, 
    address: getValuepoolFactoryAddress(), 
    signer
  }) as Valuepoolfactory
}

export const getVaFactoryContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: veFactoryAbi, 
    address: getVaFactoryAddress(), 
    signer
  }) as Vefactory
}

export const getValuepoolHelperContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: valuepoolHelperAbi, 
    address: getValuepoolHelperAddress(), 
    signer
  }) as Valuepoolhelper
}

export const getValuepoolHelper2Contract = (signer?: Signer | Provider) => {
  return getContract({
    abi: valuepoolHelper2Abi, 
    address: getValuepoolHelper2Address(), 
    signer
  }) as Valuepoolhelper2
}

export const getBettingContract = (bettingAddress: string, signer?: Signer | Provider) => {
  return getContract({
    abi: bettingAbi, 
    address: bettingAddress, 
    signer
  }) as Betting
}

export const getBettingFactoryContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: bettingFactoryAbi, 
    address: getBettingFactoryAddress(), 
    signer
  }) as BettingFactory
}

export const getBettingHelperContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: bettingHelperAbi, 
    address: getBettingHelperAddress(), 
    signer
  }) as BettingHelper
}

export const getBettingMinterContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: bettingMinterAbi, 
    address: getBettingMinterAddress(), 
    signer
  }) as BettingMinter
}

export const getSSIContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: SSIAbi, 
    address: getSSIAddress(), 
    signer
  }) as SSI
}

export const getVestingContract = (vestingContractAddress: string, signer?: Signer | Provider) => {
  return getContract({
    abi: vestingAbi, 
    address: vestingContractAddress, 
    signer
  }) as Vesting
}

export const getGaugeContract = (gaugeContractAddress: string, signer?: Signer | Provider) => {
  return getContract({
    abi: gaugeAbi, 
    address: gaugeContractAddress, 
    signer
  }) as Gauge
}

export const getBribeContract = (bribeContractAddress: string, signer?: Signer | Provider) => {
  return getContract({
    abi: bribeAbi, 
    address: bribeContractAddress, 
    signer
  }) as Bribe
}

export const getVaContract = (vaAddress: string, signer?: Signer | Provider) => {
  return getContract({
    abi: vaAbi, 
    address: vaAddress, 
    signer
  }) as Va
}

export const getBusinessVoterContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: businessVoterAbi, 
    address: getBusinessVoterAddress(), 
    signer
  }) as Businessvoter
}

export const getAffiliatesVoterContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: businessVoterAbi, 
    address: getAffiliatesVoterAddress(), 
    signer
  }) as Businessvoter
}

export const getPoolGaugeContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: poolGaugeAbi, 
    address: getPoolGaugeAddress(), 
    signer
  }) as PoolGauge
}

export const getFeeToContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: feeToAbi, 
    address: getFeeToAddress(), 
    signer
  }) as FeeTo
}