import { createAsyncThunk, createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit'
import fromPairs from 'lodash/fromPairs'
import {
  ObjectState,
} from 'state/types'
import { fetchSponsor } from 'state/sponsors/fetchPools'
import { resetUserState } from '../global/actions'

export const initialFilterState = Object.freeze({
  workspace: null,
  country: null,
  city: null,
})

const initialState: ObjectState = {
  data: [],
  userDataLoaded: false,
  apiData: [],
  filters: initialFilterState,
  currBribe: {},
  currPool: {},
}

export const setInitialDataAsync = (firestorePools) => async (dispatch) => {
  console.log("setInitialDataAsync=========>", firestorePools)
  dispatch(setInitialData(firestorePools))
}

export const fetchSponsorAsync = (sponsorAddress) => async (dispatch) => {
  try {
    console.log("fetchBusiness1================>", sponsorAddress)
    const sponsor = await fetchSponsor(sponsorAddress)
    console.log("fetchBusiness================>", sponsor, sponsorAddress)
    dispatch(setSponsorPublicData([sponsor] || []))
  } catch (error) {
    console.error('[Pools Action] error when getting staking limits', error)
  }
}

export const fetchSponsorUserDataAsync = createAsyncThunk<
  { sousId: number; allowance: any; stakingTokenBalance: any; stakedBalance: any; pendingReward: any }[],
  string
>('pool/fetchPoolsUserData', async (account, { rejectWithValue }) => {
  try {
    // const [allowances, stakingTokenBalances, stakedBalances, pendingRewards] = await Promise.all([
    //   fetchPoolsAllowance(account),
    //   fetchUserBalances(account),
    //   fetchUserStakeBalances(account),
    //   fetchUserPendingRewards(account),
    // ])

    const userData = []
    return userData
  } catch (e) {
    return rejectWithValue(e)
  }
})

export const updateRamp = null
// createAsyncThunk<
//   { rampAddress: string; value: any },
//   { rampAddress: string }
// >('pool/updateRamp', async ({ rampAddress }) => {
//   // const data = await fetchRampData(rampAddress)
//   // return { rampAddress, value: data }
// })

// export const updateUserAllowance = createAsyncThunk<
//   { sousId: number; field: string; value: any },
//   { sousId: number; account: string }
// >('pool/updateUserAllowance', async ({ sousId, account }) => {
//   const allowances = await fetchPoolsAllowance(account)
//   return { sousId, field: 'allowance', value: allowances[sousId] }
// })

// export const updateUserBalance = createAsyncThunk<
//   { sousId: number; field: string; value: any },
//   { sousId: number; account: string }
// >('pool/updateUserBalance', async ({ sousId, account }) => {
//   const tokenBalances = await fetchUserBalances(account)
//   return { sousId, field: 'stakingTokenBalance', value: tokenBalances[sousId] }
// })

// export const updateUserStakedBalance = createAsyncThunk<
//   { sousId: number; field: string; value: any },
//   { sousId: number; account: string }
// >('pool/updateUserStakedBalance', async ({ sousId, account }) => {
//   const stakedBalances = await fetchUserStakeBalances(account)
//   return { sousId, field: 'stakedBalance', value: stakedBalances[sousId] }
// })

// export const updateUserPendingReward = createAsyncThunk<
//   { sousId: number; field: string; value: any },
//   { sousId: number; account: string }
// >('pool/updateUserPendingReward', async ({ sousId, account }) => {
//   const pendingRewards = await fetchUserPendingRewards(account)
//   return { sousId, field: 'pendingReward', value: pendingRewards[sousId] }
// })

export const PoolsSlice = createSlice({
  name: 'Sponsor',
  initialState,
  reducers: {
    setSponsorPublicData: (state, action) => {
      state.data = [ ...action.payload ]
    },
    setPoolUserData: (state, action) => {
      const { sousId } = action.payload
      state.data = state.data.map((pool) => {
        if (pool.sousId === sousId) {
          return { ...pool, userDataLoaded: true, userData: action.payload.data }
        }
        return pool
      })
    },
    setInitialData: (state, action) => {
      state.apiData = action.payload || []
    },
    setCurrBribeData: (state, action) => {
      state.currBribe = action.payload
    },
    setCurrPoolData: (state, action) => {
      state.currPool = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetUserState, (state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state.data = state.data.map(({ userData, ...pool }) => {
        return { ...pool }
      })
      state.userDataLoaded = false
    })
    builder.addCase(
      fetchSponsorUserDataAsync.fulfilled,
      (
        state,
        action: PayloadAction<
          { sousId: number; allowance: any; stakingTokenBalance: any; stakedBalance: any; pendingReward: any }[]
        >,
      ) => {
        const userData = action.payload
        const userDataSousIdMap = fromPairs(userData.map((entry) => [entry.sousId, entry]))
        state.data = state.data.map((pool) => ({
          ...pool,
          userDataLoaded: true,
          userData: userDataSousIdMap[pool.sousId],
        }))
        state.userDataLoaded = true
      },
    )
    builder.addCase(fetchSponsorUserDataAsync.rejected, (state, action) => {
      console.error('[Pools Action] Error fetching pool user data', action.payload)
    })
  },
})

// Actions
export const { 
  setPoolUserData, 
  setInitialData,
  setCurrPoolData,
  setCurrBribeData,
  setSponsorPublicData,
} = PoolsSlice.actions

export default PoolsSlice.reducer
