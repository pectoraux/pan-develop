import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.bills.data
const selectCurrBribe = (state: State) => state.bills.currBribe
const selectCurrPool = (state: State) => state.bills.currPool
const selectFilteredData = (state: State) => {
  return state.bills.data.filter((ramp) => 
  (!state.bills.filters.workspace || state.bills.filters.workspace === 'All' || ramp?.workspace?.toLowerCase() === state.bills.filters.workspace?.toLowerCase()) &&
  (!state.bills.filters.country || state.bills.filters.country === 'All' || ramp?.country?.toLowerCase() === state.bills.filters.country?.toLowerCase()) &&
  (!state.bills.filters.city || state.bills.filters.city === 'All' ||  ramp?.city?.toLowerCase() === state.bills.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.bills.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.bills.userDataLoaded

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