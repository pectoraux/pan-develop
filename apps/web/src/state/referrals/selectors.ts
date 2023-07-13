import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.referrals.data
const selectCurrBribe = (state: State) => state.referrals.currBribe
const selectCurrPool = (state: State) => state.referrals.currPool
const selectFilteredData = (state: State) => {
  return state.referrals.data.filter((ramp) => 
  (!state.referrals.filters.workspace || state.referrals.filters.workspace === 'All' || ramp?.workspace?.toLowerCase() === state.referrals.filters.workspace?.toLowerCase()) &&
  (!state.referrals.filters.country || state.referrals.filters.country === 'All' || ramp?.country?.toLowerCase() === state.referrals.filters.country?.toLowerCase()) &&
  (!state.referrals.filters.city || state.referrals.filters.city === 'All' ||  ramp?.city?.toLowerCase() === state.referrals.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.referrals.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.referrals.userDataLoaded

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