import { useState, useMemo, useEffect } from 'react'
import LocalReduxProvider from 'contexts/LocalRedux/Provider'
import makeStore from 'contexts/LocalRedux/makeStore'
import { PredictionSupportedSymbol } from 'state/types'
import reducers, { initialState } from 'state/predictions'
import { useRouter } from 'next/router'
import _toUpper from 'lodash/toUpper'
import ConfigProvider from './ConfigProvider'
import configs from './config'

const BETTING_TOKEN_KEY = 'betting-token'

const BettingConfigProviders = ({ children }) => {
  const { query } = useRouter()
  const { token } = query
  const [selectedToken, setConfig] = useState(PredictionSupportedSymbol.CAKE)
  // () => {
    // const initToken = localStorage?.getItem(BETTING_TOKEN_KEY) as BettingSupportedSymbol

    // if ([BettingSupportedSymbol.BNB, BettingSupportedSymbol.CAKE].includes(initToken)) {
    //   return initToken
    // }

  //   return BettingSupportedSymbol.CAKE
  // })

  useEffect(() => {
    const upperToken = _toUpper(token as string) as PredictionSupportedSymbol

    if ([PredictionSupportedSymbol.BNB, PredictionSupportedSymbol.CAKE].includes(upperToken)) {
      setConfig(upperToken)
      localStorage?.setItem(BETTING_TOKEN_KEY, upperToken)
    }
  }, [token])

  const config = useMemo(() => {
    return configs[selectedToken]
  }, [selectedToken])

  const store = useMemo(() => {
    return makeStore(reducers, initialState, config)
  }, [config])

  return (
    <ConfigProvider config={config}>
      <LocalReduxProvider store={store}>{children}</LocalReduxProvider>
    </ConfigProvider>
  )
}

export default BettingConfigProviders
