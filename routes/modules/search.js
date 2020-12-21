const express = require('express')
const Restaurant = require('../../models/restaurant')
const router = express.Router()

// @route GET /search?keyword
// @desc Get search results
// @access Public
router.get('/', (req, res) => {
  const keyword = req.query.keyword
  console.log(keyword)
  Restaurant.find().lean() // returns an array
    .then(restaurants => {
      restaurants = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(keyword.toLowerCase()) ||
        restaurant.category.toLowerCase().includes(keyword.toLowerCase())
      )
      res.render('index', { restaurants: restaurants, keyword: keyword })
    })
})


module.exports = router