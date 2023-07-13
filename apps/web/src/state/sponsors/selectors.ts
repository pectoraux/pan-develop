import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.sponsors.data
const selectCurrBribe = (state: State) => state.sponsors.currBribe
const selectCurrPool = (state: State) => state.sponsors.currPool
const selectFilteredData = (state: State) => {
  return state.sponsors.data.filter((ramp) => 
  (!state.sponsors.filters.workspace || state.sponsors.filters.workspace === 'All' || ramp?.workspace?.toLowerCase() === state.sponsors.filters.workspace?.toLowerCase()) &&
  (!state.sponsors.filters.country || state.sponsors.filters.country === 'All' || ramp?.country?.toLowerCase() === state.sponsors.filters.country?.toLowerCase()) &&
  (!state.sponsors.filters.city || state.sponsors.filters.city === 'All' ||  ramp?.city?.toLowerCase() === state.sponsors.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.sponsors.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.sponsors.userDataLoaded

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