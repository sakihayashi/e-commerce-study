var express = require('express');
var router = express.Router();

var productController = require('./product/controllers/productController');

/* GET home page. */
router.get('/', function(req, res, next) {

  productController.getAllProducts({})
                   .then( products => {

                  


                    res.render('index', {
                      products: products.products,
                      pages: products.pages,
                      current: products.current
                    });
                   })
                   .catch( error => {
                      res.status(error.status).json(error)
                   })
});

router.get('/page/:page', function(req, res, next) {

    
  productController.getAllProducts({}, req.params.page)
                   .then( products => {

                    console.log(products.current, products.pages)

                    res.render('index', {
                      products: products.products,
                      pages: products.pages,
                      current: products.current
                    });
                   })
                   .catch( error => {
                      res.status(error.status).json(error)
                   })

});

module.exports = router;
