var Product = require('../../models/Product');

module.exports = {
    getAllProducts: (params,  currentPage) => {
        return new Promise( (resolve, reject) => {

            let perPage = 9; 
            let page = +currentPage || 1
    
            Product
                .find()
                .skip( (perPage * page) - perPage )
                .limit( perPage )
                .populate('category')
                .exec()
                .then( products => {
                  return products;   
                })
                .then( products => {

                    Product.count()
                           .exec()
                           .then( count => {


                            resolve({
                                pages: Math.ceil(count/ perPage),
                                products: products,
                                current: page
                            });

                           })
                           .catch( error => {
                            let errors = {};
                            errors.status = 500;
                            errors.message = error; 
        
                            reject(errors)
                           })

                })
                .catch( error => {

                    let errors = {};
                    errors.status = 500;
                    errors.message = error; 

                    reject(errors)

                });
        
            
    



        })
    },
    getProductByID: (id) => {
        
        return new Promise((resolve, reject) => {

            Product.findById({_id: id})
                   .then( product => {
                    resolve(product);
                   })
                   .catch( error => {

                    let errors = {};
                    errors.status = 500; 
                    errors.message = error; 

                    reject(errors);

                   });

        });

    },
    searchProductByInput: (params) => {

     return new Promise((resolve, reject) => {

        Product.search({
            query_string: {
                query: params
            }
        }, function(err, results) {

            if (err) {
                let errors = {};
                errors.status = 500;
                errors.message = error;

                reject(errors);
            } else {
                
                console.log(results)

                let data = results.hits.hits.map(function(hit) {
                    return hit; 
                });

                resolve(data);

            }
        })



     });



    },
    getProductsByCategory: (id) => {
        return new Promise((resolve, reject) => {

            Product.find({
                category: id
            })
            .populate('category', '-__v')
            .exec(function(err, products) {

                if (err) {
                    let errors = {};
                    errors.status = 500;
                    errors.message = error;
    
                    reject(errors);
                } else {

                    console.log(products)

                    resolve(products);
                }

            })



        });

    },
    instantSearch: (req, res) => {

        Product.search({
            query_string: {
                query: req.body.search_term
            }
        }, function(error, products) {

            if (error) {
                let errors = {};
                errors.status = 500;
                errors.message = error; 
                res.status(errors.status).json(errors);
            } else {
                res.json(products);
            }

        });


    }
}