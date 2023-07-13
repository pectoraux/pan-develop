import { createAsyncThunk, createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit'
import {
  ObjectState,
  SerializedPool,
} from 'state/types'
import { fetchBounties } from './fetchPools'
import { fetchBountiesUserData, fetchTBAllowance } from './fetchPoolsUser'
import { resetUserState } from '../global/actions'

export const initialFilterState = Object.freeze({
  workspace: null,
  country: null,
  city: null,
})

const initialState: any = {
  data: [],
  apiData: [],
  userDataLoaded: false,
  filters: initialFilterState,
  currBribe: {},
  currPool: {},
  contractAllowance: {}
}

export const setInitialDataAsync = (firestorePools) => async (dispatch) => {
  console.log("setInitialDataAsync=========>", firestorePools)
  dispatch(setInitialData(firestorePools))
}

export const fetchBountiesAsync = ({
  fromAccelerator, 
  fromContributors,
  fromSponsors,
  fromAuditors,
  fromBusinesses,
  fromRamps,
  fromTransfers
}) => async (dispatch) => {
  try {
    console.log("fetchBounties1================>")
    const trustbounties = await fetchBounties(
      0, 
      fromAccelerator, 
      fromContributors,
      fromSponsors,
      fromAuditors,
      fromBusinesses,
      fromRamps,
      fromTransfers
    )
    console.log("fetchBounties================>", trustbounties)
    dispatch(setBountiesPublicData(trustbounties || []))
  } catch (error) {
    console.error('[Pools Action] error when getting staking limits', error)
  }
}

export const fetchBountiesUserDataAsync = createAsyncThunk<
  { sousId: number; allowance: any; }[],
  string
>('pool/fetchPoolsUserData', async (account, { rejectWithValue }) => {
  try {
    console.log("allProtocolIds1==============>")
    const allProtocolIds = await fetchBountiesUserData(account)
    console.log("allProtocolIds==============>", allProtocolIds)
    return allProtocolIds
  } catch (e) {
    return rejectWithValue(e)
  }
})

export const updateTBUserAllowance = createAsyncThunk<
  { tokenAddress: string; value: any },
  { account: string, tokenAddress: string }
>('pool/updateTBUserAllowance', async ({ account, tokenAddress }) => {
  const allowance = await fetchTBAllowance(account, tokenAddress)
  return { tokenAddress, value: allowance }
})

export const updateUserAllowance = createAsyncThunk<
  { value: any, sousId: any, field: any },
  { value: any, sousId: any, field: any }
>('pool/updateUserAllowance', async ({ value, sousId, field }) => {
  // const allowances = await fetchPoolsAllowance(account)
  // return { sousId, field: 'allowance', value: allowances[sousId] }
  return {
    value, 
    sousId, 
    field
  };
})

export const updateUserBalance = createAsyncThunk<
  { value: any, sousId: any, field: any },
  { value: any, sousId: any }
>('pool/updateUserBalance', async ({ value, sousId }) => {
  // const allowances = await fetchPoolsAllowance(account)
  // return { sousId, field: 'allowance', value: allowances[sousId] }
  return {
    value, 
    sousId, 
    field: 'user'
  };
})

export const updateUserStakedBalance = createAsyncThunk<
  { value: any, sousId: any, field: any },
  { value: any, sousId: any, field: any }
>('pool/updateUserStakedBalance', async ({ value, sousId, field }) => {
  // const allowances = await fetchPoolsAllowance(account)
  // return { sousId, field: 'allowance', value: allowances[sousId] }
  return {
    value, 
    sousId, 
    field
  };
})

export const updateUserPendingReward = createAsyncThunk<
  { value: any, sousId: any, field: any },
  { value: any, sousId: any, field: any }
>('pool/updateUserPendingReward', async ({ value, sousId, field }) => {
  // const allowances = await fetchPoolsAllowance(account)
  // return { sousId, field: 'allowance', value: allowances[sousId] }
  return {
    value, 
    sousId, 
    field
  };
})

export const PoolsSlice = createSlice({
  name: 'Bounties',
  initialState,
  reducers: {
    setBountiesPublicData: (state, action) => {
      const livePoolsData: SerializedPool[] = action.payload 
      state.data = livePoolsData.map((pool) => {
        const apiPoolData = state.apiData.find((entry) => Number(entry.sousId) === Number(pool.sousId)) || []
        return { ...apiPoolData, ...pool }
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
      fetchBountiesUserDataAsync.fulfilled,
      (
        state,
        action,
      ) => {
        const userData = action.payload
        state.data = state.data.map((pool) => {
          const userPoolData = userData.find((entry) => entry.sousId === pool.sousId)
          return { ...pool, userDataLoaded: true, userData: userPoolData }
        })
        state.userDataLoaded = true
      },
    )
    builder.addCase(
      updateTBUserAllowance.fulfilled,
      (
        state,
        action: PayloadAction<{ tokenAddress: string; value: any }>,
      ) => {
        const { tokenAddress, value } = action.payload
        state.contractAllowance[tokenAddress] = value
      },
    )
    builder.addCase(fetchBountiesUserDataAsync.rejected, (state, action) => {
      console.error('[Pools Action] Error fetching pool user data', action.payload)
    })
    builder.addMatcher(
      isAnyOf(
        updateUserAllowance.fulfilled,
        updateUserBalance.fulfilled,
        updateUserStakedBalance.fulfilled,
        updateUserPendingReward.fulfilled,
      ),
      (state, action) => {
        const { field, value, sousId } = action.payload
        const index = state.data.findIndex((p) => p.sousId === sousId)

        if (index >= 0) {
          state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
        }
      },
    )
  },
})

// Actions
export const { 
  setBountiesPublicData, 
  setInitialData,
  setCurrPoolData,
  setCurrBribeData,
} = PoolsSlice.actions

export default PoolsSlice.reducer
