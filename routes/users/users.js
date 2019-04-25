var express = require('express');
var router = express.Router();
var userController = require('./controllers/userController');
var passport = require('passport');

var signupValidation = require('./utils/signupValidation');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', function(req, res) {

  if (req.isAuthenticated()) {
    return res.redirect('/')
  }

  res.render('auth/signup', {errors: req.flash('errors')});
});

router.post('/signup', signupValidation, function(req, res) {

  var errorValidate  = req.validationErrors();

  if (errorValidate) {
    res.render('auth/signup', {error_msg: true, errorValidate: errorValidate, errors: []})
    return;
  } else {

    userController.signup(req.body)
                .then( user => {

                  req.logIn(user, function(err) {

                    if (err) {
                      res.status(400).json({
                        confirmation: false, 
                        message: err
                      })
                    
                    } else {
                      res.redirect('/')
                    }

                  })

                })
                .catch( error => {
                  req.flash('errors', error.message);
                  return res.redirect(301, '/api/users/signup')
                })


  }

  

});

router.get('/signin', function(req, res) {

  if (req.isAuthenticated()) {
    return res.redirect('/')
  }

  res.render('auth/signin', {errors: req.flash('loginMessage')});

});

router.post('/signin', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/api/users/signin',
  failureFlash: true
}))

router.get('/logout', function(req, res) {

  req.logout();
  res.redirect('/');

});

router.get('/update-profile', function(req, res, next) {

  userController.getProfileWithHistory(req.user._id)
                .then(foundUser => {
                  res.render('account/profile', { 
                    errors: req.flash('errors'), 
                    success: req.flash('success'),
                    user: foundUser
                  })
                })
                .catch(error => {

                  res.json(error);

                })

})

router.put('/update-profile', function(req, res, next) {

  userController.updateProfile(req.body, req.user._id)
                .then( user => {

                  req.flash('success', 'Successfully updated your profile');
                  return res.redirect('/api/users/update-profile')

                })
                .catch(error => {

                  req.flash('errors', error);
                  return res.redirect('/api/users/update-profile');

                })
});


module.exports = router;