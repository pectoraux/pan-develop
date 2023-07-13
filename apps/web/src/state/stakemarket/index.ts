import { createAsyncThunk, createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit'
import {
  ObjectState,
  SerializedPool,
} from 'state/types'
import { AddressZero } from '@ethersproject/constants'
import { fetchStakes } from './fetchPools'
import { fetchStakesUserData, fetchSMAllowance } from './fetchPoolsUser'
import { resetUserState } from '../global/actions'

export const initialFilterState = Object.freeze({
  workspace: null,
  country: null,
  city: null,
})

const initialState: ObjectState = {
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

export const fetchStakesAsync = (collectionId) => async (dispatch) => {
  try {
    console.log("fetchStakes1================>", collectionId)
    const stakes = await fetchStakes(collectionId)
    console.log("fetchStakes2================>", stakes)
    const reconstructedData = stakes.filter((stake) => stake.tokenAddress !== AddressZero && parseInt(stake.sousId) === parseInt(stake.parentStakeId))
    .reduce((resultArray, stake1) => {
      const partnerData = stakes.filter((stake2) => stake1.partnerStakeIds.includes(stake2.sousId.toString()))
      const applications = stake1?.applicationsConverted?.map((appId) => stakes.find((stake2) => parseInt(stake2.sousId) === parseInt(appId)))
      // const totalLiquidity =  parseFloat(stake1.paidReceivable ?? '0') - parseFloat(stake1.paidPayable ?? '0') + parseFloat(partnerData?.paidReceivable ?? '0') - parseFloat(partnerData?.paidPayable ?? '0')
      resultArray.push({
        ...stake1,
        partnerData,
        applications,
      })
  
      return resultArray
    }, [])
    const data = reconstructedData?.filter((d) => !d.appliedTo)
    console.log("fetchStakes================>", data)
    dispatch(setStakesPublicData(data || []))
  } catch (error) {
    console.error('[Pools Action]========> error when getting stakes', error)
  }
}

export const fetchStakesUserDataAsync = createAsyncThunk<
  { sousId: number; allowance: any; }[],
  string
>('pool/fetchPoolsUserData', async (account, { rejectWithValue }) => {
  try {
    return fetchStakesUserData(account)
  } catch (e) {
    return rejectWithValue(e)
  }
})

export const updateSMUserAllowance = createAsyncThunk<
  { tokenAddress: string; value: any },
  { account: string, tokenAddress: string }
>('pool/updateSMUserAllowance', async ({ account, tokenAddress }) => {
  const allowance = await fetchSMAllowance(account, tokenAddress)
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
  name: 'Stakes',
  initialState,
  reducers: {
    setStakesPublicData: (state, action) => {
      const livePoolsData: SerializedPool[] = action.payload 
      state.data = [...livePoolsData]
    },
    setStakeUserData: (state, action) => {
      console.log("setStakeUserData====================>", action.payload)
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
      fetchStakesUserDataAsync.fulfilled,
      (
        state,
        action
      ) => {
        const userData = action.payload
        state.data.map((pool) => {
          const userPoolData = userData.find((entry) => Number(entry.sousId) === Number(pool.sousId))
          return { ...pool, userDataLoaded: true, userData: userPoolData }
        })
        state.userDataLoaded = true
      },
    )
    builder.addCase(
      updateSMUserAllowance.fulfilled,
      (
        state,
        action: PayloadAction<{ tokenAddress: string; value: any }>,
      ) => {
        const { tokenAddress, value } = action.payload
        state.contractAllowance[tokenAddress] = value
      },
    )
    builder.addCase(fetchStakesUserDataAsync.rejected, (state, action) => {
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
  setStakesPublicData, 
  setStakeUserData, 
  setInitialData,
  setCurrPoolData,
  setCurrBribeData,
} = PoolsSlice.actions

export default PoolsSlice.reducer
