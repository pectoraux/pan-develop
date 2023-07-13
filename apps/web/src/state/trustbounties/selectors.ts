import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.trustbounties.data
const selectCurrBribe = (state: State) => state.trustbounties.currBribe
const selectCurrPool = (state: State) => state.trustbounties.currPool
const selectFilteredData = (state: State) => {
  return state.trustbounties.data.filter((business) => 
  (!state.trustbounties.filters.workspace || state.trustbounties.filters.workspace === 'All' || business?.workspace?.toLowerCase() === state.trustbounties.filters.workspace?.toLowerCase()) &&
  (!state.trustbounties.filters.country || state.trustbounties.filters.country === 'All' || business?.country?.toLowerCase() === state.trustbounties.filters.country?.toLowerCase()) &&
  (!state.trustbounties.filters.city || state.trustbounties.filters.city === 'All' ||  business?.city?.toLowerCase() === state.trustbounties.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.trustbounties.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.trustbounties.userDataLoaded

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