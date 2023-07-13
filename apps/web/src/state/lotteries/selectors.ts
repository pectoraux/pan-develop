import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.lotteries.data
const selectCurrBribe = (state: State) => state.lotteries.currBribe
const selectCurrPool = (state: State) => state.lotteries.currPool
const selectFilteredData = (state: State) => {
  return state.lotteries.data.filter((ramp) => 
  (!state.lotteries.filters.workspace || state.lotteries.filters.workspace === 'All' || ramp?.workspace?.toLowerCase() === state.lotteries.filters.workspace?.toLowerCase()) &&
  (!state.lotteries.filters.country || state.lotteries.filters.country === 'All' || ramp?.country?.toLowerCase() === state.lotteries.filters.country?.toLowerCase()) &&
  (!state.lotteries.filters.city || state.lotteries.filters.city === 'All' ||  ramp?.city?.toLowerCase() === state.lotteries.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (sousId) => (state: State) => state.lotteries.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.lotteries.userDataLoaded

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