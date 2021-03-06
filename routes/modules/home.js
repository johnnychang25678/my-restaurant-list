const express = require('express')
const Restaurant = require('../../models/restaurant')

const router = express.Router()

// @route GET /
// @desc Get all reastaurants with sorting function
// @access Private
router.get('/', (req, res) => {
  const userId = req.user._id
  const sorting = req.query.sorting || req.cookies.sort || 'byTimeDesc'
  const sortMethod = {
    byNameAsc: { name: 'asc' },
    byNameDesc: { name: 'desc' },
    byCategory: { category: 'asc' },
    byLocation: { location: 'asc' },
    byTimeAsc: { _id: 'asc' },
    byTimeDesc: { _id: 'desc' },
  }
  Restaurant.find({ userId }).lean().sort(sortMethod[sorting])
    .then(restaurants => {
      res.cookie('sort', sorting)
      res.render('index', { restaurants: restaurants, sorting })
    })
    .catch(err => console.error(err))
})

module.exports = router