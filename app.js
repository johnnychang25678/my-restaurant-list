const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Restaurant = require('./models/restaurant')

const app = express()
const port = 3000

// connect to mongodb
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

// template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// @route GET /
// @desc Get all reastaurants
// @access Public
app.get('/', (req, res) => {
  Restaurant.find().lean()
    .then(restaurants => {
      console.log(restaurants)
      res.render('index', { restaurants: restaurants })
    })
    .catch(err => console.error(err))
})

// @route GET /restaurants/new
// @desc Form for adding new restaurant
// @access Public
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

// @route POST /restaurants
// @desc Add new restaurant
// @access Public
app.post('/restaurants', (req, res) => {
  console.log(req.body)
  const data = req.body
  return Restaurant.create({ ...data })
    .then(() => res.redirect('/'))
    .catch(err => console.error(err))
})

// @route GET /restaurants/:id
// @desc Get clicked restaurant detail
// @access Public
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id).lean()
    .then(restaurant => res.render('show', { restaurant: restaurant }))
    .catch(err => console.error(err))
})

// @route GET /search?keyword
// @desc Get search results
// @access Public
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  Restaurant.find().lean()
    .then(restaurants => {
      restaurants = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(keyword.toLowerCase()) ||
        restaurant.category.toLowerCase().includes(keyword.toLowerCase())
      )
      res.render('index', { restaurants: restaurants, keyword: keyword })
    })
})






app.listen(port, () => console.log(`Listening to server on port: ${port}`))


