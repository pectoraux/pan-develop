// import initStripe from 'stripe'
import Stripe from 'stripe'

const handler = async (req, res) => {
const { account: accountAddress, rampAddress, sk, accountId } = req.body
// const stripe = initStripe(sk)
const stripe = new Stripe(sk, { apiVersion: '2020-08-27',})
console.log("RESP====================>", accountId, sk, accountAddress, rampAddress)
let loginLink;
let account;
  try {
    if (!accountId) {
      // Generate a unique login link for the associated Stripe account to access their Express dashboard
      account = await stripe.accounts.create({
        type: 'express',
        capabilities: {card_payments: {requested: true}, transfers: {requested: true}},
      });
      loginLink = await stripe.accountLinks.create({
        account: account?.id,
        refresh_url: `http://localhost:3000/ramps/${rampAddress}`,
        return_url: `http://localhost:3000/ramps/${rampAddress}`,
        type: 'account_onboarding',
      });
      console.log("a===================>", account)
    }
    console.log("loginLink=======================>", loginLink)
    // Retrieve the URL from the response and redirect the user to Stripe
    res.send({
      link: loginLink ? loginLink.url : undefined,
      accountId: account?.id,
      err: ''
    })
  } catch (err) {
    console.log('The Stripe onboarding process has not succeeded.', err);
    res.send({
      link: undefined,
      account: accountId,
      err
    })
  }
}

export default handler;
