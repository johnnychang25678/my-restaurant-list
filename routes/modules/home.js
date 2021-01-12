const express = require('express')
const Restaurant = require('../../models/restaurant')

const router = express.Router()

// @route GET /
// @desc Get all reastaurants with sorting function
// @access Public
router.get('/', (req, res) => {
  const sorting = req.query.sorting || 'byTimeDesc'
  const sortMethod = {
    byNameAsc: { name: 'asc' },
    byNameDesc: { name: 'desc' },
    byCategory: { category: 'asc' },
    byLocation: { location: 'asc' },
    byTimeAsc: { _id: 'asc' },
    byTimeDesc: { _id: 'desc' },
  }
  Restaurant.find().lean().sort(sortMethod[sorting])
    .then(restaurants => {
      res.render('index', { restaurants: restaurants, sorting })
    })
    .catch(err => console.error(err))
})

module.exports = router