import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.auditors.data
const selectCurrBribe = (state: State) => state.auditors.currBribe
const selectCurrPool = (state: State) => state.auditors.currPool
const selectFilteredData = (state: State) => {
  return state.auditors.data.filter((ramp) => 
  (!state.auditors.filters.workspace || state.auditors.filters.workspace === 'All' || ramp?.workspace?.toLowerCase() === state.auditors.filters.workspace?.toLowerCase()) &&
  (!state.auditors.filters.country || state.auditors.filters.country === 'All' || ramp?.country?.toLowerCase() === state.auditors.filters.country?.toLowerCase()) &&
  (!state.auditors.filters.city || state.auditors.filters.city === 'All' ||  ramp?.city?.toLowerCase() === state.auditors.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.auditors.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.auditors.userDataLoaded

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