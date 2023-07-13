import { useMemo, memo } from 'react'
import CountUp from 'react-countup'
import { Text } from '@pancakeswap/uikit'
import { formatBigNumberToFixed } from '@pancakeswap/utils/formatBalance'
import styled from 'styled-components'
import { BigNumber } from '@ethersproject/bignumber'

const Price = styled(Text)`
  height: 18px;
  justify-self: start;
  width: 70px;

  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: center;
  }
`

interface LabelPriceProps {
  price: BigNumber
}

const LabelPrice: React.FC<any> = ({ allBettings, count, price, decimals, symbol }) => {
  const priceAsNumber = useMemo(() => parseFloat(formatBigNumberToFixed(price, 4, decimals)), [price])

  if (!Number.isFinite(priceAsNumber)) {
    return null
  }

  if (allBettings) {
    return (
      <CountUp start={0} preserveValue delay={0} end={count} prefix="#" decimals={0} duration={1}>
        {({ countUpRef }) => (
          <Price fontSize="12px">
            <span ref={countUpRef} />
          </Price>
        )}
      </CountUp>
    )
  }

  return (
    <CountUp start={0} preserveValue delay={0} end={priceAsNumber} prefix={`${symbol} `} decimals={4} duration={1}>
      {({ countUpRef }) => (
        <Price fontSize="12px">
          <span ref={countUpRef} />
        </Price>
      )}
    </CountUp>
  )
}

export default memo(LabelPrice)
