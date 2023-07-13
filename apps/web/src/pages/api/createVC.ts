// create virtual card
const handler = async (req, res) => {
    const { customerId, price, symbol, sk } = req.body
    const stripe = require('stripe')(sk);
    let transferData;
    let errorData;
    // Get the card token from the customer
    stripe.customers.retrieve(
        customerId,
        function(err, customer) {
            // Handle any errors
            if (err) {
                console.log(err);
                errorData = err;
            }
            // Get the card token
            var card_token = customer.sources.data[0].id;
            // Transfer money onto the virtual card
            stripe.transfers.create({
                amount: price * 100,
                currency: symbol,
                destination: card_token,
            }, function(err, transfer) {
                // Handle any errors
                if (err) {
                    console.log(err);
                    errorData = err;
                }
                console.log(transfer);
                transferData = transfer;
            });
    }
    );
    res.send({
        transferData,
        errorData,
    })
}

export default handler;
