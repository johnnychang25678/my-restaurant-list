const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// @route GET /restaurants/new
// @desc Form for adding new restaurant
// @access Private
router.get('/new', (req, res) => {
  res.render('new')
})

// @route POST /restaurants
// @desc Add new restaurant
// @access Private
router.post('/', (req, res) => {
  const userId = req.user._id
  const data = req.body
  return Restaurant.create({ ...data, userId })
    .then(() => res.redirect('/'))
    .catch(err => console.error(err))
})

// @route GET /restaurants/:id
// @desc Get clicked restaurant detail
// @access Private
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  Restaurant.findOne({ _id, userId }).lean()
    .then(restaurant => {
      res.render('show', { restaurant: restaurant })
    })
    .catch(err => console.error(err))
})


// @route GET /restaurants/:id/edit
// @desc Form for editing restaurant information
// @access Private
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  Restaurant.findOne({ _id, userId }).lean()
    .then(restaurant => res.render('edit', { restaurant: restaurant }))
    .catch(err => console.error(err))
})

// @route PUT /restaurants/:id
// @desc Edit restaurant information
// @access Private
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const data = req.body

  return Restaurant.findOne({ _id, userId })
    .then(restaurant => {
      restaurant = Object.assign(restaurant, data)
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(err => console.error(err))
})

// @route DELETE /restaurants/:id
// @desc Delete restaurant
// @access Private
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  return Restaurant.findOne({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.error(err))

})

module.exports = router