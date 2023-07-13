import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.worlds.data
const selectCurrBribe = (state: State) => state.worlds.currBribe
const selectCurrPool = (state: State) => state.worlds.currPool
const selectFilteredData = (state: State) => {
  return state.worlds.data.filter((ramp) => 
  (!state.worlds.filters.workspace || state.worlds.filters.workspace === 'All' || ramp?.workspace?.toLowerCase() === state.worlds.filters.workspace?.toLowerCase()) &&
  (!state.worlds.filters.country || state.worlds.filters.country === 'All' || ramp?.country?.toLowerCase() === state.worlds.filters.country?.toLowerCase()) &&
  (!state.worlds.filters.city || state.worlds.filters.city === 'All' ||  ramp?.city?.toLowerCase() === state.worlds.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.worlds.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.worlds.userDataLoaded

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