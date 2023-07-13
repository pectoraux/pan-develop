import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.valuepools.data
const selectCurrBribe = (state: State) => state.valuepools.currBribe
const selectCurrPool = (state: State) => state.valuepools.currPool
const selectFilteredData = (state: State) => {
  return state.valuepools.data.filter((ramp) => 
  (!state.valuepools.filters.workspace || state.valuepools.filters.workspace === 'All' || ramp?.workspace?.toLowerCase() === state.valuepools.filters.workspace?.toLowerCase()) &&
  (!state.valuepools.filters.country || state.valuepools.filters.country === 'All' || ramp?.country?.toLowerCase() === state.valuepools.filters.country?.toLowerCase()) &&
  (!state.valuepools.filters.city || state.valuepools.filters.city === 'All' ||  ramp?.city?.toLowerCase() === state.valuepools.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (id) => (state: State) => state.valuepools.data.find((p) => p.id?.toLowerCase() === id?.toLowerCase())
const selectUserDataLoaded = (state: State) => state.valuepools.userDataLoaded

export const makePoolWithUserDataLoadingSelector = (id) =>
  createSelector([selectPoolData(id), selectUserDataLoaded], (pool, userDataLoaded) => {
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