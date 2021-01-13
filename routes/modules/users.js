const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')
const { pass } = require('../../config/mongoose')

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
  failureRedirect: '/users/login',
  failureFlash: true,
}))

// @route GET /users/logout
// @desc logout
// @access Private
router.get('/logout', (req, res) => {
  res.clearCookie('sort')
  req.logout()
  req.flash('successMessage', '你已經成功登出。')
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
    const registerErrors = []
    if (!email || !password || !confirmPassword) {
      registerErrors.push({ message: '信箱、密碼、確認密碼欄位必填' })
    }
    if (password !== confirmPassword) {
      registerErrors.push({ message: '密碼與確認密碼不符！' })
    }
    if (registerErrors.length) {
      return res.render('register', { registerErrors, name, email, password, confirmPassword })
    }

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