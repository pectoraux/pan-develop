import BigNumber from 'bignumber.js'
import { firestore } from 'utils/firebase'
import { Token } from '@pancakeswap/sdk'
import { GRAPH_API_GAMES } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getCollection } from 'state/cancan/helpers'
import { 
  getGameHelperContract,
  getGameMinterContract,
  getGameFactoryContract,
  getBep20Contract,
} from '../../utils/contractHelpers'
import { gameFields, protocolFields } from './queries'

export const fetchGameData = async (gameName, tokenId) => {
  return (await firestore.collection("c4").doc('1').get()).data()
}

export const fetchSessionInfo = async (sessionId) => {
  return (await firestore.collection("onramp").doc(sessionId).get()).data()
}

export const getProtocols = async (first = 5, skip = 0, where={}) => {
  try {
    const res = await request(
      GRAPH_API_GAMES,
      gql`
      query getProtocols($first: Int!, $skip: Int!, $where: Protocol_filter, $orderDirection: OrderDirection) 
      {
        protocols(first: $first, skip: $skip, where: $where) {
          ${protocolFields}
        }
      }
      `,
      { 
        first, 
        skip, 
        where,
      },
    )
    return res.protocols
  } catch (error) {
    console.error('Failed to fetch protocols===========>', error)
    return []
  }
}

export const getProtocol = async (gameAddress: string) => {
  try {
    const res = await request(
      GRAPH_API_GAMES,
      gql`
        query getProtocolData($gameAddress: String!) 
        {
          protocols(where: { game: $gameAddress }) {
            ${protocolFields}
          }
        }
      `,
      { gameAddress },
    )
    return res.protocols
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, gameAddress)
    return null
  }
}

export const getGame = async (gameAddress) => {
  try {
    const res = await request(
      GRAPH_API_GAMES,
      gql`
        query getGame($gameAddress: String) 
        {
          game(id: $gameAddress) {
            ${gameFields}
            protocols {
              ${protocolFields}
            }
          }
        }
      `,
      { gameAddress },
    )
    console.log("getGame=================>", gameAddress, res)
    return res.game
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, gameAddress)
    return null
  }
}

export const getGames = async (first = 5, skip = 0, where) => {
  try {
    const res = await request(
      GRAPH_API_GAMES,
      gql`
        query getGames($where: Game_filter) 
        {
          games(first: $first, skip: $skip, where: $where) {
            ${gameFields}
            protocols {
              ${protocolFields}
            }
          }
        }
      `,
      { first, skip, where },
    )
    console.log("getGamesFromSg33=============>", res)
    return res.games
  } catch (error) {
    console.error('Failed to fetch protocol=============>', where, error)
    return null
  }
}

