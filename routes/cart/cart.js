var express = require('express');
var router = express.Router();
var cartController = require('./controller/cartController');
const stripe = require('stripe')('sk_test_jf4YHxKRXTiTyNXXEUo11IRc00Ji3VonDz');
const User = require('../users/models/User');
const async = require('async')

const Cart = require('../cart/models/Cart');

// router.get('/', function (req, res){
//     res.send('from cart');
// });

router.get('/', cartController.getUserShoppingCart);

router.post('/product/:product_id', cartController.addCart);

router.delete('/remove', cartController.removeProduct);

router.post('/payment', function (req, res, next){
    let stripeToken = req.body.stripeToken;
    let currentCharges = req.body.stripeMoney * 100;

    stripe.customers.create({
        source: stripeToken,
        email: 'customer@example.com'
    })
    .then( customer => {
        let result = stripe.charges.create({
            amount: currentCharges,
            currency: 'usd',
            customer: customer.id
        })
        return result;
    })
    .then( results => {
        async.waterfall([

            function(callback) {

                Cart.findOne({ owner: req.user._id}, function(err, cart) {
 
                    callback(err, cart);
 
                });
 
            },
            function(cart, callback) {
 
                User.findOne({_id: req.user._id}, function(err, user) {
 
                    if (user) {
                        for (let i = 0; i < cart.items.length; i++) {
                            user.history.push({
                                item: cart.items[i].item,
                                paid: cart.items[i].price
                            })
                        }
                    }
 
                    user.save(function(err, user) {
                        if (err) return next(err);
                        callback(err, user);
                    });
                })
            },
            function(user) {
                Cart.update({owner: user._id}, {$set: { items: [], total: 0}}, function(err, updated) {
                    if (updated) {
                        res.redirect('/')
                    }
                })
            }
        ])
        // res.redirect('/api/cart/thank-you');
    })
    .catch(error => {
        let errors = {};
        errors.message = error;
        errors.status = 500;
        console.log(error)
        res.status(errors.status).json(errors);
    })
    
    
})

router.get('/thank-you', function (req, res){
    res.render('cart/thank-you');
})

// router.delete('/remove', function (req, res, next){
//     res.send('from delete')
// })

module.exports = router;