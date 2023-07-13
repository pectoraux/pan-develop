import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.will.data
const selectCurrBribe = (state: State) => state.will.currBribe
const selectCurrPool = (state: State) => state.will.currPool
const selectFilteredData = (state: State) => {
  return state.will.data.filter((will) => 
  (!state.will.filters.workspace || state.will.filters.workspace === 'All' || will?.workspace?.toLowerCase() === state.will.filters.workspace?.toLowerCase()) &&
  (!state.will.filters.country || state.will.filters.country === 'All' || will?.country?.toLowerCase() === state.will.filters.country?.toLowerCase()) &&
  (!state.will.filters.city || state.will.filters.city === 'All' ||  will?.city?.toLowerCase() === state.will.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.will.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.will.userDataLoaded

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