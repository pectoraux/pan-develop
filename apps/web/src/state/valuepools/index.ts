import { createAsyncThunk, createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit'
import fromPairs from 'lodash/fromPairs'
import { isAddress } from '@ethersproject/address'
import { VESTING_ESCROW } from 'views/Vesting/config'
import { AddressZero } from '@ethersproject/constants'
import {
  PoolsState,
  SerializedPool,
} from 'state/types'
import {
  fetchPoolVA,
  fetchValuepools,
  getValuepoolsSg,
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

const initialState: any = {
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

export const fetchValuepoolSgAsync = ({ fromVesting, fromValuepool }) => async (dispatch) => {
  try {
    console.log("sgallva1==============>")
    const whereClause = isAddress(fromValuepool)
    ? {
      active: true,
      id_in: [ fromValuepool?.toLowerCase() ]
    } : fromVesting
    ? {
      active: true,
      id_in: VESTING_ESCROW
    } : {
      active: true
    }
    const valuepools = await getValuepoolsSg(0, 0, whereClause)
    const data = valuepools
    console.log("sgallva==============>", data)
    dispatch(setValuepoolsPublicData(data || []))
  } catch (error) {
    console.error('[Pools Action] error when getting staking limits=================>', error)
  }
}

export const fetchValuepoolsAsync = ({ fromVesting, fromValuepool }) => async (dispatch) => {
  try {
    console.log("allva1==============>")
    const valuepools = await fetchValuepools({ fromVesting, fromValuepool })
    const data = valuepools
    console.log("allva==============>", data)
    dispatch(setValuepoolsPublicData(data || []))
  } catch (error) {
    console.error('[Pools Action] error when getting staking limits=================>', error)
  }
}

export const fetchValuepoolsUserDataAsync = createAsyncThunk<
  { sousId: number; allowance: any; vaAllowance: any; protocolId: string; }[],
  string
>('pool/fetchPoolsUserData', async (account, { rejectWithValue }) => {
  try {
    // console.log("allProtocolIds1==============>")
    // const allProtocolIds = await fetchValuepoolsUserData(account)
    // console.log("allProtocolIds==============>", allProtocolIds)
    // return allProtocolIds
    return []
  } catch (e) {
    console.log("fetchPoolsUserData err===========>", e)
    return rejectWithValue(e)
  }
})

export const updateValuepoolVa = createAsyncThunk<
  { sousId: number; field: string; value: any },
  { sousId: number; valuepoolAddress: string }
>('pool/updateValuepoolVa', async ({ sousId, valuepoolAddress }) => {
  const _va = await fetchPoolVA(valuepoolAddress)
  return { sousId, field: '_va', value: _va }
})

export const updateUserAllowance = createAsyncThunk<
  { sousId: number; field: string; value: any },
  { sousId: number; account: string }
>('pool/updateUserAllowance', async ({ sousId, account }) => {
  const allowances = await fetchPoolsAllowance(account)
  return { sousId, field: 'allowance', value: allowances[sousId] }
})

export const updateUserBalance = createAsyncThunk<
  { sousId: number; field: string; value: any },
  { sousId: number; account: string }
>('pool/updateUserBalance', async ({ sousId, account }) => {
  const tokenBalances = await fetchUserBalances(account)
  return { sousId, field: 'stakingTokenBalance', value: tokenBalances[sousId] }
})

export const updateUserStakedBalance = createAsyncThunk<
  { sousId: number; field: string; value: any },
  { sousId: number; account: string }
>('pool/updateUserStakedBalance', async ({ sousId, account }) => {
  const stakedBalances = await fetchUserStakeBalances(account)
  return { sousId, field: 'stakedBalance', value: stakedBalances[sousId] }
})

export const updateUserPendingReward = createAsyncThunk<
  { sousId: number; field: string; value: any },
  { sousId: number; account: string }
>('pool/updateUserPendingReward', async ({ sousId, account }) => {
  const pendingRewards = await fetchUserPendingRewards(account)
  return { sousId, field: 'pendingReward', value: pendingRewards[sousId] }
})

export const PoolsSlice = createSlice({
  name: 'Valuepools',
  initialState,
  reducers: {
    setValuepoolsPublicData: (state, action) => {
      const livePoolsData = action.payload
      const oldDataMap = fromPairs(state.data.map((entry) => [entry.id?.toLowerCase(), entry]))
      state.data = livePoolsData.map((pool) => {
        const oldData = oldDataMap[pool.id?.toLowerCase()] as any
        return { ...oldData, ...pool }
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
      const livePoolsSousIdMap = fromPairs(livePoolsData.map((entry) => [entry.id?.toLowerCase(), entry]))
      state.data = state.data.map((pool) => {
        const livePoolData = livePoolsSousIdMap[pool.id?.toLowerCase()]
        return { ...pool, ...livePoolData }
      })
    },
    setInitialData: (state, action) => {
      state.data = action.payload
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
      fetchValuepoolsUserDataAsync.fulfilled,
      (
        state,
        action,
      ) => {
        const userData = action.payload
        const userDataSousIdMap = fromPairs(userData.map((entry) => [entry.sousId, entry]))
        state.data = state.data.map((pool) => ({
          ...pool,
          userDataLoaded: true,
          userData: userDataSousIdMap[parseInt(pool.sousId)] ?? pool?.userData,
        }))
        state.userDataLoaded = true
      },
    )
    builder.addCase(fetchValuepoolsUserDataAsync.rejected, (state, action) => {
      console.error('[Pools Action] Error fetching pool user data', action.payload)
    })
    builder.addMatcher(
      isAnyOf(
        updateValuepoolVa.fulfilled,
        updateUserAllowance.fulfilled,
        updateUserBalance.fulfilled,
        updateUserStakedBalance.fulfilled,
        updateUserPendingReward.fulfilled,
      ),
      (state, action: PayloadAction<{ sousId: number; field: string; value: any }>) => {
        const { field, value, sousId } = action.payload
        const index = state.data.findIndex((p) => Number(p.sousId) === Number(sousId))

        if (index >= 0) {
          state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
        }
      },
    )
  },
})

// Actions
export const { 
  setPoolsPublicData, 
  setValuepoolsPublicData, 
  setPoolUserData, 
  setInitialData,
  setCurrPoolData,
  setCurrBribeData,
} = PoolsSlice.actions

export default PoolsSlice.reducer
