const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

// import route modules
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const search = require('./modules/search')
const users = require('./modules/users')


router.use('/restaurants', auth, restaurants)
router.use('/search', auth, search)
router.use('/users', users)
router.use('/', auth, home)

module.exports = router