// import initStripe from 'stripe'
import Stripe from 'stripe'

const handler = async (req, res) => {
const { amount, symbol, sk, accountId } = req.body
// const stripe = initStripe(sk)
const stripe = new Stripe(sk, { apiVersion: '2020-08-27',})
console.log("RESP====================>", req.body)
  try {
  
    const transfer = await stripe.transfers.create({
      amount: parseInt(amount) * 100,
      currency: symbol?.toLowerCase(),
      destination: accountId,
    });
    console.log("transfer=======================>", transfer)
    // Retrieve the URL from the response and redirect the user to Stripe
    res.send({
      amount: transfer.amount / 100,
      err: ''
    })
  } catch (err) {
    console.log('The Stripe onboarding process has not succeeded.', err);
    res.send({
      amount: undefined,
      err
    })
  }
}

export default handler;
