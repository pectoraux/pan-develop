import { getFullDecimalMultiplier } from '@pancakeswap/utils/getFullDecimalMultiplier'

export const BSC_BLOCK_TIME = 3

// CAKE_PER_BLOCK details
// 40 CAKE is minted per block
// 20 CAKE per block is sent to Burn pool (A farm just for burning cake)
// 10 CAKE per block goes to CAKE syrup pool
// 9 CAKE per block goes to Yield farms and lottery
// CAKE_PER_BLOCK in config/index.ts = 40 as we only change the amount sent to the burn pool which is effectively a farm.
// CAKE/Block in src/views/Home/components/CakeDataRow.tsx = 15 (40 - Amount sent to burn pool)
export const CAKE_PER_BLOCK = 40
export const BLOCKS_PER_DAY = (60 / BSC_BLOCK_TIME) * 60 * 24
export const BLOCKS_PER_YEAR = BLOCKS_PER_DAY * 365 // 10512000
export const CAKE_PER_YEAR = CAKE_PER_BLOCK * BLOCKS_PER_YEAR
export const BASE_URL = 'https://pancakeswap.finance'
export const BASE_ADD_LIQUIDITY_URL = `${BASE_URL}/add`
export const DEFAULT_TOKEN_DECIMAL = getFullDecimalMultiplier(18)
export const DEFAULT_GAS_LIMIT = 250000
export const BOOSTED_FARM_GAS_LIMIT = 500000
export const AUCTION_BIDDERS_TO_FETCH = 500
export const RECLAIM_AUCTIONS_TO_FETCH = 500
export const AUCTION_WHITELISTED_BIDDERS_TO_FETCH = 500
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs'

