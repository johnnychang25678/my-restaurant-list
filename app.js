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
app.get('/restaurants/:id/edit', (req, res) => {
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
app.post('/restaurants/:id/edit', (req, res) => {
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
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.send('<h1>Invalid id</h1>')
  }
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.error(err))

})

// @route GET /search?keyword
// @desc Get search results
// @access Public
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  Restaurant.find().lean() // returns an array
    .then(restaurants => {
      restaurants = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(keyword.toLowerCase()) ||
        restaurant.category.toLowerCase().includes(keyword.toLowerCase())
      )
      res.render('index', { restaurants: restaurants, keyword: keyword })
    })
})


app.listen(port, () => console.log(`Listening to server on port: ${port}`))


