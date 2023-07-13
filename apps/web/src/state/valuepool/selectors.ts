import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.valuepool.data
const selectCurrBribe = (state: State) => state.valuepool.currBribe
const selectCurrPool = (state: State) => state.valuepool.currPool
const selectFilteredData = (state: State) => {
  return state.valuepool.data.filter((valuepool) => 
  (!state.valuepool.filters.workspace || state.valuepool.filters.workspace === 'All' || valuepool?.workspace?.toLowerCase() === state.valuepool.filters.workspace?.toLowerCase()) &&
  (!state.valuepool.filters.country || state.valuepool.filters.country === 'All' || valuepool?.country?.toLowerCase() === state.valuepool.filters.country?.toLowerCase()) &&
  (!state.valuepool.filters.city || state.valuepool.filters.city === 'All' ||  valuepool?.city?.toLowerCase() === state.valuepool.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.valuepool.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.valuepool.userDataLoaded

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