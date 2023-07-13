import { createAsyncThunk, createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit'
import fromPairs from 'lodash/fromPairs'
import { isAddress } from '@ethersproject/address'
import {
  ObjectState,
  SerializedPool,
} from 'state/types'
import {
  getSponsors,
  fetchSponsors
} from './fetchPools'
import {
  fetchPoolsAllowance,
  fetchUserBalances,
  fetchUserPendingRewards,
  fetchUserStakeBalances,
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
  filters: initialFilterState,
  apiData: [],
  currBribe: {},
  currPool: {},
}

export const fetchSponsorSgAsync = ({ fromSponsor }) => async (dispatch) => {
  try {
    console.log("fetchSponsorsg1================>")
    const whereClause = isAddress(fromSponsor)
    ? {
      active: true,
      id_in: [ fromSponsor?.toLowerCase() ]
    } : {
      active: true
    }
    const sponsors = await getSponsors(0, 0, whereClause)
    console.log("fetchSponsorsg================>", sponsors)
    dispatch(setSponsorsPublicData(sponsors || []))
  } catch (error) {
    console.error('[Pools Action]============> error when getting staking limits', error)
  }
}

export const fetchSponsorsAsync = ({ fromSponsor }) => async (dispatch) => {
  try {
    console.log("fetchSponsors1================>")
    const sponsors = await fetchSponsors({ fromSponsor })
    console.log("fetchSponsorsal================>", sponsors)
    dispatch(setSponsorsPublicData(sponsors || []))
  } catch (error) {
    console.error('[Pools Action]============> error when getting staking limits', error)
  }
}

export const fetchSponsorsUserDataAsync = createAsyncThunk<
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
  name: 'Sponsors',
  initialState,
  reducers: {
    setSponsorsPublicData: (state, action) => {
      const livePoolsData: SerializedPool[] = action.payload
      const livePoolsSousIdMap = fromPairs(state.data.map((entry) => [entry.id?.toLowerCase(), entry]))
      state.data = livePoolsData.map((pool) => {
        const livePoolData = livePoolsSousIdMap[pool.id?.toLowerCase()]
        return { ...pool, ...livePoolData }
      })
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
    setPoolsPublicData: (state, action) => {
      const livePoolsData: SerializedPool[] = action.payload
      const livePoolsSousIdMap = fromPairs(livePoolsData.map((entry) => [entry.sousId, entry]))
      state.data = state.data.map((pool) => {
        const livePoolData = livePoolsSousIdMap[pool.sousId]
        return { ...pool, ...livePoolData }
      })
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
      fetchSponsorsUserDataAsync.fulfilled,
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
    builder.addCase(fetchSponsorsUserDataAsync.rejected, (state, action) => {
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
  setSponsorsPublicData,
  setPoolsPublicData, 
  setPoolUserData, 
  setCurrPoolData,
  setCurrBribeData,
} = PoolsSlice.actions

export default PoolsSlice.reducer
