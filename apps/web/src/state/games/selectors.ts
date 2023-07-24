import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'
import { transformPool } from './helpers'

const selectPoolsData = (state: State) => state.games.data
const selectCurrBribe = (state: State) => state.games.currBribe
const selectCurrPool = (state: State) => state.games.currPool
const selectFilteredData = (state: State) => {
  return state.games.data.filter((ramp) => 
  (!state.games.filters.workspace || state.games.filters.workspace === 'All' || ramp?.workspace?.toLowerCase() === state.games.filters.workspace?.toLowerCase()) &&
  (!state.games.filters.country || state.games.filters.country === 'All' || ramp?.country?.toLowerCase() === state.games.filters.country?.toLowerCase()) &&
  (!state.games.filters.city || state.games.filters.city === 'All' ||  ramp?.city?.toLowerCase() === state.games.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.games.data.find((p) => parseInt(p.id) === parseInt(sousId))
const selectUserDataLoaded = (state: State) => state.games.userDataLoaded

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