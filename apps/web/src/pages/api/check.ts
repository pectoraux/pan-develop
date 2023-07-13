// import initStripe from 'stripe'
import Stripe from 'stripe';

const handler = async (req, res) => {
  const { sessionId, sk } = req.body
  console.log("check=================>", sk, process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)
  // const stripe = initStripe(sk)
  const stripe = new Stripe(sk, { apiVersion: '2020-08-27',})
  
  try {
    const session = (await stripe.checkout.sessions.listLineItems(sessionId)).data
    console.log("session1=============>", session[0])
    res.send({
      id: session.length && session[0].id,
      amount: session.length && (Number(session[0]?.amount_total ?? 0) / 100),
      currency: session.length && `${session[0].currency}`,
      error: undefined
    });
  } catch(error) {
    console.log(error)
    res.send({
      id: undefined,
      amount: undefined,
      error
    });
  }
}

export default handler;


// http://localhost:3000/ramps/0xBAC30C41181c117C6Aa0fc91a6a9E2D659b15F57?state=success&userAccount=0x2fbfd5A8B2C31DDB921211933bfb1842FF39B5eA&session_id=cs_test_a1zR3TV3akXuDrmpiHbbzr5dpDpGa70kFnQOPJ0ECSbCjx5GIBEYByJ14h&userCurrency=0x53B34d4d703C42C167fAD1013C9a74C17a91AcAf&amount=10