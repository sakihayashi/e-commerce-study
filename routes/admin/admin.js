var express = require('express');
var router = express.Router();
var categoryValidation = require('./utils/categoryValidation');
var categoryController = require('./controllers/categoryController');

var createProductController = require('./controllers/createProductController');


router.get('/', function(req, res, next) {

    res.render('index');

});

router.get('/add-category', function(req, res) {

   res.render('admin/add-category', {
       message: req.flash('success'),
       errors: req.flash('errors')
    }); 

});

router.post('/add-category', categoryValidation, function(req, res, next) {

    categoryController.addCategory(req.body)
                      .then( category => {
                        req.flash('success', 'Successfully added a category');
                        return res.redirect('/api/admin/add-category');
                      })
                      .catch(error => {
                        req.flash('errors', error.message);
                        return res.redirect('/api/admin/add-category');
                      })

})

router.get('/get-all-category', categoryController.getAllCategory)

router.get('/create-fake-product/:name/:id', createProductController.createProductByCategoryID)


module.exports = router;