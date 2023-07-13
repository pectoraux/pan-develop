import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.wills.data
const selectCurrBribe = (state: State) => state.wills.currBribe
const selectCurrPool = (state: State) => state.wills.currPool
const selectFilteredData = (state: State) => {
  return state.wills.data.filter((ramp) => 
  (!state.wills.filters.workspace || state.wills.filters.workspace === 'All' || ramp?.workspace?.toLowerCase() === state.wills.filters.workspace?.toLowerCase()) &&
  (!state.wills.filters.country || state.wills.filters.country === 'All' || ramp?.country?.toLowerCase() === state.wills.filters.country?.toLowerCase()) &&
  (!state.wills.filters.city || state.wills.filters.city === 'All' ||  ramp?.city?.toLowerCase() === state.wills.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.wills.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.wills.userDataLoaded

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