const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')

const app = express()
const routes = require('./routes/index')
const port = 3000

// connect to mongodb
require('./config/mongoose')

// template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))

// routes
app.use(routes)


app.listen(port, () => console.log(`Listening to server on port: ${port}`))


