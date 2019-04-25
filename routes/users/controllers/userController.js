const User = require('../models/User');
const bcrypt = require('bcryptjs');
const gravatar = require('../utils/gravatar');
const Cart = require('../../cart/models/Cart');

module.exports = {

    signup: function (params) {

        return new Promise((resolve, reject) => {

            User.findOne({email: params.email})
                .then( user => {

                    if (user) {
                        let errors = {};
                        errors.message = 'Email already exist';
                        errors.status = 400;
                        reject(errors);
                    } else {

                        const newUser = new User();
   
                        newUser.profile.name = params.name;
                        newUser.password = params.password;
                        newUser.email = params.email;
                        newUser.profile.picture = gravatar(params.email);


                        bcrypt.genSalt(10, (err, salt) => {

                            bcrypt.hash(newUser.password, salt, (err, hash) => {

                                if (err) {
                                    reject(err)
                                } else {
                                    newUser.password = hash;

                                    newUser
                                        .save()
                                        .then( user => {
                                            //create a cart object relating to the userid but do this in creating new user when I make an app for better efficiency
                                            let cart = new Cart();
                                            cart.owner = user._id;
                                            cart.save(function (err){
                                                if(err){
                                                    reject(err)
                                                }else{
                                                    resolve(user);
                                                }
                                            })
                                        })
                                        .catch(err => reject(err));
                                }

                            });

                        });


                    }

                })
                .catch(error => {
                    let errors = {};
                    errors.message = error;
                    errors.status = 400;
                    reject(errors);
                })


        })


    },

    updateProfile: (params, id) => {

        return new Promise((resolve, reject) => {

            User.findOne({_id: id})
                .then( user => {

                    if (params.name) {
                        user.profile.name = params.name;
                    }

                    if (params.address) {
                        user.address = params.address;
                    }

                    if (params.passsord) {
                        user.passsord = params.passsord;
                    }

                    if (params.email) {
                        user.email = params.email;
                    }

                    user.save()
                        .then( user => {
                            resolve(user)
                        })
                        .catch( error => {
                            let errors = {};
                            errors.message = error; 
                            errors.status = 400;
                            reject(errors);
                        })


                })
                .catch( error => {
                    let errors = {};
                    errors.message = error; 
                    errors.status = 400;
                    reject(errors);
                })



        });



    },
    getProfileWithHistory: (id) => {
        return new Promise((resolve, reject) => {
            User.findOne({_id: id})
                .populate('history.item')
                .exec(function (err, user){
                    if(err){
                        reject(err)
                    }else{
                        resolve(user)
                    }
                })
        })
    }


}