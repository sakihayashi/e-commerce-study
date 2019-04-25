const Cart = require('../models/Cart');
const Stripe = require('stripe')('sk_test_...');
 



module.exports = {

    removeProduct: (req, res, next) => {
        Cart.findOne({owner: req.user._id})
        .then(foundCart => {
            foundCart.items.pull(String(req.body.item));
            foundCart.total = (foundCart.total - parseFloat(req.body.price)).toFixed(2);

            foundCart.save()
                     .then(cart => {
                        req.flash('remove', 'Successfully removed');
                        res.redirect('/api/cart');
                     })
                    .catch(error => {
                        let errors = {};
                        errors.message = error;
                        errors.status = 400;
                        res.status(errors.satus).json(errors);
                    })
        .catch(error => {
            let errors = {};
            errors.message = error;
            errors.status = 400;
            res.status(errors.satus).json(errors);
        })
    })
    },
    addCart: (req, res, next) => {
    Cart.findOne({owner: req.user._id})
    .then(cart => {
        cart.items.push({
            item: req.body.product_id,
            price: parseFloat(req.body.priceValue),
            quantity: parseInt(req.body.quantity)
        })
        cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);

        cart.save()
            .then((cart) => {
                return res.redirect('/api/cart'); //go to this path and run the next func
            })
            .catch(error => {
                let errors = {};
                errors.message = error;
                errors.status = 400;
                res.status(errors.satus).json(errors);
            })
    })
    .catch( error => {
        let errors = {};
        errors.message = error;
        errors.status = 400;
        res.status(errors.satus).json(errors);
    })
    },
    getUserShoppingCart: (req, res) => {
        Cart.findOne({owner: req.user._id})
        .populate('items.item') 
        .exec(function (error,foundCart){
            if(error){
                let errors ={};
                errors.message = error;
                errors.status = 400;
                res.status(errors.satus).json(errors);
            }else{
                res.render('cart/cart', {
                    foundCart: foundCart,
                    message: req.flash('remove')
                })
            }
        })
      
    }
}