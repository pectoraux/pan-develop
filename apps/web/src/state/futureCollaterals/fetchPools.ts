import BigNumber from 'bignumber.js'
import { Token } from '@pancakeswap/sdk'
import { GRAPH_API_COLLATERALS } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { 
  getFutureCollateralsContract,
  getBep20Contract,
} from '../../utils/contractHelpers'
import { futureCollateralFields } from './queries'

export const getCollateral = async (ownerAddress) => {
  try {
    const res = await request(
      GRAPH_API_COLLATERALS,
      gql`
        query getCollateral($cardAddress: String) 
        {
          collateral(id: $cardAddress) {
            ${futureCollateralFields}
          }
        }
      `,
      { ownerAddress },
    )
    console.log("getCollateral=================>", ownerAddress, res)
    return res.collateral
  } catch (error) {
    console.error('Failed to fetch collateral=============>', error, ownerAddress)
    return null
  }
}

export const getCollaterals = async (first = 5, skip = 0, where) => {
  try {
    const res = await request(
      GRAPH_API_COLLATERALS,
      gql`
        query getCollaterals($where: Collateral_filter) 
        {
          collaterals(first: $first, skip: $skip, where: $where) {
            ${futureCollateralFields}
          }
        }
      `,
      { first, skip, where },
    )
    console.log("getCollateralsFromSg33=============>", res)
    return res.collaterals
  } catch (error) {
    console.error('Failed to fetch collaterals=============>', where, error)
    return null
  }
}

export const fetchCollateral = async (ownerAddress) => {
  const collateralContract = getFutureCollateralsContract()
  const collateral = await getCollateral(ownerAddress.toLowerCase())
  const tokenAddress = await collateralContract.token()
  const tokenContract = getBep20Contract(tokenAddress)
  const [ name, decimals, symbol ] = await Promise.all([
    tokenContract.name(),
    tokenContract.decimals(),
    tokenContract.symbol(),
  ])
  return {
    ...collateral,
    token: new Token(
      56,
      tokenAddress,
      decimals,
      symbol?.toUpperCase() ?? 'symbol',
      name ?? 'name',
      'https://www.payswap.org/',
    ),
  }
}

export const fetchFutureCollaterals = async ({ fromFutureCollateral }) => {
  const collateralContract = getFutureCollateralsContract()
  const fromGraph = await getCollaterals(0,0,{})
  const tokenAddress = await collateralContract.token()
  const tokenContract = getBep20Contract(tokenAddress)
  const [ name, decimals, symbol ] = await Promise.all([
    tokenContract.name(),
    tokenContract.decimals(),
    tokenContract.symbol(),
  ])
  const collaterals = await Promise.all(
    fromGraph.map(async (collateral, index) => {
        const fund = await collateralContract.fund(collateral.channel)
        return {
          sousId: index,
          ...collateral,
          fund: new BigNumber(fund._hex).toJSON(),
          token: new Token(
            56,
            tokenAddress,
            decimals,
            symbol?.toUpperCase() ?? 'symbol',
            name ?? 'name',
            'https://www.payswap.org/',
          ),
        }
    }).flat()
  )
  return collaterals
}