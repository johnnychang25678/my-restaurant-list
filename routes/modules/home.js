const express = require('express')
const Restaurant = require('../../models/restaurant')
const router = express.Router()

// @route GET /
// @desc Get all reastaurants
// @access Public
router.get('/', (req, res) => {
  Restaurant.find().lean()
    .then(restaurants => {
      res.render('index', { restaurants: restaurants })
    })
    .catch(err => console.error(err))
})

module.exports = router