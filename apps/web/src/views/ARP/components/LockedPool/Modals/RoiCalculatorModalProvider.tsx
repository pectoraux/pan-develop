import React, { useState, createContext } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { usePool } from 'state/pools/hooks'
import _toString from 'lodash/toString'


export const RoiCalculatorModalContext = createContext(null)

const RoiCalculatorModalProvider: React.FC<
  React.PropsWithChildren<{ children: React.ReactNode; lockedAmount: string | number }>
> = ({ children, lockedAmount }) => {
  const [showRoiCalculator, setShowRoiCalculator] = useState(false)

  if (showRoiCalculator) {
    return (
      <></>
    )
  }

  return (
    <RoiCalculatorModalContext.Provider value={setShowRoiCalculator}>{children}</RoiCalculatorModalContext.Provider>
  )
}

export default RoiCalculatorModalProvider
