import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.bill.data
const selectCurrBribe = (state: State) => state.bill.currBribe
const selectCurrPool = (state: State) => state.bill.currPool
const selectFilteredData = (state: State) => {
  return state.bill.data.filter((bill) => 
  (!state.bill.filters.workspace || state.bill.filters.workspace === 'All' || bill?.workspace?.toLowerCase() === state.bill.filters.workspace?.toLowerCase()) &&
  (!state.bill.filters.country || state.bill.filters.country === 'All' || bill?.country?.toLowerCase() === state.bill.filters.country?.toLowerCase()) &&
  (!state.bill.filters.city || state.bill.filters.city === 'All' ||  bill?.city?.toLowerCase() === state.bill.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.bill.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.bill.userDataLoaded

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