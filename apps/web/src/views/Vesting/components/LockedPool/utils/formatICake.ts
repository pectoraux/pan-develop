import BigNumber from 'bignumber.js'

interface FormatiCake {
  lockedAmount: any
  duration: number
  ceiling: BigNumber
}

export default function formatiCake({ lockedAmount, duration }: any) {
  const durationAsBn = new BigNumber(duration / (3600 * 24))
  const ceiling = new BigNumber(1460)
  return durationAsBn.times(lockedAmount).div(ceiling).toNumber()
}
