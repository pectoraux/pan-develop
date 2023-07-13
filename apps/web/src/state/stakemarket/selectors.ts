import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.stakemarket.data
const selectCurrBribe = (state: State) => state.stakemarket.currBribe
const selectCurrPool = (state: State) => state.stakemarket.currPool
const selectFilteredData = (state: State) => {
  return state.stakemarket.data.filter((ramp) => 
  (!state.stakemarket.filters.workspace || state.stakemarket.filters.workspace === 'All' || ramp?.workspace?.toLowerCase() === state.stakemarket.filters.workspace?.toLowerCase()) &&
  (!state.stakemarket.filters.country || state.stakemarket.filters.country === 'All' || ramp?.country?.toLowerCase() === state.stakemarket.filters.country?.toLowerCase()) &&
  (!state.stakemarket.filters.city || state.stakemarket.filters.city === 'All' ||  ramp?.city?.toLowerCase() === state.stakemarket.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.stakemarket.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.stakemarket.userDataLoaded

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