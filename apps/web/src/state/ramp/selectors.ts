import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.ramp.data
const selectCurrBribe = (state: State) => state.ramp.currBribe
const selectCurrPool = (state: State) => state.ramp.currPool
const selectFilteredData = (state: State) => {
  return state.ramp.data.filter((ramp) => 
  (!state.ramp.filters.workspace || state.ramp.filters.workspace === 'All' || ramp?.workspace?.toLowerCase() === state.ramp.filters.workspace?.toLowerCase()) &&
  (!state.ramp.filters.country || state.ramp.filters.country === 'All' || ramp?.country?.toLowerCase() === state.ramp.filters.country?.toLowerCase()) &&
  (!state.ramp.filters.city || state.ramp.filters.city === 'All' ||  ramp?.city?.toLowerCase() === state.ramp.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.ramp.data.find((p) => p.sousId === sousId)
const selectPoolData2 = (address) => (state: State) => state.ramp.data.find((p) => p.rampAddress?.toLowerCase() === address?.toLowerCase())
const selectUserDataLoaded = (state: State) => state.ramp.userDataLoaded

export const makePoolWithUserDataLoadingSelector = (sousId) =>
  createSelector([selectPoolData(sousId), selectUserDataLoaded], (pool, userDataLoaded) => {
    return { pool, userDataLoaded }
  })

  export const makePoolWithUserDataLoadingSelector2 = (address) =>
  createSelector([selectPoolData2(address), selectUserDataLoaded], (pool, userDataLoaded) => {
    return { pool, userDataLoaded }
  })

export const poolsWithUserDataLoadingSelector = createSelector(
  [selectPoolsData, selectUserDataLoaded],
  (pools, userDataLoaded) => {
    return { pools, userDataLoaded }
  },
)

export const poolsWithFilterSelector = createSelector(
  [selectFilteredData, selectUserDataLoaded],
  (pools, userDataLoaded) => {
    return { pools, userDataLoaded }
  },
)

export const currBribeSelector = createSelector([selectCurrBribe], (currBribe) => {
  return currBribe
})

export const currPoolSelector = createSelector([selectCurrPool], (currPool) => {
  return currPool
})