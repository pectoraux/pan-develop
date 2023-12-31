import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from 'state'
import {
  PotteryState,
  SerializedPotteryUserData,
  SerializedPotteryPublicData,
  PotteryDepositStatus,
  PotteryRoundInfo,
} from 'state/types'
import { fetchGame } from 'state/games/fetchPools'
import { resetUserState } from '../global/actions'
import { fetchPotteryFinishedRound } from './fetchPotteryRound'
import {
  fetchLastVaultAddress,
  fetchPublicPotteryValue,
  fetchTotalLockedValue,
  fetchLatestRoundId,
} from './fetchPottery'
import {
  fetchPotterysAllowance,
  fetchVaultUserData,
  fetchUserDrawData,
  fetchWithdrawAbleData,
} from './fetchUserPottery'

const initialState: any = Object.freeze({
  lastVaultAddress: '',
  data: {
    id: '',
    claimable: false,
    creatorShare: null,
    gameContract: '',
    numPlayers: null,
    owner: '',
    paidReceivable: null,
    percentile: null,
    pricePerMinutes: null,
    referrerFee: null,
    sodq: null,
    teamShare: null,
    token: '',
    totalEarned: null,
    totalScore: null,
  },
  publicData: {
    lastDrawId: '',
    totalPrize: null,
    getStatus: PotteryDepositStatus.BEFORE_LOCK,
    totalLockCake: null,
    totalSupply: null,
    lockStartTime: '',
    lockTime: 0,
    totalLockedValue: null,
    latestRoundId: '',
    maxTotalDeposit: null,
  },
  userData: {
    isLoading: true,
    allowance: null,
    previewDepositBalance: null,
    stakingTokenBalance: null,
    rewards: null,
    winCount: null,
    withdrawAbleData: [],
  },
  finishedRoundInfo: {
    isFetched: false,
    roundId: null,
    drawDate: '',
    prizePot: '',
    totalPlayers: '',
    txid: '',
    winners: [],
    lockDate: '',
  },
})

export const fetchLastVaultAddressAsync = createAsyncThunk<string>('pottery/fetchLastVaultAddress', async () => {
  const lastVaultAddress = await fetchLastVaultAddress()
  return lastVaultAddress
})

export const fetchPublicPotteryDataAsync = createAsyncThunk<SerializedPotteryPublicData>(
  'pottery/fetchPublicPotteryData',
  async (arg, { getState }) => {
    const state = getState()
    const potteryVaultAddress = (state as AppState).pottery.lastVaultAddress

    const [publicPotteryData, totalLockedValue, latestRoundId] = await Promise.all([
      fetchPublicPotteryValue(potteryVaultAddress),
      fetchTotalLockedValue(potteryVaultAddress),
      fetchLatestRoundId(),
    ])
    return { ...publicPotteryData, ...totalLockedValue, ...latestRoundId }
  },
)

export const fetchGameAsync = (gameAddress) => async (dispatch) => {
  try {
    console.log("fetchBusinesses1================>", gameAddress)
    const game = await fetchGame(gameAddress)
    console.log("fetchBusinesses================>", game, gameAddress)
    dispatch(setGamePublicData(game || {}))
  } catch (error) {
    console.error('[Pools Action] error when getting staking limits', error)
  }
}

export const fetchPotteryUserDataAsync = createAsyncThunk<SerializedPotteryUserData, string>(
  'pottery/fetchPotteryUserData',
  async (account, { rejectWithValue, getState }) => {
    try {
      const state = getState()
      const potteryVaultAddress = (state as AppState).pottery.lastVaultAddress
      const [allowance, vaultUserData, drawData, withdrawAbleData] = await Promise.all([
        fetchPotterysAllowance(account, potteryVaultAddress),
        fetchVaultUserData(account, potteryVaultAddress),
        fetchUserDrawData(account),
        fetchWithdrawAbleData(account),
      ])

      const userData = {
        allowance,
        previewDepositBalance: vaultUserData.previewDepositBalance,
        stakingTokenBalance: vaultUserData.stakingTokenBalance,
        rewards: drawData.rewards,
        winCount: drawData.winCount,
        withdrawAbleData,
      }

      return userData
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const fetchPotteryRoundData = createAsyncThunk<PotteryRoundInfo, number>(
  'pottery/fetchPotteryRound',
  async (roundId) => {
    const response = await fetchPotteryFinishedRound(roundId)
    return response
  },
)

export const PotterySlice = createSlice({
  name: 'Pottery',
  initialState,
  reducers: {
    setFinishedRoundInfoFetched: (state, action) => {
      const isFetched = action.payload
      state.finishedRoundInfo = {
        ...state.finishedRoundInfo,
        isFetched,
      }
    },
    setGamePublicData: (state, action) => {
      state.data = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetUserState, (state) => {
      state.userData = { ...initialState.userData }
    })
    builder.addCase(fetchLastVaultAddressAsync.fulfilled, (state, action: PayloadAction<string>) => {
      state.lastVaultAddress = action.payload
    })
    builder.addCase(
      fetchPublicPotteryDataAsync.fulfilled,
      (state, action: PayloadAction<SerializedPotteryPublicData>) => {
        state.publicData = { ...action.payload }
      },
    )
    builder.addCase(fetchPotteryUserDataAsync.fulfilled, (state, action: PayloadAction<SerializedPotteryUserData>) => {
      const userData = action.payload
      state.userData = {
        ...userData,
        isLoading: false,
      }
    })
    builder.addCase(fetchPotteryRoundData.fulfilled, (state, action: PayloadAction<PotteryRoundInfo>) => {
      state.finishedRoundInfo = { ...action.payload }
    })
  },
})

// Actions
export const { setFinishedRoundInfoFetched, setGamePublicData } = PotterySlice.actions

export default PotterySlice.reducer
