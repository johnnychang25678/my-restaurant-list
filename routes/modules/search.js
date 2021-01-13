const express = require('express')
const Restaurant = require('../../models/restaurant')
const router = express.Router()

// @route GET /search?keyword
// @desc Get search results
// @access Private
router.get('/', (req, res) => {
  const keyword = req.query.keyword
  const userId = req.user._id
  Restaurant.find({ userId }).lean() // returns an array
    .then(restaurants => {
      restaurants = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(keyword.toLowerCase()) ||
        restaurant.category.toLowerCase().includes(keyword.toLowerCase())
      )
      res.render('index', { restaurants, keyword })
    })
})


module.exports = router