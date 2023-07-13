import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'
import { transformPool } from './helpers'

const selectPoolsData = (state: State) => state.pools.data
const selectCurrBribe = (state: State) => state.pools.currBribe
const selectCurrPool = (state: State) => state.pools.currPool
const selectFilteredData = (state: State) => {
  return state.pools.data.filter((ramp) => 
  (!state.pools.filters.workspace || state.pools.filters.workspace === 'All' || ramp?.workspace?.toLowerCase() === state.pools.filters.workspace?.toLowerCase()) &&
  (!state.pools.filters.country || state.pools.filters.country === 'All' || ramp?.country?.toLowerCase() === state.pools.filters.country?.toLowerCase()) &&
  (!state.pools.filters.city || state.pools.filters.city === 'All' ||  ramp?.city?.toLowerCase() === state.pools.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.pools.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.pools.userDataLoaded

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