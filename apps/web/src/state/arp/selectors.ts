import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.arp.data
const selectCurrBribe = (state: State) => state.arp.currBribe
const selectCurrPool = (state: State) => state.arp.currPool
const selectFilteredData = (state: State) => {
  return state.arp.data.filter((arp) => 
  (!state.arp.filters.workspace || state.arp.filters.workspace === 'All' || arp?.workspace?.toLowerCase() === state.arp.filters.workspace?.toLowerCase()) &&
  (!state.arp.filters.country || state.arp.filters.country === 'All' || arp?.country?.toLowerCase() === state.arp.filters.country?.toLowerCase()) &&
  (!state.arp.filters.city || state.arp.filters.city === 'All' ||  arp?.city?.toLowerCase() === state.arp.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.arp.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.arp.userDataLoaded

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