import { LotteryTicket } from 'config/constants/types'
import random from 'lodash/random'

export const encodeNumbers = (value: any) => {
  const res = Array.from({length: 5}, (_, j) => 0)
  for(let i = 0; i < value.length; i++) {
    res[i] = value[i];
  }
  return `1 ${res.join("")}`
} 

export const encodeAlphabet = (value: any, ticketSize: any) => {
  const processed = []
  // const value = val?.toLowerCase()
  const ALPHABET = {"a": 0,"b": 1,"c": 2,"d": 3,"e": 4,"f": 5,"g": 6,"h": 7,"i": 8,"j": 9,"k": 10,"l": 11,"m": 12,"n": 13,"o": 14,"p": 15,"q": 16,"r": 17,"s": 18,"t": 19,"u": 20,"v": 21,"w": 22,"x": 23,"y": 24,"z": 25, " ": 26}
  const res = Array.from({length: ticketSize}, (_, j) => 0)
  let k = 0
  for(let i = 0; i < value.length; i++) {
    if (!processed.includes(value[i])) {
      if (ALPHABET[value[i]] !== undefined) {
        processed.push(value[i])
        const pos = ALPHABET[value[i]]
        res[pos] = k++;
      } else {
        res[i] = value[i];
      }
    }
  }
  return `1 ${res.join("")}`
} 
/**
 * Generate a specific number of unique, randomised 7-digit lottery numbers between 1000000 & 1999999
 */
const generateTicketNumbers = (
  userCurrentTickets?: LotteryTicket[],
  alphabet = false,
  minNumber = 1000000,
  maxNumber = 1999999,
) => {
  // 1000020005000100000300000000
  // 1000020005000100000300000000
  // 1000020005000100000300000000
  // console.log("2encodeAlphabet==================>", encodeAlphabet("messi"), encodeNumbers("24"), encodeNumbers("4"))
  // Populate array with existing tickets (if they have them) to ensure no duplicates when generating new numbers
  const existingTicketNumbers =
    userCurrentTickets?.length > 0
      ? userCurrentTickets.map((ticket) => {
          if (ticket?.number) { 
            return ticket?.number
          }
          return ""
        })
      : []
  const generatedTicketNumbers = [...existingTicketNumbers]

  // for (let count = 0; count < numberOfTickets; count++) {
  //   const randomNumber = [1,1,1,1,1,1] //random(minNumber, maxNumber)
  //   // while (randomNumber?.length < 7) {
  //   //   randomNumber.push(random(0,2))
  //   // }
  //   // while (generatedTicketNumbers.includes(randomNumber)) {
  //   //   // Catch for duplicates - generate a new number until the array doesn't include the random number generated
  //   //   randomNumber = random(minNumber, maxNumber)
  //   // }
  //   // generatedTicketNumbers.push(parseInt(randomNumber.toString()))
  //   console.log("1randomNumber===============>", generatedTicketNumbers, randomNumber.toString(), parseInt(randomNumber.toString()))
  // }
  console.log("2randomNumber===============>", generatedTicketNumbers)
  // // Filter out the users' existing tickets
  // const ticketsToBuy =
  //   userCurrentTickets?.length > 0
  //     ? generatedTicketNumbers.filter((ticketNumber) => {
  //         return !existingTicketNumbers.includes(ticketNumber)
  //       })
  //     : generatedTicketNumbers

  return generatedTicketNumbers
}

export default generateTicketNumbers
