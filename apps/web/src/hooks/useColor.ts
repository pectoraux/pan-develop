export const useColor = (superLikes: string, superDislikes: string): { itemColor: string, textColor: string }  => {
  const [Brown, Silver, Gold] = [2000, 3000, 4000]
  const superDiff = Number(superLikes) - Number(superDislikes)
  if (superDiff >= Gold) {
    return {itemColor: 'gold', textColor: 'white'}
  }
  if (superDiff >= Silver) {
    return {itemColor: 'silver', textColor: 'white'}
  }
  if (superDiff >= Brown) {
    return {itemColor: '#cd7f32', textColor: 'white'}
  }
  return {itemColor: 'black', textColor: 'white'}
}
