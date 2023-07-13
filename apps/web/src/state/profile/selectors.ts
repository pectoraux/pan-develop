import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.profile.data
const selectCurrBribe = (state: State) => state.profile.currBribe
const selectCurrPool = (state: State) => state.profile.currPool
const selectFilteredData = (state: State) => {
  return state.profile.data.filter((ramp) => 
  (!state.profile.filters.workspace || state.profile.filters.workspace === 'All' || ramp?.workspace?.toLowerCase() === state.profile.filters.workspace?.toLowerCase()) &&
  (!state.profile.filters.country || state.profile.filters.country === 'All' || ramp?.country?.toLowerCase() === state.profile.filters.country?.toLowerCase()) &&
  (!state.profile.filters.city || state.profile.filters.city === 'All' ||  ramp?.city?.toLowerCase() === state.profile.filters.city?.toLowerCase()) 
  )
}
const selectPoolData = (id) => (state: State) => state.profile.data.find((p) => parseInt(p.id) === parseInt(id))
const selectUserDataLoaded = (state: State) => state.profile.userDataLoaded

export const makePoolWithUserDataLoadingSelector = (id) => 
   createSelector([selectPoolData(id), selectUserDataLoaded], (pool, userDataLoaded) => {
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