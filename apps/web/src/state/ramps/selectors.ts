import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.ramps.data
const selectCurrBribe = (state: State) => state.ramps.currBribe
const selectCurrPool = (state: State) => state.ramps.currPool
const selectFilteredData = (state: State) => {
  return state.ramps.data.filter((ramp) => 
  (!state.ramps.filters.workspace || state.ramps.filters.workspace === 'All' || ramp?.workspace?.toLowerCase() === state.ramps.filters.workspace?.toLowerCase()) &&
  (!state.ramps.filters.country || state.ramps.filters.country === 'All' || ramp?.country?.toLowerCase() === state.ramps.filters.country?.toLowerCase()) &&
  (!state.ramps.filters.city || state.ramps.filters.city === 'All' ||  ramp?.city?.toLowerCase() === state.ramps.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.ramps.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.ramps.userDataLoaded

export const makePoolWithUserDataLoadingSelector = (sousId) =>
  createSelector([selectPoolData(sousId), selectUserDataLoaded], (pool, userDataLoaded) => {
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