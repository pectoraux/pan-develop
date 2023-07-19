import BigNumber from 'bignumber.js'
import { GRAPH_API_CARDS } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { 
  getCardContract,
  getBep20Contract,
} from '../../utils/contractHelpers'
import { cardFields, tokenBalanceFields } from './queries'

export const getCard = async (ownerAddress) => {
  try {
    const res = await request(
      GRAPH_API_CARDS,
      gql`
        query getCard($cardAddress: String) 
        {
          card(id: $cardAddress) {
            ${cardFields}
            balances {
              ${tokenBalanceFields}
            }
          }
        }
      `,
      { ownerAddress },
    )
    console.log("getCard=================>", ownerAddress, res)
    return res.card
  } catch (error) {
    console.error('Failed to fetch card=============>', error, ownerAddress)
    return null
  }
}

export const getCards = async (first = 5, skip = 0, where) => {
  try {
    const res = await request(
      GRAPH_API_CARDS,
      gql`
        query getCards($where: Card_filter) 
        {
          cards(first: $first, skip: $skip, where: $where) {
            ${cardFields}
            balances {
              ${tokenBalanceFields}
            }
          }
        }
      `,
      { first, skip, where },
    )
    console.log("getCardsFromSg33=============>", res)
    return res.cards
  } catch (error) {
    console.error('Failed to fetch protocol=============>', where, error)
    return null
  }
}

export const fetchCard = async (ownerAddress) => {
  const cardContract = getCardContract()
  const card = await getCard(ownerAddress.toLowerCase())
  const tokenId = await cardContract.tokenIds(card.id)
  const balances = await Promise.all(
    card?.balances?.map(async (tk) => {
    const tokenContract = getBep20Contract(tk.tokenAddress)
    const [ name, decimals, symbol ] = await Promise.all([
      tokenContract.name(),
      tokenContract.decimals(),
      tokenContract.symbol(),
    ])
    return {
      ...tk,
      name,
      symbol,
      decimals
    }
  }))
  // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
  return {
    tokenId,
    ...card,
    balances
  }
}

export const fetchCards = async ({ fromCard }) => {
  const cardContract = getCardContract()
  const fromGraph = await getCards(0,0,{})
  const cards = await Promise.all(
    fromGraph.map(async (card, index) => {
        const tokenId = await cardContract.tokenIds(card.id)
        const balances = await Promise.all(
          card?.balances?.map(async (tk) => {
          const tokenContract = getBep20Contract(tk.tokenAddress)
          const [ name, decimals, symbol ] = await Promise.all([
            tokenContract.name(),
            tokenContract.decimals(),
            tokenContract.symbol(),
          ])
          return {
            ...tk,
            name,
            symbol: symbol?.toUpperCase(),
            decimals
          }
        }))
        return {
          sousId: index,
          tokenId: new BigNumber(tokenId._hex).toJSON(),
          ...card,
          balances
        }
    }).flat()
  )
  return cards
}