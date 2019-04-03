var express = require('express')
var router = express.Router()
var Parse = require('parse/node')

router.get('/add_customer', function (req, res) {
    res.render('customer/add_customer');
});


router.get('/view_customers', function (req, res) {
    const Product = Parse.Object.extend('Customer')
    const query = new Parse.Query(Product)

    query
        .find()
        .then(result => {
            console.log(result)
            res.render('customer/view_customers', { products: result })
        })
        .catch(err => {
            res.render('customer/view_customers', { error: err })
        })
})

router.post('/insertInDb', function (req, res, next) {
    var name = req.body.company_name
    var address = req.body.address
    var email = req.body.email
    var contact_person = req.body.contact_person
    var contact_no = req.body.contact_no
    var discount_radio = req.body.discount_radio;
    var discount = req.body.discount

    console.log("discount_radio: " + discount_radio)

    if (discount_radio === "parcent") {
        discount = parseFloat(discount);
        discount = discount / 100.0;
        discount = discount.toString();
        console.log("discount: " + discount_radio)
    }

    if (name) {
        const Product = Parse.Object.extend('Customer')
        const product = new Product()
        product.set('name', name)
        product.set('address', address)
        product.set('email', email)
        product.set('contact_person', contact_person)
        product.set('contact_no', contact_no)
        product.set('discount', discount)
        product
            .save()
            .then(result => {
                res.redirect('view_customers')
            })
            .catch(err => {
                // render error view here
            })
    }
})

module.exports = router
