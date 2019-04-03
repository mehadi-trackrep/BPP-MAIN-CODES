var express = require("express");
var router = express.Router();
var User = require("../models/user"); // Model import where "user.js" is a mongoose Model
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var dateTime = require("node-datetime");
var User = require("../models/user");
var BillDetails = require("../models/bill_details");
var CustomerDetails = require("../models/add_customer");
var VehicleDetails = require("../models/add_vehicle");
var ProductDetails = require("../models/add_product");
var Parse = require("parse/node");
var pass = "smmh3749";
var nodemailer = require("nodemailer");

// ##########  NEW CODES #############

var dt = dateTime.create();
var formatted = dt.format("Y-m-d H:M:S");
var rand, mailOptions, host, link, global_email;

router.get("/aboutUs", function(req, res, next) {
  res.render("AboutPage");
});


// HomePage
router.get("/home", function(req, res) {
  var username = "";
  if (req.session.name) {
    console.log(
      "\n--------------------- user is logged in .........................\n"
    );
    username = req.session.name;
  }
  res.render("index", { username: username });
});

// Login

module.exports = router;
