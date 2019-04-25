var express = require('express');
var router = express.Router();
var productController = require('./controllers/productController');

var Product = require('../models/Product');

Product.createMapping(function(err, mapping) {
    if (err) {
        console.log('Error creating mapping');
        console.log(err)
    } else {
        console.log('Mapping created');
        console.log(mapping);
    }
});

var stream = Product.synchronize(); 
var count = 0; 

stream.on('data', function() {
    count++;
});

stream.on('close', function() {
    console.log('Indexed ' + count + 'documents');
});

stream.on('error', function(error) {
    console.log(error);
});

router.get('/', function(req, res, next) {
    res.render('product/product')
    // res.send('Product Page');
});

router.get('/:id', function(req, res, next) {
    productController.getProductByID(req.params.id)
                     .then( product => {

                        res.render('product/product', {
                            product: product
                        })

                     })
                     .catch( error => {
                        res.status(error.status).json(error)
                     })
});

// router.post('/:id', cartController.addCart);

router.post('/getproductbyinput', function(req, res, next) {

    productController.searchProductByInput(req.body.name)
                     .then( results => {
                        res.json(results)
                     })
                     .catch(error => {
                         res.status(error.status).json(error)
                     })

});

router.get('/getproductsbycategoryid/:id', function(req, res, next) {
   
    productController.getProductsByCategory(req.params.id)
                     .then( products => {
                        res.render('product/product-category', {
                            products: products
                        })
                     })
                     .catch( error => {
                        res.json(error)
                     })

})

router.post('/instant-search', productController.instantSearch);

module.exports = router;