export const WORKSPACES = {
    'All': 1000,
    'Delivery': 100,
    'Mobility': 110,
    'Real Estate': 120,
    'Manual Labor': 130,
    'Maintenance & Repair': 140,
    'Beauty, Fashion & Wellness': 150,
    'Education': 160,
    'Arts, Events & Entertainment': 170,
    'Healthcare': 180,
    'Law & Security': 190,
    'Tourism': 200,
    'Software & Data': 210,
    'Finance': 220,
    'Spiritual': 230,
    'Religions': 240,
    'Hawala': 250,
    'B2B eCommerce': 260,
    'D2C eCommerce': 270,
    'NGO & Donation': 280,
    'Climate': 290,
    'Sales & Marketing': 300,
    'Sports, Games & Betting': 310,
    'RP World': 320,
    'BP World': 330,
    'Authentication': 340,
    'NSFW': 350,
    'Crafts & DIY': 360,
    'Others': 370,
  }
  
  export const COUNTRIES = {
    'All': 1000,
    'Togo': 100,
    'USA': 110,
    'Ghana': 120,
    'France': 130,
    'Burkina': 140,
  }
  
  export const COUNTRIES2 = {
    'All': 1000,
    "Togo": {
      Total: 1,
      Workspace: {
        "Healthcare": 100,
        "Real Estate": 131,
        "Education": 111,
        "Software & Data": 121,
        "Religions": 108,
        "Spiritual": 86,
        "Finance": 105,
        "Beauty, Fashion & Wellness": 81,
        "Manual Labor": 1336,
      },
    },
    "USA": {
      Total: 1,
      Workspace: {
        "Healthcare": 100,
        "Real Estate": 131,
        "Education": 111,
        "Software & Data": 121,
        "Religions": 108,
        "Spiritual": 86,
        "Finance": 105,
        "Beauty, Fashion & Wellness": 81,
        "Manual Labor": 1336,
      },
    },
    "Ghana": {
      Total: 1,
      Workspace: {
        "Healthcare": 100,
        "Real Estate": 131,
        "Education": 111,
        "Software & Data": 121,
        "Religions": 108,
        "Spiritual": 86,
        "Finance": 105,
        "Beauty, Fashion & Wellness": 81,
        "Manual Labor": 1336,
      },
    },
    "France": {
      Total: 1,
      Workspace: {
        "Healthcare": 100,
        "Real Estate": 131,
        "Education": 111,
        "Software & Data": 121,
        "Religions": 108,
        "Spiritual": 86,
        "Finance": 105,
        "Beauty, Fashion & Wellness": 81,
        "Manual Labor": 1336,
      },
    },
    "Burkina Faso": {
      Total: 1,
      Workspace: {
        "Healthcare": 100,
        "Real Estate": 131,
        "Education": 111,
        "Software & Data": 121,
        "Religions": 108,
        "Spiritual": 86,
        "Finance": 105,
        "Beauty, Fashion & Wellness": 81,
        "Manual Labor": 1336,
      },
    }
  }
  
  export const CITIES2 = {
    'All': 1000,
    "Lome, Togo": {
      Total: 1,
      Workspace: {
        "Healthcare": 100,
        "Real Estate": 131,
        "Education": 111,
        "Software & Data": 121,
        "Religions": 108,
        "Spiritual": 86,
        "Finance": 105,
        "Beauty, Fashion & Wellness": 81,
        "Manual Labor": 1336,
      },
    },
    "New York, USA": {
      Total: 1,
      Workspace: {
        "Healthcare": 100,
        "Real Estate": 131,
        "Education": 111,
        "Software & Data": 121,
        "Religions": 108,
        "Spiritual": 86,
        "Finance": 105,
        "Beauty, Fashion & Wellness": 81,
        "Manual Labor": 1336,
      },
    },
    "Accra, Ghana": {
      Total: 1,
      Workspace: {
        "Healthcare": 100,
        "Real Estate": 131,
        "Education": 111,
        "Software & Data": 121,
        "Religions": 108,
        "Spiritual": 86,
        "Finance": 105,
        "Beauty, Fashion & Wellness": 81,
        "Manual Labor": 1336,
      },
    },
    "Paris, France": {
      Total: 1,
      Workspace: {
        "Healthcare": 100,
        "Real Estate": 131,
        "Education": 111,
        "Software & Data": 121,
        "Religions": 108,
        "Spiritual": 86,
        "Finance": 105,
        "Beauty, Fashion & Wellness": 81,
        "Manual Labor": 1336,
      },
    },
    "Ouagadougou, Burkina Faso": {
      Total: 1,
      Workspace: {
        "Healthcare": 100,
        "Real Estate": 131,
        "Education": 111,
        "Software & Data": 121,
        "Religions": 108,
        "Spiritual": 86,
        "Finance": 105,
        "Beauty, Fashion & Wellness": 81,
        "Manual Labor": 1336,
      },
    }
  }
  
  export const PRODUCTS2 = {
    'All': 1000,
    "Blue shades": 1,
    "Green sunglasses": 2,
    "Gold frame sunglasses": 3
  }
  
  export const PRODUCTS = {
    'All': 1000,
    "Blue shades": {
      Total: 1,
      Workspace: "Healthcare",
      Country: {
    "Togo": 11,
    "Ghana": 13,
    "Rwanda": 12,
    "Burkina Faso": 12,
    "Cote d'Ivoire": 10,
    "USA": 80,
    "France": 10,
    "Cameroon": 81,
    "Nigeria": 13
      },
      City: {
        "Lome, Togo": 117,
        "Accra, Ghana": 131,
        "Kigali, Rwanda": 211,
        "Ouagadougou, Burkina Faso": 124,
        "Abidjan, Cote d'Ivoire": 102,
        "Washington, USA": 806,
        "Paris, France": 105,
        "Douala,Cameroon": 815,
        "Lagos, Nigeria": 136
      },
    },
    "Green sunglasses": {
      Total: 2,
      Workspace: "Healthcare",
      Country: {
        "Togo": 11,
        "Ghana": 13,
        "Rwanda": 12,
        "Burkina Faso": 12,
        "Cote d'Ivoire": 10,
        "USA": 80,
        "France": 10,
        "Cameroon": 81,
        "Nigeria": 13
      },
      City: {
        "Lome, Togo": 117,
        "Accra, Ghana": 131,
        "Kigali, Rwanda": 211,
        "Ouagadougou, Burkina Faso": 124,
        "Abidjan, Cote d'Ivoire": 102,
        "Washington, USA": 806,
        "Paris, France": 105,
        "Douala,Cameroon": 815,
        "Lagos, Nigeria": 136
      },
    },
    "Gold frame sunglasses": {
      Total: 3,
      Workspace: "Spiritual",
      Country: {
        "Togo": 11,
        "Ghana": 13,
        "Rwanda": 12,
        "Burkina Faso": 12,
        "Cote d'Ivoire": 10,
        "USA": 80,
        "France": 10,
        "Cameroon": 81,
        "Nigeria": 13
      },
      City: {
        "Lome, Togo": 777,
        "Accra, Ghana": 888,
        "Kigali, Rwanda": 211,
        "Ouagadougou, Burkina Faso": 124,
        "Abidjan, Cote d'Ivoire": 102,
        "Washington, USA": 806,
        "Paris, France": 105,
        "Douala,Cameroon": 815,
        "Lagos, Nigeria": 136
      },
    },
  }
  
  export const PAYWALLS = {
    'All': 1000,
    "Blue shades": {
      Total: 1,
      Workspace: "Healthcare",
      Country: {
    "Togo": 11,
    "Ghana": 13,
    "Rwanda": 12,
    "Burkina Faso": 12,
    "Cote d'Ivoire": 10,
    "USA": 80,
    "France": 10,
    "Cameroon": 81,
    "Nigeria": 13
      },
      City: {
        "Lome, Togo": 117,
        "Accra, Ghana": 131,
        "Kigali, Rwanda": 211,
        "Ouagadougou, Burkina Faso": 124,
        "Abidjan, Cote d'Ivoire": 102,
        "Washington, USA": 806,
        "Paris, France": 105,
        "Douala,Cameroon": 815,
        "Lagos, Nigeria": 136
      },
    },
    "Green sunglasses": {
      Total: 2,
      Workspace: "Healthcare",
      Country: {
        "Togo": 11,
        "Ghana": 13,
        "Rwanda": 12,
        "Burkina Faso": 12,
        "Cote d'Ivoire": 10,
        "USA": 80,
        "France": 10,
        "Cameroon": 81,
        "Nigeria": 13
      },
      City: {
        "Lome, Togo": 117,
        "Accra, Ghana": 131,
        "Kigali, Rwanda": 211,
        "Ouagadougou, Burkina Faso": 124,
        "Abidjan, Cote d'Ivoire": 102,
        "Washington, USA": 806,
        "Paris, France": 105,
        "Douala,Cameroon": 815,
        "Lagos, Nigeria": 136
      },
    },
    "Gold frame sunglasses": {
      Total: 3,
      Workspace: "Spiritual",
      Country: {
        "Togo": 11,
        "Ghana": 13,
        "Rwanda": 12,
        "Burkina Faso": 12,
        "Cote d'Ivoire": 10,
        "USA": 80,
        "France": 10,
        "Cameroon": 81,
        "Nigeria": 13
      },
      City: {
        "Lome, Togo": 777,
        "Accra, Ghana": 888,
        "Kigali, Rwanda": 211,
        "Ouagadougou, Burkina Faso": 124,
        "Abidjan, Cote d'Ivoire": 102,
        "Washington, USA": 806,
        "Paris, France": 105,
        "Douala,Cameroon": 815,
        "Lagos, Nigeria": 136
      },
    },
  }
  
  export const CITIES = {
    'All': 1000,
    'Lome, Togo': 100,
    'New York, USA': 110,
    'Accra, Ghana': 120,
    'Paris, France': 130,
    'Ouagadougou, Burkina Faso': 140,
  }
  
  export const WORKSPACES2 = [
    {'Delivery': 'delivery'},
    {'Mobility': 'mobility'},
    {'Real Estate': 'real_estate'},
    {'Manual Labor': 'manual_labor'},
    {'Maintenance & Repair': 'maintenance_repair'},
    {'Beauty, Fashion & Wellness': 'beauty_fashion_wellness'},
    {'Education': 'education'},
    {'Arts, Events & Entertainment': 'arts_events_entertainment'},
    {'Healthcare': 'healthcare'},
    {'Law & Security': 'law_security'},
    {'Tourism': 'tourism'},
    {'Software & Data': 'software_data'},
    {'Finance': 'finance'},
    {'Spiritual': 'spiritual'},
    {'Religions': 'religions'},
    {'Hawala': 'hawala'},
    {'B2B eCommerce': 'b2b_ecommerce'},
    {'D2C eCommerce': 'd2c_ecommerce'},
    {'NGO & Donation': 'ngo_donation'},
    {'Climate': 'climate'},
    {'Sales & Marketing': 'sales_marketing'},
    {'Sports, Games & Betting': 'sports_games_betting'},
    {'RP World': 'rp_world'},
    {'BP World': 'bp_world'},
    {'Authentication': 'authentication'},
    {'NSFW': 'nfsw'},
    {'Crafts & DIY': 'crafts_diy'},
    {'Others': 'others'},
  ]