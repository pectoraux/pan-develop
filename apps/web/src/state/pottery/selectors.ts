import { createSelector } from '@reduxjs/toolkit'
import { State } from 'state/types'
import { transformPotteryPublicData, transformPotteryUserData } from './helpers'

const selectPotteryPublicData = (state: State) => state.pottery.publicData
const selectPotteryData = (state: State) => state.pottery.data
const selectPotteryUserData = (state: State) => state.pottery.userData
const selectfinishedRoundInfoData = (state: State) => state.pottery.finishedRoundInfo

export const potterDataSelector = createSelector(
  [selectPotteryData, selectPotteryPublicData, selectPotteryUserData, selectfinishedRoundInfoData],
  (data, publicData, userData, finishedRoundInfo) => {
    return {
      data,
      publicData: transformPotteryPublicData(publicData),
      userData: transformPotteryUserData(userData),
      finishedRoundInfo,
    }
  },
)
