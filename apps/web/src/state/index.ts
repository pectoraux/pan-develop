import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import burn from './burn/reducer'
import farmsReducer from './farms'
import farmsReducerV1 from './farmsV1'
import { updateVersion } from './global/actions'
import lotteryReducer from './lottery'
import lotteriesReducer from './lotteries'
import gamesReducer from './games'
import bettingsReducer from './bettings'
import predictionsReducer from './predictions'
import willsReducer from './wills'
import mint from './mint/reducer'
import multicall from './multicall/reducer'
import poolsReducer from './pools'
import swap from './swap/reducer'
import transactions from './transactions/reducer'
import user from './user/reducer'
import limitOrders from './limitOrders/reducer'
import potteryReducer from './pottery'
import globalReducer from './global/reducer'
import rampsReducer from './ramps'
import rampReducer from './ramp'
import profileReducer from './profile'
import valuepoolsReducer from './valuepools'
import valuepoolReducer from './valuepool'
import stakemarketReducer from './stakemarket'
import trustbountiesReducer from './trustbounties'
import arpsReducer from './arps'
import arpReducer from './arp'
import billsReducer from './bills'
import billReducer from './bill'
import acceleratorReducer from './accelerator'
import businessesReducer from './businesses'
import contributorsReducer from './contributors'
import referralsReducer from './referrals'
import auditorsReducer from './auditors'
import auditorReducer from './auditor'
import worldsReducer from './worlds'
import worldReducer from './world'
import sponsorsReducer from './sponsors'
import sponsorReducer from './sponsor'

const PERSISTED_KEYS: string[] = ['user', 'transactions']

const persistConfig = {
  key: 'primary',
  whitelist: PERSISTED_KEYS,
  blacklist: ['profile'],
  storage,
  version: 1,
}

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    global: globalReducer,
    farms: farmsReducer,
    farmsV1: farmsReducerV1,
    pools: poolsReducer,
    lottery: lotteryReducer,
    lotteries: lotteriesReducer,
    games: gamesReducer,
    bettings: bettingsReducer,
    predictions: predictionsReducer,
    wills: willsReducer,
    pottery: potteryReducer,
    ramps: rampsReducer,
    ramp: rampReducer,
    profile: profileReducer,
    valuepools: valuepoolsReducer,
    valuepool: valuepoolReducer,
    stakemarket: stakemarketReducer,
    trustbounties: trustbountiesReducer,
    arps: arpsReducer,
    arp: arpReducer,
    bills: billsReducer,
    bill: billReducer,
    businesses: businessesReducer,
    accelerator: acceleratorReducer,
    contributors: contributorsReducer,
    referrals: referralsReducer,
    auditors: auditorsReducer,
    auditor: auditorReducer,
    worlds: worldsReducer,
    world: worldReducer,
    sponsors: sponsorsReducer,
    sponsor: sponsorReducer,
    limitOrders,

    // Exchange
    user,
    transactions,
    swap,
    mint,
    burn,
    multicall,
  }),
)

// eslint-disable-next-line import/no-mutable-exports
let store: ReturnType<typeof makeStore>

export function makeStore(preloadedState = undefined) {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    devTools: process.env.NODE_ENV === 'development',
    preloadedState,
  })
}

export const initializeStore = (preloadedState = undefined) => {
  let _store = store ?? makeStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = makeStore({
      ...store.getState(),
      ...preloadedState,
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store

  // Create the store once in the client
  if (!store) {
    store = _store
  }

  return _store
}

store = initializeStore()

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store

export const persistor = persistStore(store, undefined, () => {
  store.dispatch(updateVersion())
})

export function useStore(initialState) {
  return useMemo(() => initializeStore(initialState), [initialState])
}
