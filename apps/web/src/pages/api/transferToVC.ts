// transfer to virtual card
const handler = async (req, res) => {
    const { email, sk } = req.body
    const stripe = require('stripe')(sk);
    let customerData;
    let errorData;
    let cardData;
    let tokenData;
    // Create a new customer
    stripe.customers.create({
        email,
        }, function(err, customer) {
        if (err) {
            console.log(err);
            errorData = err;
        }
        console.log(customer);
        customerData = customer;
        // Create a card token with random card details
        stripe.tokens.create({
            card: {
            number: Math.random().toString().slice(2, 18),
            exp_month: Math.floor(Math.random()*12)+1,
            exp_year: Math.floor(Math.random()*10)+2023,
            cvc: Math.floor(Math.random()*999).toString().padStart(3,'0'),
            }
        }, function(err, token) {
            if (err) {
                console.log(err);
                errorData = err;
            }
            console.log(token);
            tokenData = token;
            // Attach the card token to the customer
            stripe.customers.createSource(customer.id, {
                source: token.id
            }, function(err, card) {
                if (err) {
                    console.log(err);
                    errorData = err;
                }
                cardData = card;
            });
        });
    });
    res.send({
        customerData,
        errorData,
        cardData,
        tokenData
    })
}

export default handler;
