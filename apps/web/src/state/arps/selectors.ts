import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.arps.data
const selectCurrBribe = (state: State) => state.arps.currBribe
const selectCurrPool = (state: State) => state.arps.currPool
const selectFilteredData = (state: State) => {
  return state.arps.data.filter((ramp) => 
  (!state.arps.filters.workspace || state.arps.filters.workspace === 'All' || ramp?.workspace?.toLowerCase() === state.arps.filters.workspace?.toLowerCase()) &&
  (!state.arps.filters.country || state.arps.filters.country === 'All' || ramp?.country?.toLowerCase() === state.arps.filters.country?.toLowerCase()) &&
  (!state.arps.filters.city || state.arps.filters.city === 'All' ||  ramp?.city?.toLowerCase() === state.arps.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.arps.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.arps.userDataLoaded

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