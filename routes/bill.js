var express = require('express')
var router = express.Router()
var Parse = require('parse/node')

const ThermalPrinter = require('node-thermal-printer').printer
const PrinterTypes = require('node-thermal-printer').types

router.get('/bill_for_vehicle', async function (req, res, next) {
  const Stock = Parse.Object.extend('Stock')
  const query1 = new Parse.Query(Stock)
  query1.greaterThan('quantity', 0)
  query1.include('product')
  var fuel = await query1.find()

  console.log('Fuel == ' + fuel)

  const Vehicle = Parse.Object.extend('Vehicle')
  const query = new Parse.Query(Vehicle)
  query.include('companyName')
  query.skip(250)
  query
    .find()
    .then(result => {
      console.log(result)
      console.log('Fuel2 == ' + fuel)
      res.render('bill/bill_for_vehicle', {
        vehicles: result,
        fuels: fuel,
        company_discount: '[[]]'
      })
    })
    .catch(err => {
      console.log(err)
      res.render('bill/bill_for_vehicle', { error: err })
    })
})

router.get('/find_bills', function (req, res, next) {
  const Bill = Parse.Object.extend('Bill')
  const query = new Parse.Query(Bill)
  query.descending('createdAt')

  query
    .find()
    .then(result => {
      res.render('bill/find_bills', { bills: result })
    })
    .catch(err => {
      console.log(err)
    })
})

router.post('/find_bills', function (req, res, next) {
  // const Bill = Parse.Object.extend('Bill')
  // const query = new Parse.Query(Bill)
  // query.descending('createdAt')

  // query
  //   .find()
  //   .then(result => {
  //     res.render('bill/find_bills', { bills: result })
  //   })
  //   .catch(err => {
  //     console.log(err)
  //   })
  var pageNo = req.body.pageNo;
  console.log("page no working  " + pageNo);
})



router.get('/quick_bill', async function (req, res, next) {
  const Stock = Parse.Object.extend('Stock')
  const query1 = new Parse.Query(Stock)
  query1.greaterThan('quantity', 0)
  query1.include('product')
  var fuel = await query1.find()

  console.log('Fuel == ' + fuel)

  const Vehicle = Parse.Object.extend('Vehicle')
  const query = new Parse.Query(Vehicle)
  query.include('companyName')
  query
    .find()
    .then(result => {
      console.log(result)
      console.log('Fuel2 == ' + fuel)
      res.render('bill/quick_bill', {
        vehicles: result,
        fuels: fuel,
        company_discount: '0'
      })
    })
    .catch(err => {
      console.log(err)
      res.render('bill/quick_bill', { error: err })
    })
})

router.post('/bill_for_vehicle', async function (req, res, next) {
  console.log('ashce')

  var vehicle = req.body.vehicle
  var company = req.body.company
  var optionsRadios = req.body.optionsRadios
  var arr = optionsRadios.split('-')
  var product = arr[0]
  var sellingPrice = parseFloat(arr[1])
  var quantity = req.body.quantity
  var inStock = parseFloat(req.body.stock.split(' ')[1])
  var afterSaleStcok = parseFloat(req.body.after_stock.split(' ')[3])
  // var price = parseFloat(req.body.price.split(' ')[1]);
  var discount = parseFloat(req.body.discount.split(' ')[1])
  var totalPrice = parseFloat(req.body.totalPrice.split(' ')[2])
  var stockId = req.body.stockId
  var profit = req.body.profit

  var bajeNam = {
    vehicle: vehicle,
    company: company,
    product: product,
    sellingPrice: sellingPrice,
    quantity: quantity,
    inStock: inStock,
    afterSaleStcok: afterSaleStcok,
    discount: discount,
    totalPrice: totalPrice
  }

  const Stock = Parse.Object.extend('Stock')
  const query1 = new Parse.Query(Stock)
  query1.get(stockId).then(stock => {
    console.log(JSON.stringify(stock))
    const currentQuantity = Number(stock.get('quantity'))
    const newQuantity = currentQuantity - Number(quantity)
    console.log(newQuantity)
    stock.set('quantity', newQuantity)
    stock
      .save()
      .then(result => {
        console.log('Success')
      })
      .catch(err => {
        console.log(err)
      })
  })

  // Bill creation.
  const Bill = Parse.Object.extend('Bill')
  const bill = new Bill()

  bill.set('vehicle', vehicle)
  bill.set('company', company)
  bill.set('product', product)
  bill.set('quantity', quantity)
  bill.set('totalPrice', totalPrice)
  bill.set('discount', discount)
  bill.set('profit', profit)
  bill.set('billType', 'bill for vehicle')
  bill
    .save()
    .then(result => {
      console.log('\n\nsuccess Bill\n\n')
      res.render('bill/confirm_bill_for_vehicle', { result: bajeNam })
    })
    .catch(err => {
      console.log(err)
    })
})

