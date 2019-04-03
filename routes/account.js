var express = require('express')
var router = express.Router()
var Parse = require('parse/node')

router.get('/logout', function (req, res) {
  console.log('logging out')
  Parse.User.currentAsync()
    .logOut()
    .then(result => {
      console.log(result)
      res.redirect('/')
    })
    .catch(err => {
      console.log(err)
      res.redirect('/')
    })
})

router.get('/login', function (req, res) {
  redirectIfAlreadyLoggedIn(res)
  res.render('home/login')
})

router.post('/login', function (req, res) {
  redirectIfAlreadyLoggedIn(res)
  console.log('trying loggig in')
  let userName = req.body.username
  let password = req.body.password
  Parse.User.logIn(userName, password)
    .then(result => {
      console.log(result)
      res.redirect('/')
    })
    .catch(err => {
      // alert('wrong email or password try again')
      res.render('home/welcome', { message: err.message })
    })
})

// Register
router.get('/register', function (req, res) {
  redirectIfAlreadyLoggedIn(res)
  res.render('home/register', { message: null })
})
router.post('/register', function (req, res) {
  redirectIfAlreadyLoggedIn(res)
  console.log('trying to register')
  let fullName = req.body.fullName
  let userName = req.body.username
  let password = req.body.password
  var user = new Parse.User()
  user.set('username', userName)
  user.set('password', password)
  user.set('fullName', fullName)
  user
    .signUp()
    .then(result => {
      console.log(result)
      res.redirect('/', { message: result.message })
    })
    .catch(err => {
      console.log(err)
      res.render('home/register', { message: err.message })
    })
})

function redirectIfAlreadyLoggedIn (res) {
  Parse.User.enableUnsafeCurrentUser()
  let currentUser = Parse.User.current()
  if (currentUser) {
    res.redirect('/')
  }
}
module.exports = router
