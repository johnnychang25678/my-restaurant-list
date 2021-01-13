const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')

require('dotenv').config()

const app = express()
const routes = require('./routes/index')
const port = process.env.PORT

// connect to mongodb
require('./config/mongoose')

// template engine
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    ifSelect: (a, b) => a === b ? 'selected' : null // for memorizing user selected input
  }
}))
app.set('view engine', 'handlebars')

// middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))

// routes
app.use(routes)


app.listen(port, () => console.log(`Listening to server on port: ${port}`))


