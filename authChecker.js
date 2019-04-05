var Parse = require('parse/node')
authChecker = function authChecker(req, res, next) {
  console.log('checking auth')
  Parse.User.enableUnsafeCurrentUser()
  // let currentUser = Parse.User.current()
  // if (currentUser) {
  //   console.log('user found ', currentUser)
  //   next()
  // } else {
  //   console.log('user  not found ')
  //   res.redirect('/account/login')
  // }

  Parse.User.currentAsync().then(function (user) {
    // do stuff with your user

    if (user) {
      var User = Parse.Object.extend('User')
      const query = new Parse.Query(User)

      console.log('user found ' + user.get('location'))

      console.log('user found ' + user.id)
      query
        .get(user.id)
        .then(user => {
          console.log(user.get('username'))
        })
        .catch(err => {
          console.log(err)
        })
      next()
    } else {
      res.redirect('/account/login')
    }
  })
}
module.exports = authChecker
