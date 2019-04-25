var Product = require('../../models/Product');
var faker = require('faker')

module.exports = {

    createProductByCategoryID: (req, res, next) => {

        for (let i = 0; i < 30; i++) {

            let product = new Product();

            product.category = req.params.id;
            product.name = faker.commerce.productName();
            product.price = faker.commerce.price();
            product.image = faker.image.image();

            product.save();

        }

        req.flash('success', `Fake ${req.params.name} Products created`);
        res.redirect('/api/admin/get-all-category');

    }

}