import { ChainId } from '@pancakeswap/sdk'

export const GRAPH_API_PROFILE = 'https://api.thegraph.com/subgraphs/name/pectoraux/profile'
export const GRAPH_API_PREDICTION_BNB = 'https://api.thegraph.com/subgraphs/name/pancakeswap/prediction-v2'
export const GRAPH_API_PREDICTION_CAKE = 'https://api.thegraph.com/subgraphs/name/pancakeswap/prediction-cake'

export const GRAPH_API_LOTTERY = 'https://api.thegraph.com/subgraphs/name/pancakeswap/lottery'
export const SNAPSHOT_BASE_URL = process.env.NEXT_PUBLIC_SNAPSHOT_BASE_URL
export const API_PROFILE = 'https://profile.pancakeswap.com'
export const API_NFT = 'https://nft.pancakeswap.com/api/v1'
export const SNAPSHOT_API = `${SNAPSHOT_BASE_URL}/graphql`
export const SNAPSHOT_HUB_API = `${SNAPSHOT_BASE_URL}/api/message`
export const GRAPH_API_POTTERY = 'https://api.thegraph.com/subgraphs/name/pancakeswap/pottery'

/**
 * V1 will be deprecated but is still used to claim old rounds
 */
export const GRAPH_API_PREDICTION_V1 = 'https://api.thegraph.com/subgraphs/name/pancakeswap/prediction'

export const INFO_CLIENT = 'https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2'
export const INFO_CLIENT_ETH = 'https://api.thegraph.com/subgraphs/name/pancakeswap/exhange-eth'
export const BLOCKS_CLIENT = 'https://api.thegraph.com/subgraphs/name/pancakeswap/blocks'
export const BLOCKS_CLIENT_ETH = 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks'
export const STABLESWAP_SUBGRAPH_CLIENT = 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-stableswap'
export const GRAPH_API_NFTMARKET = 'https://api.thegraph.com/subgraphs/name/pancakeswap/nft-market'
export const GRAPH_API_CANCAN = 'https://api.thegraph.com/subgraphs/name/pectoraux/cancan2'
export const GRAPH_API_BUSINESS = 'https://api.thegraph.com/subgraphs/name/pectoraux/businessvoter'
export const GRAPH_API_REFERRAL = 'https://api.thegraph.com/subgraphs/name/pectoraux/referralvoter'
export const GRAPH_API_CONTRIBUTORS = 'https://api.thegraph.com/subgraphs/name/pectoraux/contributorsvoter'
export const GRAPH_API_SM_VOTER = 'https://api.thegraph.com/subgraphs/name/pectoraux/stakemarketvoter'
export const GRAPH_API_TB_VOTER = 'https://api.thegraph.com/subgraphs/name/pectoraux/trustbountiesvoter'
export const GRAPH_API_ACC_VOTER = 'https://api.thegraph.com/subgraphs/name/pectoraux/acceleratorvoter'
export const GRAPH_API_CONTRIBUTORS_VOTER = 'https://api.thegraph.com/subgraphs/name/pectoraux/contributorsvoter'
export const GRAPH_API_SSI = 'https://api.thegraph.com/subgraphs/name/pectoraux/ssi'
export const GRAPH_API_BETTINGS = 'https://api.thegraph.com/subgraphs/name/pectoraux/betting'
export const GRAPH_API_STAKES = 'https://api.thegraph.com/subgraphs/name/pectoraux/stakemarket'
export const GRAPH_API_VALUEPOOLS = 'https://api.thegraph.com/subgraphs/name/pectoraux/valuepools'
export const GRAPH_API_VP_VOTER = 'https://api.thegraph.com/subgraphs/name/pectoraux/valuepoolvoter'
export const GRAPH_API_AUDITORS = 'https://api.thegraph.com/subgraphs/name/pectoraux/auditors'
export const GRAPH_API_CARDS = 'https://api.thegraph.com/subgraphs/name/pectoraux/cards'
export const GRAPH_API_COLLATERALS = 'https://api.thegraph.com/subgraphs/name/pectoraux/futureCollaterals'
export const GRAPH_API_ARPS = 'https://api.thegraph.com/subgraphs/name/pectoraux/arp'
export const GRAPH_API_LOTTERIES = 'https://api.thegraph.com/subgraphs/name/pectoraux/lotteries'
export const GRAPH_API_BILLS = 'https://api.thegraph.com/subgraphs/name/pectoraux/bills'
export const GRAPH_API_WILLS = 'https://api.thegraph.com/subgraphs/name/pectoraux/wills'
export const GRAPH_API_GAMES = 'https://api.thegraph.com/subgraphs/name/pectoraux/games'
export const GRAPH_API_RAMPS = 'https://api.thegraph.com/subgraphs/name/pectoraux/ramps'
export const GRAPH_API_TRUSTBOUNTIES = 'https://api.thegraph.com/subgraphs/name/pectoraux/trustbounties'
export const GRAPH_API_WORLDS = 'https://api.thegraph.com/subgraphs/name/pectoraux/worlds'
export const GRAPH_API_SPONSORS = 'https://api.thegraph.com/subgraphs/name/pectoraux/sponsors'
export const GRAPH_API_PAIRS = 'https://api.thegraph.com/subgraphs/name/pectoraux/pools'
export const GRAPH_HEALTH = 'https://api.thegraph.com/index-node/graphql'

export const TC_MOBOX_SUBGRAPH = 'https://api.thegraph.com/subgraphs/name/pancakeswap/trading-competition-v3'
export const TC_MOD_SUBGRAPH = 'https://api.thegraph.com/subgraphs/name/pancakeswap/trading-competition-v4'

export const FARM_API = 'https://farms.pancake-swap.workers.dev'

export const BIT_QUERY = 'https://graphql.bitquery.io'

export const ACCESS_RISK_API = 'https://red.alert.pancakeswap.com/red-api'

export const CELER_API = 'https://api.celerscan.com/scan'

export const INFO_CLIENT_WITH_CHAIN = {
  [ChainId.BSC]: 'https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2',
  [ChainId.ETHEREUM]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/exhange-eth',
}

export const BLOCKS_CLIENT_WITH_CHAIN = {
  [ChainId.BSC]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/blocks',
  [ChainId.ETHEREUM]: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
}
