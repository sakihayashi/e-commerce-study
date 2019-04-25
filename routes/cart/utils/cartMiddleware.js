var Cart = require('../models/Cart');

module.exports = (req, res, next) => {
    if(req.user){
        let total = 0;
        Cart.findOne({owner: req.user._id})
            .then(cart => {
                if(cart){
                    for (let i = 0; i < cart.items.length; i++) {
                        total += cart.items[i].quantity;
                        
                    }
                    res.locals.cart = total;
                    next();
                }else{
                    res.locals.cart = 0;
                    next();
                }
            })
            .catch(error =>{
                
            })
    }
}