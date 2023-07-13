export const tokenFields = `
id
tokenAddress
value
`

export const userFields = `
id
ticketNumber
claimed
account
tokens {
  ${tokenFields}
}
`

export const historyFields = `
id
createdAt
updatedAt
finalNumber
countWinnersPerBracket
numberOfWinningTickets
lottery {
  id
  users {
    ${userFields}
  }
  tokens {
    ${tokenFields}
  }
}
`

export const lotteryFields = `
  id
  treasuryFee
  referrerFee
  priceTicket
  firstTicketId
  discountDivisor
  startTime
  endTime
  collectionId
  users {
    ${userFields}
  }
  history {
    ${historyFields}
  }
`