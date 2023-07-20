import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.futureCollaterals.data
const selectCurrBribe = (state: State) => state.futureCollaterals.currBribe
const selectCurrPool = (state: State) => state.futureCollaterals.currPool
const selectFilteredData = (state: State) => {
  return state.futureCollaterals.data.filter((ramp) => 
  (!state.futureCollaterals.filters.workspace || state.futureCollaterals.filters.workspace === 'All' || ramp?.workspace?.toLowerCase() === state.futureCollaterals.filters.workspace?.toLowerCase()) &&
  (!state.futureCollaterals.filters.country || state.futureCollaterals.filters.country === 'All' || ramp?.country?.toLowerCase() === state.futureCollaterals.filters.country?.toLowerCase()) &&
  (!state.futureCollaterals.filters.city || state.futureCollaterals.filters.city === 'All' ||  ramp?.city?.toLowerCase() === state.futureCollaterals.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.futureCollaterals.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.futureCollaterals.userDataLoaded

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