import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.contributors.data
const selectCurrBribe = (state: State) => state.contributors.currBribe
const selectCurrPool = (state: State) => state.contributors.currPool
const selectFilteredData = (state: State) => {
  return state.contributors.data.filter((ramp) => 
  (!state.contributors.filters.workspace || state.contributors.filters.workspace === 'All' || ramp?.workspace?.toLowerCase() === state.contributors.filters.workspace?.toLowerCase()) &&
  (!state.contributors.filters.country || state.contributors.filters.country === 'All' || ramp?.country?.toLowerCase() === state.contributors.filters.country?.toLowerCase()) &&
  (!state.contributors.filters.city || state.contributors.filters.city === 'All' ||  ramp?.city?.toLowerCase() === state.contributors.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.contributors.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.contributors.userDataLoaded

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