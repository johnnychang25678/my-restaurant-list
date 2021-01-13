module.exports = (req, res, next) => {
  if (req.isAuthenticated()) { // from passport.js
    return next()
  }
  return res.redirect('/users/login')
}