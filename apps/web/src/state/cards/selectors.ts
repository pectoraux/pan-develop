import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.cards.data
const selectCurrBribe = (state: State) => state.cards.currBribe
const selectCurrPool = (state: State) => state.cards.currPool
const selectFilteredData = (state: State) => {
  return state.cards.data.filter((ramp) => 
  (!state.cards.filters.workspace || state.cards.filters.workspace === 'All' || ramp?.workspace?.toLowerCase() === state.cards.filters.workspace?.toLowerCase()) &&
  (!state.cards.filters.country || state.cards.filters.country === 'All' || ramp?.country?.toLowerCase() === state.cards.filters.country?.toLowerCase()) &&
  (!state.cards.filters.city || state.cards.filters.city === 'All' ||  ramp?.city?.toLowerCase() === state.cards.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.cards.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.cards.userDataLoaded

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