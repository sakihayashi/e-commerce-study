var Category = require('../../models/Category');

module.exports = {

    addCategory: (params) => {

        return new Promise((resolve, reject) => {

            let category = new Category();

            category.name = params.name; 

            category.save()
                    .then( category => {
                        resolve(category);
                    })
                    .catch( error => {

                        let errors = {};

                        if (error.code === 11000) {

                            errors.confirmation = false;
                            errors.message = 'Category already exists!';
                            reject(errors)

                        } else {
                            errors.confirmation = false;
                            errors.message = error; 
                            reject(errors)
                        }

                    })




        })

    },
    getAllCategory: (req, res, next ) => {


        Category.find({})
                .then( categories => {

                    console.log(categories)

                    res.render('category/create-fake-product', {
                        categories: categories, 
                        success: req.flash('success')
                    })

                })
                .catch( error => {

                    let errors = {};
                    errors.status = 500;
                    errors.message = error;

                    res.status(errors.status).json(errors);

                });

    }

}