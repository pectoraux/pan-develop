import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.bettings.data
const selectCurrBribe = (state: State) => state.bettings.currBribe
const selectCurrPool = (state: State) => state.bettings.currPool
const selectFilteredData = (state: State) => {
  return state.bettings.data.filter((ramp) => 
  (!state.bettings.filters.workspace || state.bettings.filters.workspace === 'All' || ramp?.workspace?.toLowerCase() === state.bettings.filters.workspace?.toLowerCase()) &&
  (!state.bettings.filters.country || state.bettings.filters.country === 'All' || ramp?.country?.toLowerCase() === state.bettings.filters.country?.toLowerCase()) &&
  (!state.bettings.filters.city || state.bettings.filters.city === 'All' ||  ramp?.city?.toLowerCase() === state.bettings.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.bettings.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.bettings.userDataLoaded

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