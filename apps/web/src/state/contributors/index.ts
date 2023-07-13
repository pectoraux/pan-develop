import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import fromPairs from 'lodash/fromPairs'
import {
  ObjectState,
  SerializedPool,
} from 'state/types'
import {
  fetchContributors,
} from './fetchPools'
import {
  fetchContributorsUserData,
} from './fetchPoolsUser'
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

let pools = []

export const setInitialDataAsync = (firestorePools) => async (dispatch) => {
  console.log("setInitialDataAsync=========>", firestorePools)
  dispatch(setInitialData(firestorePools))
}

export const fetchContributorsGaugesAsync = () => async (dispatch) => {
  try {
    console.log("fetchContributors1================>")
    const businesses = await fetchContributors()
    console.log("fetchContributors================>", businesses)
    const data = businesses
    dispatch(setContributorsPublicData(data || []))
    console.log("userData1================>", pools)
  } catch (error) {
    console.error('[Pools Action] error when getting staking limits======>', error)
  }
}

export const fetchContributorsUserDataAsync = createAsyncThunk<
  { sousId: number; allowance: any; profileId: number; tokenIds: any; bribes: any }[],
  { account: string }
>('pool/fetchPoolsUserData', async ({account}, { rejectWithValue }) => {
  try {
    const allBribes = await fetchContributorsUserData(account, pools)
    const userData = pools.map((pool) => ({
      sousId: parseInt(pool.sousId),
      allowance: 0,
      profileId: allBribes?.find((entry) => parseInt(entry.sousId) === parseInt(pool.sousId))?.profileId,
      tokenIds: allBribes?.find((entry) => parseInt(entry.sousId) === parseInt(pool.sousId))?.tokenIds,
      bribes: allBribes?.find((entry) => parseInt(entry.sousId) === parseInt(pool.sousId))?.augmentedBribes,
    }))
    console.log("userData================>", userData)
    return userData
  } catch (e) {
    return rejectWithValue(e)
  }
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
  name: 'Businesses',
  initialState,
  reducers: {
    setContributorsPublicData: (state, action) => {
      state.data = [ ...action.payload ]
      pools = [ ...action.payload ] 
    },
    setContributorsUserData: (state, action) => {
      const { sousId } = action.payload
      state.data = state.data.map((pool) => {
        if (pool.sousId === sousId) {
          return { ...pool, userDataLoaded: true, userData: action.payload.data }
        }
        return pool
      })
    },
    setPoolsPublicData: (state, action) => {
      const livePoolsData: SerializedPool[] = action.payload
      const livePoolsSousIdMap = fromPairs(livePoolsData.map((entry) => [entry.sousId, entry]))
      state.data = state.data.map((pool) => {
        const livePoolData = livePoolsSousIdMap[pool.sousId]
        return { ...pool, ...livePoolData }
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
      fetchContributorsUserDataAsync.fulfilled,
      (
        state,
        action
      ) => {
        const userData = action.payload
        
        const userDataSousIdMap = fromPairs(userData.map((entry) => [entry.sousId, entry]))
        try {
          state.data.map((pool) => {
              return {
                ...pool,
                userDataLoaded: true,
                userData: Object.values(userDataSousIdMap[pool.sousId]).length 
                ? userDataSousIdMap[pool.sousId] : pool.userData
              }
          })
          state.userDataLoaded = true
        } catch(err) { return null }
        return null
      },
    )
    builder.addCase(fetchContributorsUserDataAsync.rejected, (state, action) => {
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
  setContributorsPublicData, 
  setContributorsUserData, 
  setInitialData,
  setCurrPoolData,
  setCurrBribeData,
} = PoolsSlice.actions

export default PoolsSlice.reducer
