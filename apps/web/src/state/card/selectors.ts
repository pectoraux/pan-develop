import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.card.data
const selectCurrBribe = (state: State) => state.card.currBribe
const selectCurrPool = (state: State) => state.card.currPool
const selectFilteredData = (state: State) => {
  return state.card.data.filter((card) => 
  (!state.card.filters.workspace || state.card.filters.workspace === 'All' || card?.workspace?.toLowerCase() === state.card.filters.workspace?.toLowerCase()) &&
  (!state.card.filters.country || state.card.filters.country === 'All' || card?.country?.toLowerCase() === state.card.filters.country?.toLowerCase()) &&
  (!state.card.filters.city || state.card.filters.city === 'All' ||  card?.city?.toLowerCase() === state.card.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.card.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.card.userDataLoaded

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