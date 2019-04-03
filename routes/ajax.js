var express = require('express')
var router = express.Router()
var Parse = require('parse/node')

router.get('/get-vehicle', async function (req, res) {
  var reg = req.query.id
  reg = reg.replace(/[^a-zA-Z0-9]/g, '')
  reg = reg.toString().toLowerCase()
  const Vehicle = Parse.Object.extend('Vehicle')
  const query1 = new Parse.Query(Vehicle)
  const query2 = new Parse.Query(Vehicle)
  query1.startsWith('registrationFlat', reg)
  query2.startsWith('driverNoFlat', reg)

  var query = Parse.Query.or(query1, query2)

  var data = []
  // query.fullText('registrationFlat', reg)
  // query.select('registration')
  var result = await query
    .find()
    .then(result => {
      console.log('i#####  ##########data#########: ' + typeof result)
      console.log(result)
      result.forEach(el => {
        data.push({
          id: el.get('registration'),
          title: el.get('registration') + el.get('driverNoFlat'),
          text: el.get('registration') + ',' + el.get('driverNoFlat')
        })
      })
      res.send(data)
    })
    .catch(err => {
      console.log(err)
      res.send([err])
    })

  // var obj = {}

  // obj.id = 'Select Vehicle'
  // obj.title = 'Select Vehicle'
  // obj.text = '<div> Select Vehicle </div>'
  // data.push(obj)

  // res.send(data)
})

router.get('/check-registration', async function (req, res) {
  var reg = req.query.id
  reg = reg.replace(/[^a-zA-Z0-9]/g, '')
  reg = reg.toString().toLowerCase()
  const Vehicle = Parse.Object.extend('Vehicle')
  const query = new Parse.Query(Vehicle)
  var check = []
  query.equalTo('registrationFlat', reg)
  console.log('==> registration name: ' + reg)
  query
    .find()
    .then(result => {
      if (result.length > 0) {
        res.send(true)
        console.log(result[0].registrationFlat)
      } else {
        console.log('false')
        res.send(false)
      }
    })
    .catch(err => {
      console.log(err)
    })
})

router.get('/get-company', async function (req, res) {
  console.log('get-company')
  console.log(req.query.id)
  var regId = req.query.id
  const Vehicle = Parse.Object.extend('Vehicle')
  const query = new Parse.Query(Vehicle)
  query.include('companyName')
  result = await query.equalTo('registration', regId).first()
  // .then(result => {
  //     res.send(result)
  // })
  // .catch(err => {
  //     res.send({});
  // });

  res.send(result)
  // Parse.User.logOut()
  //     .then(result => {
  //         console.log(result);
  //         res.redirect("/");
  //     })
  //     .catch(err => {
  //         console.log(err);
  //         res.redirect("/");
  //     });
})

router.get('/update-bills', function (req, res) {
  console.log('Update bills: ' + obj)
  var obj = req.query.obj
  res.send('obj: ' + obj)
})

module.exports = router
