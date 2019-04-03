var express = require('express')
var router = express.Router()
var Parse = require('parse/node')

router.get('/currentSummery', function (req, res) {
  const Stock = Parse.Object.extend("Stock");
  const query = new Parse.Query(Stock);
  query.include("product");
  query
    .find()
    .then(result => {
      console.log(result)
      res.render('report/currentSummery', { products: result })
    })
    .catch(err => {
      res.render('report/currentSummery', { error: err })
    })
})

router.get('/salesBetweenTime', function (req, res) {
  const Product = Parse.Object.extend('Product')
  const query = new Parse.Query(Product)
  query
    .find()
    .then(result => {
      console.log(result)
      res.render('report/salesBetweenTime', { products: result })
    })
    .catch(err => {
      res.render('report/salesBetweenTime', { error: err })
    })
})

router.get('/salesToCustomer', function (req, res) {
  const Bill = Parse.Object.extend('Bill')
  const query = new Parse.Query(Bill)
  query.descending("createdAt");

  query
    .find()
    .then(result => {
      res.render('report/salesToCustomer', { bills: result })
    })
    .catch(err => {
      console.log(err)
    })
})

router.get('/salesToVehicle', function (req, res) {
  const Bill = Parse.Object.extend('Bill')
  const query = new Parse.Query(Bill)
  query.descending("createdAt");

  query
    .find()
    .then(result => {
      res.render('report/salesToVehicle', { bills: result })
    })
    .catch(err => {
      console.log(err)
    })
})

module.exports = router
