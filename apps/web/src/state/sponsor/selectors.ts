import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.sponsor.data
const selectCurrBribe = (state: State) => state.sponsor.currBribe
const selectCurrPool = (state: State) => state.sponsor.currPool
const selectFilteredData = (state: State) => {
  return state.sponsor.data.filter((sponsor) => 
  (!state.sponsor.filters.workspace || state.sponsor.filters.workspace === 'All' || sponsor?.workspace?.toLowerCase() === state.sponsor.filters.workspace?.toLowerCase()) &&
  (!state.sponsor.filters.country || state.sponsor.filters.country === 'All' || sponsor?.country?.toLowerCase() === state.sponsor.filters.country?.toLowerCase()) &&
  (!state.sponsor.filters.city || state.sponsor.filters.city === 'All' ||  sponsor?.city?.toLowerCase() === state.sponsor.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.sponsor.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.sponsor.userDataLoaded

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