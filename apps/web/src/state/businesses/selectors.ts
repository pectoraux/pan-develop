import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.businesses.data
const selectCurrBribe = (state: State) => state.businesses.currBribe
const selectCurrPool = (state: State) => state.businesses.currPool
const selectFilteredData = (state: State) => {
  return state.businesses.data.filter((ramp) => 
  (!state.businesses.filters.workspace || state.businesses.filters.workspace === 'All' || ramp?.workspace?.toLowerCase() === state.businesses.filters.workspace?.toLowerCase()) &&
  (!state.businesses.filters.country || state.businesses.filters.country === 'All' || ramp?.country?.toLowerCase() === state.businesses.filters.country?.toLowerCase()) &&
  (!state.businesses.filters.city || state.businesses.filters.city === 'All' ||  ramp?.city?.toLowerCase() === state.businesses.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.businesses.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.businesses.userDataLoaded

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