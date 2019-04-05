var express = require('express')
var router = express.Router()
var Parse = require('parse/node')

router.get('/add_customer', function (req, res) {
    res.render('customer/add_customer');
});


router.get('/view_customers', function (req, res) {

    var page = req.query.page || 0;
    console.log("\n\n==> page: " + page)
    var pages, cnt, extraPages, numPageLinks, lastPage, pageStart = page;

    const displayLimit = 10;

    const Product = Parse.Object.extend('Customer')
    const query = new Parse.Query(Product)

    query.count().then(function (count) {
        // console.log("==> count: " + count);
        cnt = count;
        pages = Math.ceil(cnt / displayLimit);
        extraPages = cnt - page * displayLimit;

        if (Number(extraPages) > 0) {
            numPageLinks = Math.ceil(extraPages / displayLimit);
            console.log("==> numPageLinks: " + numPageLinks);
        } else numPageLinks = 0;

        lastPage = Number(numPageLinks) + Number(pageStart);
        console.log("==> lastPage: " + lastPage);
        console.log("==> extraPages: " + extraPages);
        console.log("==> pages: " + pages);
    });

    query.descending('updatedAt');
    query.limit(displayLimit);
    query.skip(page * displayLimit);
    query
        .find()
        .then(result => {
            // console.log(result)
            console.log("==> pageStart, lastPage: " + pageStart + " -- " + lastPage);
            res.render('customer/view_customers', { products: result, pages: pages, pageStart: pageStart, lastPage: lastPage })
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
