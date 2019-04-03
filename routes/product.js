var express = require('express')
var router = express.Router()
var Parse = require('parse/node')

router.get('/add_product', function (req, res) {
  res.render('product/add_product');
});


router.get('/view_products', function (req, res) {
  const Product = Parse.Object.extend('Product')
  const query = new Parse.Query(Product)
  query
    .find()
    .then(result => {
      console.log(result)
      res.render('product/view_products', { products: result })
    })
    .catch(err => {
      res.render('product/view_products', { error: err })
    })
})





router.post('/insertInDb', function (req, res, next) {
  let name = req.body.product_name
  if (name) {
    const Product = Parse.Object.extend('Product')
    const product = new Product()
    product.set('name', name)
    product.set('qantity', 0)
    product.set('buying_price', 0)
    product.set('selling_price', 0)
    product
      .save()
      .then(result => {
        res.redirect('view_products')
      })
      .catch(err => {
        // render error view here
      })
  }
})

module.exports = router