router.post('/quick_bill', function (req, res, next) {
  var vehicle = req.body.vehicle
  var company = req.body.company
  var optionsRadios = req.body.optionsRadios
  var arr = optionsRadios.split('-')
  var product = arr[0]
  var sellingPrice = parseFloat(arr[1])
  var quantity = req.body.quantity
  var inStock = parseFloat(req.body.stock.split(' ')[1])
  var afterSaleStcok = parseFloat(req.body.after_stock.split(' ')[3])
  // var price = parseFloat(req.body.price.split(' ')[1]);
  var discount
  var totalPrice = parseFloat(req.body.totalPrice.split(' ')[2])
  var stockId = req.body.stockId
  var profit = req.body.profit
  if (vehicle === 'Retail') {
    discount = 0
    company = 'Pump'
  } else {
    discount = parseFloat(req.body.discount.split(' ')[1])
  }
  var bajeNam = {
    vehicle: vehicle,
    company: company,
    product: product,
    sellingPrice: sellingPrice,
    quantity: quantity,
    inStock: inStock,
    afterSaleStcok: afterSaleStcok,
    discount: discount,
    totalPrice: totalPrice
  }

  const Stock = Parse.Object.extend('Stock')
  const query1 = new Parse.Query(Stock)
  query1.get(stockId).then(stock => {
    console.log(JSON.stringify(stock))
    const currentQuantity = Number(stock.get('quantity'))
    const newQuantity = currentQuantity - Number(quantity)
    console.log(newQuantity)
    stock.set('quantity', newQuantity)
    stock
      .save()
      .then(result => {
        console.log('Success')
      })
      .catch(err => {
        console.log(err)
      })
  })
  // Bill creation.
  const Bill = Parse.Object.extend('Bill')
  const bill = new Bill()

  bill.set('vehicle', vehicle)
  bill.set('company', company)
  bill.set('product', product)
  bill.set('quantity', quantity)
  bill.set('totalPrice', totalPrice)
  bill.set('discount', discount)
  bill.set('profit', profit)
  bill.set('billType', 'quick')
  bill
    .save()
    .then(result => {
      console.log('\n\nsuccess Bill\n\n')
      res.render('bill/confirm_bill_for_vehicle', { result: bajeNam })
    })
    .catch(err => {
      console.log(err)
    })
})

router.post('/print_bill_for_vehicle', function (req, res, next) {
  var vehicle = req.body.vehicle
  var company = req.body.company
  var product = req.body.product
  var sellingPrice = req.body.price
  var quantity = req.body.quantity
  var inStock = req.body.stock
  var afterSaleStcok = req.body.after_stock
  var discount = req.body.discount
  var totalPrice = req.body.totalPrice

  // let printer = new ThermalPrinter({
  //     type: PrinterTypes.STAR,                                  // Printer type: 'star' or 'epson'
  //     interface: 'tcp://xxx.xxx.xxx.xxx',                       // Printer interface
  //     options: {                                                 // Additional options
  //         timeout: 5000                                           // Connection timeout (ms) [applicable only for network printers] - default: 3000
  //     }
  // });
  // printer.beep();

  // printer.println("--------------------------------");
  // printer.println();

  // printer.alignCenter();
  // printer.setTextDoubleHeight();
  // printer.setTextDoubleWidth();
  // printer.bold(true);
  // printer.println("CASH RECEIPT")
  // printer.println();
  // printer.println("--------------------------------");

  // printer.setTextNormal();
  // printer.println("Petrol Pump")
  // printer.println("\n");

  // printer.bold(false);
  // printer.tableCustom([
  //     { text: "Vehicle: ", align: "LEFT", width: 0.5 },
  //     { text: vehicle, align: "RIGHT", width: 0.5 },
  //     { text: "Company: ", align: "LEFT", width: 0.5 },
  //     { text: company, align: "RIGHT", width: 0.5 }
  // ]);
  // printer.println("--------------------------------");

  // printer.tableCustom([                                       // Prints table with custom settings (text, align, width, bold)
  //     { text: "Product: ", align: "LEFT", width: 0.5 },
  //     { text: product, align: "RIGHT", width: 0.5 }
  // ]);
  // printer.println("--------------------------------");

  // printer.tableCustom([
  //     { text: "Quantity: ", align: "LEFT", width: 0.5 },
  //     { text: quantity, align: "RIGHT", width: 0.5 },
  //     { text: "Unit price: ", align: "LEFT", width: 0.5 },
  //     { text: sellingPrice, align: "RIGHT", width: 0.5 },
  //     { text: "Discount: ", align: "LEFT", width: 0.5 },
  //     { text: discount, align: "RIGHT", width: 0.5 },
  // ]);
  // printer.println("--------------------------------");

  // printer.bold(true);
  // printer.tableCustom([
  //     { text: "Total: ", align: "LEFT", width: 0.5 },
  //     { text: totalPrice, align: "RIGHT", width: 0.5 }
  // ]);

  // printer.alignLeft();

  // var today = new Date();
  // var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  // var dateTime = date + ' ' + time;

  // printer.println("Printed on " + dateTime);
  // printer.println("Developed by BridgeTech");

  // printer.setTextDoubleHeight();
  // printer.setTextDoubleWidth();
  // printer.bold(true);
  // printer.println("Thank You!!");

  // printer.cut();

  // try {
  //     let execute = printer.execute()
  //     console.error("Print done!");
  // } catch (error) {
  //     console.log("Print failed:", error);
  // }

  res.redirect('/')
})

module.exports = router
