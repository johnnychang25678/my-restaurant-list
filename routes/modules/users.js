const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')

// @route GET /users/login
// @desc login form
// @access Public
router.get('/login', (req, res) => {
  res.render('login')
})

// @route POST /users/login
// @desc login
// @access Public
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// @route GET /users/logout
// @desc logout
// @access Private
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

// @route GET /users/register
// @desc register form
// @access Public
router.get('/register', (req, res) => {
  res.render('register')
})

// @route POST /users/register
// @desc register 
// @access Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body
    const user = await User.findOne({ email })
    if (user) {
      console.log('user already exists!')
      return res.render('register', { name, email, password, confirmPassword })
    } else {
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      await User.create({
        name,
        email,
        password: hash
      })
      console.log('user created!')
      return res.redirect('/')
    }
  } catch (err) {
    console.log(err)
  }

})

module.exports = router