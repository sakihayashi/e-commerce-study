function categoryValidation(req, res, next) {

    req.checkBody('name', 'Category cannot be empty').notEmpty();

    var errorValidate = req.validationErrors(); 

    if (errorValidate) {
        req.flash('errors', 'Category cannot be empty!');
        res.status(302).redirect('/api/admin/add-category');
    } else {
        next(); 
    }

}

module.exports = categoryValidation;