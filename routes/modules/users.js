const express = require('express')
const router = express.Router()

// @route GET /users/login
// @desc login form
// @access Public
router.get('/login', (req, res) => {
  res.render('login')
})

// @route GET /users/register
// @desc register form
// @access Public
router.get('/register', (req, res) => {
  res.render('register')
})


module.exports = router