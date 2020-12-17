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

// middleware for static files
app.use(express.static('public'))

// @route GET /
// @desc Get all reastaurants
// @access Public
app.get('/', (req, res) => {
  Restaurant.find().lean()
    .then(restaurants => res.render('index', { restaurants: restaurants }))
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

// app.get('/search', (req, res) => {
//   const keyword = req.query.keyword // {keyword: saba}
//   const restaurants = restaurantList.results
//     .filter(restaurant =>
//       restaurant.name.toLowerCase().includes(keyword.toLowerCase()) ||
//       restaurant.category.toLowerCase().includes(keyword.toLowerCase())
//     )
//   res.render('index', { restaurants: restaurants, keyword: keyword })
// })

// app.get('/restaurants/:id', (req, res) => {
//   const id = req.params.id
//   const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === id)
//   res.render('show', { restaurant: restaurant })
// })

app.listen(port, () => console.log(`Listening to server on port: ${port}`))


