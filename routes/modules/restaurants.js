const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Restaurant = require('../../models/restaurant')

// @route GET /restaurants/new
// @desc Form for adding new restaurant
// @access Public
router.get('/new', (req, res) => {
  res.render('new')
})

// @route POST /restaurants
// @desc Add new restaurant
// @access Public
router.post('/', (req, res) => {
  const data = req.body
  return Restaurant.create({ ...data })
    .then(() => res.redirect('/'))
    .catch(err => console.error(err))
})

// @route GET /restaurants/:id
// @desc Get clicked restaurant detail
// @access Public
router.get('/:id', (req, res) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.send('<h1>Invalid id</h1>')
  }
  Restaurant.findById(id).lean()
    .then(restaurant => {
      res.render('show', { restaurant: restaurant })
    })
    .catch(err => console.error(err))
})


// @route GET /restaurants/:id/edit
// @desc Form for editing restaurant information
// @access Public
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.send('<h1>Invalid id</h1>')
  }
  Restaurant.findById(id).lean()
    .then(restaurant => res.render('edit', { restaurant: restaurant }))
    .catch(err => console.error(err))
})

// @route POST /restaurants/:id/edit
// @desc Edit restaurant information
// @access Public
router.post('/:id/edit', (req, res) => {
  const id = req.params.id
  const data = req.body
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.send('<h1>Invalid id</h1>')
  }
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant = Object.assign(restaurant, data)
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(err => console.error(err))
})

// @route POST /restaurants/:id/delete
// @desc Delete restaurant
// @access Public
router.post('/:id/delete', (req, res) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.send('<h1>Invalid id</h1>')
  }
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.error(err))

})

module.exports = router