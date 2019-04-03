var express = require("express");
var router = express.Router();
var Parse = require("parse/node");

router.get("/add_stock", function (req, res) {
  const Product = Parse.Object.extend("Product");
  const query = new Parse.Query(Product);
  query
    .find()
    .then(result => {
      res.render("stock/add_stock", { products: result });
    })
    .catch(err => {
      res.render("stock/view_stock", { error: err });
    });
});

router.get("/view_stock", function (req, res) {
  const Stock = Parse.Object.extend("Stock");
  const query = new Parse.Query(Stock);
  query.include("product");
  query
    .find()
    .then(result => {
      // console.log(JSON.stringify(result))
      res.render("stock/view_stock", { stocks: result });
    })
    .catch(err => {
      res.render("stock/view_stock", { error: err });
    });
});


router.post("/insertInDb", function (req, res, next) {
  console.log(req.body);
  const productId = req.body.pid;
  const quantity = Number(req.body.quantity);
  const buyingPrice = Number(req.body.buying_price);
  const sellingPrice = Number(req.body.selling_price);
  console.log("product = " + productId);
  console.log("quantity = " + quantity);
  console.log("buyingPrice = " + buyingPrice);
  console.log("sellingPrice = " + sellingPrice);
  const Product = Parse.Object.extend("Product");
  const Stock = Parse.Object.extend("Stock");
  const query = new Parse.Query(Product);
  query
    .get(productId)
    .then(product => {
      console.log(product);
      const stock = new Stock();
      stock.set("product", product);
      stock.set("quantity", quantity);
      stock.set("buyingPrice", buyingPrice);
      stock.set("sellingPrice", sellingPrice);
      stock
        .save()
        .then(result => {
          res.redirect("/stock/view_stock");
        })
        .catch(err => {
          // render error view here
        });
    })
    .catch(err => {
      console.log(err);
    });
});

router.post("/:stockId", function (req, res, next) {
  const stockId = req.params.stockId;
  const addedQuantity = Number(req.body.addedQuantity);
  console.log(stockId);
  console.log(addedQuantity);
  const Stock = Parse.Object.extend("Stock");
  const query = new Parse.Query(Stock);
  query
    .get(stockId)
    .then(stock => {
      console.log(JSON.stringify(stock));
      const currentQuantity = Number(stock.get("quantity"));
      const newQuantity = currentQuantity + addedQuantity;
      console.log(newQuantity);
      stock.set("quantity", newQuantity);
      stock
        .save()
        .then(result => {
          res.redirect("/stock/view_stock");
        })
        .catch(err => {
          res.redirect("/stock/view_stock");
        });
    })
    .catch(err => {
      console.log(err);
      res.redirect("/stock/view_stock");
    });
});

module.exports = router;
