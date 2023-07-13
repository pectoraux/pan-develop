import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.auditor.data
const selectCurrBribe = (state: State) => state.auditor.currBribe
const selectCurrPool = (state: State) => state.auditor.currPool
const selectFilteredData = (state: State) => {
  return state.auditor.data.filter((auditor) => 
  (!state.auditor.filters.workspace || state.auditor.filters.workspace === 'All' || auditor?.workspace?.toLowerCase() === state.auditor.filters.workspace?.toLowerCase()) &&
  (!state.auditor.filters.country || state.auditor.filters.country === 'All' || auditor?.country?.toLowerCase() === state.auditor.filters.country?.toLowerCase()) &&
  (!state.auditor.filters.city || state.auditor.filters.city === 'All' ||  auditor?.city?.toLowerCase() === state.auditor.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.auditor.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.auditor.userDataLoaded

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