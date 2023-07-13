// import initStripe from 'stripe'
import Stripe from 'stripe';

const handler = async (req, res) => {
  const { account, price, currency, rampAddress, sk } = req.body
  // const stripe = initStripe(sk)
  const stripe = new Stripe(sk, { apiVersion: '2020-08-27',})
  const lineItems = [{
    quantity: 1,
    price_data: {
      currency: currency.symbol,
      unit_amount: parseInt(price) * 100,
      product_data: {
        name: currency?.name,
        description: currency?.name,
      },
    },
  }] 
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${req.headers.origin}/ramps/${rampAddress}?state=success&userAccount=${account}&session_id={CHECKOUT_SESSION_ID}&userCurrency=${currency?.address}&amount=${price}`,
      cancel_url: `${req.headers.origin}/ramps/${rampAddress}?state=failure&userAccount=${account}&session_id={CHECKOUT_SESSION_ID}&userCurrency=${currency?.address}&amount=${price}`,
    })

    res.send({
      id: session.id,
      error: undefined
    });
  } catch(error) {
    console.log(error)
    res.send({
      id: undefined,
      error
    });
  }
}

export default handler;


// http://localhost:3000/ramps/0xBAC30C41181c117C6Aa0fc91a6a9E2D659b15F57?state=success&userAccount=0x2fbfd5A8B2C31DDB921211933bfb1842FF39B5eA&session_id=cs_test_a1zR3TV3akXuDrmpiHbbzr5dpDpGa70kFnQOPJ0ECSbCjx5GIBEYByJ14h&userCurrency=0x53B34d4d703C42C167fAD1013C9a74C17a91AcAf&amount=10