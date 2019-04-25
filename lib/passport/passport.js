var LocalStrategy = require('passport-local').Strategy; 
var User = require('../../routes/users/models/User');
var bcrypt = require('bcryptjs');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        console.log('Passport Deeerialize 13')
        User.findById(id, function(err, user) {
            if (err) {
                done(err, null)
            } else {
                done(null, user)
            }
        })

    });

    passport.use('local-login', new LocalStrategy({

        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true

    }, function(req, email, password, done) {
        console.log('LINE 27');
        User.findOne({email: email}, function(err, user) {

            if (err) {
                return done(err, null);
            }

            if (!user) {
                return done(null, false, req.flash('loginMessage', 'User does not exist! Go sign up'))
            }

            bcrypt.compare(password, user.password)
                  .then((err, res) => {

                    if (err === false) {
                        return done(null, false, req.flash('loginMessage', 'Check email or password'))
                    } else if (res === false) {
                        return done(null, false, req.flash('loginMessage', 'Check email or password'))
                    } else {
                        return done(null, user);
                    }

                  })

        })



    }))



}