import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.accelerator.data
const selectCurrBribe = (state: State) => state.accelerator.currBribe
const selectCurrPool = (state: State) => state.accelerator.currPool
const selectFilteredData = (state: State) => {
  return state.accelerator.data.filter((ramp) => 
  (!state.accelerator.filters.workspace || state.accelerator.filters.workspace === 'All' || ramp?.workspace?.toLowerCase() === state.accelerator.filters.workspace?.toLowerCase()) &&
  (!state.accelerator.filters.country || state.accelerator.filters.country === 'All' || ramp?.country?.toLowerCase() === state.accelerator.filters.country?.toLowerCase()) &&
  (!state.accelerator.filters.city || state.accelerator.filters.city === 'All' ||  ramp?.city?.toLowerCase() === state.accelerator.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.accelerator.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.accelerator.userDataLoaded

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