export const fetchGame = async (gameId) => {
  const gameFromSg = await getGame(gameId)
  const gameMinterContract = getGameMinterContract()
  const gameHelperContract = getGameHelperContract()
  const gameFactoryContract = getGameFactoryContract()
  const [[
    owner,
    _token,
    gameContract,
    pricePerMinutes,
    teamShare,
    creatorShare,
    referrerFee,
    numPlayers,
    totalScore,
    totalPaid,
    claimable,
  ],
  // [
  //   burnToken,
  //   checker,
  //   destination,
  //   discount,
  //   burnCollectionId,
  //   item,
  // ],
    totalEarned,
  ] = await Promise.all([
      gameFactoryContract.ticketInfo_(gameId),
      // gameFactoryContract.burnTokenForCredit(gameId),
      gameFactoryContract.totalEarned(gameId),
  ])
  const collection = await getCollection(gameId)
  console.log("9collection================>", collection)
  const tokenContract = getBep20Contract(_token)
  const [
    name,
    symbol,
    decimals
  ] = await Promise.all([
    tokenContract.name(),
    tokenContract.symbol(),
    tokenContract.decimals(),
  ])
  const objects =  await Promise.all(
    gameFromSg?.objectNames?.map(async (objectName) => {
      const [
        gameTokenIds,
        userTokenIds
      ] = await Promise.all([
        gameHelperContract.getAllProtocolObjects(gameId, objectName.name, 0),
        gameHelperContract.getResourceToObject(objectName.id, objectName.name)
      ])
      return {
        ...objectName,
        gameTokenIds: getTokenIds(gameTokenIds, objectName.name, gameId),
        userTokenIds: getTokenIds(userTokenIds, objectName.name, gameId),
      }
    })
  )
  const accounts =  await Promise.all(
    gameFromSg?.protocols?.map(async (protocol) => {
      const [[
        tokenOwner,
        lender,
        game,
        timer,
        score,
        deadline,
        pricePercentile,
        price,
        won,
        gameCount,
        scorePercentile,
        gameMinutes,
      ],
      // userPercentile,
      receiver,
      objectNames,
      userDeadLine,
      ] = await Promise.all([
        gameMinterContract.gameInfo_(protocol?.id),
        // gameMinterContract.getUserPercentile(protocol?.id),
        gameMinterContract.getReceiver(protocol?.id),
        gameHelperContract.getAllObjects(protocol?.id, 0),
        gameFactoryContract.userDeadLines_(protocol?.id, gameId)
      ])

      return {
        ...protocol,
        tokenOwner,
        lender,
        game,
        receiver,
        objectNames,
        timer: new BigNumber(timer._hex).toJSON(),
        score: new BigNumber(score._hex).toJSON(),
        deadline: new BigNumber(deadline._hex).toJSON(),
        pricePercentile: new BigNumber(pricePercentile._hex).toJSON(),
        price: new BigNumber(price._hex).toJSON(),
        won: new BigNumber(won._hex).toJSON(),
        gameCount: new BigNumber(gameCount._hex).toJSON(),
        scorePercentile: new BigNumber(scorePercentile._hex).toJSON(),
        gameMinutes: new BigNumber(gameMinutes._hex).toJSON(),
        userDeadLine: new BigNumber(userDeadLine._hex).toJSON(),
        // userPercentile: new BigNumber(userPercentile._hex).toJSON(),
      }
    })
  )

  // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
  return {
    id: gameId,
    owner,
    gameContract,
    claimable,
    accounts,
    objects,
    collection,
    pricePerMinutes: new BigNumber(pricePerMinutes._hex).toJSON(),
    teamShare: new BigNumber(teamShare._hex).dividedBy(100).toJSON(),
    creatorShare: new BigNumber(creatorShare._hex).dividedBy(100).toJSON(),
    referrerFee: new BigNumber(referrerFee._hex).dividedBy(100).toJSON(),
    // paidReceivable: new BigNumber(paidReceivable._hex).toJSON(),
    numPlayers: new BigNumber(numPlayers._hex).toJSON(),
    // percentile: new BigNumber(percentile._hex).toJSON(),
    totalPaid: new BigNumber(totalPaid._hex).toJSON(),
    totalScore: new BigNumber(totalScore._hex).toJSON(),
    totalEarned: new BigNumber(totalEarned._hex).toJSON(),
    token: new Token(
      56,
      _token,
      decimals,
      symbol,
      name,
      'https://www.trueusd.com/',
    ),
  }
}

export const getTokenIds = async (objectTokenIds, name, gameId) => {
  const gameHelperContract = getGameHelperContract()
  return objectTokenIds.map(async (tokenId) => {
    const [[
      category, 
      ratings
    ]] = await Promise.all([
      gameHelperContract.getResourceToObject(name,gameId)
    ])

    return {
      category,
      tokenId: new BigNumber(tokenId._hex).toJSON(),
      ratings
    }
  })
}

export const fetchGames = async ({ fromGame }) => {
  const gamesFromSg = await getGames(0,0,{})
  const games =  await Promise.all(
    gamesFromSg.filter((game) =>
      fromGame ? game?.id === fromGame : true)
      .map(async (game) => {
        const data = await fetchGame(game.id)
        return {
          sousId: game.id,
          ...data
        }
    }).flat()
  )
  return games
}